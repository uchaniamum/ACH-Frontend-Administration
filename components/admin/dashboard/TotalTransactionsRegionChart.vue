<template>
  <div class="flex flex-col relative w-full border-0 border-gray-300 rounded-xl shadow-md p-2 box-border" style="
      box-shadow: -4px 0 6px -1px rgba(0, 0, 0, 0.1),
        4px 0 6px -1px rgba(0, 0, 0, 0.1), 0 -4px 6px -1px rgba(0, 0, 0, 0.1),
        0 4px 6px -1px rgba(0, 0, 0, 0.1);
    ">
    <!-- Botones Monto / Cantidad + Título y botones Enviados/Recibidos -->
    <div class="flex flex-col items-start gap-1.5">
      <XTabs v-model:value="activeTab" @update:value="handleTabChange" class="w-full">
        <XTabList class="w-full">
          <XTab value="0">Monto</XTab>
          <XTab value="1">Cantidad</XTab>
        </XTabList>
        <XTabPanels class="w-full">
          <XTabPanel value="0" class="w-full">
            <div class="flex flex-col w-full">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full mb-6">
                <h3 class="text-black font-bold text-[20px] m-0 flex items-center gap-2">
                  {{
                    totalTransactionsRegionData?.panel ||
                    "No hay descripción disponible"
                  }}
                  <Icon name="x:paste-clipboard" @click="handleCopiar"
                    class="text-[#0A44C6] w-10 h-10 cursor-pointer hover:text-[#0C55F8]" />
                  <span v-if="copiado" class="mt-1 bg-blue-500 text-white text-sm px-2 py-1 rounded z-20">
                    Copiado
                  </span>
                </h3>

                <div
                  class="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-[#F0F5FF] w-full sm:w-auto">
                  <!-- Botón Enviados -->
                  <button @click="Enviados" :class="[
                    'flex items-center gap-2 px-3 py-2 flex-1 sm:flex-none min-w-[100px] rounded-md text-sm cursor-pointer transition-colors',
                    selected === 'enviados'
                      ? 'bg-[#6F8CCE] text-white'
                      : 'bg-[#F0F5FF] text-[#5F6A7B] hover:bg-[#6F8CCE] hover:text-white',
                  ]">
                    <Icon name="x:arrow-tr-circle" class="w-6 h-6 sm:w-7 sm:h-7" />
                    Enviados
                  </button>

                  <!-- Botón Recibidos -->
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
              <div class="relative w-full border-gray-200 rounded-lg p-2" style="height: 500px; overflow-y: auto">
                <!-- Botón Ver todas las cifras - CON TU SVG PERSONALIZADO -->
                <div class="absolute left-2 top-2 flex items-center cursor-pointer z-10" @click="toggleManual">
                  <div class="flex items-center justify-center">
                    <!-- Tu rectángulo SVG personalizado -->
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18" 
                      height="19" 
                      viewBox="0 0 18 19" 
                      fill="none"
                      class="transition-all duration-200"
                    >
                      <path 
                        d="M2 1.38855H16C16.8284 1.38855 17.5 2.06012 17.5 2.88855V16.8885C17.5 17.717 16.8284 18.3885 16 18.3885H2C1.17157 18.3885 0.5 17.717 0.5 16.8885V2.88855C0.5 2.06012 1.17157 1.38855 2 1.38855Z" 
                        :fill="mostrarValores ? '#0C55F8' : 'white'" 
                        :stroke="mostrarValores ? '#0C55F8' : '#A9B6C9'"
                        class="transition-all duration-200"
                      />
                      <!-- Ícono de check cuando está activo -->
                      <path 
                        v-if="mostrarValores"
                        d="M5 9.5l2.5 2.5 5.5-5.5" 
                        stroke="white" 
                        stroke-width="1.5" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <span class="font-normal text-[13px] ml-2 select-none">Ver todas las cifras</span>
                </div>

                <!-- Gráfico -->
                <BarChart ref="chartRefMonto" :data="chartData" :options="chartOptionsComputed" />
              </div>
            </div>
          </XTabPanel>
          <XTabPanel value="1" class="w-full">
            <div class="flex flex-col w-full">
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full mb-6">
                <h3 class="text-black font-bold text-[20px] m-0 flex items-center gap-2">
                  {{
                    totalTransactionsRegionData?.panel ||
                    "No hay descripción disponible"
                  }}
                  <Icon name="x:paste-clipboard" @click="handleCopiar"
                    class="text-[#0A44C6] w-10 h-10 cursor-pointer hover:text-[#0C55F8]" />
                  <span v-if="copiado" class="mt-1 bg-blue-500 text-white text-sm px-2 py-1 rounded z-20">
                    Copiado
                  </span>
                </h3>

                <div
                  class="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-[#F0F5FF] w-full sm:w-auto">
                  <!-- Botón Enviados -->
                  <button @click="Enviados" :class="[
                    'flex items-center gap-2 px-3 py-2 flex-1 sm:flex-none min-w-[100px] rounded-md text-sm cursor-pointer transition-colors',
                    selected === 'enviados'
                      ? 'bg-[#6F8CCE] text-white'
                      : 'bg-[#F0F5FF] text-[#5F6A7B] hover:bg-[#6F8CCE] hover:text-white',
                  ]">
                    <Icon name="x:arrow-tr-circle" class="w-6 h-6 sm:w-7 sm:h-7" />
                    Enviados
                  </button>

                  <!-- Botón Recibidos -->
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
              <div class="relative w-full border-gray-200 rounded-lg p-2" style="height: 500px; overflow-y: auto">
                <!-- Botón Ver todas las cifras - VERSIÓN MEJORADA -->
                <div class="absolute left-2 top-2 flex items-center cursor-pointer z-10" @click="toggleManual">
                  <div class="flex items-center justify-center">
                    <!-- Tu rectángulo SVG personalizado -->
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18" 
                      height="19" 
                      viewBox="0 0 18 19" 
                      fill="none"
                      class="transition-all duration-200"
                    >
                      <path 
                        d="M2 1.38855H16C16.8284 1.38855 17.5 2.06012 17.5 2.88855V16.8885C17.5 17.717 16.8284 18.3885 16 18.3885H2C1.17157 18.3885 0.5 17.717 0.5 16.8885V2.88855C0.5 2.06012 1.17157 1.38855 2 1.38855Z" 
                        :fill="mostrarValores ? '#0C55F8' : 'white'" 
                        :stroke="mostrarValores ? '#0C55F8' : '#A9B6C9'"
                        class="transition-all duration-200"
                      />
                      <!-- Ícono de check cuando está activo -->
                      <path 
                        v-if="mostrarValores"
                        d="M5 9.5l2.5 2.5 5.5-5.5" 
                        stroke="white" 
                        stroke-width="1.5" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"
                        fill="none"
                      />
                    </svg>
                  </div>
                  <span class="font-normal text-[12px] ml-2 select-none">Ver todas las cifras</span>
                </div>

                <!-- Gráfico -->
                <BarChart ref="chartRefCantidad" :data="chartData" :options="chartOptionsComputed" />
              </div>
            </div>
          </XTabPanel>
        </XTabPanels>
      </XTabs>
    </div>
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
import { useChartUtilitarios } from "~/componsables/useChartUtilitarios";
import { XCheckBox } from "#components";
import { seriesService } from "~/services/dashboard/seriesService";
import type { SerieTotalTransactionsResponse } from "~/features/dashboard/serieTotalTransactions.types";
import { useToast } from "#imports";
import { useAnalyticsOptions } from "~/componsables/useAnalyticsOptions";
import type { SerieTotalTransactionsRegionResponse } from "~/features/dashboard/serieTotalTransaccionsRegion.types";

// Interfaces
interface ChartDataSet {
  label: string;
  data: number[];
  backgroundColor: string;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataSet[];
}

// Variables reactivas
const { copiarGrafico, copiado, mostrarValoresPluginSumatoria } = useChartUtilitarios();
const grafico: Ref<any> = ref(null);
const mostrarValores = ref(false);
const seleccionado = ref(""); // por defecto no mostrar valores
const chartData: Ref<ChartData> = ref({ labels: [], datasets: [] });
const totalTransactionsRegionData =
  ref<SerieTotalTransactionsRegionResponse | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const toast = useToast();
const periodo = useState<string | null>("periodo");
const currentMode = ref<"sent" | "received">("sent");
const filtroActivo = ref<"amount" | "count">("amount");
const selected = ref<"enviados" | "recibidos">("enviados");
const activeTab = ref("0"); // Control del tab activo
const chartRefMonto: Ref<any> = ref(null);
const chartRefCantidad: Ref<any> = ref(null);

// Computed para obtener la referencia correcta del chart según el tab activo
const currentChartRef = computed(() => {
  return activeTab.value === "0" ? chartRefMonto.value : chartRefCantidad.value;
});

// Computed para las opciones del gráfico que reacciona a mostrarValores
const chartOptionsComputed = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { stacked: true, ticks: { font: { size: 10 } } },
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
        generateLabels: (chart: any) => {
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
        },
      },
    },
  },
}));

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
  // Forzar actualización del gráfico
  await nextTick();
  updateChart();
};

// Registrar Chart.js y plugin
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  mostrarValoresPluginSumatoria
);

// Funciones
const handleCopiar = async () => {
  try {
    // Esperar un tick para asegurar que el DOM esté actualizado
    await nextTick();
    const chartRef = currentChartRef.value;
    
    if (chartRef?.$el) {
      console.log("Copiando gráfico desde tab:", activeTab.value === "0" ? "Monto" : "Cantidad");
      // Llamar a la función de copiar con la referencia correcta
      await copiarGrafico(chartRef.$el);
      console.log("Gráfico copiado exitosamente");
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

// FUNCIÓN CORREGIDA - Simplificada y con mejor logging
const toggleManual = async () => {
  console.log("=== TOGGLE MANUAL ===");
  console.log("Estado actual mostrarValores:", mostrarValores.value);
  
  // Cambiar el estado
  mostrarValores.value = !mostrarValores.value;
  
  console.log("Nuevo estado mostrarValores:", mostrarValores.value);
  console.log("Plugin habilitado:", mostrarValores.value ? "SÍ" : "NO");
  
  // Esperar a que Vue actualice el DOM
  await nextTick();
  
  // Forzar actualización del gráfico
  updateChart();
  
  console.log("=== FIN TOGGLE ===");
};

const updateChart = () => {
  // Actualizar ambos gráficos si existen
  if (chartRefMonto.value?.chart) {
    chartRefMonto.value.chart.update();
  }
  if (chartRefCantidad.value?.chart) {
    chartRefCantidad.value.chart.update();
  }
};

const Monto = async (): Promise<void> => {
  filtroActivo.value = "amount";
  if (periodo.value) {
    await loadTotalTransactionsRegionData(periodo.value, "amount");
  }
};

const Cantidad = async (): Promise<void> => {
  filtroActivo.value = "count";
  if (periodo.value) {
    await loadTotalTransactionsRegionData(periodo.value, "count");
  }
};

const loadTotalTransactionsRegionData = async (
  periodo: string,
  tipo: "amount" | "count" = filtroActivo.value
) => {
  try {
    console.log(`=== CARGANDO DATOS ===`);
    console.log(`Período: ${periodo}, Tipo: ${tipo}, Modo: ${currentMode.value}`);
    
    loading.value = true;
    error.value = null;
    const response = await seriesService.getSerieTotalTransactionsRegionByCode(
      periodo,
      tipo
    );

    if (response) {
      totalTransactionsRegionData.value = response;
      
      // Construir datos según el modo actual (enviados/recibidos)
      let regionsToUse;
      if (currentMode.value === "sent") {
        regionsToUse = response.sent.regions;
      } else {
        regionsToUse = response.received.regions;
      }
      
      chartData.value = buildChartData(regionsToUse);
      console.log("ChartData construido con", chartData.value.datasets.length, "datasets");
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

const buildChartData = (participants: any[]) => {
  const labels = participants.map((p: any) => p.code);

  const qr = participants.map((p: any) => {
    const item = p.items.find((i: any) => i.transactionCode === "QR");
    return item ? item.value : 0;
  });

  const express = participants.map((p: any) => {
    const item = p.items.find((i: any) => i.transactionCode === "EXPRESS");
    return item ? item.value : 0;
  });

  const asincrono = participants.map((p: any) => {
    const item = p.items.find((i: any) => i.transactionCode === "ASYNC");
    return item ? item.value : 0;
  });

  return {
    labels,
    datasets: [
      { label: "Asincrono", data: asincrono, backgroundColor: "#A6C4F6" },
      { label: "Express", data: express, backgroundColor: "#6F8CCE" },
      { label: "QR", data: qr, backgroundColor: "#0C55F8" },
    ],
  };
};

const Enviados = async () => {
  selected.value = "enviados";
  if (totalTransactionsRegionData.value) {
    currentMode.value = "sent";
    chartData.value = buildChartData(
      totalTransactionsRegionData.value.sent.regions
    );
    await nextTick();
    updateChart();
  }
};

const Recibidos = async () => {
  selected.value = "recibidos";
  if (totalTransactionsRegionData.value) {
    currentMode.value = "received";
    chartData.value = buildChartData(
      totalTransactionsRegionData.value.received.regions
    );
    await nextTick();
    updateChart();
  }
};

const actualizarVisibilidadDatasets = async () => {
  await nextTick();
  const valueUpper = seleccionado.value.toUpperCase();
  chartData.value.datasets.forEach((ds) => {
    const shouldHide = valueUpper !== "" ? ds.label !== valueUpper : false;
    ds.hidden = shouldHide;
  });
  updateChart();
};

// Watchers
watch(seleccionado, async (nuevoValor) => {
  if (nuevoValor && totalTransactionsRegionData.value) {
    const mode = currentMode.value === "sent" ? "sent" : "received";
    chartData.value = buildChartData(
      totalTransactionsRegionData.value[mode].regions
    );
    await nextTick();
    actualizarVisibilidadDatasets();
  }
});

watch(periodo, (newVal) => {
  if (newVal) {
    loadTotalTransactionsRegionData(newVal);
  }
});

// Watch para mostrarValores para forzar actualización del gráfico
watch(mostrarValores, async (newValue, oldValue) => {
  console.log(`Watch mostrarValores: ${oldValue} -> ${newValue}`);
  console.log("Plugin del gráfico:", newValue ? "ACTIVADO" : "DESACTIVADO");
  
  await nextTick();
  updateChart();
  
  console.log("Gráfico actualizado con plugin:", newValue);
});

// Mounted
onMounted(async () => {
  if (periodo.value) {
    await loadTotalTransactionsRegionData(periodo.value);
  }
});

defineOptions({
  name: "BarVertical",
});
</script>