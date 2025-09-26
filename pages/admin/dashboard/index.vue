<template>
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
 <div class="flex w-full gap-4 overflow-x-auto">
  <div class="flex-1 min-w-[300px] flex justify-center">
    <AdminDashboardUsabilityByChannelChart />
  </div>
  <div class="flex-1 min-w-[300px] flex justify-center">
    <AdminDashboardUsabilityByTransferChart />
  </div>
</div>
    <!-- Barra Horizontal -->
    <div class="w-full mb-12">
      <AdminDashboardTransactionByBancksChart />
    </div>
  </div>
</template>
