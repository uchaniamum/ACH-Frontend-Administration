<template>
  <div class="flex flex-col relative w-full border-0 border-gray-300 rounded-xl shadow-md p-2 box-border" style="
      box-shadow: -4px 0 6px -1px rgba(0, 0, 0, 0.1),
        4px 0 6px -1px rgba(0, 0, 0, 0.1), 0 -4px 6px -1px rgba(0, 0, 0, 0.1),
        0 4px 6px -1px rgba(0, 0, 0, 0.1);
    ">
    <div class="flex flex-col items-start gap-1.5">
      <XTabs v-model:value="activeTab" @update:value="handleTabChange" class="w-full">
        <XTabList class="w-full">
          <XTab value="0">Monto</XTab>
          <XTab value="1">Cantidad</XTab>
        </XTabList>

        <XTabPanels class="w-full">
          <!-- Panel Monto -->
          <XTabPanel value="0" class="w-full">
            <div class="flex flex-col w-full">
              <!-- Header con título y botones -->
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full mb-6">
                <h3 class="text-black font-bold text-[20px] m-0 flex items-center gap-2">
                  {{ chartTitle }}
                  <Icon name="x:paste-clipboard" @click="handleCopiar"
                    class="text-[#0A44C6] w-10 h-10 cursor-pointer hover:text-[#0C55F8]" />
                </h3>

                <!-- Botones Enviados/Recibidos -->
                <div
                  class="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-[#F0F5FF] w-full sm:w-auto">
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

              <!-- Área del gráfico -->
              <div class="relative w-full border-gray-200 rounded-lg p-2" style="height: 500px; overflow-y: auto">
                <!-- Toggle Ver todas las cifras -->
                <div class="absolute left-2 top-2 flex items-center cursor-pointer z-10" @click="toggleManual">
                  <div class="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none"
                      class="transition-all duration-200">
                      <path
                        d="M2 1.38855H16C16.8284 1.38855 17.5 2.06012 17.5 2.88855V16.8885C17.5 17.717 16.8284 18.3885 16 18.3885H2C1.17157 18.3885 0.5 17.717 0.5 16.8885V2.88855C0.5 2.06012 1.17157 1.38855 2 1.38855Z"
                        :fill="mostrarValores ? '#0C55F8' : 'white'" :stroke="mostrarValores ? '#0C55F8' : '#A9B6C9'"
                        class="transition-all duration-200" />
                      <path v-if="mostrarValores" d="M5 9.5l2.5 2.5 5.5-5.5" stroke="white" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round" fill="none" />
                    </svg>
                  </div>
                  <span class="font-normal text-[13px] ml-2 select-none">Ver todas las cifras</span>
                </div>

                <!-- Gráfico Monto -->
                <BarChart ref="chartRefMonto" :data="chartData" :options="chartOptionsComputed" />
              </div>
            </div>
          </XTabPanel>

          <!-- Panel Cantidad -->
          <XTabPanel value="1" class="w-full">
            <div class="flex flex-col w-full">
              <!-- Header con título y botones -->
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full mb-6">
                <h3 class="text-black font-bold text-[20px] m-0 flex items-center gap-2">
                  {{ chartTitle }}
                  <Icon name="x:paste-clipboard" @click="handleCopiar"
                    class="text-[#0A44C6] w-10 h-10 cursor-pointer hover:text-[#0C55F8]" />
                  <!-- Toast de copiado -->
                </h3>

                <!-- Botones Enviados/Recibidos -->
                <div
                  class="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-[#F0F5FF] w-full sm:w-auto">
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

              <!-- Área del gráfico -->
              <div class="relative w-full border-gray-200 rounded-lg p-2" style="height: 500px; overflow-y: auto">
                <!-- Toggle Ver todas las cifras -->
                <div class="absolute left-2 top-2 flex items-center cursor-pointer z-10" @click="toggleManual">
                  <div class="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none"
                      class="transition-all duration-200">
                      <path
                        d="M2 1.38855H16C16.8284 1.38855 17.5 2.06012 17.5 2.88855V16.8885C17.5 17.717 16.8284 18.3885 16 18.3885H2C1.17157 18.3885 0.5 17.717 0.5 16.8885V2.88855C0.5 2.06012 1.17157 1.38855 2 1.38855Z"
                        :fill="mostrarValores ? '#0C55F8' : 'white'" :stroke="mostrarValores ? '#0C55F8' : '#A9B6C9'"
                        class="transition-all duration-200" />
                      <path v-if="mostrarValores" d="M5 9.5l2.5 2.5 5.5-5.5" stroke="white" stroke-width="1.5"
                        stroke-linecap="round" stroke-linejoin="round" fill="none" />
                    </svg>
                  </div>
                  <span class="font-normal text-[13px] ml-2 select-none">Ver todas las cifras</span>
                </div>
                <!-- Gráfico Cantidad -->
                <BarChart ref="chartRefCantidad" :data="chartData" :options="chartOptionsComputed" />
              </div>
            </div>
          </XTabPanel>
        </XTabPanels>
      </XTabs>
    </div>
    <Transition name="fade">
      <div v-if="copiado"
        class="fixed top-4 right-4 bg-blue-500 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50">
        Gráfico copiado al portapapeles
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import type { Ref } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar as BarChart } from "vue-chartjs";

// Composables & Services
import { useChartUtilitarios } from "~/componsables/useChartUtilitarios";
import { seriesService } from "~/services/dashboard/seriesService";
import { useToast } from "#imports";

// Types
import type { SerieTotalTransactionsRegionResponse } from "~/features/dashboard/serieTotalTransaccionsRegion.types";

// INTERFACES Y TIPOS
interface ChartDataSet {
  label: string;
  data: number[];
  backgroundColor: string;
  hidden?: boolean;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataSet[];
}

type FilterType = "amount" | "count";
type ModeType = "sent" | "received";
type SelectionType = "enviados" | "recibidos";

// SETUP Y CONFIGURACIÓN INICIAL
defineOptions({
  name: "BarVertical",
});

// Registrar Chart.js y plugins
const { copiarGrafico, copiado, mostrarValoresPluginSumatoria } = useChartUtilitarios();
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  mostrarValoresPluginSumatoria
);

// VARIABLES REACTIVAS
const activeTab = ref("0");
const mostrarValores = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

// Datos y filtros
const chartData: Ref<ChartData> = ref({ labels: [], datasets: [] });
const totalTransactionsRegionData = ref<SerieTotalTransactionsRegionResponse | null>(null);
const filtroActivo = ref<FilterType>("amount");
const currentMode = ref<ModeType>("sent");
const selected = ref<SelectionType>("enviados");

// Referencias a gráficos
const chartRefMonto: Ref<any> = ref(null);
const chartRefCantidad: Ref<any> = ref(null);

// Estados globales
const periodo = useState<string | null>("periodo");
const toast = useToast();

// COMPUTED PROPERTIES
const currentChartRef = computed(() => {
  return activeTab.value === "0" ? chartRefMonto.value : chartRefCantidad.value;
});

const chartTitle = computed(() => {
  return totalTransactionsRegionData.value?.panel || "No hay descripción disponible";
});

const chartOptionsComputed = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      ticks: { font: { size: 10 } }
    },
    y: {
      stacked: true,
      beginAtZero: true,
      ticks: {
        callback: (value: any) => formatNumber(Number(value)),
        font: { size: 11, family: "Work Sans" },
      },
    },
  },
  plugins: {
    mostrarValoresPluginSumatoria: { enabled: mostrarValores.value },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const label = context.dataset.label || "";
          const value = formatNumber(context.raw);
          return `${label}: ${value}`;
        },
      },
    },
    legend: {
      position: "top" as const,
      align: "end" as const,
      onClick: null,
      labels: {
        usePointStyle: true,
        pointStyle: "circle" as const,
        boxWidth: 12,
        boxHeight: 12,
        padding: 15,
        font: { size: 10, family: "Work Sans", weight: "400" },
        color: "#5F6A7B",
        generateLabels: (chart: any) => generateCustomLabels(chart),
      },
    },
  },
}));

// FUNCIONES UTILITARIAS
function formatNumber(value: number): string {
  const suffixes = ["", "K", "M", "B", "T"];
  let newValue = value;
  let suffixIndex = 0;

  while (Math.abs(newValue) >= 1000 && suffixIndex < suffixes.length - 1) {
    newValue /= 1000;
    suffixIndex++;
  }

  const formatted = newValue.toLocaleString("es-BO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return formatted + suffixes[suffixIndex];
}

function generateCustomLabels(chart: any) {
  const order = ["QR", "Express", "Asincrono"];
  return order
    .map((label) => {
      const datasetIndex = chart.data.datasets.findIndex(
        (d: any) => d.label === label
      );
      if (datasetIndex === -1) return null;

      const dataset = chart.data.datasets[datasetIndex];
      return {
        text: dataset.label,
        fillStyle: dataset.backgroundColor,
        hidden: !chart.isDatasetVisible(datasetIndex),
        datasetIndex,
        strokeStyle: "transparent",
      };
    })
    .filter((x: any) => x !== null);
}

function buildChartData(participants: any[]): ChartData {
  const labels = participants.map((p: any) => p.code);

  const getValueByCode = (participants: any[], code: string) =>
    participants.map((p: any) => {
      const item = p.items.find((i: any) => i.transactionCode === code);
      return item ? item.value : 0;
    });

  return {
    labels,
    datasets: [
      {
        label: "Asincrono",
        data: getValueByCode(participants, "ASYNC"),
        backgroundColor: "#A6C4F6"
      },
      {
        label: "Express",
        data: getValueByCode(participants, "EXPRESS"),
        backgroundColor: "#6F8CCE"
      },
      {
        label: "QR",
        data: getValueByCode(participants, "QR"),
        backgroundColor: "#0C55F8"
      },
    ],
  };
}

function getButtonClasses(type: SelectionType): string[] {
  return [
    'flex items-center gap-2 px-3 py-2 flex-1 sm:flex-none min-w-[100px] rounded-md text-sm cursor-pointer transition-colors',
    selected.value === type
      ? 'bg-[#6F8CCE] text-white'
      : 'bg-[#F0F5FF] text-[#5F6A7B] hover:bg-[#6F8CCE] hover:text-white',
  ];
}

// FUNCIONES DE ACTUALIZACIÓN
function updateChart() {
  if (chartRefMonto.value?.chart) {
    chartRefMonto.value.chart.update();
  }
  if (chartRefCantidad.value?.chart) {
    chartRefCantidad.value.chart.update();
  }
}

async function updateChartData(mode: ModeType) {
  if (!totalTransactionsRegionData.value) return;

  const regionsToUse = mode === "sent"
    ? totalTransactionsRegionData.value.sent.regions
    : totalTransactionsRegionData.value.received.regions;

  chartData.value = buildChartData(regionsToUse);
  await nextTick();
  updateChart();
}

// HANDLERS DE EVENTOS
async function handleTabChange(value: string) {
  activeTab.value = value;
  await nextTick();

  // Cambiar filtro según el tab
  const newFilter: FilterType = value === "0" ? "amount" : "count";

  if (filtroActivo.value !== newFilter) {
    filtroActivo.value = newFilter;
    if (periodo.value) {
      await loadTotalTransactionsRegionData(periodo.value, newFilter);
    }
  }

  await nextTick();
  updateChart();
}

async function handleCopiar() {
  try {
    await nextTick();
    const chartRef = currentChartRef.value;

    if (chartRef?.$el) {
      await copiarGrafico(chartRef.$el);
      console.log(`Gráfico copiado desde tab: ${activeTab.value === "0" ? "Monto" : "Cantidad"}`);
    } else {
      throw new Error("No se pudo obtener la referencia del gráfico");
    }
  } catch (error) {
    console.error("Error al copiar el gráfico:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error al copiar el gráfico",
      life: 3000,
    });
  }
}

async function toggleManual() {
  mostrarValores.value = !mostrarValores.value;
  console.log(`Plugin mostrar valores: ${mostrarValores.value ? "ACTIVADO" : "DESACTIVADO"}`);
  await nextTick();
  updateChart();
}

async function handleEnviados() {
  selected.value = "enviados";
  currentMode.value = "sent";
  await updateChartData("sent");
}

async function handleRecibidos() {
  selected.value = "recibidos";
  currentMode.value = "received";
  await updateChartData("received");
}

// FUNCIONES CARGAR DATOS DESDE EL SERVICIO 
async function loadTotalTransactionsRegionData(
  periodo: string,
  tipo: FilterType = filtroActivo.value
) {
  try {
    console.log(`Cargando datos: Período=${periodo}, Tipo=${tipo}, Modo=${currentMode.value}`);
    loading.value = true;
    error.value = null;
    const response = await seriesService.getSerieTotalTransactionsRegionByCode(periodo, tipo);
    if (response) {
      totalTransactionsRegionData.value = response;
      await updateChartData(currentMode.value);
    }
  } catch (err: any) {
    console.error("Error loading data:", err);
    error.value = err.message || "Error al cargar la información";
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.value,
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
}

// WATCHERS
watch(periodo, (newVal) => {
  if (newVal) {
    loadTotalTransactionsRegionData(newVal);
  }
});

watch(mostrarValores, async () => {
  await nextTick();
  updateChart();
});

// LIFECYCLE
onMounted(async () => {
  if (periodo.value) {
    await loadTotalTransactionsRegionData(periodo.value);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>