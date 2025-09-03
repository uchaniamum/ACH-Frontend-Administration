<template>
    <div class="flex flex-col gap-20">
        <XHeader title="Gestión de horarios" :breadcrumb-items="itemsBreadSchedules" :show-breadcrumb="true">
            <template #description>
                <span>Gestiona horarios regulares y extraordinarios, asegúrate de configurarlos adecuadamente para garantizar la correcta continuidad operativa.</span>
            </template>
        </XHeader>
        <div class="flex flex-col gap-12">
            <div class="flex justify-end gap-4">
                Definiciones:  
                <div class="flex items-center gap-6">
                    <Icon name="x:arrow-bl" class="text-[#0293B0] text-[12px] font-semibold"/>
                    <span class="text-gray-700">Recibidas</span>
                </div> 

                <div class="flex items-center gap-6">
                    <Icon name="x:arrow-tr" class="text-magenta-500 text-[12px] font-semibold"/>
                    <span class="text-gray-700">Enviadas</span>
                </div> 
            </div>

            <div class="flex justify-between gap-4">
                <div class="self-center">
                    <XIconField>
                        <XInputText name="codigo" placeholder="Buscar" v-model="searchSchedules"/>
                        <XInputIcon icon="search"/>
                    </XIconField>
                </div>
            </div>

            <div class="flex flex-col">
                <div class="flex flex-col gap-12">
                    <DataTable
                        :value="paginatedSchedule" 
                        :loading="loading"
                        dataKey="code"
                        @page="onPageChange"
                        :filters="filtersSchedules"
                        :globalFilterFields="['acronym', 'code', 'description', 'transactionCodeDescription', 'startTime', 'endTime']"
                    >
                        <template #empty> 
                            <span class="flex justify-center">
                                {{ flatSchedules.length === 0 && searchSchedules.trim() ? 
                                    'No se encontraron horarios que coincidan con la búsqueda.' : 
                                    'No se encontraron horarios disponibles.' }}
                            </span> 
                        </template>
                        <template #loading> 
                            <span class="flex justify-center">Cargando datos de horarios. Por favor espere.</span> 
                        </template>

                        <Column field="acronym" header="Canal" sortable style="min-width: 100px;">
                            <template #body="{ data }">
                                {{ data.acronym }}
                            </template>
                        </Column>

                        <Column field="code" header="Código" sortable headerStyle="width: 120px;" bodyStyle="width: 120px;">
                            <template #body="{ data }">
                                {{ data.code }}
                            </template>
                        </Column>
                    
                        

                        <Column field="startTime" header="Hora Inicio" sortable style="min-width: 120px;">
                            <template #body="{ data }">
                                {{ data.startTime }}
                            </template>
                        </Column> 

                        <Column field="endTime" header="Hora Fin" sortable style="min-width: 120px;">
                            <template #body="{ data }">
                                {{ data.endTime }}
                            </template>
                        </Column>

                        <Column field="transactionCodeDescription" header="Descripción" sortable style="min-width: 200px;">
                            <template #body="{ data }">
                                {{ data.transactionCodeDescription }}
                            </template>
                        </Column>

                        <Column field="scheduleType" header="Tipo" sortable style="min-width: 100px;">
                            <template #body="{ data }">
                                {{ data.scheduleType }}
                            </template>
                        </Column>

                        <Column header="Acciones" class="min-w-[210px]">
                            <template #body="{ data }">
                                <div class="flex gap-4">
                                    <XButton 
                                        variant="outlined" 
                                        icon="clock"
                                        class="p-2"
                                        v-tooltip.top="{ value: 'Ver horario(s) extraordinario(s)', hideDelay: 300 }"
                                        @click="editSchedule(data)"
                                    />
                                    <XButton 
                                        variant="outlined" 
                                        icon="alarm"
                                        class="p-2"
                                        v-tooltip.top="{ value: 'Nuevo horario extraordinario', hideDelay: 300 }"
                                        @click="createScheduleModal()" 
                                    />
                                    <XButton 
                                        icon="edit-pencil"
                                        class="p-2"
                                        v-tooltip.top="{ value: 'Editar horario', hideDelay: 300 }"
                                        @click="editSchedule(data)"
                                    />
                                </div>
                            </template>
                        </Column>
                    </DataTable>

                    <Paginator 
                        v-if="flatSchedules.length > 0"
                        v-model:first="paginationSchedulesFirst"
                        v-model:rows="paginationSchedulesRows"
                        :totalRecords="filteredSchedule.length"
                        :rowsPerPageOptions="[10, 25, 50, 100]"
                    />
                </div>
            </div>
        </div>
        <SchedulesModal
            v-model="modalScheduleState.showModalSchedule"
            :mode="modalScheduleState.mode"
            :scheduleData="modalScheduleState.scheduleData"
            @submit="editSchedule"
        />
    </div>
</template>

<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core';
import SchedulesModal from '~/features/schedules/schedulesModal.vue';
import type { ScheduleResponseList, Schedule, SchudeleFormData, SchudeleDetailReponse } from '~/features/schedules/type';
import type { ModalMode, ServiceError } from '~/features/users/types';
import { scheduleService } from '~/services/scheduleService';

// Composables 
const toast = useToast()

const itemsBreadSchedules = ref([
    { label: 'Inicio', to: '/' },
    { label: 'Configuracion', to: '/admin/configuration' },
    { label: 'Horarios' }
])

// State - Cambio importante: ahora es Schedule[] directamente
const schedules = ref<ScheduleResponseList[]>([])
const loading = ref(false)
const searchSchedules = ref('')
const paginationSchedulesFirst = ref(0)
const paginationSchedulesRows = ref(10)

// State para la modal edicion
const modalScheduleState = ref<{
    showModalSchedule: boolean,
    mode: ModalMode,
    scheduleData?: SchudeleFormData,
}>({
    showModalSchedule: false,
    mode: 'create',
    scheduleData: undefined
})


// Filters
const filtersSchedules = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    acronym: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});

// Computed para aplanar todos los horarios
const flatSchedules = computed(() => {
    
    if (!schedules.value || schedules.value.length === 0) {
        return [];
    }

    // Aplanar todos los paymentTransactionSchedule en un solo array
    const allSchedules: Schedule[] = [];
    
    schedules.value.forEach((scheduleGroup, index) => {        
        if (scheduleGroup && scheduleGroup.paymentTransactionSchedule) {
            if (Array.isArray(scheduleGroup.paymentTransactionSchedule)) {
                allSchedules.push(...scheduleGroup.paymentTransactionSchedule);
            }
        } else {
            console.log(`Group ${index} has no paymentTransactionSchedule or is invalid`);
        }
    });
    
    return allSchedules;
});

// Filtrado actualizado - ahora trabaja con Schedule[] aplanado
const filteredSchedule = computed(() => {
    if (!flatSchedules.value || flatSchedules.value.length === 0) {
        return [];
    }

    const searchTerm = searchSchedules.value.toLowerCase().trim();
    
    return flatSchedules.value.filter(schedule => {
        // Si no hay término de búsqueda, mostrar todos
        if (searchTerm === '') {
            return true;
        }

        // Buscar en todos los campos relevantes de Schedule
        const matchesSearch = 
            schedule.acronym?.toLowerCase().includes(searchTerm) ||
            schedule.code?.toLowerCase().includes(searchTerm) ||
            schedule.description?.toLowerCase().includes(searchTerm) ||
            schedule.transactionCodeDescription?.toLowerCase().includes(searchTerm) ||
            schedule.scheduleType?.toLowerCase().includes(searchTerm) ||
            schedule.startTime?.toLowerCase().includes(searchTerm) ||
            schedule.endTime?.toLowerCase().includes(searchTerm);

        return matchesSearch;
    });
});

const paginatedSchedule = computed(() => {
    const start = paginationSchedulesFirst.value;
    const end = start + paginationSchedulesRows.value;
    return filteredSchedule.value.slice(start, end);
});

const onPageChange = (event: any) => {
    paginationSchedulesFirst.value = event.first;
    paginationSchedulesRows.value = event.rows;
}

const loadSchedule = async (): Promise<void> => {
    loading.value = true
    try {
        const response = await scheduleService.getSchedule()
        if (response) {
            // Verificar diferentes estructuras posibles de la respuesta
            if (Array.isArray(response)) {
                // Si response es directamente un array de ScheduleResponseList
                schedules.value = response
            } else if (response.data && Array.isArray(response.data)) {
                // Si response tiene una propiedad data que es el array
                schedules.value = response.data
            } else if (response.paymentTransactionSchedule && Array.isArray(response.paymentTransactionSchedule)) {
                // Si response tiene directamente paymentTransactionSchedule
                schedules.value = [response]
            } else {
                console.warn('Estructura de respuesta no reconocida:', response);
                schedules.value = [];
            }
        } else {
            console.warn('No se recibieron datos de horarios');
            schedules.value = [];
        }
        //loadDays(schedules.value);
    } catch (error) {
        console.error('Error loading schedules:', error)
        const serviceError = error as ServiceError
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: serviceError.message || 'Error al cargar los horarios',
            life: 5000
        })
        schedules.value = [];
    } finally {
        loading.value = false
    }
}

const createScheduleModal = (): void => {
    modalScheduleState.value = {
        showModalSchedule: true,
        mode: 'create',
        scheduleData: undefined
    }
}

// Funciones para las acciones - Cambio importante: ahora recibe Schedule
const editSchedule = (schedule: Schedule) => {
    console.log('Editar horario extraordinario para:', schedule);
    
    modalScheduleState.value = {
        showModalSchedule: true,
        mode: 'edit',
        scheduleData: {
            paymentGatewayCode: schedule.code || '',
            transactionCode: schedule.transactionCode || '',
            scheduleEffectiveDate: '', // CORREGIDO: era scheduleEfectiveDate
            startTime: schedule.startTime || '',
            endTime: schedule.endTime || '',
            changeReason: '',
            base64JustificationFile: ''
        }
    };
}


const viewHistory = (schedule: Schedule) => {
    console.log('Ver historial de horario:', schedule);
    // Implementar lógica para ver historial
}

// Lifecycle
onMounted(() => {
    loadSchedule()
})


watch(filteredSchedule, (newVal) => {
    console.log('Filtered schedules count:', newVal.length);
})

watch(flatSchedules, (newVal) => {
    console.log('Flat schedules updated:', newVal);
})
</script>