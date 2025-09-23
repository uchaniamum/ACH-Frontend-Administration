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
        {{ totalTransactionsRegionData?.panel || 'No hay descripción disponible' }}
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
      </div>

      <!-- Gráfico -->
      <BarChart ref="grafico" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
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

// Interfaces para tipar el gráfico
interface ChartDataSet {
  label: string;
  data: number[];
  backgroundColor: string;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataSet[];
}

// Plugin para mostrar valores
const mostrarValoresPlugin = {
  id: "mostrarValoresPlugin",
  afterDatasetsDraw(chart: any) {
    if (!chart.$mostrarValores) return;
    const ctx = chart.ctx;
    const lastDatasetIndex = chart.data.datasets.length - 1;
    chart.data.labels.forEach((_: any, i: number) => {
      let sum = 0;
      chart.data.datasets.forEach((dataset: any, idx: number) => {
        const meta = chart.getDatasetMeta(idx);
        const bar = meta.data[i];
        const value = dataset.data[i];
        sum += value;
        const color = ["Asincrono", "Express"].includes(dataset.label)
          ? "#FFFFFF"
          : "#2A303A";
        const fontSize = Math.max(10, chart.height * 0.025);
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = `${fontSize}px Work Sans`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(value + "M", bar.x, (bar.y + bar.base) / 2);
        ctx.restore();
      });

      const topBar = chart.getDatasetMeta(lastDatasetIndex).data[i];
      const sumFontSize = Math.max(10, chart.height * 0.03);

      ctx.save();
      ctx.fillStyle = "#373F4A";
      ctx.font = `${sumFontSize}px Work Sans`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(sum + "M", topBar.x, topBar.y - 4);
      ctx.restore();
    });
  },
};

// Registrar Chart.js y plugins
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  mostrarValoresPlugin
);

// Composable
const { copiarGrafico, copiado } = useChartUtilitarios();

// Refs
const grafico: Ref<any> = ref(null);
const mostrarValores = ref(false);
const seleccionado = ref<string | null>(null);
const chartData: Ref<ChartData> = ref({
  labels: [],
  datasets: [],
});



// Chart options
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: { stacked: true, ticks: { font: { size: 10 } } },
    y: {
      stacked: true,
      beginAtZero: true,
      suggestedMax: 1000,
      ticks: { stepSize: 100, callback: (v: any) => v + "M" },
    },
  },
  plugins: {
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
        borderColor: "transparent", // 🔹 esto elimina el borde

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
    tooltip: {
      callbacks: {
        label: (context: any) => {
          return `${context.dataset.label}: ${context.raw}M`;
        },
      },
    },
  },
});

// Methods
const handleCopiar = () => {
  if (grafico.value?.$el) {
    copiarGrafico(grafico.value.$el);
  }
};

const toggleValores = () => {
  mostrarValores.value = !mostrarValores.value;
  if (grafico.value?.chart) {
    grafico.value.chart.$mostrarValores = mostrarValores.value;
    grafico.value.chart.update();
  }
};

// Placeholder de acciones (evita errores en runtime)
const accionFiltro1 = () => console.log("accionFiltro1");
const accionFiltro2 = () => console.log("accionFiltro2");

const totalTransactionsRegionData =
  ref<SerieTotalTransactionsRegionResponse | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const toast = useToast();

const loadTotalTransactionsRegionData = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await seriesService.getSerieTotalTransactionsRegionByCode(
      "1M"
    );

    if (response) {
      totalTransactionsRegionData.value = response;
      // 👇 inicializamos con "sent" (Enviados)
      chartData.value = buildChartData(response.sent.regions);
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

// Estado para controlar si mostramos enviados o recibidos
const currentMode = ref<"sent" | "received">("sent");

// Reemplaza los métodos vacíos
const Enviados = () => {
  if (totalTransactionsRegionData.value) {
    currentMode.value = "sent";
    chartData.value = buildChartData(
      totalTransactionsRegionData.value.sent.regions
    );
  }
};

const Recibidos = () => {
  if (totalTransactionsRegionData.value) {
    currentMode.value = "received";
    chartData.value = buildChartData(
      totalTransactionsRegionData.value.received.regions
    );
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
      { label: "QR", data: qr, backgroundColor: "#0C55F8" }, 
    ],
  };
};

onMounted(async () => {
  await loadTotalTransactionsRegionData();
  // Manejo de errores
  if (error.value) {
    console.warn(
      "No se pudieron cargar los datos de transacciones totales:",
      error.value
    );
  }
});

// Component name (opcional pero útil para debugging)
defineOptions({
  name: "BarVertical",
});
</script>