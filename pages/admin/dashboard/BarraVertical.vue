<template>
  <div
    class="flex flex-col relative w-full border-2 border-gray-300 rounded-xl shadow-md p-2 box-border"
  >
    <!-- Filtros -->
    <div class="flex flex-col items-start gap-1.5">
      <div class="flex flex-wrap gap-3 border-b-2 border-[#c2c0c0] mb-2.5">
        <button
          v-for="filtro in filtros"
          :key="filtro.key"
          @click="filtro.accion"
          class="px-4 py-2 min-w-[100px] rounded-md text-[#5F6A7B] text-base cursor-pointer bg-transparent transition-all hover:text-[#0C55F8] hover:bg-[#d1e4f0] hover:border-b-2 hover:border-[#0C55F8]"
        >
          {{ filtro.label }}
        </button>
      </div>

      <!-- Título + Copiar -->
      <div class="flex items-center justify-between w-full mb-2 titulo-botones flex-wrap gap-3">
        <h3 class="text-black font-bold text-[18px] lg:text-[20px] m-0 flex items-center gap-2">
          Transacciones por Región (Expresado en Dólares)
          <Icon
            name="x:paste-clipboard"
            class="text-[#0A44C6] w-8 h-8 lg:w-10 lg:h-10 cursor-pointer hover:text-[#0C55F8]"
            @click="handleCopiar"
          />
              <!-- Mensaje “copiado” -->
    <span
      v-if="copiado"
      class="mt-1 bg-blue-500 text-white text-sm px-2 py-1 rounded z-20"
    >
      Copiado
    </span>
        </h3>

        <!-- Acciones (detalle enviados/recibidos) -->
        <div
          ref="detalleEnviados"
          class="flex flex-wrap gap-3 p-3 rounded-lg bg-[#F0F5FF] justify-center"
        >
          <button
            v-for="accion in acciones"
            :key="accion.key"
            @click="accion.fn"
            class="flex items-center gap-1 px-3 py-2 min-w-[100px] rounded-md bg-[#F0F5FF] text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white"
          >
            <Icon :name="accion.icon" class="text-[#5F6A7B] w-6 h-6" />
            {{ accion.label }}
          </button>
        </div>
      </div>
    </div>



    <!-- Contenedor gráfico + detalle (lo que se copiará) -->
    <div
      ref="contenedorCopiable"
      class="relative w-full flex flex-col justify-center items-center gap-4 min-h-[300px]"
    >
      <!-- Botón ver cifras -->
      <div class="absolute left-2 top-2 flex items-center cursor-pointer z-10">
        <XCheckBox
          v-model="seleccionado"
          name="mostrarValores"
          value="seleccionarDatos"
          @click="toggleValores"
          :class="{ 'border-[#0C55F8]': seleccionado === 'seleccionarDatos' }"
        />
        <span class="font-normal text-[12px] ml-2">Ver todas las cifras</span>
      </div>

      <!-- Gráfico -->
      <BarChart ref="grafico" :data="chartData" :options="chartOptions" />

      <!-- Reutilizamos el bloque detalle aquí -->
      <div class="flex gap-3 p-3 rounded-lg bg-[#F0F5FF] flex-wrap justify-center lg:hidden">
        <button
          v-for="accion in acciones"
          :key="accion.key"
          @click="accion.fn"
          class="flex items-center gap-1 px-3 py-2 min-w-[100px] rounded-md bg-[#F0F5FF] text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white"
        >
          <Icon :name="accion.icon" class="text-[#5F6A7B] w-6 h-6" />
          {{ accion.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, nextTick, ref } from "vue"
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

//plugin para mostrar datos 
const mostrarValoresPlugin = {
  id: "mostrarValoresPlugin",
  afterDatasetsDraw(chart) {
    if (!chart.$mostrarValores) return;

    const ctx = chart.ctx;
    const lastDatasetIndex = chart.data.datasets.length - 1; // última barra de cada grupo

    chart.data.labels.forEach((_, i) => {
      let sum = 0;
        chart.data.datasets.forEach((dataset, idx) => {
        const meta = chart.getDatasetMeta(idx)
        const bar = meta.data[i]
        const value = dataset.data[i]
        sum += value

        const color = ["Asincrono", "Express"].includes(dataset.label)
          ? "#FFFFFF"
          : "#2A303A"

        ctx.save()
        ctx.fillStyle = color
        ctx.font = "12px Work Sans"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(value + "M", bar.x, (bar.y + bar.base) / 2)
        ctx.restore()
      })

      // calcular la suma de todos los datasets para esta posición
      chart.data.datasets.forEach((dataset) => {
        sum += dataset.data[i];
      });

      // obtener la barra superior (último dataset)
      const topBar = chart.getDatasetMeta(lastDatasetIndex).data[i];

      // dibujar la sumatoria sobre la barra superior
      ctx.save();
      ctx.fillStyle = "#373F4A";
      ctx.font = "12px Work Sans";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(sum + "M", topBar.x, topBar.y - 4); // 4px arriba del tope
      ctx.restore();
    });
  }
};

ChartJS.register(mostrarValoresPlugin)

export default defineComponent({
  name: "BarVertical",
  components: { BarChart: Bar },

  setup() {
    const { copiarGrafico, copiado } = useChartUtilitarios()
    const grafico = ref(null)
    const seleccionado = ref(null)
    const contenedorCopiable = ref(null)

    const handleCopiar = () => {
      if (contenedorCopiable.value) copiarGrafico(contenedorCopiable.value)
    }

    return { copiado, grafico, seleccionado, contenedorCopiable, handleCopiar }
  },

  data() {
    return {
      mostrarValores: false,
      filtros: [
        { key: "monto", label: "Monto", accion: () => alert("Filtro por Monto") },
        { key: "cantidad", label: "Cantidad", accion: () => alert("Filtro por Cantidad") },
      ],
      acciones: [
        {
          key: "enviados",
          label: "Enviados",
          icon: "x:arrow-tr-circle",
          fn: () => alert("Botón Enviados"),
        },
        {
          key: "recibidos",
          label: "Recibidos",
          icon: "x:arrow-br-circle",
          fn: () => alert("Botón Recibidos"),
        },
      ],
      chartData: reactive({
        labels: ["ASU", "CON", "SAN", "COR", "GUA", "CAZ", "CZA", "ITA", "MIS", "PAR", "ALT", "CNE", "ÑEE", "AMM", "CAN", "PTE", "BOQ", "ALP"],
        datasets: [
          {
            label: "QR",
            data: [150, 100, 60, 180, 160, 120, 150, 60, 80, 150, 180, 200, 250, 60, 80, 140, 150, 200],
            backgroundColor: "#0C55F8",
           
       
          },
          {
            label: "Express",
            data: [200, 180, 60, 140, 250, 50, 80, 120, 980, 60, 120, 50, 150, 180, 200, 150, 160, 80],
            backgroundColor: "#6F8CCE",
          
  
          },
          {
            label: "Asincrono",
            data: [150, 120, 80, 160, 200, 60, 120, 60, 200, 145, 145, 45, 60, 120, 150, 80, 70, 80],
            backgroundColor: "#A6C4F6",      
          },
        ],
      }),
      chartOptions: reactive({
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
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
            onClick:null,
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
      }),
    }
  },

  mounted() {
    nextTick(() => {
      if (this.$refs.grafico?.chart) {
        this.$refs.grafico.chart.$mostrarValores = this.mostrarValores
      }
    })
  },

  methods: {
    toggleValores() {
      this.mostrarValores = !this.mostrarValores
      if (this.$refs.grafico?.chart) {
        this.$refs.grafico.chart.$mostrarValores = this.mostrarValores
        this.$refs.grafico.chart.update()
      }
    },
  },
})
</script>
