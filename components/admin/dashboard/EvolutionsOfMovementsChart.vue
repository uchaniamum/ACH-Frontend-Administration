<template>
  <div class="flex flex-col relative w-full border-0 border-gray-300 rounded-xl shadow-md p-2 box-border" style="
      box-shadow:
        -4px 0 6px -1px rgba(0, 0, 0, 0.1),
        4px 0 6px -1px rgba(0, 0, 0, 0.1),
        0 -4px 6px -1px rgba(0, 0, 0, 0.1),
        0 4px 6px -1px rgba(0, 0, 0, 0.1);
    ">
    <div class="flex flex-col items-start gap-1.5 w-full">
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
                <h3 class="text-black font-bold text-[18px] lg:text-[20px] m-0 mb-4 lg:mb-0">
                  <div class="flex items-center gap-3">
                    <span>{{ chartTitle }} - Monto</span>
                    <Icon 
                      name="x:paste-clipboard"
                      class="text-[#0A44C6] w-8 h-8 lg:w-10 lg:h-10 cursor-pointer hover:text-[#0C55F8]"
                      @click="handleCopiar" 
                    />
                    <span v-if="copiado" class="bg-blue-500 text-white text-sm px-2 py-1 rounded z-20">
                      Copiado
                    </span>
                  </div>
                </h3>

                <!-- Botones Enviados/Recibidos -->
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

              <!-- Radio buttons con colores -->
              <div class="flex justify-end items-center gap-12 mb-4">
                <div class="flex items-center gap-1">
                  <span class="w-7 h-7 rounded-full inline-block" :style="{ backgroundColor: '#0C55F8' }"></span>
                  <span class="text-[10px] font-normal" :style="{ color: '#5F6A7B', fontFamily: 'Work Sans' }">QR</span>
                  <XRadioButton v-model="seleccionado" value="QR" />
                </div>
                <div class="flex items-center gap-1">
                  <span class="w-7 h-7 rounded-full inline-block" :style="{ backgroundColor: '#6F8CCE' }"></span>
                  <span class="text-[10px] font-normal" :style="{ color: '#5F6A7B', fontFamily: 'Work Sans' }">Express</span>
                  <XRadioButton v-model="seleccionado" value="EXPRESS" />
                </div>
                <div class="flex items-center gap-1">
                  <span class="w-7 h-7 rounded-full inline-block" :style="{ backgroundColor: '#A6C4F6' }"></span>
                  <span class="text-[10px] font-normal" :style="{ color: '#5F6A7B', fontFamily: 'Work Sans' }">Asincrono</span>
                  <XRadioButton v-model="seleccionado" value="ASYNC" />
                </div>
              </div>

              <!-- Área del gráfico Monto -->
              <div class="w-full">
                <div class="chart-container">
                  <LineChart 
                    ref="chartRefMonto" 
                    :data="chartData" 
                    :options="chartOptions"
                    :plugins="[puntosColorYDatos]" 
                    class="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </XTabPanel>

          <!-- Panel Cantidad -->
          <XTabPanel value="1" class="w-full">
            <div class="flex flex-col w-full">
              <!-- Header con título y botones -->
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full mb-6">
                <h3 class="text-black font-bold text-[18px] lg:text-[20px] m-0 mb-4 lg:mb-0">
                  <div class="flex items-center gap-3">
                    <span>{{ chartTitle }} - Cantidad</span>
                    <Icon 
                      name="x:paste-clipboard"
                      class="text-[#0A44C6] w-8 h-8 lg:w-10 lg:h-10 cursor-pointer hover:text-[#0C55F8]"
                      @click="handleCopiar" 
                    />
                 </div>
                </h3>

                <!-- Botones Enviados/Recibidos -->
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

              <!-- Radio buttons con colores -->
              <div class="flex justify-end items-center gap-12 mb-4">
                <div class="flex items-center gap-1">
                  <span class="w-7 h-7 rounded-full inline-block" :style="{ backgroundColor: '#0C55F8' }"></span>
                  <span class="text-[10px] font-normal" :style="{ color: '#5F6A7B', fontFamily: 'Work Sans' }">QR</span>
                  <XRadioButton v-model="seleccionado" value="QR" />
                </div>
                <div class="flex items-center gap-1">
                  <span class="w-7 h-7 rounded-full inline-block" :style="{ backgroundColor: '#6F8CCE' }"></span>
                  <span class="text-[10px] font-normal" :style="{ color: '#5F6A7B', fontFamily: 'Work Sans' }">Express</span>
                  <XRadioButton v-model="seleccionado" value="EXPRESS" />
                </div>
                <div class="flex items-center gap-1">
                  <span class="w-7 h-7 rounded-full inline-block" :style="{ backgroundColor: '#A6C4F6' }"></span>
                  <span class="text-[10px] font-normal" :style="{ color: '#5F6A7B', fontFamily: 'Work Sans' }">Asincrono</span>
                  <XRadioButton v-model="seleccionado" value="ASYNC" />
                </div>
              </div>

              <!-- Área del gráfico Cantidad -->
              <div class="w-full">
                <div class="chart-container">
                  <LineChart 
                    ref="chartRefCantidad" 
                    :data="chartData" 
                    :options="chartOptions"
                    :plugins="[puntosColorYDatos]" 
                    class="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </XTabPanel>
        </XTabPanels>
      </XTabs>
    </div>
    <Transition name="fade">
      <div v-if="copiado" class="fixed top-4 right-4 bg-blue-500 text-white text-sm px-4 py-2 rounded-lg shadow-lg z-50">
        Gráfico copiado al portapapeles
      </div>
    </Transition>  
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch, computed } from "vue";
import type { Ref } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Line as LineChart } from "vue-chartjs";

// Composables & Services
import { useChartUtilitarios } from "~/componsables/useChartUtilitarios";
import { seriesService } from "~/services/dashboard/seriesService";
import { useToast } from "#imports";
import { XRadioButton } from "#components";

// Types
import type { SeriesEvolutivaResponse } from "~/features/dashboard/serieEvolutiva.types";

// ============================================================================
// INTERFACES Y TIPOS
// ============================================================================
interface ChartDataSet {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  tension: number;
  fill: boolean;
  borderWidth?: number;
  pointRadius: number;
  pointHoverRadius?: number;
  hidden?: boolean;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataSet[];
}

type FilterType = "amount" | "count";
type ModeType = "sent" | "received";
type SelectionType = "enviados" | "recibidos";
type TransactionType = "QR" | "EXPRESS" | "ASYNC";

// ============================================================================
// SETUP Y CONFIGURACIÓN INICIAL
// ============================================================================
defineOptions({
  name: "LineChartEvolution",
});

// Registrar Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

// ============================================================================
// VARIABLES REACTIVAS
// ============================================================================
// Estado del componente
const activeTab = ref("0");
const loading = ref(false);
const error = ref<string | null>(null);
const seleccionado = ref("");

// Datos y filtros
const chartData: Ref<ChartData> = ref({ labels: [], datasets: [] });
const evolutionsMovementsData = ref<SeriesEvolutivaResponse | null>(null);
const filtroActivo = ref<FilterType>("amount");
const currentMode = ref<ModeType>("sent");
const selected = ref<SelectionType>("enviados");

// Referencias a gráficos
const chartRefMonto: Ref<any> = ref(null);
const chartRefCantidad: Ref<any> = ref(null);

// Estados globales
const periodo = useState<string | null>("periodo");
const toast = useToast();

// Composable
const { copiado, copiarGrafico } = useChartUtilitarios();

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================
const currentChartRef = computed(() => {
  return activeTab.value === "0" ? chartRefMonto.value : chartRefCantidad.value;
});

const chartTitle = computed(() => {
  return evolutionsMovementsData.value?.panel || "No hay descripción disponible";
});

// ============================================================================
// CONFIGURACIÓN DE COLORES
// ============================================================================
const TRANSACTION_COLORS = {
  QR: "#0C55F8",
  EXPRESS: "#6F8CCE", 
  ASYNC: "#A6C4F6"
} as const;

// ============================================================================
// FUNCIONES UTILITARIAS
// ============================================================================
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

function getTransactionColor(transactionCode: string): string {
  const upperCode = transactionCode.toUpperCase() as keyof typeof TRANSACTION_COLORS;
  return TRANSACTION_COLORS[upperCode] || "#000000";
}

function getLabelByGranularity(point: any, granularity: string): string {
  if (granularity === "day") return point.date.slice(8, 10); // DD
  if (granularity === "month") return point.date.slice(0, 7); // YYYY-MM
  if (granularity === "year") return point.date.slice(0, 4); // YYYY
  return point.date; // fallback
}

function buildChartData(series: any[], granularity: string): ChartData {
  const labels = series[0]?.points.map((p: any) => getLabelByGranularity(p, granularity)) || [];
  
  const datasets = series.map((s: any) => {
    const transactionCode = s.transactionCode.toUpperCase();
    const color = getTransactionColor(transactionCode);
    
    return {
      label: transactionCode,
      data: s.points.map((p: any) => p.value),
      borderColor: color,
      backgroundColor: color,
      fill: false,
      tension: 0.2,
      pointRadius: 4,
      pointHoverRadius: 6,
    };
  });

  return { labels, datasets };
}

function getButtonClasses(type: SelectionType): string[] {
  return [
    'flex items-center gap-2 px-3 py-2 flex-1 sm:flex-none min-w-[100px] rounded-md text-sm cursor-pointer transition-colors',
    selected.value === type
      ? 'bg-[#6F8CCE] text-white'
      : 'bg-[#F0F5FF] text-[#5F6A7B] hover:bg-[#6F8CCE] hover:text-white',
  ];
}

// ============================================================================
// PLUGIN PERSONALIZADO
// ============================================================================
const puntosColorYDatos = {
  id: "puntosColorYDatos",
  afterDatasetsDraw(chart: any) {
    const { ctx } = chart;

    chart.data.datasets.forEach((dataset: any) => {
      const meta = chart.getDatasetMeta(chart.data.datasets.indexOf(dataset));
      if (!meta) return;

      meta.data.forEach((point: any, index: number) => {
        // Dibujar círculo del punto
        drawPointCircle(ctx, point, dataset.borderColor || "#000");

        // Solo mostrar tooltip si está seleccionado
        if (!seleccionado.value || dataset.label !== seleccionado.value) return;

        const value = dataset.data[index];
        drawValueTooltip(ctx, point, value);
      });
    });
  },
};

function drawPointCircle(ctx: any, point: any, color: string) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.restore();
}

function drawValueTooltip(ctx: any, point: any, value: number) {
  const texto = formatNumber(value);
  
  ctx.save();
  ctx.translate(point.x, point.y - 25);
  ctx.rotate(-Math.PI / 3);

  const paddingX = 8;
  const paddingY = 4;
  const textWidth = ctx.measureText(texto).width;
  const width = textWidth + paddingX * 2;
  const height = 18;

  // Dibujar burbuja redondeada
  drawRoundedRect(ctx, -width / 2, -height / 2, width, height, 6, "#6F8CCE");

  // Texto centrado
  ctx.fillStyle = "white";
  ctx.font = "10px Work Sans";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(texto, 0, 0);

  ctx.restore();
}

function drawRoundedRect(ctx: any, x: number, y: number, width: number, height: number, radius: number, fillColor: string) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  
  ctx.fillStyle = fillColor;
  ctx.fill();
}

// ============================================================================
// CONFIGURACIÓN DEL GRÁFICO
// ============================================================================
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
  },
  scales: {
    x: {
      ticks: { font: { size: 10 } },
      grid: { drawOnChartArea: true }
    },
    y: {
      beginAtZero: true,
      suggestedMax: 1000,
      ticks: {
        callback: (value: any) => formatNumber(Number(value)),
        font: { size: 11, family: "Work Sans" },
      },
      grid: { drawOnChartArea: true }
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const label = context.dataset.label || "";
          const value = formatNumber(context.raw);
          return `${label}: ${value}`;
        },
      },
    },
    legend: { display: false },
  },
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6
    }
  }
});

// ============================================================================
// FUNCIONES DE ACTUALIZACIÓN
// ============================================================================
function updateChart() {
  if (chartRefMonto.value?.chart) {
    chartRefMonto.value.chart.update();
  }
  if (chartRefCantidad.value?.chart) {
    chartRefCantidad.value.chart.update();
  }
}

async function updateChartData(mode: ModeType) {
  if (!evolutionsMovementsData.value) return;
  
  const seriesToUse = mode === "sent" 
    ? evolutionsMovementsData.value.sent.series
    : evolutionsMovementsData.value.received.series;
    
  chartData.value = buildChartData(seriesToUse, evolutionsMovementsData.value.granularity);
  
  if (seleccionado.value) {
    await nextTick();
    updateDatasetVisibility();
  }
}

async function updateDatasetVisibility() {
  await nextTick();
  const valueUpper = seleccionado.value.toUpperCase();
  
  chartData.value.datasets.forEach((ds) => {
    ds.hidden = valueUpper !== "" ? ds.label !== valueUpper : false;
  });

  updateChart();
}

// ============================================================================
// HANDLERS DE EVENTOS
// ============================================================================
async function handleTabChange(value: string) {
  activeTab.value = value;
  await nextTick();
  
  const newFilter: FilterType = value === "0" ? "amount" : "count";
  
  if (filtroActivo.value !== newFilter) {
    filtroActivo.value = newFilter;
    if (periodo.value) {
      await loadEvolutionsMovementsData(periodo.value, newFilter);
    }
  }
  
  if (seleccionado.value) {
    await nextTick();
    updateDatasetVisibility();
  }
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

// ============================================================================
// FUNCIONES DE DATOS
// ============================================================================
async function loadEvolutionsMovementsData(
  periodo: string,
  tipo: FilterType = filtroActivo.value
) {
  try {
    console.log(`Cargando datos evolutivos: Período=${periodo}, Tipo=${tipo}, Modo=${currentMode.value}`);
    
    loading.value = true;
    error.value = null;
    
    const response = await seriesService.getSerieEvolutivaByCode(periodo, tipo);
    
    if (response) {
      evolutionsMovementsData.value = response;
      await updateChartData(currentMode.value);
    }
  } catch (err: any) {
    console.error("Error loading evolution data:", err);
    error.value = err.message || "Error al cargar la información evolutiva";
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

// ============================================================================
// WATCHERS
// ============================================================================
watch(periodo, (newVal) => {
  if (newVal) {
    loadEvolutionsMovementsData(newVal);
  }
});

watch(seleccionado, async (nuevoValor) => {
  if (evolutionsMovementsData.value) {
    await updateChartData(currentMode.value);
    await nextTick();
    updateDatasetVisibility();
  }
});

// ============================================================================
// LIFECYCLE
// ============================================================================
onMounted(async () => {
  if (periodo.value) {
    await loadEvolutionsMovementsData(periodo.value);
  }
  if (error.value) {
    console.warn("No se pudieron cargar los datos de evolución:", error.value);
  }
});
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: 400px;
}

.chart-container canvas {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
}

@media (max-width: 768px) {
  .chart-container {
    height: 350px !important;
  }
}

@media (min-width: 1024px) {
  .chart-container {
    height: 500px !important;
  }
}
</style>