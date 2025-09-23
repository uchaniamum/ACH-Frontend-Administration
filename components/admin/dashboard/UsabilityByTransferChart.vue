<template>
  <div class="flex flex-col relative w-full border-2 border-gray-300 rounded-xl shadow-md p-4 box-border">
    <!-- Encabezado con título y botones -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full mb-4 titulo-botones gap-2">
      <h3 class="text-black font-bold text-lg sm:text-[20px] flex items-center gap-2 relative">
        {{ usabilityTransferData?.panel || 'No hay descripción disponible' }}
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

      <div class="flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-[#F0F5FF] w-full sm:w-auto justify-center">
        <button @click="Enviados"
          class="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 min-w-[90px] sm:min-w-[100px] rounded-md bg-[#F0F5FF] text-[#5F6A7B] text-xs sm:text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white">
          <Icon name="x:arrow-tr-circle" class="text-[#5F6A7B] w-6 h-6 sm:w-7 sm:h-7" /> Enviados
        </button>
        <button @click="Recibidos"
          class="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 min-w-[90px] sm:min-w-[100px] rounded-md bg-[#F0F5FF] text-[#5F6A7B] text-xs sm:text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white">
          <Icon name="x:arrow-br-circle" class="text-[#5F6A7B] w-6 h-6 sm:w-7 sm:h-7" /> Recibidos
        </button>
      </div>
    </div>

    <!-- Botón Ver todas las cifras -->
    <div class="flex items-center gap-2 mb-2">
      <div ref="verCifras" class="flex items-center cursor-pointer transition-all">
        <XCheckBox v-model="seleccionado" name="mostrarValoresPie" value="seleccionarDatos" @click="toggleValores"
          :class="{ 'border-[#0C55F8]': seleccionado === 'seleccionarDatos' }" />
        <span class="font-normal text-[11px] sm:text-[12px] ml-2">Ver todas las cifras</span>
      </div>
    </div>

    <!-- Contenedor que se copiará (gráfico + labels) -->
    <div ref="graficoContenido" class="w-full flex flex-col items-center gap-4 sm:gap-6">
      <div class="flex justify-center items-center w-[400px] h-[400px] sm:w-[420px] sm:h-[460px]">
        <PieChart ref="grafico" :data="chartData" :options="chartOptions" />
      </div>

      <div
        class="flex flex-col gap-2 sm:gap-3 border border-[#92ACE5] p-3 rounded-lg bg-white w-[90%] sm:w-[55%] mx-auto">
        <div class="text-[13px] sm:text-[14px] font-semibold text-[#5F6A7B] mb-1 sm:mb-2 text-left">
          {{ chartData.datasets[0].label }}</div>
        <div v-for="(label, index) in chartData.labels" :key="index"
          class="flex justify-between items-center w-full p-1 flex-wrap">
          <div class="flex items-center gap-1 sm:gap-2 min-w-[120px] sm:min-w-[140px] flex-1">
            <span class="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
              :style="{ backgroundColor: chartData.datasets[0].backgroundColor[index] }"></span>
            <span class="text-[10px] sm:text-[11px] font-medium text-[#5F6A7B]">{{ label }}</span>
          </div>
          <span class="text-[10px] sm:text-[11px] font-medium text-[#5F6A7B] text-right flex-shrink-0 ml-1 sm:ml-2">
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
import { Chart as ChartJS, Title, Tooltip, ArcElement } from "chart.js";
import { Pie as PieChart } from "vue-chartjs";
import { useChartUtilitarios } from "~/componsables/useChartUtilitarios";
import { XCheckBox } from "#components";
import type { SerieUsabilityTransferResponse } from "~/features/dashboard/serieUsabilityTransfer.types";
import { useToast } from "#imports";
import { seriesService } from "~/services/dashboard/seriesService";

ChartJS.register(
  Title,
  Tooltip,
  ArcElement,
  useChartUtilitarios().mostrarTooltipBurbujaPlugin
);

// Interfaces para tipar el gráfico
interface ChartDataSet {
  label: string;
  data: number[];
  backgroundColor: string[];
}

interface ChartData {
  labels: string[];
  datasets: ChartDataSet[];
}

// Composable
const { copiarGrafico, copiado } = useChartUtilitarios();
const graficoContenido: Ref<HTMLElement | null> = ref(null);
const verCifras: Ref<HTMLElement | null> = ref(null);
const grafico: Ref<any> = ref(null);
const mostrarValoresPie = ref(false);
const seleccionado = ref<string | null>(null);
const usabilityTransferData = ref<SerieUsabilityTransferResponse | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const toast = useToast();
const chartData: Ref<ChartData> = ref({
  labels: [],
  datasets: [
    {
      label: "",
      data: [],
      backgroundColor: ["#0C55F8", "#073395", "#9EBBFC"],
    },
  ],
});
const total = computed(() =>chartData.value.datasets[0].data.reduce((sum, val) => sum + val, 0));
const periodo = useState<string | null>('periodo')


// Chart options
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    mostrarValoresPie: false,
  },
  layout: { padding: 20 },
  elements: { arc: { borderWidth: 4, radius: "80%" } },
});

// Computed

// Methods
const handleCopiar = () => {
  if (graficoContenido.value) {
    copiarGrafico(graficoContenido.value);
  }
};

const toggleValores = () => {
  mostrarValoresPie.value = !mostrarValoresPie.value;
  if (grafico.value?.chart) {
    grafico.value.chart.options.plugins.mostrarValoresPie = mostrarValoresPie.value;
    grafico.value.chart.update();
  }
};


const Enviados = (): void => {
  if (!usabilityTransferData.value) return;
  actualizarChart('sent');
};
const Recibidos = (): void => {
  if (!usabilityTransferData.value) return;
  actualizarChart('received');
};

 watch(periodo, (newVal) => {
      if (newVal) {
loadUsabilityTransferData(newVal)
      }
    })
const loadUsabilityTransferData = async (periodo:string) => {
  try {
    loading.value = true;
    error.value = null;
    const response = await seriesService.getSerieUsabilityByTransferByCode(periodo);
    console.log("mis usabilidad es", response);
    if (response) usabilityTransferData.value = response;
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
  if (!usabilityTransferData.value) return; // asegura que hay datos
  const items = tipo === 'sent' ? usabilityTransferData.value.sent.items : usabilityTransferData.value.received.items;
  chartData.value = {
    labels: items.map(item => item.transactionCode),
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

onMounted(async () => {
  await loadUsabilityTransferData();
  // Manejo de errores
  if (error.value) {
    console.warn('No se pudieron cargar los datos de usabilidad de transferencia:', error.value)
  }
});

defineOptions({
  name: "PieUsabilidadTransferencia"
});
</script>

<style scoped></style>