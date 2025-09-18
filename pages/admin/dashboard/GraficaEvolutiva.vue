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
          Evolución de Movimientos (Expresado en Dólares)
          <Icon name="x:paste-clipboard" class="text-[#0A44C6] w-10 h-10 cursor-pointer hover:text-[#0C55F8]"
            @click="descargarGrafico" />
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

    <!-- Contenedor del gráfico -->
    <div class="relative w-full flex justify-center items-start min-h-[300px]">
      <!-- Gráfico -->
      <LineChart ref:grafico :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>


<script>
import { defineComponent } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)
// Plugin que dibuja círculos tipo radio


export default defineComponent({
  name: 'LineExample',
  components: { LineChart: Line },
  data() {
    return {
      hoverLinea: false,
      chartData: {
        labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
        datasets: [
          {
            label: "QR",
            data: [200, 190, 170, 160, 140, 120, 110, 95, 90, 0, 120, 100, 140, 160, 180, 200, 205, 230, 240, 200, 190, 170, 150, 140, 120, 90, 98, 200, 205, 220],
            borderColor: "#0C55F8",
            backgroundColor: "rgba(12,85,248,0.2)",
            tension: 0.5, // suaviza la línea
            fill: true,
            pointRadius: 6,       // <-- tamaño del punto
            pointHoverRadius: 8   // <-- tamaño cuando pasas el mouse
          },
          {
            label: "Express",
            data: [500, 450, 300, 380, 380, 360, 450, 480, 400, 300, 350, 450, 600, 540, 330, 220, 450, 320, 450, 320, 150, 200, 250, 300, 350, 400, 450, 500, 550],
            borderColor: "#6F8CCE",
            backgroundColor: "rgba(111,140,206,0.2)",
            tension: 0.5,
            fill: true,
            pointRadius: 6,       // <-- tamaño del punto
            pointHoverRadius: 8
          },
          {
            label: "Asincrono",
            data: [150, 100, 60, 180, 160, 120, 150, 60, 80, 150, 180, 200, 250, 60, 80, 140, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800],
            borderColor: "#A6C4F6",
            backgroundColor: "rgba(166,196,246,0.2)",
            tension: 0.5,
            fill: true,
            pointRadius: 6,       // <-- tamaño del punto
            pointHoverRadius: 8
          }
        ]
      },
      chartOptions: {
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
              callback: value => value + "M"
            }
          }
        },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              boxWidth: 8,
              boxHeight: 8,
              padding: 17,
              font: { size: 9.335, family: "Work Sans", weight: '400' },
              color: '#5F6A7B',
              generateLabels: chart => {
                return chart.data.datasets.map((dataset, i) => ({
                  text: dataset.label,
                  fillStyle: dataset.borderColor,
                  strokeStyle: dataset.borderColor,
                  lineWidth: 2,
                  datasetIndex: i,
                  // icono tipo radio
                  radio: true,
                  radioSelected: dataset.hidden !== true // si dataset visible → seleccionado
                }))
              },
              // al hacer click en la leyenda
              onClick: (e, legendItem, legend) => {
                const index = legendItem.datasetIndex;
                const ci = legend.chart;
                // alternar visibilidad del dataset
                ci.isDatasetVisible(index) ? ci.hide(index) : ci.show(index);
              },
              // dibujar el “radio” al lado derecho
              render: function (ctx, legendItem, x, y) {
                // dibujar radio (círculo)
                ctx.save();
                const radius = 5;
                ctx.beginPath();
                ctx.arc(x + 50, y, radius, 0, 2 * Math.PI); // 50px a la derecha
                ctx.fillStyle = legendItem.radioSelected ? '#0C55F8' : '#FFFFFF';
                ctx.strokeStyle = '#0C55F8';
                ctx.lineWidth = 1;
                ctx.fill();
                ctx.stroke();
                ctx.restore();
              }
            }

          }
        }
      }
    }
  },


  methods: {
    accion1() { alert("Botón 1 presionado"); },
    accion2() { alert("Botón 2 presionado"); },
    accionFiltro1() { alert("Filtro por Monto"); },
    accionFiltro2() { alert("Filtro por Cantidad"); }
  }
})
</script>

<style scoped></style>