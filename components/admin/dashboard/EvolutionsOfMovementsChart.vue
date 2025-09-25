<template>
  <div class="flex flex-col relative w-full border-0 border-gray-300 rounded-xl shadow-md p-2 box-border"
    style="box-shadow:-4px 0 6px -1px rgba(0, 0, 0, 0.1),4px 0 6px -1px rgba(0, 0, 0, 0.1),0 -4px 6px -1px rgba(0, 0, 0, 0.1),0 4px 6px -1px rgba(0, 0, 0, 0.1);">

    <!-- Botones Monto / Cantidad -->
    <div class="flex flex-col items-start gap-1.5">
      <div class="flex gap-3 border-b-2 border-[#c2c0c0] mb-2.5">
        <button @click="filtroActivo = 'amount'"
          class="px-4 py-2 min-w-[100px] rounded-md text-base cursor-pointer transition-all" :class="filtroActivo === 'amount'
            ? 'text-[#0C55F8] border-b-2 border-[#0C55F8] bg-[#d1e4f0]'
            : 'text-[#5F6A7B] hover:text-[#0C55F8] hover:border-b-2 hover:border-[#0C55F8] hover:bg-[#d1e4f0]'">
          Monto
        </button>

        <button @click="filtroActivo = 'count'"
          class="px-4 py-2 min-w-[100px] rounded-md text-base cursor-pointer transition-all" :class="filtroActivo === 'count'
            ? 'text-[#0C55F8] border-b-2 border-[#0C55F8] bg-[#d1e4f0]'
            : 'text-[#5F6A7B] hover:text-[#0C55F8] hover:border-b-2 hover:border-[#0C55F8] hover:bg-[#d1e4f0]'">
          Cantidad
        </button>
      </div>

      <!-- Título y botones Enviados/Recibidos -->
      <div class="flex items-center justify-between w-full mb-6">
        <h3 class="text-black font-bold text-[18px] lg:text-[20px] m-0 flex flex-col gap-1">
          <div class="flex items-center justify-between w-full mb-8">
            <span>{{ evolutionsMovementsData?.panel || 'No hay descripción disponible' }}
            </span>
            <Icon name="x:paste-clipboard"
              class="text-[#0A44C6] w-8 h-8 lg:w-10 lg:h-10 cursor-pointer hover:text-[#0C55F8]"
              @click="handleCopiar" />
            <span v-if="copiado" class="mt-1 bg-blue-500 text-white text-sm px-2 py-1 rounded z-20">
              Copiado
            </span>
          </div>
        </h3>
         <div class="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-[#F0F5FF] w-full sm:w-auto">
        <button @click="Enviados"
          class="flex items-center gap-2 px-3 py-2 flex-1 sm:flex-none min-w-[100px] rounded-md bg-[#F0F5FF] text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white">
          <Icon name="x:arrow-tr-circle" class="w-6 h-6 sm:w-7 sm:h-7" />
          Enviados
        </button>
        <button @click="Recibidos"
          class="flex items-center gap-2 px-3 py-2 flex-1 sm:flex-none min-w-[100px] rounded-md bg-[#F0F5FF] text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white">
          <Icon name="x:arrow-br-circle" class="w-6 h-6 sm:w-7 sm:h-7" />
          Recibidos
        </button>
      </div>
      </div>
    </div>

    <!-- Radios -->
    <div class="flex justify-end items-center gap-4">
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

    <!-- Contenedor del gráfico -->
    <div class="relative w-full flex justify-center items-start min-h-[400px] lg:min-h-[500px]">
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
const accionFiltro1 = () => alert('Filtro por Monto');
const accionFiltro2 = () => alert('Filtro por Cantidad');
const evolutionsMovementsData = ref<SeriesEvolutivaResponse | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const toast = useToast();
const currentMode = ref<"sent" | "received">("sent");
const periodo = useState<string | null>('periodo')
const filtroActivo = ref<'amount' | 'count'>('amount');


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
        ctx.strokeStyle = dataset.borderColor || '#000';
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
        ctx.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
        ctx.lineTo(width / 2, height / 2 - radius);
        ctx.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
        ctx.lineTo(-width / 2 + radius, height / 2);
        ctx.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
        ctx.lineTo(-width / 2, -height / 2 + radius);
        ctx.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);
        ctx.closePath();

        ctx.fillStyle = '#6F8CCE';
        ctx.fill();

        // Texto centrado
        ctx.fillStyle = 'white';
        ctx.font = '10px Work Sans';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(texto, 0, 0);

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
        callback: (value: any) => formatNumber(Number(value)),
        font: { size: 11, family: "Work Sans" },
      },
    }
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

const Monto = (): void => {
  filtroActivo.value = 'amount';
  if (periodo.value) {
    loadEvolutionsMovementsData(periodo.value, 'amount');
  }
};

const Cantidad = (): void => {
  filtroActivo.value = 'count';
  if (periodo.value) {
    loadEvolutionsMovementsData(periodo.value, 'count');
  }
};

const loadEvolutionsMovementsData = async (periodo: string, tipo: 'amount' | 'count' = filtroActivo.value) => {
  try {
    loading.value = true;
    error.value = null;
    const response = await seriesService.getSerieEvolutivaByCode(periodo, tipo);
    console.log("mis usabilidad es", response);
    if (response)
      evolutionsMovementsData.value = response;
    chartData.value = buildChartData(response.sent.series, response.granularity);    // Inicializa gráfico con "Enviados"
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
    label: s.transactionCode.toUpperCase(), // fuerza todo a mayúscula
    data: s.points.map((p: any) => p.value),
    borderColor:
      s.transactionCode.toUpperCase() === 'QR'
        ? '#0C55F8'
        : s.transactionCode.toUpperCase() === 'EXPRESS'
          ? '#6F8CCE'
          : '#A6C4F6',
    backgroundColor:
      s.transactionCode.toUpperCase() === 'QR'
        ? '#0C55F8'
        : s.transactionCode.toUpperCase() === 'EXPRESS'
          ? '#6F8CCE'
          : '#A6C4F6',
    fill: false,
    tension: 0.2,
    pointRadius: 4
  }));

  return { labels, datasets };
};
watch(seleccionado, (nuevoValor) => {
  const valueUpper = nuevoValor.toUpperCase(); // <-- normalizamos
  chartData.value.datasets.forEach(ds => {
    ds.hidden = valueUpper !== '' ? ds.label !== valueUpper : false;
  });
  chartRef.value?.chart?.update();
});



onMounted(async () => {
  await loadEvolutionsMovementsData(periodo.value);
  if (error.value) {
    console.warn('No se pudieron cargar los datos de evolución de movimientos:', error.value)
  }
});


</script>