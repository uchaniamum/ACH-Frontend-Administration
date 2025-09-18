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
          Total Transacciones por Bancos (Expresado en Dólares)
          <Icon name="x:paste-clipboard" @click="handleCopiar"
            class="text-[#0A44C6] w-10 h-10 cursor-pointer hover:text-[#0C55F8]" />
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

    <!-- Mensaje “copiado” -->
    <span v-if="copiado" class="absolute top-2 right-2 bg-blue-500 text-white text-sm px-2 py-1 rounded z-20">
      Copiado
    </span>

    <!-- Contenedor del gráfico con scroll vertical -->
    <div class="relative w-full border-gray-200 rounded-lg p-2" style="height: 500px; overflow-y: auto;">
      <!-- Botón Ver todas las cifras -->
      <div class="absolute left-2 top-2 flex items-center cursor-pointer z-10">
<XRadioButton  v-model="seleccionado"  name="mostrarValoresHorizontal" value="seleccionarDatos" @click="toggleValores"
  :class="{'border-[#0C55F8]': seleccionado === 'seleccionarDatos'  }"/>
 <span class="font-normal text-[12px]">Ver todas las cifras</span>
        <Icon name="x:sort" class="text-[#0C55F8] w-7 h-7 ml-2 cursor-pointer" @click="handleOrdenar" />
      </div>

      <!-- Gráfico -->
      <BarChart ref="chartRef" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, nextTick } from 'vue';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'vue-chartjs';
import { useChartUtilitarios } from '~/componsables/useChartUtilitarios'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const mostrarValoresPluginHorizontal = {
  id: 'mostrarValoresPluginHorizontal',
  afterDatasetsDraw(chart) {
    if (!chart.$mostrarValoresHorizontal) return;
    const ctx = chart.ctx;

    chart.data.labels.forEach((_, i) => {
      chart.data.datasets.forEach((dataset) => {
        const meta = chart.getDatasetMeta(chart.data.datasets.indexOf(dataset));
        const bar = meta.data[i];
        const value = dataset.data[i];
        const color = ['Asincrono', 'Express'].includes(dataset.label) ? '#FFFFFF' : '#2A303A';

        ctx.save();
        ctx.fillStyle = color;
        ctx.font = '9px Work Sans';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(value + 'M', (bar.x + bar.base) / 2, bar.y);
        ctx.restore();
      });
    });
  }
};

ChartJS.register(mostrarValoresPluginHorizontal);

export default defineComponent({
  name: 'BarHorizontal',
  components: { BarChart: Bar },

  setup() {
    const chartRef = ref(null);
    const mostrarValoresHorizontal = ref(false);
    const ordenAscendente = ref(true);
    const seleccionado=ref(null);
    const chartData = ref({
      labels: ['paraguay', 'Bolivia', 'Sudameris', 'Contínental', 'Itaú', 'GNB', 'Atlas', 'Ueno', 'BASA', 'Bancop', 'Río', 'Zeta'],
      datasets: [
        { label: "QR", data: [150, 200, 150, 120, 80, 160, 200, 60, 120, 60, 200, 145], backgroundColor: "#A6C4F6", barPercentage: 0.9, categoryPercentage: 0.8 },
        { label: "Express", data: [50, 450, 200, 180, 60, 140, 250, 50, 80, 120, 980, 60], backgroundColor: "#6F8CCE", barPercentage: 0.9, categoryPercentage: 0.8 },
        { label: "Asincrono", data: [456, 500, 150, 100, 60, 180, 160, 120, 150, 60, 80, 150], backgroundColor: "#0C55F8", barPercentage: 0.9, categoryPercentage: 0.8 }
      ]
    });

    const chartOptions = ref({
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: true, beginAtZero: true, suggestedMax: 1000, ticks: { stepSize: 100, callback: value => value + "M" } },
        y: { stacked: true, ticks: { font: { size: 10 } } }
      },
      plugins: {
        legend: {
          position: 'top',
          align: 'end',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            boxWidth: 12,
            boxHeight: 12,
            padding: 15,
            font: { size: 10, family: "Work Sans", weight: '400' },
            color: '#5F6A7B'
          }
        }
      }
    });

    const { copiado, copiarGrafico, ordenarBarras } = useChartUtilitarios();

   

const toggleValores = () => {
  if (seleccionado.value === 'seleccionarDatos') {
    // Deselect
    seleccionado.value = null;
    if (chartRef.value?.chart) {
      chartRef.value.chart.$mostrarValoresHorizontal = false;
      chartRef.value.chart.update();
    }
  } else {
    // Select
    seleccionado.value = 'seleccionarDatos';
    if (chartRef.value?.chart) {
      chartRef.value.chart.$mostrarValoresHorizontal = true;
      chartRef.value.chart.update();
    }
  }
};

    const handleCopiar = () => copiarGrafico(chartRef.value.$el);
    const handleOrdenar = () => ordenarBarras(chartRef.value, chartData.value, ordenAscendente);

    // Botones de acción
    const accion1 = () => alert("Botón Enviados presionado");
    const accion2 = () => alert("Botón Recibidos presionado");
    const accionFiltro1 = () => alert("Filtro por Monto");
    const accionFiltro2 = () => alert("Filtro por Cantidad");

    return {
      chartRef,
      chartData,
      chartOptions,
      mostrarValoresHorizontal,
      toggleValores,
      handleCopiar,
      handleOrdenar,
      copiado,
      accion1,
      accion2,
      accionFiltro1,
      accionFiltro2
    };
  }
});
</script>

<style scoped>
.ver-todas-cifras {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #373F4A;
  font-family: 'Work Sans';
  position: absolute;
  z-index: 10;
  transition: all 0.2s ease;
}
</style>
