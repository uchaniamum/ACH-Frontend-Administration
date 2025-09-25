<template>
  <div class="flex flex-col relative w-full border border-gray-300 rounded-2xl p-5 m-1 box-border min-h-[400px] sm:h-auto"
    style="box-shadow:-4px 0 6px -1px rgba(0,0,0,0.1),4px 0 6px -1px rgba(0,0,0,0.1),0 -4px 6px -1px rgba(0,0,0,0.1),0 4px 6px -1px rgba(0,0,0,0.1);">
    <!-- Encabezado con título y botones -->  
    <div

      class="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-4 gap-3 flex-wrap titulo-botones">
      <h3 class="text-black font-bold text-lg sm:text-[20px] flex items-center gap-2 relative">
        {{ usabilityData?.panel || 'No hay descripción disponible' }}
        <div class="relative">
          <Icon name="x:paste-clipboard"
            class="text-[#0A44C6] w-8 h-8 sm:w-10 sm:h-10 cursor-pointer hover:text-[#0C55F8]"
            @click="handleCopiar()" />
          <span v-if="copiado"
            class="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-blue-500 text-white text-sm px-2 py-1 rounded z-20">
            Copiado
          </span>
        </div>
      </h3>

      <!-- Botones Enviados / Recibidos -->
      <div class="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-[#F0F5FF] w-full sm:w-auto">
        <button @click="Enviados"
          class="flex items-center gap-2 px-3 py-2 flex-1 sm:flex-none min-w-[100px] rounded-md bg-[#F0F5FF] text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white">
          <Icon name="x:arrow-tr-circle" class="w-6 h-6 sm:w-7 sm:h-7" />
          Enviados
        </button>
        <button @click="Recibidos"
          class="flex items-center gap-2 px-3 py-2 flex-1 sm:flex-none min-w-[100px] rounded-md bg-[#F0F5FF] text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white">
          <Icon name="x:arrow-br-circle" class="w-6 h-6 sm:w-7 sm:h-7" />
          Recibidos
        </button>
      </div>
    </div>

    <!-- Botón Ver todas las cifras -->
    <div class="flex items-center gap-2 mb-2">
      <div ref="verCifras" class="flex items-center cursor-pointer transition-all">
        <XCheckBox v-model="seleccionado" name="mostrarValoresPie" value="seleccionarDatos" @click="toggleValores"
          :class="{ 'border-[#0C55F8]': seleccionado === 'seleccionarDatos' }" />
        <span class="font-normal text-[12px] ml-2 sm:text-[14px]">Ver todas las cifras</span>
      </div>
    </div>

    <!-- Contenido a copiar (gráfico + labels) -->
    <div ref="graficoContenido" class="w-full flex flex-col items-center gap-6">
      <!-- Gráfico Pie -->
      <div
        class="flex justify-center items-center w-full max-w-[300px] h-[320px] sm:max-w-[350px] sm:h-[300px] md:max-w-[300px] md:h-[300px]">
        <PieChart ref="grafico" :data="chartData" :options="chartOptions" />
      </div>

      <!-- Contenedor de labels -->
      <div
        class="flex flex-col gap-3 border border-[#92ACE5] p-3 rounded-lg bg-white w-[95%] sm:w-[70%] lg:w-[60%] mx-auto">
        <div class="text-[12px] sm:text-[14px] font-semibold text-[#5F6A7B] mb-2 text-left">
          {{ chartData.datasets[0].label }}
        </div>
        <div v-for="(label, index) in chartData.labels" :key="index"
          class="flex justify-between items-center w-full p-1 flex-wrap">
          <div class="flex items-center gap-2 min-w-[120px] flex-1">
            <span class="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0"
              :style="{ backgroundColor: chartData.datasets[0].backgroundColor[index] }"></span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import type { Ref } from 'vue';
import { Chart as ChartJS, Title, Tooltip, ArcElement, Legend } from "chart.js";
import { Pie as PieChart } from "vue-chartjs";
import { useChartUtilitarios } from "~/componsables/useChartUtilitarios";
import { XCheckBox } from "#components";
import { seriesService } from '~/services/dashboard/seriesService';
import type { SerieUsabilityChannelResponse } from "~/features/dashboard/serieUsabilityChannel.types";
import { useToast } from 'primevue/usetoast';

// Registrar Chart.js
ChartJS.register(
  Title,
  Tooltip,
  ArcElement,
  Legend,
  useChartUtilitarios().mostrarTooltipBurbujaPlugin
);

// Definir interfaces
interface ChartDataSet {
  label: string;
  data: number[];
  backgroundColor: string[];
}

interface ChartData {
  labels: string[];
  datasets: ChartDataSet[];
}

// Definir nombre del componente
defineOptions({
  name: "UsabilityByChannelChart"
});

// Composables y utilidades
const { copiarGrafico, copiado } = useChartUtilitarios();
const toast = useToast();
const periodo = useState<string | null>('periodo');

// Referencias del template
const graficoContenido: Ref<HTMLElement | null> = ref(null);
const grafico: Ref<any> = ref(null);
const verCifras: Ref<HTMLElement | null> = ref(null);

// Estado reactivo
const mostrarValoresPie: Ref<boolean> = ref(false);
const seleccionado: Ref<string | null> = ref(null);
const usabilityData = ref<SerieUsabilityChannelResponse | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

// Datos del gráfico con datos iniciales para testing
const chartData: Ref<ChartData> = ref({
  labels: ['Test 1', 'Test 2', 'Test 3'],
  datasets: [
    {
      label: "Datos de prueba",
      data: [30, 45, 25],
      backgroundColor: ["#0C55F8", "#073395", "#9EBBFC", "#6F8CCE", "#021132", "#F2A900"],
    },
  ],
});

// Opciones del gráfico
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, mostrarValoresPie: false },
  layout: { top: 10, right: 40, bottom: 10, left: 40 },
  elements: { arc: { borderWidth: 4, radius: "75%" } },
});

// Computed
const total = computed(() => chartData.value.datasets[0].data.reduce((sum, val) => sum + val, 0));

// Métodos
const handleCopiar = (): void => {
  if (graficoContenido.value) copiarGrafico(graficoContenido.value);
};

const toggleValores = (): void => {
  mostrarValoresPie.value = !mostrarValoresPie.value;
  if (grafico.value?.chart) {
    grafico.value.chart.options.plugins.mostrarValoresPie = mostrarValoresPie.value;
    grafico.value.chart.update();
  }
};

const loadUsabilityChannelData = async (periodo: string) => {
  try {
    loading.value = true;
    error.value = null;
    const response = await seriesService.getSerieUsabilityByChannelByCode(periodo);
    if (response) usabilityData.value = response;
    actualizarChart('sent');
  } catch (err: any) {
    console.error('Error loading channel data:', err);
    error.value = err.message || 'Error al cargar la información del canal';
    toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 5000 });
  } finally {
    loading.value = false;
  }
};

const actualizarChart = (tipo: 'sent' | 'received') => {
  if (!usabilityData.value) return; // asegura que hay datos
  const items = tipo === 'sent' ? usabilityData.value.sent.items : usabilityData.value.received.items;
  // Actualizamos reactivo
  chartData.value = {
    labels: items.map(item => item.paymentChannelCode),
    datasets: [
      {
        label: tipo === 'sent' ? 'Enviados' : 'Recibidos',
        data: items.map(item => item.percent),
        backgroundColor: [
          "#0C55F8", "#073395", "#9EBBFC", "#6F8CCE", "#021132", "#F2A900"
        ],
      },
    ],
  };
};

const Enviados = (): void => {
  if (!usabilityData.value) return;
  actualizarChart('sent');
};

const Recibidos = (): void => {
  if (!usabilityData.value) return;
  actualizarChart('received');
};

// Watchers
watch(periodo, (newVal) => {
  if (newVal) {
    loadUsabilityChannelData(newVal);
  }
});

// Lifecycle
onMounted(() => {
  if (periodo.value) {
    loadUsabilityChannelData(periodo.value);
  }
});
</script>

<style scoped></style>