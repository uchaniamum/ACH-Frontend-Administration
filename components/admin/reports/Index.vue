<template>
  <div>
    <XHeader title="Consulta de transferencias interbancarias" :breadcrumb-items="itemsBreadParameters"
        :show-breadcrumb="true">
      <template #description>
        <p>Consulta las transferencias interbancarias aplicando filtros en función a los criterios de búsqueda
          disponibles.</p>
      </template>
    </XHeader>
    <div class="pt-12 flex flex-col gap-20">
      <div class="flex justify-between gap-4">
        <p>Selecciona un tipo de movimiento y llena los campos necesarios para realizar la búsqueda.</p>
      </div>
      <div class="flex justify-start p-3">
        <div class="flex gap-3 rounded-lg bg-[#F0F5FF] p-3">
          <button @click="accion1"
              class="px-2 py-2 min-w-[100px] rounded-md text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white">
            <Icon name="x:arrow-tr-circle" class="text-[#5F6A7B] w-7 h-7" />
            Enviados
          </button>
          <button @click="accion2"
              class="px-3 py-2 min-w-[100px] rounded-md text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white">
            <Icon name="x:arrow-br-circle" class="text-[#5F6A7B] w-7 h-7" />
            Recibidos
          </button>
          <button @click="accion3"
              class="px-3 py-2 min-w-[100px] rounded-md text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white">
            <Icon name="x:transfer" class="text-[#5F6A7B] w-7 h-7" />
            Ambos
          </button>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row gap-4 w-full">
        <div class="w-full sm:w-1/3 p-4 bg-white border border-gray-200 rounded-2xl h-65 flex flex-col justify-between">
          <!-- Contenedor fila para título + select -->
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-black font-bold text-[16px] m-0">Datos del Cliente</h3>
            <XSelect name="cuenta" optionLabel="label" optionValue="value" placeholder="Cuenta"
                :dropdown="true" appendTo="body" class="w-100" />
          </div>
          <XInputText name="codigo" label="Numero de cuenta" label-required placeholder="Ingresa numero" />
        </div>
        <!-- Tarjeta 2 -->
        <div class="w-full sm:w-1/3 p-4 bg-white border border-gray-200 rounded-2xl h-auto flex flex-col">
          <h3 class="text-black font-bold text-[16px] m-0">
            Detalles de la transferencia
          </h3>
          
          <XDatePicker v-model="date" label="Fecha" name="fechaTransferencia" label-required
              :rules="[(v: any) => !!v || 'El campo es requerido']" :pt="{
                  calendarContainer: { class: 'bg-white' },
                  panel: { class: 'bg-[#f1f1f1]' },
              }">
            <!-- Icono en el campo -->
            <template #icon>
              <Icon name="x:calendar-1" class="text-[#92ACE5] w-11 h-11" />
            </template>
          </XDatePicker>
          
          <!-- Trigger centrado -->
          <div class="flex justify-center mt-4">
            <h3 class="text-blue font-normal text-[12px] m-0 cursor-pointer hover:underline flex items-center gap-1"
                @click="showFilters = !showFilters">
              {{ showFilters ? 'Ocultar criterios de búsqueda' : 'Más criterios de búsqueda' }}
              <Icon :name="showFilters ? 'x:nav-arrow-down' : 'x:nav-arrow-up'" />
            </h3>
          </div>
          
          <!-- Sección desplegable centrada -->
          <transition name="fade">
            <div v-show="showFilters" class="mt-4">
              <!-- Subtítulo alineado a la izquierda -->
              <h3 class="text-blue font-normal text-[12px] m-0 mb-3 text-left">
                Tipo de Transferencia
              </h3>
              
              <!-- Botones justificados con espaciado -->
              <div class="flex flex-wrap gap-3 justify-start mb-4">
                <XButton label="QR" class="!w-[60px] !bg-[#F0F5FF] !text-[#5F6A7B] !border-[#F0F5FF]" />
                <XButton label="Express"
                    class="!w-[75px] !bg-[#F0F5FF] !text-[#5F6A7B] !border-[#F0F5FF]" />
                <XButton label="Asíncrono"
                    class="!w-[85px] !bg-[#F0F5FF] !text-[#5F6A7B] !border-[#F0F5FF]" />
                <XButton label="Todos"
                    class="!w-[60px] !bg-[#6F8CCE] !text-[#FFFFFF] !border-[#6F8CCE]" />
              </div>
              
              <!-- Subtítulo alineado a la izquierda -->
              <h3 class="text-blue font-normal text-[12px] m-0 mb-3 text-left">
                Moneda
              </h3>
              
              <!-- Botones justificados con espaciado -->
              <div class="flex flex-wrap gap-3 justify-start">
                <XButton label="Gs" class="!w-[50px] !bg-[#F0F5FF] !text-[#5F6A7B] !border-[#F0F5FF]" />
                <XButton label="BRL"
                    class="!w-[50px] !bg-[#F0F5FF] !text-[#5F6A7B] !border-[#F0F5FF]" />
                <XButton label="$US"
                    class="!w-[50px] !bg-[#F0F5FF] !text-[#5F6A7B] !border-[#F0F5FF]" />
                <XButton label="EUR"
                    class="!w-[50px] !bg-[#F0F5FF] !text-[#5F6A7B] !border-[#F0F5FF]" />
                <XButton label="Todos"
                    class="!w-[60px] !bg-[#6F8CCE] !text-[#FFFFFF] !border-[#6F8CCE]" />
              </div>
            </div>
          </transition>
        </div>
        
        <div class="w-full sm:w-1/3 p-4 bg-white border border-gray-200 rounded-2xl h-auto flex flex-col">
          
          <h3 class="text-black font-bold text-[16px] m-0">Datos del Destinatario</h3>
          <XInputText name="codigo" label="Numero de cuenta" placeholder="Ingresa numero" />
          
          <div class="flex justify-center mt-4">
            <h3 class="text-blue font-normal text-[12px] m-0 cursor-pointer hover:underline flex items-center gap-1"
                @click="showFiltersDestinatario = !showFiltersDestinatario">
              {{ showFiltersDestinatario ? 'Ocultar criterios de búsqueda' : 'Más criterios de búsqueda' }}
              <Icon :name="showFiltersDestinatario ? 'x:nav-arrow-down' : 'x:nav-arrow-up'" />
            </h3>
          </div>
          <!-- Sección desplegable centrada -->
          <transition name="fade">
            <div v-show="showFiltersDestinatario" class="mt-4">
              <XSelect v-model="selectedBanks" :options="bankOptions" multiple optionLabel="label"
                  optionValue="value" placeholder="Selecciona bancos" />
            </div>
          </transition>
        </div>
      </div>
      <XSnackBar icon="x:info-empty" bg-circle="bg-[#A6C4F6]" closable class="border-[#A6C4F6] mb-4"
          class-icon="text-[#3698DB] w-[22px] h-[22px]">
        <p class="text-[#5F6A7B]">
          Recuerda que al seleccionar la opción
          <span class="font-bold">"Más criterios de búsqueda"</span>,
          se habilitarán campos adicionales que te permitirán realizar la consulta de manera más específica.
        </p>
      </XSnackBar>
      <div class="self-end flex gap-8">
        <XButton label="Limpiar" :disabled="selectedBanks.length === 0" variant="outlined" class="!w-[150px]"
            @click="accion4">
          <template #icon>
            <Icon name="x:clean" class="w-5 h-5" />
          </template>
        </XButton>
        
        <XButton label="Buscar" :disabled="selectedBanks.length === 0" class="!w-[200px]" @click="accion5">
          <template #icon>
            <Icon name="x:search" class="w-5 h-5" />
          </template>
        </XButton>
      </div>

      <DataTable
        class="col-span-12"
        v-model:filters="filters"
        filterDisplay="row"
        :rows="10"
        :value="transferencias"
        :globalFilterFields="['productoOrigen','productoDestino','bancoOrigen','bancoDestino','moneda','estado']"
      >
        <Column class="col-span-1" :showFilterMenu="false" filterField="fechaHoraTransferencia"
            field="fechaHoraTransferencia" header="Fecha y hora transf.">
        </Column>
        <Column class="col-span-4" :showFilterMenu="false" field="productoOrigen" header="Producto origen">
        </Column>
        <Column class="col-span-1" :showFilterMenu="false" field="bancoOrigen" header="Banco origen">
        </Column>
        <Column class="col-span-2" :showFilterMenu="false" field="productoDestino" header="Producto destino">
        </Column>
        <Column class="col-span-1" :showFilterMenu="false" field="bancoDestino" header="Banco destino">
        </Column>
        <Column class="col-span-1" :showFilterMenu="false" field="moneda" header="Moneda">
        </Column>
        <Column class="col-span-1" :showFilterMenu="false" field="importe" header="Importe">
        </Column>
        <Column class="col-span-1" :showFilterMenu="false" field="tipoTransferencia" header="Tipo transf.">
        </Column>
        <Column class="col-span-1" :showFilterMenu="false" field="estado" header="Estado">
        </Column>
        <Column class="col-span-1" :showFilterMenu="false" header="Detalles">
          <template #body="{ data }">
            <div class="flex flex-row gap-2">
              <XButton
                label="Ver"
                @click="verDetalle(data)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'

const showFilters = ref(false)
const showFiltersDestinatario = ref(false)
const date = ref(null)
const selectedBanks = ref<string[]>([])

const filters = ref({
  fechaHoraTransferencia: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  productoOrigen: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  bancoOrigen: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  productoDestino: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  bancoDestino: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  moneda: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  importe: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  tipoTransferencia: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  estado: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  detalles: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
})

const accion1 = () => alert("Botón Enviados presionado")
const accion2 = () => alert("Botón Recibidos presionado")
const accion3 = () => alert("Botón Ambos presionado")
const accion4 = () => alert("Botón Limpiar presionado")
const accion5 = () => alert("Botón Buscar presionado")

const bankOptions = [
  { label: 'Banco 1', value: 'b1' },
  { label: 'Banco 2', value: 'b2' },
  { label: 'Banco 3', value: 'b3' }
]

// Datos del breadcrumb (ejemplo)
const itemsBreadParameters = [
  { label: 'Inicio', url: '/' },
  { label: 'Transferencias', url: '/transferencias' },
  { label: 'Consulta' }
]

const transferencias = ref([
  {
    fechaHoraTransferencia: '2025-09-21 14:32',
    productoOrigen: 'Cuenta Corriente',
    bancoOrigen: 'Banco 1',
    productoDestino: 'Caja de Ahorro',
    bancoDestino: 'Banco 2',
    moneda: 'USD',
    importe: 1200.50,
    tipoTransferencia: 'Express',
    estado: 'Completado'
  },
  {
    fechaHoraTransferencia: '2025-09-20 09:10',
    productoOrigen: 'Caja de Ahorro',
    bancoOrigen: 'Banco 3',
    productoDestino: 'Cuenta Corriente',
    bancoDestino: 'Banco 1',
    moneda: 'EUR',
    importe: 500.00,
    tipoTransferencia: 'Asíncrono',
    estado: 'Pendiente'
  }
])

// ✅ FUNCIÓN CORREGIDA PARA NUXT
const verDetalle = async (row: any) => {
  console.log('Navegando a detalle con datos:', row)
  
  try {
    // Usar navigateTo (función global de Nuxt)
    await navigateTo({
      path: '/admin/reports/detalle-transferencia',
      query: { 
        banco: row.bancoOrigen,
        fecha: row.fechaHoraTransferencia,
        importe: row.importe.toString(),
        moneda: row.moneda
      }
    })
  } catch (error) {
    console.error('Error de navegación:', error)
    // Fallback con window.location
    const params = new URLSearchParams({
      banco: row.bancoOrigen,
      fecha: row.fechaHoraTransferencia,
      importe: row.importe.toString(),
      moneda: row.moneda
    })
    window.location.href = `/admin/reports/detalle-transferencia?${params.toString()}`
  }
}
</script>

<style>
/* Animación simple para desplegar */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>