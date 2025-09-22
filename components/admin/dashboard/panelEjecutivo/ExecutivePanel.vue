<template>
  <!-- Contenedor superior con degradado -->
  <div class="w-full p-6 rounded-t-lg border border-gray-200 mb-0"
    style="background: linear-gradient(to left, #E7EEFE, #9EBBFC) top no-repeat, white;">
    <div class="flex flex-col sm:flex-row justify-between items-center gap-2 px-4 py-2 w-full">
      <h2 class="text-[20px] font-bold text-[#073395]">
        {{ sumaryData?.panel || 'No hay descripción disponible' }}
      </h2>
      <XSelect 
        name="periodo" 
        v-model="selectedPeriod" 
        :options="periodsOptions" 
        optionLabel="label" 
        optionValue="value"
        placeholder="Seleccionar" 
        :loading="optionsLoading" 
        :dropdown="true" 
        appendTo="body" 
      />
    </div>
  </div>

  <!-- Componente PieUsabilidadCanal con el parámetro periodo -->
  <PieUsabilidadCanal :periodo="selectedPeriod" />

  <!-- Contenedor inferior pegado -->
  <div class="w-full p-6 border border-gray-200 rounded-b-lg mt-0 mb-12 bg-white">
    <p class="text-gray-600">
      {{ sumaryData?.panelDescription || 'No hay descripción disponible' }}
    </p>
  </div>

  <!-- Contenedor flexible con altura unificada -->
  <div class="flex flex-wrap gap-8 justify-center items-stretch">
    <!-- Bloque 1 -->
    <div class="flex flex-col flex-[2] min-w-[300px]">
      <div class="px-6 py-3 border border-gray-200 bg-[#6D99FB] rounded-t-2xl mb-4">
        <h2 class="text-[18px] text-white font-bold text-center">
          Total Movimientos de Transacciones
        </h2>
      </div>

      <div class="flex gap-4 flex-col sm:flex-row flex-1">
        <!-- Recibidos -->
        <div class="flex-1 p-4 bg-white border border-gray-200 flex flex-col rounded-none sm:rounded-bl-2xl">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-black font-bold text-[18px] m-0">Recibidos</h3>
            <Icon name="x:arrow-br-circle" class="text-[#92ACE5] w-11 h-11" />
          </div>
          <div class="px-8 py-6 bg-[#6D99FB] text-white rounded-xl font-bold text-center text-lg mb-8">
            {{ sumaryData?.amount.received.total || 'No hay descripción disponible' }}
          </div>
          <div class="p-4 bg-white border border-gray-200 rounded-2xl h-52 flex flex-col justify-between">
            <div v-for="(item, index) in sumaryData?.amount.received.items" :key="index"
              class="flex justify-between items-center">
              <span class="text-[#0C55F8]">
                {{ mapTransactionLabel(item.transactionCode) }}
              </span>
              <span class="text-[#0C55F8]">
                $us.{{ item.value.toLocaleString('es-BO') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Enviados -->
        <div class="flex-1 p-4 bg-white border border-gray-200 flex flex-col rounded-none sm:rounded-br-2xl">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-black font-bold text-[18px] m-0">Enviados</h3>
            <Icon name="x:arrow-tr-circle" class="text-[#92ACE5] w-11 h-11" />
          </div>
          <div class="px-8 py-6 bg-[#6D99FB] text-white rounded-xl font-bold text-center text-lg mb-8">
            {{ sumaryData?.amount.sent.total || 'No hay descripción disponible' }}
          </div>
          <div class="p-4 bg-white border border-gray-200 rounded-2xl h-52 flex flex-col justify-between">
            <div v-for="(item, index) in sumaryData?.amount.sent.items" :key="index"
              class="flex justify-between items-center">
              <span class="text-[#0C55F8]">
                {{ mapTransactionLabel(item.transactionCode) }}
              </span>
              <span class="text-[#0C55F8]">
                $us.{{ item.value.toLocaleString('es-BO') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bloque 2 -->
    <div class="flex flex-col flex-[2] min-w-[300px]">
      <div class="px-6 py-3 border border-gray-200 bg-[#92ACE5] rounded-t-2xl mb-4">
        <h2 class="text-[18px] text-white font-bold text-center">
          Total Cantidad de Transacciones
        </h2>
      </div>

      <div class="flex gap-4 flex-col sm:flex-row flex-1">
        <!-- Recibidos -->
        <div class="flex-1 p-4 bg-white border border-gray-200 flex flex-col rounded-none sm:rounded-bl-2xl">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-black font-bold text-[18px] m-0">Recibidos</h3>
            <Icon name="x:arrow-br-circle" class="text-[#92ACE5] w-11 h-11" />
          </div>
          <div class="px-8 py-6 bg-[#92ACE5] text-white rounded-xl font-bold text-center text-lg mb-8">
            {{ sumaryData?.count.received.total || 'No hay descripción disponible' }}
          </div>
          <div class="p-4 bg-white border border-gray-200 rounded-2xl h-52 flex flex-col justify-between">
            <div v-for="(item, index) in sumaryData?.count.received.items" :key="index"
              class="flex justify-between items-center">
              <span class="text-[#0C55F8]">
                {{ mapTransactionLabel(item.transactionCode) }}
              </span>
              <span class="text-[#0C55F8]">
                $us.{{ item.value.toLocaleString('es-BO') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Enviados -->
        <div class="flex-1 p-4 bg-white border border-gray-200 flex flex-col rounded-none sm:rounded-br-2xl">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-black font-bold text-[18px] m-0">Enviados</h3>
            <Icon name="x:arrow-tr-circle" class="text-[#92ACE5] w-11 h-11" />
          </div>
          <div class="px-8 py-6 bg-[#92ACE5] text-white rounded-xl font-bold text-center text-lg mb-8">
            {{ sumaryData?.count.sent.total || 'No hay descripción disponible' }}
          </div>
          <div class="p-4 bg-white border border-gray-200 rounded-2xl h-52 flex flex-col justify-between">
            <div v-for="(item, index) in sumaryData?.count.sent.items" :key="index"
              class="flex justify-between items-center">
              <span class="text-[#0C55F8]">
                {{ mapTransactionLabel(item.transactionCode) }}
              </span>
              <span class="text-[#0C55F8]">
                $us.{{ item.value.toLocaleString('es-BO') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bloque 3 -->
    <div class="flex flex-col flex-[1] min-w-[240px]">
      <div class="px-6 py-3 border border-gray-200 bg-[#052263] rounded-t-2xl mb-4">
        <h2 class="text-[18px] text-white font-bold text-center">
          Eficiencia
        </h2>
      </div>
      <div class="flex-1 p-4 bg-white border border-gray-200 flex flex-col rounded-none sm:rounded-b-2xl">
        <div class="px-4 py-2 text-white rounded-xl font-bold text-center text-base mb-2">
          <AdminDashboardPanelEjecutivoEfficiencyChart :percentage="sumaryData?.efficiency?.overall || 0" />
        </div>
        <div class="p-2 bg-white border border-gray-200 rounded-2xl flex flex-col justify-center gap-2 min-h-[80px]">
          <div class="flex justify-between items-center w-full">
            <div class="flex items-center gap-1">
              <Icon name="x:arrow-tr-circle" />
              <span class="text-[#0C55F8]">Enviados</span>
            </div>
            <span class="text-[#0C55F8]">{{ sumaryData?.efficiency.sent.percent || 'No hay descripción disponible' }} %
            </span>
          </div>
          <div class="flex justify-between items-center w-full">
            <div class="flex items-center gap-1">
              <Icon name="x:arrow-br-circle" />
              <span class="text-[#0C55F8]">Recibidos</span>
            </div>
            <span class="text-[#0C55F8]">{{ sumaryData?.efficiency.received.percent || 'No hay descripción disponible'
            }} %</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAnalyticsOptions } from '~/componsables/useAnalyticsOptions';
import { sumaryService } from '~/services/dashboard/sumaryService';
import type { SumaryResponses } from "~/features/dashboard/sumary.types";
import { useToast } from 'primevue/usetoast';

const loading = ref(false);
const sumaryData = ref<SumaryResponses | null>(null)
const error = ref<string | null>(null);
const toast = useToast();
const selectedPeriod = ref<string | null>(null)

// Watcher para detectar cambios en el periodo seleccionado
watch(selectedPeriod, (newVal) => {
  if (newVal) {
    loadSumaryData()
  }
})

const mapTransactionLabel = (code: string): string => {
  const map: Record<string, string> = {
    QR: "QR",
    EXPRESS: "Expres",
    ASYNC: "Asíncrono",
  }
  return map[code] ?? code
}

// Usar el composable de opciones
const {
  periodsOptions,
  loading: optionsLoading,
  error: optionsError,
  loadperiodsOptions
} = useAnalyticsOptions()

const loadSumaryData = async () => {
  try {
    loading.value = true
    error.value = null
    if (!selectedPeriod.value) {
      error.value = 'Periodo no especificado'
      return
    }
    const response = await sumaryService.getSummaryByCode(selectedPeriod.value)
    if (response) {
      sumaryData.value = response
    }
  } catch (err: any) {
    console.error('Error loading channel data:', err)
    error.value = err.message || 'Error al cargar la información del canal'
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.value,
      life: 5000
    })
  } finally {
    loading.value = false
  }
};

// Cargar opciones al montar el componente
onMounted(async () => {
  await loadperiodsOptions()
  // Manejo de errores
  if (optionsError.value) {
    console.warn('No se pudieron cargar las opciones de periodos:', optionsError.value)
  }
});
</script>