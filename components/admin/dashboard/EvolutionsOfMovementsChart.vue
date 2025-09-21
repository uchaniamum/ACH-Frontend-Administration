<template>
  <div class="flex flex-col relative w-full border-2 border-gray-300 rounded-xl shadow-md p-2 box-border">
    <!-- Botones Monto / Cantidad -->
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

      <!-- Título y botones Enviados/Recibidos -->
      <div class="flex items-center justify-between w-full mb-6">
        <h3 class="text-black font-bold text-[18px] lg:text-[20px] m-0 flex flex-col gap-1">
          <div class="flex items-center justify-between w-full mb-8">
            <span>Evolucion de Movimientos (Expresado en Dólares)</span>
            <Icon name="x:paste-clipboard"
              class="text-[#0A44C6] w-8 h-8 lg:w-10 lg:h-10 cursor-pointer hover:text-[#0C55F8]"
              @click="handleCopiar" />
            <span v-if="copiado" class="mt-1 bg-blue-500 text-white text-sm px-2 py-1 rounded z-20">
              Copiado
            </span>
          </div>
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
        <XRadioButton v-model="seleccionado" value="Express" />
      </div>
      <div class="flex items-center gap-1">
        <span class="w-7 h-7 rounded-full inline-block" :style="{ backgroundColor: '#A6C4F6' }"></span>
        <span class="text-[10px] font-normal" :style="{ color: '#5F6A7B', fontFamily: 'Work Sans' }">Asincrono</span>
        <XRadioButton v-model="seleccionado" value="Asincrono" />
      </div>
    </div>

    <!-- Contenedor del gráfico -->
    <div class="relative w-full flex justify-center items-start min-h-[300px]">
      <LineChart ref="chartRef" :data="chartData" :options="chartOptions" :plugins="[puntosColorYDatos]" />
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
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
import { useChartUtilitarios } from '~/componsables/useChartUtilitarios'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

export default defineComponent({
  name: 'LineExample',
  components: { LineChart: Line },
  setup() {
    const chartRef = ref(null)
    const seleccionado = ref('') // por defecto no mostrar valores


const puntosColorYDatos = {
  id: 'puntosColorYDatos',
  afterDatasetsDraw(chart) {
    const { ctx } = chart
    chart.data.datasets.forEach((dataset) => {
      const meta = chart.getDatasetMeta(chart.data.datasets.indexOf(dataset))
      if (!meta) return

      meta.data.forEach((point, index) => {
        // Dibujar círculo
        ctx.save()
        ctx.beginPath()
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
        ctx.fillStyle = 'white'
        ctx.fill()
        ctx.lineWidth = 2
        ctx.strokeStyle = dataset.borderColor
        ctx.stroke()
        ctx.restore()

        // Dibujar tooltip solo si hay selección
        if (!seleccionado.value || dataset.label !== seleccionado.value) return

        const value = dataset.data[index] + 'M'
        ctx.save()
        ctx.translate(point.x, point.y - 25) // desplazado un poco más arriba movetou y
    
        ctx.rotate(-Math.PI / 3) // ROTADO AL OTRO LADO

        const padding = 6
        const textWidth = ctx.measureText(value).width
        const width = textWidth + padding * 2
        const height = 18

        // Burbuja curvada
        ctx.beginPath()
        ctx.moveTo(-width / 2 + 5, -height / 2)
        ctx.bezierCurveTo(-width / 2, -height / 2, -width / 2, height / 2, -width / 2 + 5, height / 2)
        ctx.lineTo(width / 2 - 5, height / 2)
        ctx.bezierCurveTo(width / 2, height / 2, width / 2, -height / 2, width / 2 - 5, -height / 2)
        ctx.closePath()
        ctx.fillStyle = '#6F8CCE'
        ctx.fill()

        // Texto
        ctx.fillStyle = 'white'
        ctx.font = '10px Work Sans'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(value, 0, 0)
        ctx.restore()
      })
    })
  }
}



    const chartData = ref({
      labels: Array.from({ length: 30 }, (_, i) => (i + 1).toString().padStart(2, '0')),
      datasets: [
        {
          label: 'QR',
          data: [200, 190, 170, 160, 140, 120, 110, 95, 90, 0, 120, 100, 140, 160, 180, 200, 205, 230, 240, 200, 190, 170, 150, 140, 120, 90, 98, 200, 205, 220],
          borderColor: '#0C55F8',
          backgroundColor: '#0C55F8',
          tension: 0.8,
          fill: true,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 8
        },
        {
          label: 'Express',
          data: [500, 450, 300, 380, 380, 360, 450, 480, 400, 300, 350, 450, 600, 540, 330, 220, 450, 320, 450, 320, 150, 200, 250, 300, 350, 400, 450, 500, 550],
          borderColor: '#6F8CCE',
          backgroundColor: '#6F8CCE',
          tension: 0.5,
          fill: true,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 8
        },
        {
          label: 'Asincrono',
          data: [150, 100, 60, 180, 160, 120, 150, 60, 80, 150, 180, 200, 250, 60, 80, 140, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800],
          borderColor: '#A6C4F6',
          backgroundColor: '#A6C4F6',
          tension: 0.9,
          fill: true,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 8
        }
      ]
    })

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
            callback: value => value + 'M'
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    })

    const { copiado, copiarGrafico } = useChartUtilitarios()
    const handleCopiar = () => copiarGrafico(chartRef.value.$el)

    const accion1 = () => alert('Botón Enviados presionado')
    const accion2 = () => alert('Botón Recibidos presionado')
    const accionFiltro1 = () => alert('Filtro por Monto')
    const accionFiltro2 = () => alert('Filtro por Cantidad')

    // Mostrar solo el dataset seleccionado en el gráfico
    watch(seleccionado, (nuevoValor) => {
      chartData.value.datasets.forEach(ds => {
        ds.hidden = ds.label !== nuevoValor && nuevoValor !== ''
      })

      // Actualizar gráfico para mostrar valores del plugin
      chartRef.value?.chart?.update()
    })

    return {
      chartRef,
      chartData,
      chartOptions,
      //puntosColorLinea,
      handleCopiar,
      copiado,
      accion1,
      accion2,
      accionFiltro1,
      accionFiltro2,
      seleccionado,
      puntosColorYDatos
      //puntosDatos
    }
  }
})
</script>
