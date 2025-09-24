<template>
  <!-- Contenedor raíz que cubre toda la pantalla -->
    <!-- Contenedor interno con padding y layout de dashboard -->
    <div class="flex flex-col gap-16 p-4">
      
      <!-- Panel Ejecutivo -->
      <div class="w-full">
        <AdminDashboardPanelEjecutivoExecutivePanel />
      </div>

      <!-- Line Chart -->
      <div class="w-full">
        <AdminDashboardEvolutionsOfMovementsChart />
      </div>

      <!-- Barra Vertical -->
      <div class="w-full">
        <AdminDashboardTotalTransactionsRegionChart />
      </div>
      <!-- PieCharts lado a lado, responsivo -->
      <div class="flex flex-wrap gap-4 w-full justify-center">
        <div class="flex-1 min-w-[280px] max-w-[500px] flex flex-col items-center chart-wrapper">
          <AdminDashboardUsabilityByChannelChart />
        </div>
        <div class="flex-1 min-w-[280px] max-w-[500px] flex flex-col items-center chart-wrapper">
          <AdminDashboardUsabilityByTransferChart />
        </div>
      </div>

      <!-- Barra Horizontal -->
      <div class="w-full mb-12">
        <AdminDashboardTransactionByBancksChart />
      </div>

    </div>
  
</template>


<style scoped>
.chart-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.chart-wrapper .grafico-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.chart-wrapper .grafico-pie {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.chart-wrapper .labels-container {
  flex: 0 0 auto;
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .chart-wrapper {
    min-width: 100%;
  }
}
</style>
