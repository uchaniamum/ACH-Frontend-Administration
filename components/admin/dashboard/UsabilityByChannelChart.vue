<template>
  <div
    class="flex flex-col relative w-full border border-gray-300 rounded-2xl p-5 m-1 box-border min-h-[400px] sm:h-auto"
    style="box-shadow:-4px 0 6px -1px rgba(0,0,0,0.1),4px 0 6px -1px rgba(0,0,0,0.1),0 -4px 6px -1px rgba(0,0,0,0.1),0 4px 6px -1px rgba(0,0,0,0.1);">
    <!-- Encabezado con título y botones -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-4 gap-3 flex-wrap titulo-botones">
      <h3 class="text-black font-bold text-lg sm:text-[20px] flex items-center gap-2 relative">
        {{ chartTitle }}
        <div class="relative">
          <Icon name="x:paste-clipboard"
            class="text-[#0A44C6] w-8 h-8 sm:w-10 sm:h-10 cursor-pointer hover:text-[#0C55F8]"
            @click="handleCopiar" />
          </div>
      </h3>

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
        <span class="font-normal text-[12px] ml-2 sm:text-[14px]">Ver todas las cifras</span>
      </div>
    </div>

    <!-- Contenido a copiar (gráfico + labels) -->
    <div ref="graficoContenido" class="w-full flex flex-col items-center gap-6">
      <!-- Gráfico Pie -->
      <div class="flex justify-center items-center w-full max-w-[350px] h-[370px] sm:max-w-[400px] sm:h-[350px] md:max-w-[400px] md:h-[400px]">
        <PieChart ref="grafico" :data="chartData" :options="chartOptions" />
      </div>

      <!-- Leyenda personalizada -->
      <div class="flex flex-col gap-3 border border-[#92ACE5] p-3 rounded-lg bg-white w-[95%] sm:w-[70%] lg:w-[60%] mx-auto">
        <div class="text-[12px] sm:text-[14px] font-semibold text-[#5F6A7B] mb-2 text-left">
          {{ chartData.datasets[0].label }}
        </div>
        <div 
          v-for="(label, index) in chartData.labels" 
          :key="index"
          class="flex justify-between items-center w-full p-1 flex-wrap"
        >
          <div class="flex items-center gap-2 min-w-[120px] flex-1">
            <span 
              class="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0"
              :style="{ backgroundColor: chartData.datasets[0].backgroundColor[index] }"
            ></span>
            <span class="text-[11px] sm:text-[12px] font-medium text-[#5F6A7B]">
              {{ label }}
            </span>
          </div>
          <span class="text-[11px] sm:text-[12px] font-medium text-[#5F6A7B] text-right flex-shrink-0 ml-2">
            {{ ((chartData.datasets[0].data[index] / total) * 100).toFixed(1) }}%
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
import { Chart as ChartJS, Title, Tooltip, ArcElement, Legend } from "chart.js";
import { Pie as PieChart } from "vue-chartjs";

// Composables & Services
import { useChartUtilitarios } from "~/componsables/useChartUtilitarios";
import { seriesService } from '~/services/dashboard/seriesService';
import { useToast } from 'primevue/usetoast';
import { XCheckBox } from "#components";

// Types
import type { SerieUsabilityChannelResponse } from "~/features/dashboard/serieUsabilityChannel.types";

// INTERFACES Y TIPOS
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

// SETUP Y CONFIGURACIÓN INICIAL
defineOptions({
  name: "UsabilityByChannelChart"
});

// Registrar Chart.js
const { mostrarTooltipBurbujaPlugin } = useChartUtilitarios();
ChartJS.register(
  Title,
  Tooltip,
  ArcElement,
  Legend,
  mostrarTooltipBurbujaPlugin
);

// CONFIGURACIÓN DE COLORES Y UMBRALES
const CHART_COLORS = [
  "#0C55F8", 
  "#073395", 
  "#9EBBFC", 
  "#6F8CCE", 
  "#021132", 
  "#F2A900"
] as const;

// Color para la categoría "Otros"
const OTHERS_COLOR = "#9CA3AF";

// Umbral mínimo para mostrar categorías individuales (%)
const THRESHOLD_PERCENTAGE = 5;

// Mapeo de códigos de canal a nombres amigables
const CHANNEL_NAME_MAP: Record<string, string> = {
  // Mapeo de códigos de la base de datos a nombres de visualización
  'WEB': 'Web',
  'TELLER': 'Ventanilla', 
  'MOBILE': 'Móvil',
  'ATM': 'ATM',
  'POS': 'POS',
  'USSD': 'USSD',
  // Agregar más mapeos según sea necesario
  'INTERNET': 'Internet',
  'PHONE': 'Teléfono',
  'BRANCH': 'Sucursal',
  'KIOSK': 'Kiosko',
  'AGENT': 'Agente'
};

// VARIABLES REACTIVAS
const mostrarValoresPie: Ref<boolean> = ref(false);
const seleccionado: Ref<string | null> = ref(null);
const loading = ref(false);
const error = ref<string | null>(null);
const selected = ref<SelectionType>('enviados');

// Datos del gráfico
const usabilityData = ref<SerieUsabilityChannelResponse | null>(null);
const chartData: Ref<ChartData> = ref({
  labels: ['Test 1', 'Test 2', 'Test 3'],
  datasets: [
    {
      label: "Datos de prueba",
      data: [30, 45, 25],
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

// COMPUTED PROPERTIES
const chartTitle = computed(() => {
  return usabilityData.value?.panel || 'No hay descripción disponible';
});

const total = computed(() => {
  return chartData.value.datasets[0].data.reduce((sum, val) => sum + val, 0);
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { display: false }, 
    mostrarValoresPie: mostrarValoresPie.value 
  },
  layout: { 
    padding: { top: 10, right: 40, bottom: 10, left: 40 } 
  },
  elements: { 
    arc: { borderWidth: 4, radius: "75%" } 
  },
}));

// FUNCIONES UTILITARIAS
function getButtonClasses(type: SelectionType): string[] {
  return [
    'flex items-center gap-2 px-3 py-2 flex-1 sm:flex-none min-w-[100px] rounded-md text-sm cursor-pointer transition-colors',
    selected.value === type
      ? 'bg-[#6F8CCE] text-white'
      : 'bg-[#F0F5FF] text-[#5F6A7B] hover:bg-[#6F8CCE] hover:text-white'
  ];
}

function getChannelDisplayName(channelCode: string): string {
  // Convertir a mayúsculas para hacer la búsqueda
  const upperCode = channelCode.toUpperCase();
  // Retornar nombre amigable o el código original si no está mapeado
  return CHANNEL_NAME_MAP[upperCode] || channelCode;
}

function shouldGroupAsOthers(items: any[]): boolean {
  // Solo agrupar si hay más de 6 items o si hay items muy pequeños
  return items.length > 6 || items.some(item => item.percent < THRESHOLD_PERCENTAGE);
}

function buildChartData(items: any[], mode: ModeType): ChartData {
  // Verificar si necesitamos agrupar items pequeños
  if (!shouldGroupAsOthers(items)) {
    // Si no hay muchos items, mostrar todos sin agrupar
    return {
      labels: items.map(item => getChannelDisplayName(item.paymentChannelCode)),
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
  const labels = mainItems.map(item => getChannelDisplayName(item.paymentChannelCode));
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

// FUNCIONES DE ACTUALIZACIÓN
function updateChart() {
  if (grafico.value?.chart) {
    grafico.value.chart.options.plugins.mostrarValoresPie = mostrarValoresPie.value;
    grafico.value.chart.update();
  }
}

function updateChartData(mode: ModeType) {
  if (!usabilityData.value) return;
  
  const items = mode === 'sent' 
    ? usabilityData.value.sent.items 
    : usabilityData.value.received.items;
    
  chartData.value = buildChartData(items, mode);
}

// HANDLERS DE EVENTOS
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

// FUNCIONES DE DATOS
async function loadUsabilityChannelData(periodo: string) {
  try {
    console.log(`Cargando datos de usabilidad: Período=${periodo}`);
    
    loading.value = true;
    error.value = null;
    
    const response = await seriesService.getSerieUsabilityByChannelByCode(periodo);
    
    if (response) {
      usabilityData.value = response;
      updateChartData('sent'); // Cargar datos enviados por defecto
    }
  } catch (err: any) {
    console.error('Error loading usability data:', err);
    error.value = err.message || 'Error al cargar la información del canal';
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

// WATCHERS
watch(periodo, (newVal) => {
  if (newVal) {
    loadUsabilityChannelData(newVal);
  }
});

// LIFECYCLE
onMounted(() => {
  if (periodo.value) {
    loadUsabilityChannelData(periodo.value);
  }
});
</script>

<style scoped>
/* Estilos específicos para el componente */
.titulo-botones {
  min-height: 60px;
}

/* Mejoras para responsive */
@media (max-width: 640px) {
  .titulo-botones h3 {
    font-size: 18px;
  }
}

@media (min-width: 1024px) {
  .titulo-botones {
    align-items: center;
  }
}
</style>