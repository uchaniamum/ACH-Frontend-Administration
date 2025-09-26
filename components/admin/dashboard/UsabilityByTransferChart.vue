<template>
  <div
    class="flex flex-col relative w-full border border-gray-300 rounded-2xl p-5 m-1 box-border min-h-[400px] sm:h-auto"
    style="box-shadow:-4px 0 6px -1px rgba(0,0,0,0.1),4px 0 6px -1px rgba(0,0,0,0.1),0 -4px 6px -1px rgba(0,0,0,0.1),0 4px 6px -1px rgba(0,0,0,0.1);">

    <!-- Encabezado con título y botones -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mb-4 gap-2 sm:gap-3">
      <div class="flex items-center gap-2 w-full min-w-0">
        <span class="truncate font-bold text-black text-lg sm:text-[20px] min-w-0">
          {{ chartTitle }}
        </span>
        <div class="relative flex-shrink-0">
          <Icon name="x:paste-clipboard"
            class="text-[#0A44C6] w-6 h-6 sm:w-8 sm:h-8 cursor-pointer hover:text-[#0C55F8]" 
            @click="handleCopiar" />
       
        </div>
      </div>

      <!-- Botones Enviados / Recibidos -->
      <div class="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-[#F0F5FF] w-full sm:w-auto">
        <button @click="handleEnviados" :class="getButtonClasses('enviados')">
          <Icon name="x:arrow-tr-circle" class="w-6 h-6 sm:w-7 sm:h-7" />
          Enviados
        </button>

        <button @click="handleRecibidos" :class="getButtonClasses('recibidos')">
          <Icon name="x:arrow-br-circle" class="w-6 h-6 sm:w-7 sm:h-7" />
          Recibidos
        </button>
      </div>
    </div>

    <!-- Checkbox Ver todas las cifras -->
    <div class="flex items-center gap-2 mb-2">
      <div ref="verCifras" class="flex items-center cursor-pointer transition-all">
        <XCheckBox 
          v-model="seleccionado" 
          name="mostrarValoresPie" 
          value="seleccionarDatos" 
          @click="toggleValores"
          :class="{ 'border-[#0C55F8]': seleccionado === 'seleccionarDatos' }" 
        />
        <span class="font-normal text-[11px] sm:text-[12px] ml-2">Ver todas las cifras</span>
      </div>
    </div>

    <!-- Contenedor que se copiará (gráfico + labels) -->
    <div ref="graficoContenido" class="w-full flex flex-col items-center gap-4 sm:gap-6">
      <!-- Gráfico Pie responsivo -->
      <div class="flex justify-center items-center w-full max-w-[400px] h-[300px] sm:max-w-[420px] sm:h-[350px] md:max-w-[450px] md:h-[400px]">
        <PieChart ref="grafico" :data="chartData" :options="chartOptions" />
      </div>

      <!-- Leyenda personalizada -->
      <div class="flex flex-col gap-2 sm:gap-3 border border-[#92ACE5] p-3 rounded-lg bg-white w-[90%] sm:w-[55%] mx-auto mt-20">
        <div class="text-[13px] sm:text-[14px] font-semibold text-[#5F6A7B] mb-1 sm:mb-2 text-left">
          {{ chartData.datasets[0].label }}
        </div>
        <div 
          v-for="(label, index) in chartData.labels" 
          :key="index"
          class="flex justify-between items-center w-full p-1 flex-wrap"
        >
          <div class="flex items-center gap-1 sm:gap-2 min-w-[120px] sm:min-w-[140px] flex-1">
            <span 
              class="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
              :style="{ backgroundColor: chartData.datasets[0].backgroundColor[index] }"
            ></span>
            <span class="text-[10px] sm:text-[11px] font-medium text-[#5F6A7B]">
              {{ label }}
            </span>
          </div>
          <span class="text-[10px] sm:text-[11px] font-medium text-[#5F6A7B] text-right flex-shrink-0 ml-1 sm:ml-2">
            {{ formatPercentage(chartData.datasets[0].data[index], total) }}%
          </span>
        </div>
      </div>
    </div>
    <Transition name="fade">
      <div v-if="copiado" class="fixed top-4 right-4 bg-blue-500 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50">
        Gráfico copiado al portapapeles
      </div>
    </Transition>  
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import type { Ref } from 'vue';
import { Chart as ChartJS, Title, Tooltip, ArcElement } from "chart.js";
import { Pie as PieChart } from "vue-chartjs";

// Composables & Services
import { useChartUtilitarios } from "~/componsables/useChartUtilitarios";
import { seriesService } from "~/services/dashboard/seriesService";
import { useToast } from "#imports";
import { XCheckBox } from "#components";

// Types
import type { SerieUsabilityTransferResponse } from "~/features/dashboard/serieUsabilityTransfer.types";

// ============================================================================
// INTERFACES Y TIPOS
// ============================================================================
interface ChartDataSet {
  label: string;
  data: number[];
  backgroundColor: string[];
}

interface ChartData {
  labels: string[];
  datasets: ChartDataSet[];
}

type ModeType = 'sent' | 'received';
type SelectionType = 'enviados' | 'recibidos';

// ============================================================================
// SETUP Y CONFIGURACIÓN INICIAL
// ============================================================================
defineOptions({
  name: "PieUsabilidadTransferencia"
});

// Registrar Chart.js
const { mostrarTooltipBurbujaPlugin } = useChartUtilitarios();
ChartJS.register(
  Title,
  Tooltip,
  ArcElement,
  mostrarTooltipBurbujaPlugin
);

// ============================================================================
// CONFIGURACIÓN DE COLORES Y MAPEOS
// ============================================================================
const CHART_COLORS = [
  "#0C55F8", 
  "#021132", 
  "#9EBBFC", 
  "#6F8CCE", 
  "#073395", 
  "#F2A900"
] as const;

// Color para la categoría "Otros"
const OTHERS_COLOR = "#9CA3AF";

// Umbral mínimo para mostrar categorías individuales (%)
const THRESHOLD_PERCENTAGE = 3;

// Mapeo de códigos de transacción a nombres amigables
const TRANSACTION_NAME_MAP: Record<string, string> = {
  'QR': 'QR',
  'EXPRESS': 'Express',
  'ASYNC': 'Asíncrono',
  'P2P': 'P2P',
  'B2C': 'B2C',
  'C2B': 'C2B',
  'INSTANT': 'Instantáneo',
  'SCHEDULED': 'Programado',
  'RECURRING': 'Recurrente'
};

// ============================================================================
// VARIABLES REACTIVAS
// ============================================================================
// Estado del componente
const mostrarValoresPie = ref(false);
const seleccionado = ref<string | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const selected = ref<SelectionType>('enviados');

// Datos del gráfico
const usabilityTransferData = ref<SerieUsabilityTransferResponse | null>(null);
const chartData: Ref<ChartData> = ref({
  labels: [],
  datasets: [
    {
      label: "Datos de prueba",
      data: [],
      backgroundColor: [...CHART_COLORS],
    },
  ],
});

// Referencias del template
const graficoContenido: Ref<HTMLElement | null> = ref(null);
const grafico: Ref<any> = ref(null);
const verCifras: Ref<HTMLElement | null> = ref(null);

// Estados globales
const periodo = useState<string | null>('periodo');
const toast = useToast();

// Composables
const { copiarGrafico, copiado } = useChartUtilitarios();

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================
const chartTitle = computed(() => {
  return usabilityTransferData.value?.panel || 'No hay descripción disponible';
});

const total = computed(() => {
  return chartData.value.datasets[0].data.reduce((sum, val) => sum + val, 0);
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    mostrarValoresPie: mostrarValoresPie.value,
  },
  layout: { padding: 20 },
  elements: { 
    arc: { borderWidth: 5, radius: "80%" } 
  },
}));

// ============================================================================
// FUNCIONES UTILITARIAS
// ============================================================================
function getButtonClasses(type: SelectionType): string[] {
  return [
    'flex items-center gap-2 px-3 py-2 flex-1 sm:flex-none min-w-[100px] rounded-md text-sm cursor-pointer transition-colors',
    selected.value === type
      ? 'bg-[#6F8CCE] text-white'
      : 'bg-[#F0F5FF] text-[#5F6A7B] hover:bg-[#6F8CCE] hover:text-white'
  ];
}

function getTransactionDisplayName(transactionCode: string): string {
  const upperCode = transactionCode.toUpperCase();
  return TRANSACTION_NAME_MAP[upperCode] || transactionCode;
}

function formatPercentage(value: number, total: number): string {
  return ((value / total) * 100).toFixed(1);
}

function shouldGroupAsOthers(items: any[]): boolean {
  return items.length > 6 || items.some(item => item.percent < THRESHOLD_PERCENTAGE);
}

function buildChartData(items: any[], mode: ModeType): ChartData {
  // Verificar si necesitamos agrupar items pequeños
  if (!shouldGroupAsOthers(items)) {
    return {
      labels: items.map(item => getTransactionDisplayName(item.transactionCode)),
      datasets: [
        {
          label: mode === 'sent' ? 'Enviados' : 'Recibidos',
          data: items.map(item => item.percent),
          backgroundColor: [...CHART_COLORS].slice(0, items.length),
        },
      ],
    };
  }

  // Separar items principales y pequeños
  const mainItems = items.filter(item => item.percent >= THRESHOLD_PERCENTAGE);
  const smallItems = items.filter(item => item.percent < THRESHOLD_PERCENTAGE);
  
  // Calcular suma de items pequeños
  const othersSum = smallItems.reduce((sum, item) => sum + item.percent, 0);
  
  // Construir arrays finales con nombres amigables
  const labels = mainItems.map(item => getTransactionDisplayName(item.transactionCode));
  const data = mainItems.map(item => item.percent);
  const colors = [...CHART_COLORS];
  
  // Agregar "Otros" si hay items pequeños
  if (smallItems.length > 0 && othersSum > 0) {
    labels.push('Otros');
    data.push(othersSum);
    colors.push(OTHERS_COLOR);
  }
  
  return {
    labels,
    datasets: [
      {
        label: mode === 'sent' ? 'Enviados' : 'Recibidos',
        data,
        backgroundColor: colors.slice(0, labels.length),
      },
    ],
  };
}

// ============================================================================
// FUNCIONES DE ACTUALIZACIÓN
// ============================================================================
function updateChart() {
  if (grafico.value?.chart) {
    grafico.value.chart.options.plugins.mostrarValoresPie = mostrarValoresPie.value;
    grafico.value.chart.update();
  }
}

function updateChartData(mode: ModeType) {
  if (!usabilityTransferData.value) return;
  
  const items = mode === 'sent' 
    ? usabilityTransferData.value.sent.items 
    : usabilityTransferData.value.received.items;
    
  chartData.value = buildChartData(items, mode);
}

// ============================================================================
// HANDLERS DE EVENTOS
// ============================================================================
function handleCopiar(): void {
  if (graficoContenido.value) {
    copiarGrafico(graficoContenido.value);
  }
}

function toggleValores(): void {
  mostrarValoresPie.value = !mostrarValoresPie.value;
  updateChart();
}

function handleEnviados(): void {
  selected.value = 'enviados';
  updateChartData('sent');
}

function handleRecibidos(): void {
  selected.value = 'recibidos';
  updateChartData('received');
}

// ============================================================================
// FUNCIONES DE DATOS
// ============================================================================
async function loadUsabilityTransferData(periodo: string) {
  try {
    console.log(`Cargando datos de usabilidad de transferencia: Período=${periodo}`);
    
    loading.value = true;
    error.value = null;
    
    const response = await seriesService.getSerieUsabilityByTransferByCode(periodo);
    console.log("Datos de usabilidad de transferencia:", response);
    
    if (response) {
      usabilityTransferData.value = response;
      updateChartData('sent'); // Cargar datos enviados por defecto
    }
  } catch (err: any) {
    console.error('Error loading transfer usability data:', err);
    error.value = err.message || 'Error al cargar la información de transferencia';
    toast.add({ 
      severity: 'error', 
      summary: 'Error', 
      detail: error.value, 
      life: 5000 
    });
  } finally {
    loading.value = false;
  }
}

// ============================================================================
// WATCHERS
// ============================================================================
watch(periodo, (newVal) => {
  if (newVal) {
    loadUsabilityTransferData(newVal);
  }
});

// ============================================================================
// LIFECYCLE
// ============================================================================
onMounted(async () => {
  if (periodo.value) {
    await loadUsabilityTransferData(periodo.value);
  }
  
  if (error.value) {
    console.warn('No se pudieron cargar los datos de usabilidad de transferencia:', error.value);
  }
});
</script>

<style scoped>
/* Estilos específicos para el componente */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Transición para el toast de copiado */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Mejoras para responsive */
@media (max-width: 640px) {
  .min-w-0 {
    min-width: 0;
  }
}

@media (min-width: 1024px) {
  .titulo-botones {
    align-items: center;
  }
}
</style>