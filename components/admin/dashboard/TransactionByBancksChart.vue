<template>
  <div class="flex flex-col relative w-full border-0 border-gray-300 rounded-xl shadow-md p-2 box-border"
    style="box-shadow:-4px 0 6px -1px rgba(0, 0, 0, 0.1),4px 0 6px -1px rgba(0, 0, 0, 0.1),0 -4px 6px -1px rgba(0, 0, 0, 0.1),0 4px 6px -1px rgba(0, 0, 0, 0.1);">

    <!-- Botones Monto / Cantidad + Título y botones Enviados/Recibidos -->
    <div class="flex flex-col items-start gap-1.5">
      <div class="flex gap-3 border-b-2 border-[#c2c0c0] mb-2.5">
        <button @click="Monto" :class="[
          'px-4 py-2 min-w-[100px] rounded-md text-base cursor-pointer bg-transparent transition-all',
          filtroActivo === 'amount'
            ? 'text-[#0C55F8] bg-[#d1e4f0] border-b-2 border-[#0C55F8]'
            : 'text-[#5F6A7B] hover:text-[#0C55F8] hover:bg-[#d1e4f0] hover:border-b-2 hover:border-[#0C55F8]'
        ]">
          Monto
        </button>
        <button @click="Cantidad" :class="[
          'px-4 py-2 min-w-[100px] rounded-md text-base cursor-pointer bg-transparent transition-all',
          filtroActivo === 'count'
            ? 'text-[#0C55F8] bg-[#d1e4f0] border-b-2 border-[#0C55F8]'
            : 'text-[#5F6A7B] hover:text-[#0C55F8] hover:bg-[#d1e4f0] hover:border-b-2 hover:border-[#0C55F8]'
        ]">
          Cantidad
        </button>
      </div>

      <div class="flex items-center justify-between w-full mb-2">
        <h3 class="text-black font-bold text-[20px] m-0 flex items-center gap-2">
          {{ totalTransactionsData?.panel || "No hay descripción disponible" }}
          <Icon name="x:paste-clipboard" @click="handleCopiar"
            class="text-[#0A44C6] w-10 h-10 cursor-pointer hover:text-[#0C55F8]" />
          <span v-if="copiado" class="mt-1 bg-blue-500 text-white text-sm px-2 py-1 rounded z-20">
            Copiado
          </span>
        </h3>

        <div class="flex gap-3 p-3 rounded-lg bg-[#F0F5FF]">
          <button @click="Enviados"
            class="px-2 py-2 min-w-[100px] rounded-md bg-[#F0F5FF] text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white">
            <Icon name="x:arrow-tr-circle" class="text-[#5F6A7B] w-7 h-7" />
            Enviados
          </button>
          <button @click="Recibidos"
            class="px-3 py-2 min-w-[100px] rounded-md bg-[#F0F5FF] text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white">
            <Icon name="x:arrow-br-circle" class="text-[#5F6A7B] w-7 h-7" />
            Recibidos
          </button>
        </div>
      </div>
    </div>

    <!-- Contenedor del gráfico con scroll vertical -->
    <div class="relative w-full border-gray-200 rounded-lg p-2" style="height: 500px; overflow-y: auto">
      <!-- Botón Ver todas las cifras -->
      <div class="absolute left-2 top-2 flex items-center cursor-pointer z-10">
        <XCheckBox v-model="seleccionado" name="mostrarValoresBarra" value="seleccionarDatos"
          :class="{ 'border-[#0C55F8]': seleccionado === 'seleccionarDatos' }" @click="toggleManual" />
        <span class="font-normal text-[12px] ml-2">Ver todas las cifras</span>
        <Icon name="x:sort" class="text-[#0C55F8] w-7 h-7 ml-2 cursor-pointer" @click="handleOrdenar" />
      </div>

      <!-- Gráfico -->
      <BarChart ref="chartRef" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, computed, nextTick, type Ref } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartData,
  type Plugin,
  type ChartOptions,
  LogarithmicScale,
} from "chart.js";
import { Bar } from "vue-chartjs";
import { useChartUtilitarios } from "~/componsables/useChartUtilitarios";
import type { SerieTotalTransactionsResponse } from "~/features/dashboard/serieTotalTransactions.types";
import { useToast } from "#imports";
import { seriesService } from "~/services/dashboard/seriesService";
import { useAnalyticsOptions } from "~/componsables/useAnalyticsOptions";
import { filtersService } from "~/services/filtersService";


ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

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

// Plugin corregido para mostrar valores sobre las barras
const mostrarValoresPlugin: Plugin = {
  id: "mostrarValoresPlugin",
  afterDatasetsDraw(chart: any) {
    const pluginEnabled = chart.config.options.plugins?.mostrarValoresPlugin?.enabled;
    if (!pluginEnabled) return;
    const ctx = chart.ctx;
    chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (meta.hidden) return;
      meta.data.forEach((bar: any, index: number) => {
        const value = dataset.data[index];
        if (value <= 0) return;
        const color = ["Asincrono", "Express"].includes(dataset.label)
          ? "#FFFFFF"
          : "#2A303A";
        const fontSize = Math.max(11, chart.height * 0.025);
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = `${fontSize}px Work Sans`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";        
        const x = bar.base + (bar.width / 2);
        const y = bar.y;
        ctx.fillText(formatNumber(value), x, y);
        ctx.restore();
      });
    });
  },
};

ChartJS.register(mostrarValoresPlugin);

export default defineComponent({
  name: "BarHorizontal",
  components: { BarChart: Bar },
  setup() {
    const chartRef = ref<InstanceType<typeof Bar> | null>(null);
    const seleccionado = ref<string | null>(null);
    const ordenAscendente = ref(true);
    const mostrarValoresHorizontal = ref(false);
    const chartData: Ref<ChartData> = ref({
      labels: [],
      datasets: [],
    });

    const { copiado, copiarGrafico, ordenarBarras } = useChartUtilitarios();
    const totalTransactionsData = ref<SerieTotalTransactionsResponse | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const toast = useToast();

    // Estado para el filtro activo (Monto/Cantidad)
    const filtroActivo = ref<'amount' | 'count'>('amount');

    const handleCopiar = (): void => copiarGrafico(chartRef.value?.$el);

    const handleOrdenar = (): void => {
      ordenarBarras(chartRef.value, chartData.value, ordenAscendente);
    };

    const periodo = useState<string | null>("periodo");

    // Opciones del gráfico con configuración corregida
    const chartOptions = computed((): ChartOptions<'bar'> => {
      return {
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
          },
          y: {
            stacked: true,
            ticks: {
              font: {
                size: 11,
                family: "Work Sans",
              },
            },
          },
        },
        plugins: {
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
              generateLabels: (chart: any) => {
                const order = ["QR", "Express", "Asincrono"];
                return order
                  .map((label) => {
                    const datasetIndex = chart.data.datasets.findIndex(
                      (d: any) => d.label === label
                    );
                    if (datasetIndex === -1) return null; // Ignorar si no existe
                    const dataset = chart.data.datasets[datasetIndex];
                    return {
                      text: dataset.label,
                      fillStyle: dataset.backgroundColor,
                      hidden: !chart.isDatasetVisible(datasetIndex),
                      datasetIndex,
                      strokeStyle: "transparent", // sin borde
                    };
                  })
                  .filter((x: any) => x !== null); // eliminar los nulos
              },
            },
          },
          // Configuración del plugin personalizado (reactivo)
          mostrarValoresPlugin: {
            enabled: mostrarValoresHorizontal.value,
          },
        },
      };
    });

    // Función para alternar la visualización de valores
    const onToggleValores = (nuevoValor: string | null) => {
      console.log('onToggleValores llamado con:', nuevoValor);

      // Cambiar el estado basado en si está seleccionado o no
      const estaSeleccionado = nuevoValor === "seleccionarDatos";
      mostrarValoresHorizontal.value = estaSeleccionado;

      console.log('Estado después del cambio:', {
        nuevoValor,
        estaSeleccionado,
        mostrarValoresHorizontal: mostrarValoresHorizontal.value
      });

      // Forzar actualización inmediata del gráfico
      nextTick(() => {
        const chartInstance = chartRef.value?.chart;
        if (chartInstance) {
          console.log('Actualizando chart con estado:', mostrarValoresHorizontal.value);

          // Actualizar la configuración del plugin
          if (chartInstance.config.options.plugins) {
            chartInstance.config.options.plugins.mostrarValoresPlugin = {
              enabled: mostrarValoresHorizontal.value
            };
          }

          // Forzar re-render completo
          chartInstance.update('active');
        }
      });
    };

    const Monto = (): void => {
      console.log('Filtro por Monto seleccionado');
      filtroActivo.value = 'amount';

      // Recargar datos con el nuevo filtro
      if (periodo.value) {
        loadTotalTransactionsBanckData(periodo.value, 'amount');
      }
    };

    const Cantidad = (): void => {
      console.log('Filtro por Cantidad seleccionado');
      filtroActivo.value = 'count';

      // Recargar datos con el nuevo filtro
      if (periodo.value) {
        loadTotalTransactionsBanckData(periodo.value, 'count');
      }
    };

    // Función manual para testing
    const toggleManual = () => {
      console.log('Toggle manual - estado actual:', mostrarValoresHorizontal.value);
      mostrarValoresHorizontal.value = !mostrarValoresHorizontal.value;
      seleccionado.value = mostrarValoresHorizontal.value ? "seleccionarDatos" : null;
    };
    // Watcher para forzar actualización cuando cambie mostrarValoresHorizontal
    watch(mostrarValoresHorizontal, (newVal) => {
      const chartInstance = chartRef.value?.chart;
      if (chartInstance) {
        console.log('Watchers: mostrarValoresHorizontal cambió a:', newVal);

        // Actualizar directamente la configuración del plugin
        if (chartInstance.config.options.plugins) {
          chartInstance.config.options.plugins.mostrarValoresPlugin = {
            enabled: newVal
          };
        }

        // Forzar actualización completa
        chartInstance.update('active');
      }
    });

    // Watcher para recargar datos cuando cambie el período
    watch(periodo, (newVal) => {
      if (newVal) {
        loadTotalTransactionsBanckData(newVal, filtroActivo.value);
      }
    });

    const loadTotalTransactionsBanckData = async (periodo: string, tipo: 'amount' | 'count' = filtroActivo.value) => {
      try {
        loading.value = true;
        error.value = null;
        const response = await seriesService.getSerieTotalTransactionsByCode(periodo, tipo);
        if (response) {
          totalTransactionsData.value = response;
          chartData.value = await buildChartData(response.sent.externalParticipants);
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

    const buildChartData = async (participants: any[]) => {
      console.log("=== INICIO buildChartData ===");
      console.log("participants recibidos:", participants);

      try {
        // Obtener los datos originales para hacer el mapeo correcto
        const bancks = await filtersService.getFilterBanck();
        if (!bancks || bancks.length === 0) {
          return buildChartDataFallback(participants);
        }
        // Crear mapa con código original -> displayName
        const bankNameMap = bancks.reduce((acc: any, bank: any, index: number) => {
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
    const currentMode = ref<"sent" | "received">("sent");
    const Enviados = async () => {
      if (totalTransactionsData.value) {
        try {
          loading.value = true;
          currentMode.value = "sent";
          chartData.value = await buildChartData(
            totalTransactionsData.value.sent.externalParticipants
          );
        } catch (error) {
          console.error("Error al cargar datos enviados:", error);
        } finally {
          loading.value = false;
        }
      }
    };

    const Recibidos = async () => {
      if (totalTransactionsData.value) {
        try {
          loading.value = true;
          currentMode.value = "received";
          chartData.value = await buildChartData(
            totalTransactionsData.value.received.externalParticipants
          );
        } catch (error) {
          console.error("Error al cargar datos recibidos:", error);
        } finally {
          loading.value = false;
        }
      }
    };
    onMounted(async () => {
      if (periodo.value) {
        // Cargar con el filtro inicial (amount por defecto)
        loadTotalTransactionsBanckData(periodo.value, filtroActivo.value);
      }

      if (error.value) {
        console.warn(
          "No se pudieron cargar los datos de transacciones totales:",
          error.value
        );
      }
    });

    return {
      chartRef,
      chartData,
      chartOptions,
      seleccionado,
      onToggleValores,
      handleCopiar,
      handleOrdenar,
      copiado,
      Enviados,
      Recibidos,
      Monto,
      Cantidad,
      loadTotalTransactionsBanckData,
      totalTransactionsData,
      ordenAscendente,
      filtroActivo,
      mostrarValoresHorizontal,
      toggleManual,
      // Para depuración
      toggleDebug: () => {
        console.log('Estado actual:', {
          seleccionado: seleccionado.value,
          mostrarValoresHorizontal: mostrarValoresHorizontal.value,
          chartInstance: !!chartRef.value?.chart,
        });

        const chartInstance = chartRef.value?.chart;
        if (chartInstance) {
          console.log('Config del plugin:', chartInstance.config.options.plugins?.mostrarValoresPlugin);
        }
      },
    };
  },
});
</script>

<style scoped>
.ver-todas-cifras {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #373f4a;
  font-family: "Work Sans";
  position: absolute;
  z-index: 10;
  transition: all 0.2s ease;
}
</style>