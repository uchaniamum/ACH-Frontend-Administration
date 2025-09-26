<template>
  <div class="flex flex-col relative w-full border-0 border-gray-300 rounded-xl shadow-md p-2 box-border"
    style="box-shadow:-4px 0 6px -1px rgba(0, 0, 0, 0.1),4px 0 6px -1px rgba(0, 0, 0, 0.1),0 -4px 6px -1px rgba(0, 0, 0, 0.1),0 4px 6px -1px rgba(0, 0, 0, 0.1);">

    <!-- Botones Monto / Cantidad + Título y botones Enviados/Recibidos -->
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

              <div class="flex items-center justify-between w-full mb-2">
                <h3 class="text-black font-bold text-[20px] m-0 flex items-center gap-2">
                  {{ chartTitle }}
                  <Icon name="x:paste-clipboard" @click="handleCopiar"
                    class="text-[#0A44C6] w-10 h-10 cursor-pointer hover:text-[#0C55F8]" />
                </h3>
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
              <!-- Contenedor del gráfico con scroll vertical -->
              <div class="relative w-full border-gray-200 rounded-lg p-2" style="height: 500px;">
                <div class="left-2 top-2 flex items-center cursor-pointer z-10" >
                  <div class="flex items-center justify-center" @click="toggleManual">
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
                                  <Icon name="x:sort" class="text-[#0C55F8] w-7 h-7 ml-2 cursor-pointer" @click="handleOrdenar" />

                </div>
                <!-- Gráfico -->
                <div class="relative w-full border-gray-200 rounded-lg p-2" style="height: 500px; overflow-y: auto;">
                  <div :style="{ height: chartHeight, minHeight: '500px' }">
                    <BarChart ref="chartRefMonto" :data="chartData" :options="chartOptionsComputed" />
                  </div>
                </div>              </div>

            </div>
          </XTabPanel>
          <!-- Panel Cantidad -->
          <XTabPanel value="1" class="w-full">
            <div class="flex flex-col w-full">

              <div class="flex items-center justify-between w-full mb-2">
                <h3 class="text-black font-bold text-[20px] m-0 flex items-center gap-2">
                  {{ chartTitle }}
                  <Icon name="x:paste-clipboard" @click="handleCopiar"
                    class="text-[#0A44C6] w-10 h-10 cursor-pointer hover:text-[#0C55F8]" />
                </h3>
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
              <!-- Contenedor del gráfico con scroll vertical -->
              <div class="relative w-full border-gray-200 rounded-lg p-2" style="height: 500px; ">

                <div class="left-2 top-2 flex items-center cursor-pointer z-10" >
                  <div class="flex items-center justify-center"          @click="toggleManual"  >
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
                <Icon name="x:sort" class="text-[#0C55F8] w-7 h-7 ml-2 cursor-pointer" @click="handleOrdenar" />

                </div>
                <!-- Gráfico -->
                <!-- Gráfico con altura dinámica -->
                <div class="relative w-full border-gray-200 rounded-lg p-2" style="height: 500px; overflow-y: auto;">
                  <div :style="{ height: chartHeight, minHeight: '500px' }">
                    <BarChart ref="chartRefCantidad" :data="chartData" :options="chartOptionsComputed" />
                  </div>
                </div>
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
import { onMounted, ref, watch, computed, nextTick } from "vue";
import type { Ref } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartData, 
} from "chart.js";
import { Bar as BarChart } from "vue-chartjs";
import { useChartUtilitarios } from "~/componsables/useChartUtilitarios";
import type { SerieTotalTransactionsResponse } from "~/features/dashboard/serieTotalTransactions.types";
import { useToast } from "#imports";
import { seriesService } from "~/services/dashboard/seriesService";
import { filtersService } from "~/services/filtersService";

// Composables
const { copiado, copiarGrafico, ordenarBarras, mostrarValoresPlugin } = useChartUtilitarios();
const toast = useToast();
type FilterType = "amount" | "count";
type ModeType = "sent" | "received";
type SelectionType = "enviados" | "recibidos";

// Registrar plugins de Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  mostrarValoresPlugin
);

// Referencias reactivas
const totalTransactionsData = ref<SerieTotalTransactionsResponse | null>(null);
const filtroActivo = ref<'amount' | 'count'>('amount');
const currentMode = ref<"sent" | "received">("sent");
const periodo = useState<string | null>("periodo");

// Referencias a gráficos
const chartRefMonto: Ref<any> = ref(null);
const chartRefCantidad: Ref<any> = ref(null);
const chartData: Ref<ChartData> = ref({ labels: [], datasets: [] });
const activeTab = ref("0");
const mostrarValores = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);
const selected = ref<SelectionType>("enviados");
const ordenAscendente = ref(true);


// Computed para obtener la referencia del gráfico actual
const currentChartRef = computed(() => {
  return activeTab.value === "0" ? chartRefMonto.value : chartRefCantidad.value;
});

const chartTitle = computed(() => {
  return totalTransactionsData.value?.panel || "No hay descripción disponible";
});

// Opciones del gráfico
const chartOptionsComputed = computed(() => ({
  indexAxis: "y" as const,
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
  },

  scales: {
    x: {
      stacked: true,
      beginAtZero: true,
      ticks: {
        callback: (value: any) => formatNumber(Number(value)),
        font: {
          size: 11,
          family: "Work Sans",
        },
      },
      grid: {
        display: true,
        drawBorder: true,
      }
    },
    y: {
      stacked: true,
      ticks: {
        font: {
          size: 11,
          family: "Work Sans",
        },
        grid: {
          display: false,
        },

      },
    },
  },
  plugins: {
    mostrarValoresPlugin: { enabled: mostrarValores.value,
     font: {
      size: 10,        // tamaño más pequeño
      family: "Work Sans",
      weight: "400",
    },
color: "#333",      // color del texto
    anchor: "end",      // posición del texto
    align: "end",       // alineación
    offset: 4           // espacio respecto a la barra    
      },
    tooltip: {
      callbacks: {
        label: function (context: any) {
          const label = context.dataset.label || '';
          const value = formatNumber(context.raw);
          return `${label}: ${value}`;
        }
      }
    },
    legend: {
      position: "top" as const,
      align: "end" as const,
      onClick: () => { }, // Deshabilitar click en leyenda
      labels: {
        usePointStyle: true,
        pointStyle: "circle" as const,
        boxWidth: 12,
        boxHeight: 12,
        padding: 15,
        font: {
          size: 11,
          family: "Work Sans",
          weight: "400" as const,
        },
        color: "#5F6A7B",
        generateLabels: (chart: any) => generateCustomLabels(chart),
      },
    },
  },
}));

// Agregar computed para altura dinámica scroll bar
const chartHeight = computed(() => {
  const dataLength = chartData.value.labels?.length || 0;
  const minHeight = 500;
  const heightPerBar = 40; // Altura por barra
  const calculatedHeight = Math.max(minHeight, dataLength * heightPerBar + 100);
  return `${calculatedHeight}px`;
});



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

const buildChartData = async (participants: any[]) => {
  try {
    const bancks = await filtersService.getFilterBanck();
          console.log("mis bancos sonnnnnnnn ",bancks);

    if (!bancks || bancks.length === 0) {
      
      return buildChartDataFallback(participants);
    }

    const bankNameMap = bancks.reduce((acc: any, bank: any) => {
      if (bank && bank.code && bank.displayName) {
        acc[bank.code] = bank.displayName;
      } else {
        console.warn("Banco con estructura incorrecta:", bank);
      }
      return acc;
    }, {});

    const labels = participants.map((p: any) => {
      const name = bankNameMap[p.code];
      console.log(`Mapeo: ${p.code} -> ${name}`);
      return name || p.code;
    });

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

    const result = {
      labels,
      datasets: [
        {
          label: "Asincrono",
          data: asincrono,
          backgroundColor: "#A6C4F6",
          borderColor: "#A6C4F6",
          borderWidth: 1,
        },
        {
          label: "Express",
          data: express,
          backgroundColor: "#6F8CCE",
          borderColor: "#6F8CCE",
          borderWidth: 1,
        },
        {
          label: "QR",
          data: qr,
          backgroundColor: "#0C55F8",
          borderColor: "#0C55F8",
          borderWidth: 1,
        },
      ],
    };

    return result;
  } catch (error) {
    console.error("Error en buildChartData:", error);
    return buildChartDataFallback(participants);
  }
};

// Función fallback por si falla el mapeo
const buildChartDataFallback = (participants: any[]) => {
  console.log("Usando fallback - códigos sin nombres");
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
      {
        label: "Asincrono",
        data: asincrono,
        backgroundColor: "#A6C4F6",
        borderColor: "#A6C4F6",
        borderWidth: 1,
      },
      {
        label: "Express",
        data: express,
        backgroundColor: "#6F8CCE",
        borderColor: "#6F8CCE",
        borderWidth: 1,
      },
      {
        label: "QR",
        data: qr,
        backgroundColor: "#0C55F8",
        borderColor: "#0C55F8",
        borderWidth: 1,
      },
    ],
  };
};

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
  if (!totalTransactionsData.value) return;

  const participantsToUse = mode === "sent"
    ? totalTransactionsData.value.sent.externalParticipants
    : totalTransactionsData.value.received.externalParticipants;

  chartData.value = await buildChartData(participantsToUse);

  await nextTick();
  updateChart();
}

// FUNCIÓN PRINCIPAL DE CARGA DE DATOS
const loadTotalTransactionsBanckData = async (periodo: string, tipo: 'amount' | 'count' = filtroActivo.value) => {
  try {
    loading.value = true;
    error.value = null;

    console.log(`Cargando datos: periodo=${periodo}, tipo=${tipo}`);

    const response = await seriesService.getSerieTotalTransactionsByCode(periodo, tipo);
    if (response) {
      totalTransactionsData.value = response;

      // Cargar datos según el modo actual
      const participantsToUse = currentMode.value === "sent"
        ? response.sent.externalParticipants
        : response.received.externalParticipants;

      chartData.value = await buildChartData(participantsToUse);

      console.log(`Datos cargados exitosamente para tipo: ${tipo}`);
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
};

// HANDLERS DE EVENTOS
async function handleTabChange(value: string) {
  console.log(`Cambiando tab a: ${value}`);
  activeTab.value = value;

  // Cambiar filtro según el tab
  const newFilter: FilterType = value === "0" ? "amount" : "count";
  console.log(`Nuevo filtro: ${newFilter}`);

  if (filtroActivo.value !== newFilter) {
    filtroActivo.value = newFilter;
    if (periodo.value) {
      await loadTotalTransactionsBanckData(periodo.value, newFilter);
    }
  } else {
    // Si el filtro es el mismo, solo actualizar el gráfico
    await nextTick();
    updateChart();
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

async function handleOrdenar() {
  try {
    await nextTick();
    const chartRef = currentChartRef.value;

    if (chartRef?.$el) {
      await ordenarBarras(chartRef.$el,chartData.value,ordenAscendente);
      console.log(`ordenado desde tab: ${activeTab.value === "0" ? "Monto" : "Cantidad"}`);
    } else {
      throw new Error("No se pudo obtener la referencia ");
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
  console.log("Cambiando a enviados");
  selected.value = "enviados";
  currentMode.value = "sent";
  await updateChartData("sent");
}

async function handleRecibidos() {
  console.log("Cambiando a recibidos");
  selected.value = "recibidos";
  currentMode.value = "received";
  await updateChartData("received");
}

// WATCHERS
watch(periodo, (newVal) => {
  console.log(`Período cambió a: ${newVal}`);
  if (newVal) {
    loadTotalTransactionsBanckData(newVal, filtroActivo.value);
  }
});

watch(mostrarValores, async () => {
  await nextTick();
  updateChart();
});

// LIFECYCLE
onMounted(async () => {
  console.log("Componente montado");
  if (periodo.value) {
    await loadTotalTransactionsBanckData(periodo.value, filtroActivo.value);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>