<template>
  <div class="flex flex-col gap-16 w-full">
    <!-- Panel Ejecutivo -->
    <div style="width: 100%;">
      <PanelEjecutivo />
    </div>

    <!-- Line Chart -->
    <div style="width: 100%;">
      <LineChart />
    </div>

    <!-- Barra Vertical -->
    <div style="width: 100%;">
      <BarChartVertical />
    </div>

    <!-- PieCharts lado a lado -->
    <div class="flex flex-wrap gap-4 w-full justify-center">
      <!-- Primer PieChart -->
      <div class="flex-1 flex flex-col items-center chart-wrapper">
        <PieChartUsabilidadCanal />
      </div>

      <!-- Segundo PieChart -->
      <div class="flex-1 flex flex-col items-center chart-wrapper">
        <PieChartUsabilidadTransferencia />
      </div>
    </div>

    <!-- Barra Horizontal -->
<div style="width: 100%; margin-bottom: 50px;">
  <BarChartHorizontal />
</div>

  </div>
</template>


<script>
import BarChartVertical from './TotalTransactionsByBancksChart.vue'   // tu gráfico vertical
import BarChartHorizontal from './TransactionByRegionChart.vue' // tu gráfico horizontal
import LineChart from './EvolutionsOfMovementsChart.vue'
import PieChartUsabilidadCanal from './UsabilityByChannelChart.vue'
import PieChartUsabilidadTransferencia from './UsabilityByTransferChart.vue'
import PanelEjecutivo from './panelEjecutivo/ExecutivePanel.vue'

export default {
  name: 'Index',
  components: { BarChartVertical, BarChartHorizontal, LineChart, PieChartUsabilidadCanal, PieChartUsabilidadTransferencia, PanelEjecutivo }
}
</script>
<style scoped>
.chart-wrapper .grafico-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.chart-wrapper .grafico-pie {
  flex: 1 1 auto; /* ocupa todo el espacio disponible para el gráfico */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px; /* espacio con los labels */
}

.chart-wrapper .labels-container {
  flex: 0 0 auto; /* altura solo para el contenido de labels */
  width: 100%;    /* ocupa todo el ancho del contenedor */
  box-sizing: border-box;
  margin: 0 auto;
}

</style>