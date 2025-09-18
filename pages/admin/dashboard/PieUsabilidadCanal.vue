<template>
  <div
    class="flex flex-col relative w-full border-2 border-gray-300 rounded-xl shadow-md p-4 box-border h-[600px] sm:h-auto"
  >
    <!-- Encabezado con título y botones -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-4 gap-3 titulo-botones"
    >
      <h3
        class="text-black font-bold text-lg sm:text-[20px] flex items-center gap-2"
      >
        Usabilidad por Canal
        <Icon
          name="x:paste-clipboard"
          class="text-[#0A44C6] w-8 h-8 sm:w-10 sm:h-10 cursor-pointer hover:text-[#0C55F8]"
          @click="handleCopiar"
        />
      </h3>

      <!-- Botones -->
      <div
        class="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-[#F0F5FF]"
      >
        <button
          @click="accion1"
          class="flex items-center gap-2 px-3 py-2 flex-1 sm:flex-none min-w-[100px] rounded-md bg-[#F0F5FF] text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white"
        >
          <Icon name="x:arrow-tr-circle" class="w-6 h-6 sm:w-7 sm:h-7" />
          Enviados
        </button>
        <button
          @click="accion2"
          class="flex items-center gap-2 px-3 py-2 flex-1 sm:flex-none min-w-[100px] rounded-md bg-[#F0F5FF] text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white"
        >
          <Icon name="x:arrow-br-circle" class="w-6 h-6 sm:w-7 sm:h-7" />
          Recibidos
        </button>
      </div>
    </div>

    <!-- Botón Ver todas las cifras -->
    <div class="flex items-center gap-2 mb-2">
      <div
        ref="verCifras"
        class="flex items-center cursor-pointer transition-all"
      >
        <XRadioButton
          v-model="seleccionado"
          name="mostrarValoresPie"
          value="seleccionarDatos"
          @click="toggleValores"
          :class="{
            'border-[#0C55F8]': seleccionado === 'seleccionarDatos',
          }"
        />
        <span class="font-normal text-[12px]">Ver todas las cifras</span>
      </div>
    </div>

    <!-- Contenido a copiar (gráfico + labels) -->
    <div
      ref="graficoContenido"
      class="w-full flex flex-col items-center gap-6"
    >
      <!-- Gráfico Pie -->
       <div class="flex justify-center items-center w-[400px] h-[400px] sm:w-[320px] sm:h-[400px]">
        <PieChart ref="grafico" :data="chartData" :options="chartOptions" />
      </div>


      <!-- Contenedor de labels -->
      <div
        class="flex flex-col gap-3 border border-[#92ACE5] p-3 rounded-lg bg-white w-full sm:w-[70%] lg:w-[60%] mx-auto"
      >
        <div
          class="text-[14px] font-semibold text-[#5F6A7B] mb-2 text-left"
        >
          Enviados
        </div>
        <div
          v-for="(label, index) in chartData.labels"
          :key="index"
          class="flex justify-between items-center w-full p-1 flex-wrap"
        >
          <div
            class="flex items-center gap-2 min-w-[120px] flex-1"
          >
            <span
              class="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex-shrink-0"
              :style="{
                backgroundColor:
                  chartData.datasets[0].backgroundColor[index],
              }"
            ></span>
            <span
              class="text-[11px] sm:text-[12px] font-medium text-[#5F6A7B]"
            >
              {{ label }}
            </span>
          </div>
          <span
            class="text-[11px] sm:text-[12px] font-medium text-[#5F6A7B] text-right flex-shrink-0 ml-2"
          >
            {{
              ((chartData.datasets[0].data[index] / total) * 100).toFixed(1)
            }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Mensaje “copiado” -->
    <span
      v-if="copiado"
      class="absolute top-2 right-2 bg-blue-500 text-white text-xs sm:text-sm px-2 py-1 rounded z-20"
    >
      Copiado
    </span>
  </div>
</template>

<script>
import { defineComponent, nextTick, ref } from "vue";
import { Chart as ChartJS, Title, Tooltip, ArcElement } from "chart.js";
import { Pie } from "vue-chartjs";
import { useChartUtilitarios } from "~/componsables/useChartUtilitarios";

ChartJS.register(
  Title,
  Tooltip,
  ArcElement,
  useChartUtilitarios().mostrarTooltipBurbujaPlugin
);

export default defineComponent({
  name: "PieUsabilidadCanal",
  components: { PieChart: Pie },
  setup() {
    const { copiarGrafico, copiado } = useChartUtilitarios();
    const graficoContenido = ref(null);

    const handleCopiar = () => {
      if (graficoContenido.value) {
        copiarGrafico(graficoContenido.value); // ✅ solo gráfico + detalle
      }
    };

    return { graficoContenido, handleCopiar, copiado };
  },
  data() {
    return {
      seleccionado: null,
      mostrarValoresPie: false,
      chartData: {
        labels: ["Web", "Ventanilla", "Móvil", "ATM", "Agente"],
        datasets: [
          {
            label: "Enviados",
            data: [35, 35, 10, 2, 18],
            backgroundColor: [
              "#0C55F8",
              "#073395",
              "#9EBBFC",
              "#6F8CCE",
              "#021132",
            ],
          },
        ],
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          mostrarValoresPie: false,
        },
        layout: { top: 10, right: 40, bottom: 10, left: 40 },
        elements: { arc: { borderWidth: 4, radius: "75%" } },
      },
    };
  },
  mounted() {
    nextTick(() => {
      if (this.$refs.grafico?.chart) {
        this.$refs.grafico.chart.options.plugins.mostrarValoresPie =
          this.mostrarValoresPie;
        this.resizeObserver = new ResizeObserver(() =>
          this.reposicionarVerCifras()
        );
        this.resizeObserver.observe(this.$refs.grafico.$el);
      }
    });
  },
  beforeUnmount() {
    this.resizeObserver?.disconnect();
  },
  methods: {
    toggleValores() {
      this.mostrarValoresPie = !this.mostrarValoresPie;
      if (this.$refs.grafico?.chart) {
        this.$refs.grafico.chart.options.plugins.mostrarValoresPie =
          this.mostrarValoresPie;
        this.$refs.grafico.chart.update();
      }
    },
    reposicionarVerCifras() {
      const verCifras = this.$refs.verCifras;
      const titulo = this.$el.querySelector(".titulo-botones h3");
      const graficoBody = this.$refs.grafico.$el;
      if (!verCifras || !titulo || !graficoBody) return;

      const tituloRect = titulo.getBoundingClientRect();
      const contenedorRect = graficoBody.getBoundingClientRect();

      verCifras.style.left = `${tituloRect.left - contenedorRect.left}px`;
      verCifras.style.top = `${
        tituloRect.bottom - contenedorRect.top + 5
      }px`;
    },
    accion1() {
      console.log("Enviados");
    },
    accion2() {
      console.log("Recibidos");
    },
  },
  computed: {
    total() {
      return this.chartData.datasets[0].data.reduce(
        (sum, val) => sum + val,
        0
      );
    },
  },
});
</script>

<style scoped></style>
