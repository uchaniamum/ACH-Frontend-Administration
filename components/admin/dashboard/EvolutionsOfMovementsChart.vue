<template>
  <div class="flex flex-col relative w-full border-0 border-gray-300 rounded-xl shadow-md p-2 box-border" style="
      box-shadow:
        -4px 0 6px -1px rgba(0, 0, 0, 0.1),
        4px 0 6px -1px rgba(0, 0, 0, 0.1),
        0 -4px 6px -1px rgba(0, 0, 0, 0.1),
        0 4px 6px -1px rgba(0, 0, 0, 0.1);
    ">
    <!-- Botones Monto / Cantidad -->
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
              <!-- Título y botón copiar -->
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full mb-6">
                <h3 class="text-black font-bold text-[18px] lg:text-[20px] m-0 mb-4 lg:mb-0">
                  <div class="flex items-center gap-3">
                    <span>{{
                      evolutionsMovementsData?.panel ||
                      "No hay descripción disponible"
                    }}
                      - Monto</span>
                    <Icon name="x:paste-clipboard"
                      class="text-[#0A44C6] w-8 h-8 lg:w-10 lg:h-10 cursor-pointer hover:text-[#0C55F8]"
                      @click="handleCopiar" />
                    <span v-if="copiado" class="bg-blue-500 text-white text-sm px-2 py-1 rounded z-20">
                      Copiado
                    </span>
                  </div>
                </h3>

                <!-- Botones Enviados/Recibidos -->
                <div
                  class="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-[#F0F5FF] w-full sm:w-auto">
                  <button @click="Enviados" :class="[
                    'flex items-center gap-2 px-3 py-2 flex-1 sm:flex-none min-w-[100px] rounded-md text-sm cursor-pointer transition-colors',
                    selected === 'enviados'
                      ? 'bg-[#6F8CCE] text-white'
                      : 'bg-[#F0F5FF] text-[#5F6A7B] hover:bg-[#6F8CCE] hover:text-white',
                  ]">
                    <Icon name="x:arrow-tr-circle" class="w-6 h-6 sm:w-7 sm:h-7" />
                    Enviados
                  </button>
                  <button @click="Recibidos" :class="[
                    'flex items-center gap-2 px-3 py-2 flex-1 sm:flex-none min-w-[100px] rounded-md text-sm cursor-pointer transition-colors',
                    selected === 'recibidos'
                      ? 'bg-[#6F8CCE] text-white'
                      : 'bg-[#F0F5FF] text-[#5F6A7B] hover:bg-[#6F8CCE] hover:text-white',
                  ]">
                    <Icon name="x:arrow-br-circle" class="w-6 h-6 sm:w-7 sm:h-7" />
                    Recibidos
                  </button>
                </div>
              </div>

              <!-- Radios con más espacio entre grupos -->
              <div class="flex justify-end items-center gap-12 mb-4">
                <div class="flex items-center gap-1">
                  <span class="w-7 h-7 rounded-full inline-block" :style="{ backgroundColor: '#0C55F8' }"></span>
                  <span class="text-[10px] font-normal" :style="{ color: '#5F6A7B', fontFamily: 'Work Sans' }">QR</span>
                  <XRadioButton v-model="seleccionado" value="QR" />
                </div>
                <div class="flex items-center gap-1">
                  <span class="w-7 h-7 rounded-full inline-block" :style="{ backgroundColor: '#6F8CCE' }"></span>
                  <span class="text-[10px] font-normal"
                    :style="{ color: '#5F6A7B', fontFamily: 'Work Sans' }">Express</span>
                  <XRadioButton v-model="seleccionado" value="EXPRESS" />
                </div>
                <div class="flex items-center gap-1">
                  <span class="w-7 h-7 rounded-full inline-block" :style="{ backgroundColor: '#A6C4F6' }"></span>
                  <span class="text-[10px] font-normal"
                    :style="{ color: '#5F6A7B', fontFamily: 'Work Sans' }">Asincrono</span>
                  <XRadioButton v-model="seleccionado" value="ASYNC" />
                </div>
              </div>

              <!-- Contenedor del gráfico para Monto - CORREGIDO -->
              <div class="w-full">
                <div class="chart-container" style="position: relative; width: 100%; height: 400px;">
                  <LineChart ref="chartRefMonto" :data="chartData" :options="chartOptions"
                    :plugins="[puntosColorYDatos]" style="width: 100% !important; height: 100% !important;" />
                </div>
              </div>
            </div>
          </XTabPanel>

          <!-- Panel Cantidad -->
          <XTabPanel value="1" class="w-full">
            <div class="flex flex-col w-full">
              <!-- Título y botón copiar -->
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full mb-6">
                <h3 class="text-black font-bold text-[18px] lg:text-[20px] m-0 mb-4 lg:mb-0">
                  <div class="flex items-center gap-3">
                    <span>{{
                      evolutionsMovementsData?.panel ||
                      "No hay descripción disponible"
                    }}
                      - Cantidad</span>
                    <Icon name="x:paste-clipboard"
                      class="text-[#0A44C6] w-8 h-8 lg:w-10 lg:h-10 cursor-pointer hover:text-[#0C55F8]"
                      @click="handleCopiar" />
                    <span v-if="copiado" class="bg-blue-500 text-white text-sm px-2 py-1 rounded z-20">
                      Copiado
                    </span>
                  </div>
                </h3>

                <!-- Botones Enviados/Recibidos -->
                <div
                  class="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-[#F0F5FF] w-full sm:w-auto">
                  <button @click="Enviados" :class="[
                    'flex items-center gap-2 px-3 py-2 flex-1 sm:flex-none min-w-[100px] rounded-md text-sm cursor-pointer transition-colors',
                    selected === 'enviados'
                      ? 'bg-[#6F8CCE] text-white'
                      : 'bg-[#F0F5FF] text-[#5F6A7B] hover:bg-[#6F8CCE] hover:text-white',
                  ]">
                    <Icon name="x:arrow-tr-circle" class="w-6 h-6 sm:w-7 sm:h-7" />
                    Enviados
                  </button>
                  <button @click="Recibidos" :class="[
                    'flex items-center gap-2 px-3 py-2 flex-1 sm:flex-none min-w-[100px] rounded-md text-sm cursor-pointer transition-colors',
                    selected === 'recibidos'
                      ? 'bg-[#6F8CCE] text-white'
                      : 'bg-[#F0F5FF] text-[#5F6A7B] hover:bg-[#6F8CCE] hover:text-white',
                  ]">
                    <Icon name="x:arrow-br-circle" class="w-6 h-6 sm:w-7 sm:h-7" />
                    Recibidos
                  </button>
                </div>
              </div>

              <!-- Radios con más espacio entre grupos -->
              <div class="flex justify-end items-center gap-12 mb-4">
                <div class="flex items-center gap-1">
                  <span class="w-7 h-7 rounded-full inline-block" :style="{ backgroundColor: '#0C55F8' }"></span>
                  <span class="text-[10px] font-normal" :style="{ color: '#5F6A7B', fontFamily: 'Work Sans' }">QR</span>
                  <XRadioButton v-model="seleccionado" value="QR" />
                </div>
                <div class="flex items-center gap-1">
                  <span class="w-7 h-7 rounded-full inline-block" :style="{ backgroundColor: '#6F8CCE' }"></span>
                  <span class="text-[10px] font-normal"
                    :style="{ color: '#5F6A7B', fontFamily: 'Work Sans' }">Express</span>
                  <XRadioButton v-model="seleccionado" value="EXPRESS" />
                </div>
                <div class="flex items-center gap-1">
                  <span class="w-7 h-7 rounded-full inline-block" :style="{ backgroundColor: '#A6C4F6' }"></span>
                  <span class="text-[10px] font-normal"
                    :style="{ color: '#5F6A7B', fontFamily: 'Work Sans' }">Asincrono</span>
                  <XRadioButton v-model="seleccionado" value="ASYNC" />
                </div>
              </div>

              <!-- Contenedor del gráfico para Cantidad - CORREGIDO -->
              <div class="w-full">
                <div class="chart-container" style="position: relative; width: 100%; height: 400px;">
                  <LineChart ref="chartRefCantidad" :data="chartData" :options="chartOptions"
                    :plugins="[puntosColorYDatos]" style="width: 100% !important; height: 100% !important;" />
                </div>
              </div>
            </div>
          </XTabPanel>
        </XTabPanels>
      </XTabs>
    </div>
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
import { useChartUtilitarios } from "~/componsables/useChartUtilitarios";
import { XRadioButton } from "#components";
import { seriesService } from "~/services/dashboard/seriesService";
import type { SeriesEvolutivaResponse } from "~/features/dashboard/serieEvolutiva.types";
import { useToast } from "#imports";

// Interfaces para tipar el gráfico
interface ChartDataSet {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  tension: number;
  fill: boolean;
  borderWidth: number;
  pointRadius: number;
  pointHoverRadius: number;
  hidden?: boolean;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataSet[];
}

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

// Composable
const { copiado, copiarGrafico } = useChartUtilitarios();
const chartData: Ref<ChartData> = ref({
  labels: [],
  datasets: [],
});

// Refs - Separados para cada tab
const chartRefMonto: Ref<any> = ref(null);
const chartRefCantidad: Ref<any> = ref(null);
const seleccionado = ref(""); // por defecto no mostrar valores
const evolutionsMovementsData = ref<SeriesEvolutivaResponse | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const toast = useToast();
const currentMode = ref<"sent" | "received">("sent");
const periodo = useState<string | null>("periodo");
const filtroActivo = ref<"amount" | "count">("amount");
const selected = ref<"enviados" | "recibidos">("enviados");
const activeTab = ref("0"); // Control del tab activo

//  obtener la referencia correcta del chart según el tab activo
const currentChartRef = computed(() => {
  return activeTab.value === "0" ? chartRefMonto.value : chartRefCantidad.value;
});

// Función para formatear números
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

// Plugin personalizado
const puntosColorYDatos = {
  id: "puntosColorYDatos",
  afterDatasetsDraw(chart: any) {
    const { ctx } = chart;

    chart.data.datasets.forEach((dataset: any) => {
      const meta = chart.getDatasetMeta(chart.data.datasets.indexOf(dataset));
      if (!meta) return;

      meta.data.forEach((point: any, index: number) => {
        // Dibujar círculo
        ctx.save();
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = dataset.borderColor || "#000";
        ctx.stroke();
        ctx.restore();

        // Solo mostrar tooltip si está seleccionado
        if (!seleccionado.value || dataset.label !== seleccionado.value) return;

        const value = dataset.data[index];
        const texto = formatNumber(value);

        ctx.save();
        ctx.translate(point.x, point.y - 25); // un poco arriba
        ctx.rotate(-Math.PI / 3); // rotación si quieres

        const paddingX = 8;
        const paddingY = 4;
        const textWidth = ctx.measureText(texto).width;
        const width = textWidth + paddingX * 2;
        const height = 18;

        // Ajustar la burbuja
        ctx.beginPath();
        const radius = 6; // esquinas redondeadas
        ctx.moveTo(-width / 2 + radius, -height / 2);
        ctx.lineTo(width / 2 - radius, -height / 2);
        ctx.quadraticCurveTo(
          width / 2,
          -height / 2,
          width / 2,
          -height / 2 + radius
        );
        ctx.lineTo(width / 2, height / 2 - radius);
        ctx.quadraticCurveTo(
          width / 2,
          height / 2,
          width / 2 - radius,
          height / 2
        );
        ctx.lineTo(-width / 2 + radius, height / 2);
        ctx.quadraticCurveTo(
          -width / 2,
          height / 2,
          -width / 2,
          height / 2 - radius
        );
        ctx.lineTo(-width / 2, -height / 2 + radius);
        ctx.quadraticCurveTo(
          -width / 2,
          -height / 2,
          -width / 2 + radius,
          -height / 2
        );
        ctx.closePath();

        ctx.fillStyle = "#6F8CCE";
        ctx.fill();

        // Texto centrado
        ctx.fillStyle = "white";
        ctx.font = "10px Work Sans";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(texto, 0, 0);

        ctx.restore();
      });
    });
  },
};

// Configuración del gráfico corregida para ocupar todo el ancho
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false, // Importante para que use el height del contenedor
  layout: {
    padding: {
      top: 20,
      right: 20, // Padding derecho para que no se corte
      bottom: 20,
      left: 20
    }
  },
  scales: {
    x: {
      ticks: {
        font: { size: 10 }
      },
      // Asegurar que use todo el ancho disponible
      grid: {
        drawOnChartArea: true,
      }
    },
    y: {
      beginAtZero: true,
      suggestedMax: 1000,
      ticks: {
        callback: (value: any) => formatNumber(Number(value)),
        font: { size: 11, family: "Work Sans" },
      },
      // Asegurar que use toda la altura disponible
      grid: {
        drawOnChartArea: true,
      }
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
  // Configuración adicional para asegurar que el gráfico use todo el espacio
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6
    }
  }
});

// Methods - FUNCIÓN CORREGIDA
const handleCopiar = async () => {
  try {
    // Esperar un tick para asegurar que el DOM esté actualizado
    await nextTick();
    const chartRef = currentChartRef.value;
    if (chartRef?.$el) {
      // Llamar a la función de copiar
      await copiarGrafico(chartRef.$el);
    } else {
      console.error("No se pudo obtener la referencia del gráfico");
      console.log("chartRef:", chartRef);
      console.log("activeTab:", activeTab.value);
      // Mensaje de error para el usuario
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "No se pudo copiar el gráfico. Intente nuevamente.",
        life: 3000,
      });
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
};

// Función para manejar el cambio de tabs 
const handleTabChange = async (value: string) => {
  activeTab.value = value;
  await nextTick();
  // Evitar llamadas duplicadas
  if (value === "0" && filtroActivo.value !== "amount") {
    await Monto();
  } else if (value === "1" && filtroActivo.value !== "count") {
    await Cantidad();
  }
  if (seleccionado.value) {
    await nextTick();
    actualizarVisibilidadDatasets();
  }
};

const Enviados = async () => {
  selected.value = "enviados";
  if (evolutionsMovementsData.value) {
    currentMode.value = "sent";
    chartData.value = buildChartData(
      evolutionsMovementsData.value.sent.series,
      evolutionsMovementsData.value.granularity
    );
    if (seleccionado.value) {
      await nextTick();
      actualizarVisibilidadDatasets();
    }
  }
};

const Recibidos = async () => {
  selected.value = "recibidos";
  if (evolutionsMovementsData.value) {
    currentMode.value = "received";
    chartData.value = buildChartData(
      evolutionsMovementsData.value.received.series,
      evolutionsMovementsData.value.granularity
    );
    if (seleccionado.value) {
      await nextTick();
      actualizarVisibilidadDatasets();
    }
  }
};

watch(periodo, (newVal) => {
  if (newVal) {
    loadEvolutionsMovementsData(newVal);
  }
});

const Monto = async (): Promise<void> => {
  filtroActivo.value = "amount";
  if (periodo.value) {
    await loadEvolutionsMovementsData(periodo.value, "amount");
  }
};

const Cantidad = async (): Promise<void> => {
  filtroActivo.value = "count";
  if (periodo.value) {
    await loadEvolutionsMovementsData(periodo.value, "count");
  }
};
const actualizarVisibilidadDatasets = async () => {
  await nextTick();
  const valueUpper = seleccionado.value.toUpperCase();
  chartData.value.datasets.forEach((ds) => {
    const shouldHide = valueUpper !== "" ? ds.label !== valueUpper : false;
    ds.hidden = shouldHide;
  });

  // Actualizar ambos gráficos
  if (chartRefMonto.value?.chart) {
    chartRefMonto.value.chart.update();
  }
  if (chartRefCantidad.value?.chart) {
    chartRefCantidad.value.chart.update();
  }
};

watch(seleccionado, async (nuevoValor) => {
  if (nuevoValor && evolutionsMovementsData.value) {
    const mode = currentMode.value === "sent" ? "sent" : "received";
    chartData.value = buildChartData(
      evolutionsMovementsData.value[mode].series,
      evolutionsMovementsData.value.granularity
    );
    await nextTick();
    actualizarVisibilidadDatasets();
  }
});
const loadEvolutionsMovementsData = async (
  periodo: string,
  tipo: "amount" | "count" = filtroActivo.value
) => {
  try {
    loading.value = true;
    error.value = null;
    const response = await seriesService.getSerieEvolutivaByCode(periodo, tipo);
    if (response) {
      evolutionsMovementsData.value = response;
      // Construir datos según el modo actual (enviados/recibidos)
      let seriesToUse;
      if (currentMode.value === "sent") {
        seriesToUse = response.sent.series;
      } else {
        seriesToUse = response.received.series;
      }
      chartData.value = buildChartData(seriesToUse, response.granularity);
    }
  } catch (err: any) {
    console.error("Error loading channel data:", err);
    error.value = err.message || "Error al cargar la información del canal";
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.value,
      life: 5000,
    });
  } finally {
    loading.value = false;
  }
};

const buildChartData = (series: any[], granularity: string) => {
  // Función para obtener label según la granularidad
  const getLabel = (p: any) => {
    if (granularity === "day") return p.date.slice(8, 10); //DD
    if (granularity === "month") return p.date.slice(0, 7); // YYYY-MM
    if (granularity === "year") return p.date.slice(0, 4); // YYYY
    return p.date; // fallback
  };
  const labels = series[0]?.points.map((p: any) => getLabel(p)) || [];
  const datasets = series.map((s: any) => ({
    label: s.transactionCode.toUpperCase(), // fuerza todo a mayúscula
    data: s.points.map((p: any) => p.value),
    borderColor:
      s.transactionCode.toUpperCase() === "QR"
        ? "#0C55F8"
        : s.transactionCode.toUpperCase() === "EXPRESS"
          ? "#6F8CCE"
          : "#A6C4F6",
    backgroundColor:
      s.transactionCode.toUpperCase() === "QR"
        ? "#0C55F8"
        : s.transactionCode.toUpperCase() === "EXPRESS"
          ? "#6F8CCE"
          : "#A6C4F6",
    fill: false,
    tension: 0.2,
    pointRadius: 4,
  }));

  return { labels, datasets };
};

// Función separada para actualizar la visibilidad de los datasets - MEJORADA


onMounted(async () => {
  await loadEvolutionsMovementsData(periodo.value);
  if (error.value) {
    console.warn(
      "No se pudieron cargar los datos de evolución de movimientos:",
      error.value
    );
  }
});
</script>

<style scoped>
/* Asegurar que el contenedor del gráfico use todo el ancho disponible */
.chart-container {
  width: 100% !important;
  max-width: 100% !important;
}

/* Asegurar que el canvas del gráfico se ajuste al contenedor */
.chart-container canvas {
  width: 100% !important;
  height: 100% !important;
  max-width: 100% !important;
}

/* Estilos adicionales para mejor responsive */
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