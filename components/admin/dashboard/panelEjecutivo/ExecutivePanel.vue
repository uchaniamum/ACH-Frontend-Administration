<template>
  <!-- Contenedor superior con degradado -->
  <div class="w-full p-3 sm:p-6 rounded-t-lg border border-gray-200 mb-0"
    style="background: linear-gradient(to left, #E7EEFE, #9EBBFC) top no-repeat, white;">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2 sm:px-4 py-2 w-full">
      <h2 class="text-[18px] sm:text-[20px] font-bold text-[#073395] leading-tight">
        {{ sumaryData?.panel || 'No hay descripción disponible' }}
      </h2>
      <XSelect name="periodo" v-model="selectedPeriod" :options="periodsOptions" optionLabel="label" optionValue="value"
        placeholder="Seleccionar" :loading="optionsLoading" :dropdown="true" appendTo="body"
        class="w-full sm:w-64 max-w-xs" />
    </div>
  </div>

  <!-- Contenedor inferior pegado -->
  <div class="w-full p-3 sm:p-6 border-l border-r border-b border-[#6D99FB] rounded-b-lg mt-0 mb-6 sm:mb-12 bg-white">
    <p class="text-gray-600 text-sm sm:text-base">
      {{ sumaryData?.panelDescription || 'No hay descripción disponible' }}
    </p>
  </div>

  <!-- Contenedor flexible con altura unificada -->
  <div class="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center items-stretch">
    <!-- Bloque 1 -->
    <div class="flex flex-col flex-1 lg:flex-[2] min-w-0 rounded-3xl overflow-hidden"
      style="box-shadow: -4px 0 6px -1px rgba(0, 0, 0, 0.1), 4px 0 6px -1px rgba(0, 0, 0, 0.1), 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <div class="px-4 sm:px-6 py-3 border border-gray-200 bg-[#6D99FB] rounded-t-3xl mb-4">
        <h2 class="text-[16px] sm:text-[18px] text-white font-bold text-center">
          Total Movimientos de Transacciones
        </h2>
      </div>

      <div class="flex gap-2 sm:gap-4 flex-col md:flex-row flex-1">
        <!-- Recibidos -->
        <div class="flex-1 p-3 sm:p-4 bg-white border border-gray-200 flex flex-col rounded-none md:rounded-bl-3xl">
          <div class="flex justify-between items-center mb-4 sm:mb-6">
            <h3 class="text-black font-bold text-[16px] sm:text-[18px] m-0">Recibidos</h3>
            <Icon name="x:arrow-br-circle" class="text-[#92ACE5] w-8 h-8 sm:w-11 sm:h-11 flex-shrink-0" />
          </div>

          <div
            class="px-4 sm:px-8 py-4 sm:py-6 bg-[#6D99FB] text-white rounded-2xl font-bold text-center text-base sm:text-lg mb-6 sm:mb-8 break-words">
            {{ sumaryData?.amount.received.total || 'No hay descripción disponible' }}
          </div>

          <div
            class="p-3 sm:p-4 bg-white border border-[#6D99FB] rounded-3xl flex-1 min-h-[180px] sm:h-52 flex flex-col justify-between overflow-auto">
            <div v-for="(item, index) in sumaryData?.amount.received.items" :key="index"
              class="flex justify-between items-center py-1 gap-2">
              <span class="text-[#0C55F8] text-sm sm:text-base flex-shrink-0 min-w-0">
                {{ mapTransactionLabel(item.transactionCode) }}
              </span>
              <span class="text-[#0C55F8] text-sm sm:text-base font-medium text-right">
                $us.{{ item.value.toLocaleString('es-BO') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Enviados -->
        <div class="flex-1 p-3 sm:p-4 bg-white border border-gray-200 flex flex-col rounded-none md:rounded-br-3xl">
          <div class="flex justify-between items-center mb-4 sm:mb-6">
            <h3 class="text-black font-bold text-[16px] sm:text-[18px] m-0">Enviados</h3>
            <Icon name="x:arrow-tr-circle" class="text-[#92ACE5] w-8 h-8 sm:w-11 sm:h-11 flex-shrink-0" />
          </div>

          <div
            class="px-4 sm:px-8 py-4 sm:py-6 bg-[#6D99FB] text-white rounded-2xl font-bold text-center text-base sm:text-lg mb-6 sm:mb-8 break-words">
            {{ sumaryData?.amount.sent.total || 'No hay descripción disponible' }}
          </div>

          <div
            class="p-3 sm:p-4 bg-white border border-[#6D99FB] rounded-3xl flex-1 min-h-[180px] sm:h-52 flex flex-col justify-between overflow-auto">
            <div v-for="(item, index) in sumaryData?.amount.sent.items" :key="index"
              class="flex justify-between items-center py-1 gap-2">
              <span class="text-[#0C55F8] text-sm sm:text-base flex-shrink-0 min-w-0">
                {{ mapTransactionLabel(item.transactionCode) }}
              </span>
              <span class="text-[#0C55F8] text-sm sm:text-base font-medium text-right">
                $us.{{ item.value.toLocaleString('es-BO') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bloque 2 -->
    <div class="flex flex-col flex-1 lg:flex-[2] min-w-0 rounded-3xl overflow-hidden"
      style="box-shadow: -4px 0 6px -1px rgba(0, 0, 0, 0.1), 4px 0 6px -1px rgba(0, 0, 0, 0.1), 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1);">

      <div class="px-4 sm:px-6 py-3 border border-gray-200 bg-[#92ACE5] rounded-t-3xl mb-4">
        <h2 class="text-[16px] sm:text-[18px] text-white font-bold text-center">
          Total Cantidad de Transacciones
        </h2>
      </div>

      <div class="flex gap-2 sm:gap-4 flex-col md:flex-row flex-1">
        <!-- Recibidos -->
        <div class="flex-1 p-3 sm:p-4 bg-white border border-gray-200 flex flex-col rounded-none md:rounded-bl-3xl">
          <div class="flex justify-between items-center mb-4 sm:mb-6">
            <h3 class="text-black font-bold text-[16px] sm:text-[18px] m-0">Recibidos</h3>
            <Icon name="x:arrow-br-circle" class="text-[#92ACE5] w-8 h-8 sm:w-11 sm:h-11 flex-shrink-0" />
          </div>

          <div
            class="px-4 sm:px-8 py-4 sm:py-6 bg-[#92ACE5] text-white rounded-2xl font-bold text-center text-base sm:text-lg mb-6 sm:mb-8 break-words">
            {{ sumaryData?.count.received.total || 'No hay descripción disponible' }}
          </div>

          <div
            class="p-3 sm:p-4 bg-white border border-[#92ACE5] rounded-3xl flex-1 min-h-[180px] sm:h-52 flex flex-col justify-between overflow-auto">
            <div v-for="(item, index) in sumaryData?.count.received.items" :key="index"
              class="flex justify-between items-center py-1 gap-2">
              <span class="text-[#0C55F8] text-sm sm:text-base flex-shrink-0 min-w-0">
                {{ mapTransactionLabel(item.transactionCode) }}
              </span>
              <span class="text-[#0C55F8] text-sm sm:text-base font-medium text-right">
                $us.{{ item.value.toLocaleString('es-BO') }}
              </span>
            </div>
          </div>
        </div>

        <!-- Enviados -->
        <div class="flex-1 p-3 sm:p-4 bg-white border border-gray-200 flex flex-col rounded-none md:rounded-br-3xl">
          <div class="flex justify-between items-center mb-4 sm:mb-6">
            <h3 class="text-black font-bold text-[16px] sm:text-[18px] m-0">Enviados</h3>
            <Icon name="x:arrow-tr-circle" class="text-[#92ACE5] w-8 h-8 sm:w-11 sm:h-11 flex-shrink-0" />
          </div>

          <div
            class="px-4 sm:px-8 py-4 sm:py-6 bg-[#92ACE5] text-white rounded-2xl font-bold text-center text-base sm:text-lg mb-6 sm:mb-8 break-words">
            {{ sumaryData?.count.sent.total || 'No hay descripción disponible' }}
          </div>

          <div
            class="p-3 sm:p-4 bg-white border border-[#92ACE5] rounded-3xl flex-1 min-h-[180px] sm:h-52 flex flex-col justify-between overflow-auto">
            <div v-for="(item, index) in sumaryData?.count.sent.items" :key="index"
              class="flex justify-between items-center py-1 gap-2">
              <span class="text-[#0C55F8] text-sm sm:text-base flex-shrink-0 min-w-0">
                {{ mapTransactionLabel(item.transactionCode) }}
              </span>
              <span class="text-[#0C55F8] text-sm sm:text-base font-medium text-right">
                $us.{{ item.value.toLocaleString('es-BO') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bloque 3 -->
    <div class="flex flex-col flex-1 min-w-0 max-w-full lg:max-w-xs rounded-3xl overflow-hidden"
      style="box-shadow: -4px 0 6px -1px rgba(0, 0, 0, 0.1), 4px 0 6px -1px rgba(0, 0, 0, 0.1), 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1);">

      <div class="px-4 sm:px-6 py-3 border border-gray-200 bg-[#052263] rounded-t-3xl mb-4">
        <h2 class="text-[16px] sm:text-[18px] text-white font-bold text-center">
          Eficiencia
        </h2>
      </div>

      <div class="flex-1 p-3 sm:p-4 bg-white border border-gray-200 flex flex-col rounded-none lg:rounded-b-3xl">
        <div class="px-4 py-2 text-white rounded-xl font-bold text-center text-base mb-2">
          <AdminDashboardPanelEjecutivoEfficiencyChart :percentage="sumaryData?.efficiency?.overall || 0" />
        </div>

        <div
          class="p-3 sm:p-4 bg-white border border-[#92ACE5] rounded-2xl flex flex-col justify-center gap-3 sm:gap-2 min-h-[120px] sm:min-h-[80px]">
          <div class="flex justify-between items-center w-full gap-2">
            <div class="flex items-center gap-1 flex-shrink-0">
              <Icon name="x:arrow-tr-circle" class="w-4 h-4 sm:w-5 sm:h-5" />
              <span class="text-[#0C55F8] text-sm sm:text-base">Enviados</span>
            </div>
            <span class="text-[#0C55F8] text-sm sm:text-base font-medium">
              {{ sumaryData?.efficiency.sent.percent || 'No hay descripción disponible' }} %
            </span>
          </div>

          <div class="flex justify-between items-center w-full gap-2">
            <div class="flex items-center gap-1 flex-shrink-0">
              <Icon name="x:arrow-br-circle" class="w-4 h-4 sm:w-5 sm:h-5" />
              <span class="text-[#0C55F8] text-sm sm:text-base">Recibidos</span>
            </div>
            <span class="text-[#0C55F8] text-sm sm:text-base font-medium">
              {{ sumaryData?.efficiency.received.percent || 'No hay descripción disponible' }} %
            </span>
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
const periodo = useState<string | null>('periodo', () => null)

// Watcher para detectar cambios en el periodo seleccionado
watch(selectedPeriod, (newVal) => {
  periodo.value = newVal
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
   // Si hay opciones disponibles y no hay valor seleccionado, tomar la primera
  if (periodsOptions.value.length > 0 && !selectedPeriod.value) {
    selectedPeriod.value = periodsOptions.value[0].value
  }

  // Manejo de errores
  if (optionsError.value) {
    console.warn('No se pudieron cargar las opciones de periodos:', optionsError.value)
  }
});
</script>