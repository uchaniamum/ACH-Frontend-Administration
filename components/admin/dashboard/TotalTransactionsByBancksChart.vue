<template>
  <div class="flex flex-col relative w-full border-2 border-gray-300 rounded-xl shadow-md p-2 box-border">
    <!-- Botones Monto / Cantidad + Título y botones Enviados/Recibidos -->
    <div class="flex flex-col items-start gap-1.5">
      <div class="flex gap-3 border-b-2 border-[#c2c0c0] mb-2.5">
        <button @click="accionFiltro1"
          class="px-4 py-2 min-w-[100px] rounded-md text-[#5F6A7B] text-base cursor-pointer bg-transparent transition-all hover:text-[#0C55F8] hover:bg-[#d1e4f0] hover:border-b-2 hover:border-[#0C55F8]">
          Monto
        </button>
        <button @click="accionFiltro2"
          class="px-4 py-2 min-w-[100px] rounded-md text-[#5F6A7B] text-base cursor-pointer bg-transparent transition-all hover:text-[#0C55F8] hover:bg-[#d1e4f0] hover:border-b-2 hover:border-[#0C55F8]">
          Cantidad
        </button>
      </div>

      <div class="flex items-center justify-between w-full mb-2">
        <h3 class="text-black font-bold text-[20px] m-0 flex items-center gap-2">
          Transacciones por Región (Expresado en Dólares)
          <Icon name="x:paste-clipboard" @click="handleCopiar"
            class="text-[#0A44C6] w-10 h-10 cursor-pointer hover:text-[#0C55F8]" />
          <span v-if="copiado" class="mt-1 bg-blue-500 text-white text-sm px-2 py-1 rounded z-20">
            Copiado
          </span>
        </h3>

        <div class="flex gap-3 p-3 rounded-lg bg-[#F0F5FF]">
          <button @click="accion1"
            class="px-2 py-2 min-w-[100px] rounded-md bg-[#F0F5FF] text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white">
            <Icon name="x:arrow-tr-circle" class="text-[#5F6A7B] w-7 h-7" />
            Enviados
          </button>
          <button @click="accion2"
            class="px-3 py-2 min-w-[100px] rounded-md bg-[#F0F5FF] text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white">
            <Icon name="x:arrow-br-circle" class="text-[#5F6A7B] w-7 h-7" />
            Recibidos
          </button>
        </div>
      </div>
    </div>

    <!-- Contenedor del gráfico con scroll vertical -->
    <div class="relative w-full border-gray-200 rounded-lg p-2" style="height: 500px; overflow-y: auto;">
      <!-- Botón Ver todas las cifras -->
      <div class="absolute left-2 top-2 flex items-center cursor-pointer z-10">
        <XCheckBox v-model="seleccionado" name="mostrarValoresHorizontal" value="seleccionarDatos"
          @click="toggleValores" :class="{ 'border-[#0C55F8]': seleccionado === 'seleccionarDatos' }" />
        <span class="font-normal text-[12px] ml-2">Ver todas las cifras</span>
      </div>

      <!-- Gráfico -->
      <BarChart ref="grafico" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js"
import { Bar } from "vue-chartjs"
import { useChartUtilitarios } from "~/componsables/useChartUtilitarios"

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

// 🔹 Plugin para mostrar valores
const mostrarValoresPlugin = {
  id: "mostrarValoresPlugin",
  afterDatasetsDraw(chart) {
    if (!chart.$mostrarValores) return;
    const ctx = chart.ctx;
    const lastDatasetIndex = chart.data.datasets.length - 1;
    chart.data.labels.forEach((_, i) => {
      let sum = 0;
      chart.data.datasets.forEach((dataset, idx) => {
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

ChartJS.register(mostrarValoresPlugin)

export default defineComponent({
  name: "BarVertical",
  components: { BarChart: Bar },

  setup() {
    const grafico = ref(null)
    const mostrarValores = ref(false)
    const seleccionado = ref(null)

    const { copiarGrafico, copiado } = useChartUtilitarios()
    const handleCopiar = () => copiarGrafico(grafico.value.$el)

    const chartData = ref({
      labels: ["ASU", "CON", "SAN", "COR", "GUA", "CAZ", "CZA", "ITA", "MIS", "PAR", "ALT", "CNE", "ÑEE", "AMM", "CAN", "PTE", "BOQ", "ALP"],
      datasets: [
        { label: "QR", data: [150, 100, 60, 180, 160, 120, 150, 60, 80, 150, 180, 200, 250, 60, 80, 140, 150, 200], backgroundColor: "#0C55F8" },
        { label: "Express", data: [200, 180, 60, 140, 250, 50, 80, 120, 980, 60, 120, 50, 150, 180, 200, 150, 160, 80], backgroundColor: "#6F8CCE" },
        { label: "Asincrono", data: [150, 120, 80, 160, 200, 60, 120, 60, 200, 145, 145, 45, 60, 120, 150, 80, 70, 80], backgroundColor: "#A6C4F6" },
      ],
    })

    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: true, ticks: { font: { size: 10 } } },
        y: {
          stacked: true,
          beginAtZero: true,
          suggestedMax: 1000,
          ticks: { stepSize: 100, callback: (v) => v + "M" },
        },
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
    })

    // Arreglo de toggleValores (sin this)
    const toggleValores = () => {
      mostrarValores.value = !mostrarValores.value
      if (grafico.value?.chart) {
        grafico.value.chart.$mostrarValores = mostrarValores.value
        grafico.value.chart.update()
      }
    }

    // 🔹 placeholder de acciones (evita errores en runtime)
    const accion1 = () => console.log("accion1")
    const accion2 = () => console.log("accion2")
    const accionFiltro1 = () => console.log("accionFiltro1")
    const accionFiltro2 = () => console.log("accionFiltro2")

    return { 
      grafico,
      chartData, 
      chartOptions, 
      mostrarValores, 
      toggleValores, 
      seleccionado, 
      copiado, 
      handleCopiar,
      accion1,
      accion2,
      accionFiltro1,
      accionFiltro2
    }
  }
})
</script>

