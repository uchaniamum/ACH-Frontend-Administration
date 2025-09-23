<template>
  <div
    class="flex flex-col relative w-full border-2 border-gray-300 rounded-xl shadow-md p-2 box-border"
  >
    <!-- Botones Monto / Cantidad + Título y botones Enviados/Recibidos -->
    <div class="flex flex-col items-start gap-1.5">
      <div class="flex gap-3 border-b-2 border-[#c2c0c0] mb-2.5">
        <button
          @click="accionFiltro1"
          class="px-4 py-2 min-w-[100px] rounded-md text-[#5F6A7B] text-base cursor-pointer bg-transparent transition-all hover:text-[#0C55F8] hover:bg-[#d1e4f0] hover:border-b-2 hover:border-[#0C55F8]"
        >
          Monto
        </button>
        <button
          @click="accionFiltro2"
          class="px-4 py-2 min-w-[100px] rounded-md text-[#5F6A7B] text-base cursor-pointer bg-transparent transition-all hover:text-[#0C55F8] hover:bg-[#d1e4f0] hover:border-b-2 hover:border-[#0C55F8]"
        >
          Cantidad
        </button>
      </div>

      <div class="flex items-center justify-between w-full mb-2">
        <h3
          class="text-black font-bold text-[20px] m-0 flex items-center gap-2"
        >
        {{ totalTransactionsData?.panel || 'No hay descripción disponible' }}
          <Icon
            name="x:paste-clipboard"
            @click="handleCopiar"
            class="text-[#0A44C6] w-10 h-10 cursor-pointer hover:text-[#0C55F8]"
          />
          <span
            v-if="copiado"
            class="mt-1 bg-blue-500 text-white text-sm px-2 py-1 rounded z-20"
          >
            Copiado
          </span>
        </h3>

        <div class="flex gap-3 p-3 rounded-lg bg-[#F0F5FF]">
          <button
            @click="Enviados"
            class="px-2 py-2 min-w-[100px] rounded-md bg-[#F0F5FF] text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white"
          >
            <Icon name="x:arrow-tr-circle" class="text-[#5F6A7B] w-7 h-7" />
            Enviados
          </button>
          <button
            @click="Recibidos"
            class="px-3 py-2 min-w-[100px] rounded-md bg-[#F0F5FF] text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white"
          >
            <Icon name="x:arrow-br-circle" class="text-[#5F6A7B] w-7 h-7" />
            Recibidos
          </button>
        </div>
      </div>
    </div>

    <!-- Contenedor del gráfico con scroll vertical -->
    <div
      class="relative w-full border-gray-200 rounded-lg p-2"
      style="height: 500px; overflow-y: auto"
    >
      <!-- Botón Ver todas las cifras -->
      <div class="absolute left-2 top-2 flex items-center cursor-pointer z-10">
        <XCheckBox
          v-model="seleccionado"
          name="mostrarValoresHorizontal"
          value="seleccionarDatos"
          @click="toggleValores"
          :class="{ 'border-[#0C55F8]': seleccionado === 'seleccionarDatos' }"
        />
        <span class="font-normal text-[12px] ml-2">Ver todas las cifras</span>
        <Icon
          name="x:sort"
          class="text-[#0C55F8] w-7 h-7 ml-2 cursor-pointer"
          @click="handleOrdenar"
        />
      </div>

      <!-- Gráfico -->
      <BarChart ref="chartRef" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, type Ref } from "vue";
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
import { Bar } from "vue-chartjs";
import { useChartUtilitarios } from "~/componsables/useChartUtilitarios";
import type { SerieTotalTransactionsResponse } from "~/features/dashboard/serieTotalTransactions.types";
import { useToast } from "#imports";
import { seriesService } from "~/services/dashboard/seriesService";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

// Plugin para mostrar valores sobre las barras
const mostrarValoresPluginHorizontal = {
  id: "mostrarValoresPluginHorizontal",
  afterDatasetsDraw(chart: any) {
    if (!chart.$mostrarValoresHorizontal) return;
    const ctx = chart.ctx;

    chart.data.labels.forEach((_: string, i: number) => {
      chart.data.datasets.forEach((dataset: any) => {
        const meta = chart.getDatasetMeta(chart.data.datasets.indexOf(dataset));
        const bar = meta.data[i];
        const value = dataset.data[i];
        const color = ["Asincrono", "Express"].includes(dataset.label)
          ? "#FFFFFF"
          : "#2A303A";

        const fontSize = Math.max(10, chart.height * 0.025);

        ctx.save();
        ctx.fillStyle = color;
        ctx.font = `${fontSize}px Work Sans`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(value + "M", (bar.x + bar.base) / 2, bar.y);
        ctx.restore();
      });
    });
  },
};

ChartJS.register(mostrarValoresPluginHorizontal);

export default defineComponent({
  name: "BarHorizontal",
  components: { BarChart: Bar },

  setup() {
    const chartRef = ref<InstanceType<typeof Bar> | null>(null);
    const seleccionado = ref<string | null>(null);
    const ordenAscendente = ref(true);
    const chartData: Ref<ChartData> = ref({
      labels: [],
      datasets: [],
    });

    // Opciones del gráfico
    const chartOptions = ref({
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          beginAtZero: true,
          suggestedMax: 1000,
          ticks: { stepSize: 100, callback: (value: any) => value + "M" },
        },
        y: { stacked: true, ticks: { font: { size: 10 } } },
      },
      plugins: {
        legend: {
          position: "top",
          align: "end",
          onClick: null,
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
            boxWidth: 12,
            boxHeight: 12,
            padding: 15,
            font: { size: 10, family: "Work Sans", weight: "400" },
            color: "#5F6A7B",
          },
          
        },
      },
    });

    const { copiado, copiarGrafico, ordenarBarras } = useChartUtilitarios();

    const toggleValores = (): void => {
      if (seleccionado.value === "seleccionarDatos") {
        seleccionado.value = null;
        if (chartRef.value?.chart) {
          chartRef.value.chart.$mostrarValoresHorizontal = false;
          chartRef.value.chart.update();
        }
      } else {
        seleccionado.value = "seleccionarDatos";
        if (chartRef.value?.chart) {
          chartRef.value.chart.$mostrarValoresHorizontal = true;
          chartRef.value.chart.update();
        }
      }
    };

    const handleCopiar = (): void => copiarGrafico(chartRef.value?.$el);
    const handleOrdenar = (): void =>
      ordenarBarras(chartRef.value, chartData.value, ordenAscendente);

    // Botones de acción

    const accionFiltro1 = (): void => alert("Filtro por Monto");
    const accionFiltro2 = (): void => alert("Filtro por Cantidad");

    const totalTransactionsData = ref<SerieTotalTransactionsResponse | null>(
      null
    );
    const loading = ref(false);
    const error = ref<string | null>(null);
    const toast = useToast();

    const loadTotalTransactionsBanckData = async () => {
      try {
        loading.value = true;
        error.value = null;

        const response = await seriesService.getSerieTotalTransactionsByCode(
          "1M"
        );
        if (response) {
          totalTransactionsData.value = response;
          // 👇 inicializamos con "sent" (Enviados)
          chartData.value = buildChartData(response.sent.externalParticipants);
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
        return item ? item.value / 1000000 : 0; // 👉 lo divido a "millones"
      });

      const express = participants.map((p: any) => {
        const item = p.items.find((i: any) => i.transactionCode === "EXPRESS");
        return item ? item.value / 1000000 : 0;
      });

      const asincrono = participants.map((p: any) => {
        const item = p.items.find((i: any) => i.transactionCode === "ASYNC");
        return item ? item.value / 1000000 : 0;
      });

      return {
        labels,
        datasets: [
          { label: "Asincrono", data: asincrono, backgroundColor: "#A6C4F6" },
          { label: "Express", data: express, backgroundColor: "#6F8CCE" },
          { label: "QR", data: qr, backgroundColor: "#0C55F8" }, // 👉 QR arriba
        ],
      };
    };
    const currentMode = ref<"sent" | "received">("sent");
    const Enviados = () => {
      if (totalTransactionsData.value) {
        currentMode.value = "sent";
        chartData.value = buildChartData(
          totalTransactionsData.value.sent.externalParticipants
        );
      }
    };

    const Recibidos = () => {
      if (totalTransactionsData.value) {
        currentMode.value = "received";
        chartData.value = buildChartData(
          totalTransactionsData.value.received.externalParticipants
        );
      }
    };

    onMounted(async () => {
      await loadTotalTransactionsBanckData();
      // Manejo de errores
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
      toggleValores,
      handleCopiar,
      handleOrdenar,
      copiado,
      Enviados,
      Recibidos,
      accionFiltro1,
      accionFiltro2,
      loadTotalTransactionsBanckData,
      totalTransactionsData
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
