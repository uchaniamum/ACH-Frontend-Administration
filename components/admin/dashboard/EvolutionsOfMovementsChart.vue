<template>
  <div class="flex flex-col relative w-full border-0 border-gray-300 rounded-xl shadow-md p-2 sm:p-4 box-border"
    style="box-shadow:-4px 0 6px -1px rgba(0, 0, 0, 0.1),4px 0 6px -1px rgba(0, 0, 0, 0.1),0 -4px 6px -1px rgba(0, 0, 0, 0.1),0 4px 6px -1px rgba(0, 0, 0, 0.1);">

    <!-- Botones Monto / Cantidad -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
      <div class="flex gap-2 sm:gap-3 border-b-2 border-[#c2c0c0] mb-2.5 w-full sm:w-auto">
        <button @click="Monto"
          class="px-4 py-2 min-w-[80px] sm:min-w-[100px] rounded-md text-[#5F6A7B] text-sm sm:text-base cursor-pointer bg-transparent transition-all hover:text-[#0C55F8] hover:bg-[#d1e4f0] hover:border-b-2 hover:border-[#0C55F8]">
          Monto
        </button>
        <button @click="Cantidad"
          class="px-4 py-2 min-w-[80px] sm:min-w-[100px] rounded-md text-[#5F6A7B] text-sm sm:text-base cursor-pointer bg-transparent transition-all hover:text-[#0C55F8] hover:bg-[#d1e4f0] hover:border-b-2 hover:border-[#0C55F8]">
          Cantidad
        </button>
      </div>
    </div>

    <!-- Título y botones Enviados/Recibidos -->
    <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full mb-6 gap-4">
      <div class="flex items-center gap-2 w-full">
        <h3 class="text-black font-bold text-[16px] sm:text-[18px] lg:text-[20px] m-0 truncate">
          {{ evolutionsMovementsData?.panel || 'No hay descripción disponible' }}
        </h3>
        <Icon name="x:paste-clipboard"
          class="text-[#0A44C6] w-10 h-10 sm:w-12 sm:h-12 cursor-pointer hover:text-[#0C55F8]" @click="handleCopiar" />
        <span v-if="copiado" class="bg-blue-500 text-white text-xs sm:text-sm px-2 py-1 rounded">
          Copiado
        </span>
      </div>


      <div class="flex gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-[#F0F5FF] w-full sm:w-auto justify-center">
        <button @click="Enviados"
          class="flex items-center gap-1 px-2 py-2 min-w-[90px] sm:min-w-[100px] rounded-md bg-[#F0F5FF] text-[#5F6A7B] text-xs sm:text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white">
          <Icon name="x:arrow-tr-circle" class="text-[#5F6A7B] w-5 h-5 sm:w-6 sm:h-6" />
          Enviados
        </button>
        <button @click="Recibidos"
          class="flex items-center gap-1 px-3 py-2 min-w-[90px] sm:min-w-[100px] rounded-md bg-[#F0F5FF] text-[#5F6A7B] text-xs sm:text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white">
          <Icon name="x:arrow-br-circle" class="text-[#5F6A7B] w-5 h-5 sm:w-6 sm:h-6" />
          Recibidos
        </button>
      </div>
    </div>

    <!-- Radios -->
    <div class="flex flex-wrap justify-end items-center gap-3 sm:gap-4">
      <div class="flex items-center gap-1">
        <span class="w-5 h-5 sm:w-7 sm:h-7 rounded-full inline-block" :style="{ backgroundColor: '#0C55F8' }"></span>
        <span class="text-[9px] sm:text-[10px] font-normal"
          :style="{ color: '#5F6A7B', fontFamily: 'Work Sans' }">QR</span>
        <XRadioButton v-model="seleccionado" value="QR" />
      </div>
      <div class="flex items-center gap-1">
        <span class="w-5 h-5 sm:w-7 sm:h-7 rounded-full inline-block" :style="{ backgroundColor: '#6F8CCE' }"></span>
        <span class="text-[9px] sm:text-[10px] font-normal"
          :style="{ color: '#5F6A7B', fontFamily: 'Work Sans' }">Express</span>
        <XRadioButton v-model="seleccionado" value="EXPRESS" />
      </div>
      <div class="flex items-center gap-1">
        <span class="w-5 h-5 sm:w-7 sm:h-7 rounded-full inline-block" :style="{ backgroundColor: '#A6C4F6' }"></span>
        <span class="text-[9px] sm:text-[10px] font-normal"
          :style="{ color: '#5F6A7B', fontFamily: 'Work Sans' }">Asincrono</span>
        <XRadioButton v-model="seleccionado" value="ASYNC" />
      </div>
    </div>

    <!-- Contenedor del gráfico -->
    <div class="relative w-full flex justify-center items-start h-[280px] sm:h-[350px] lg:h-[500px]">
      <LineChart ref="chartRef" :data="chartData" :options="chartOptions" :plugins="[puntosColorYDatos]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import type { Ref } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { Line as LineChart } from 'vue-chartjs';
import { useChartUtilitarios } from '~/componsables/useChartUtilitarios';
import { XRadioButton } from "#components";
import { seriesService } from '~/services/dashboard/seriesService';
import type { SeriesEvolutivaResponse } from '~/features/dashboard/serieEvolutiva.types';
import { useToast } from '#imports';

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
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

// Composable
const { copiado, copiarGrafico } = useChartUtilitarios();
const chartData: Ref<ChartData> = ref({
  labels: [],
  datasets: [],
});
// Refs
const chartRef: Ref<any> = ref(null);
const seleccionado = ref(''); // por defecto no mostrar valores
const evolutionsMovementsData = ref<SeriesEvolutivaResponse | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const toast = useToast();
const currentMode = ref<"sent" | "received">("sent");
const periodo = useState<string | null>('periodo')


// Plugin personalizado
const puntosColorYDatos = {
  id: 'puntosColorYDatos',
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
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = dataset.borderColor;
        ctx.stroke();
        ctx.restore();

        // Dibujar tooltip solo si hay selección
        if (!seleccionado.value || dataset.label !== seleccionado.value) return;

        const value = dataset.data[index] + 'M';
        ctx.save();
        ctx.translate(point.x, point.y - 25); // desplazado un poco más arriba
        ctx.rotate(-Math.PI / 3); // ROTADO AL OTRO LADO

        const padding = 6;
        const textWidth = ctx.measureText(value).width;
        const width = textWidth + padding * 2;
        const height = 18;

        // Burbuja curvada
        ctx.beginPath();
        ctx.moveTo(-width / 2 + 5, -height / 2);
        ctx.bezierCurveTo(-width / 2, -height / 2, -width / 2, height / 2, -width / 2 + 5, height / 2);
        ctx.lineTo(width / 2 - 5, height / 2);
        ctx.bezierCurveTo(width / 2, height / 2, width / 2, -height / 2, width / 2 - 5, -height / 2);
        ctx.closePath();
        ctx.fillStyle = '#6F8CCE';
        ctx.fill();

        // Texto
        ctx.fillStyle = 'white';
        ctx.font = '10px Work Sans';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(value, 0, 0);
        ctx.restore();
      });
    });
  }
};

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: 0 },
  scales: {
    x: { ticks: { font: { size: 10 } } },
    y: {
      beginAtZero: true,
      suggestedMax: 1000,
      ticks: {
        stepSize: 100,
        precision: 0,
        callback: (value: any) => value + 'M'
      }
    }
  },
  plugins: {
    legend: { display: false }
  }
});

// Methods
const handleCopiar = () => {
  if (chartRef.value?.$el) {
    copiarGrafico(chartRef.value.$el);
  }
};

// Reemplaza los métodos vacíos
const Enviados = () => {
  if (evolutionsMovementsData.value) {
    currentMode.value = "sent";
    chartData.value = buildChartData(evolutionsMovementsData.value.sent.series, evolutionsMovementsData.value.granularity);
  }
};

const Recibidos = () => {
  if (evolutionsMovementsData.value) {
    currentMode.value = "received";
    chartData.value = buildChartData(evolutionsMovementsData.value.received.series, evolutionsMovementsData.value.granularity);
  }
};

watch(periodo, (newVal) => {
  if (newVal) {
    loadEvolutionsMovementsData(newVal)
  }
})
const Monto = () => {
  if (periodo.value) {
    loadEvolutionsMovementsData(periodo.value);
  }
};

const Cantidad = () => {
  if (periodo.value) {
    loadEvolutionsMovementsCountData(periodo.value);
  }
};


const loadEvolutionsMovementsData = async (periodo: string) => {
  try {
    loading.value = true;
    error.value = null;
    const response = await seriesService.getSerieEvolutivaByCode(periodo);
    console.log("mis usabilidad es", response);
    if (response) evolutionsMovementsData.value = response;
    chartData.value = buildChartData(response.sent.series, response.granularity // 'day', 'month' o 'year'
    );    // Inicializa gráfico con "Enviados"
    //actualizarChart('sent');
  } catch (err: any) {
    console.error('Error loading channel data:', err);
    error.value = err.message || 'Error al cargar la información del canal';
    toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 5000 });
  } finally {
    loading.value = false;
  }
};

const loadEvolutionsMovementsCountData = async (periodo: string) => {
  try {
    loading.value = true;
    error.value = null;
    const response = await seriesService.getSerieEvolutivaCountByCode(periodo);
    console.log("mis usabilidad  contador es", response);
    if (response) evolutionsMovementsData.value = response;
    chartData.value = buildChartData(response.sent.series, response.granularity // 'day', 'month' o 'year'
    );    // Inicializa gráfico con "Enviados"
    //actualizarChart('sent');
  } catch (err: any) {
    console.error('Error loading channel data:', err);
    error.value = err.message || 'Error al cargar la información del canal';
    toast.add({ severity: 'error', summary: 'Error', detail: error.value, life: 5000 });
  } finally {
    loading.value = false;
  }
};



const buildChartData = (series: any[], granularity: string) => {
  // Función para obtener label según la granularidad
  const getLabel = (p: any) => {
    if (granularity === 'day') return p.date.slice(8, 10);  //DD  
    if (granularity === 'month') return p.date.slice(0, 7); // YYYY-MM
    if (granularity === 'year') return p.date.slice(0, 4);  // YYYY
    return p.date; // fallback
  };
  const labels = series[0]?.points.map((p: any) => getLabel(p)) || [];
  const datasets = series.map((s: any) => ({
    label: s.transactionCode,
    data: s.points.map((p: any) => p.value / 1000000),
    borderColor:
      s.transactionCode === 'QR'
        ? '#0C55F8'
        : s.transactionCode === 'EXPRESS'
          ? '#6F8CCE'
          : '#A6C4F6',
    backgroundColor:
      s.transactionCode === 'QR'
        ? '#0C55F8'
        : s.transactionCode === 'EXPRESS'
          ? '#6F8CCE'
          : '#A6C4F6',
    fill: false,
    tension: 0.2,
    pointRadius: 4
  }));

  return { labels, datasets };
};
watch(seleccionado, (nuevoValor) => {
  chartData.value.datasets.forEach(ds => {
    ds.hidden = nuevoValor !== '' ? ds.label !== nuevoValor : false;
  });
  chartRef.value?.chart?.update();
});



onMounted(async () => {
  if (periodo.value) {
    loadEvolutionsMovementsData(periodo.value);
  }
  if (error.value) {
    console.warn('No se pudieron cargar los datos de evolución de movimientos:', error.value)
  }
});

defineOptions({
  name: "LineExample"
});
</script>