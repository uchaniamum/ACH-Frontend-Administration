<template>
    <div class="flex flex-col gap-20">
        <XHeader title="Gestión de horarios" :breadcrumb-items="itemsBreadSchedules" :show-breadcrumb="true" :show-back="true">
            <template #description>
                <span>Gestiona horarios regulares y extraordinarios, asegúrate de configurarlos adecuadamente para garantizar la correcta continuidad operativa.</span>
            </template>
        </XHeader>
        <div class="flex flex-col gap-12">
            <div class="flex justify-end gap-4">
                Definiciones:  
                <div class="flex items-center gap-6">
                    <Icon name="x:arrow-bl" class="text-orange-500 text-[12px] font-semibold"/>
                    <span class="text-gray-700">Recibidas</span>
                </div> 

                <div class="flex items-center gap-6">
                    <Icon name="x:arrow-tr" class="text-sky-500 text-[12px] font-semibold"/>
                    <span class="text-gray-700">Enviadas</span>
                </div> 
            </div>

            <div class="flex justify-between gap-4">
                <div class="flex items-center gap-4">
                    <div class="self-center">
                        <XIconField>
                            <XInputText name="codigo" placeholder="Buscar" v-model="searchSchedules"/>
                            <XInputIcon icon="search"/>
                        </XIconField>
                    </div>
                    <!-- Botón para limpiar filtros (opcional) -->
                    <XButton 
                        v-if="searchSchedules.trim() || selectedChannel !== 'todos'"
                        variant="outlined" 
                        icon="filter-x"
                        class="p-2"
                        v-tooltip.top="{ value: 'Limpiar filtros', hideDelay: 300 }"
                        @click="clearFilters"
                    />
                </div>
                <div class="self-center">
                    <SelectButton 
                        v-model="selectedChannel" 
                        :options="channelOptions" 
                        optionLabel="label" 
                        optionValue="value"
                        dataKey="value" 
                        aria-labelledby="custom"
                        :pt="{
                            root: { class: 'bg-white gap-6' },
                        }"
                    >
                        <template #option="slotProps">
                            <div class="flex items-center justify-center max-w-70 w-50">
                                <span class="font-medium">{{ slotProps.option.label }}</span>
                            </div>
                        </template>
                    </SelectButton>
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
                                {{ filteredSchedule.length === 0 && (searchSchedules.trim() || selectedChannel !== 'todos') ? 
                                    'No se encontraron horarios que coincidan con los filtros aplicados.' : 
                                    'No se encontraron horarios disponibles.' }}
                            </span> 
                        </template>
                        <template #loading> 
                            <span class="flex justify-center">Cargando datos de horarios. Por favor espere.</span> 
                        </template>

                        <Column field="acronym" header="Canal" sortable  class="text-left">
                            <template #body="{ data }">
                                {{ data.acronym }}
                            </template> 
                        </Column>

                        <Column field="isInbound" header="Transacción" sortable  class="text-left">
                            <template #body="{ data }">
                                <span v-if="data.isInbound" class="flex gap-6">
                                    <Icon name="x:arrow-tr" class="text-sky-500 text-[12px] font-bold"/>
                                    <span class="text-gray-700">{{ data.description }}</span>
                                </span>
                                <span v-else class="flex gap-6">
                                    <Icon name="x:arrow-bl" class="text-orange-500 text-[12px] font-semibold"/>
                                    <span class="text-gray-700">{{ data.description }}</span>
                                </span>
                            </template>
                        </Column>
                    
                        <Column field="scheduleWeek" header="Día" style="min-width: 160px;" class="text-left">
                            <template #body="{ data }">
                                {{ formatScheduleWeek(data.scheduleWeek) }}
                            </template>
                        </Column>

                        <Column field="startTime" header="Hora Inicio" sortable class="text-left">
                            <template #body="{ data }">
                                {{ data.startTime }}
                            </template>
                        </Column> 

                        <Column field="endTime" header="Hora Fin" sortable class="text-left">
                            <template #body="{ data }">
                                {{ data.endTime }}
                            </template>
                        </Column>

                        <Column field="transactionCodeDescription" header="Detalle" sortable style="min-width: 190px;" class="text-left">
                            <template #body="{ data }">
                                {{ data.transactionCodeDescription }}
                            </template>
                        </Column>

                        <Column field="exceptionCounter" header="Horario extraordinario" sortable  style="min-width: 157px;" class="text-left">
                            <template #body="{ data }">
                                <span v-if="data.exceptionCounter > 0" class="flex gap-6">
                                    <XTag severity="magenta" :value="`(${data.exceptionCounter}) Programado`" />
                                </span>
                                <span v-else>
                                    <XTag severity="neutral" value="No programado"/>
                                </span>
                            </template>
                        </Column>

                        <Column header="Acciones" class="text-left">
                            <template #body="{ data }">
                                <div class="flex justify-end gap-4">
                                    <XButton v-if="data.exceptionCounter > 0"
                                        variant="outlined" 
                                        icon="clock"
                                        class="p-2"
                                        v-tooltip.top="{ value: 'Ver horario(s) extraordinario(s)', hideDelay: 300 }"
                                        @click="viewExtraordinarySchedule(data)"
                                    />
                                    <XButton 
                                        variant="outlined" 
                                        icon="alarm"
                                        class="p-2"
                                        v-tooltip.top="{ value: 'Nuevo horario extraordinario', hideDelay: 300 }"
                                        @click="createScheduleModal(data)" 
                                    />
                                    <XButton 
                                        icon="edit-pencil"
                                        class="p-2"
                                        v-tooltip.top="{ value: 'Editar horario', hideDelay: 300 }"
                                        @click="editScheduleRegularModal(data)"
                                    />
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                    <div class="flex justify-center">
                        <Paginator 
                            v-if="filteredSchedule.length > 0"
                            v-model:first="paginationSchedulesFirst"
                            v-model:rows="paginationSchedulesRows"
                            :totalRecords="filteredSchedule.length"
                            :rowsPerPageOptions="[10, 25, 50, 100]"
                            template="RowsPerPageDropdown  FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        >
                            <template #start="slotProps">
                                Página: {{ slotProps.state.page + 1 }}, Filas: 
                            </template>
                        </Paginator>
                    </div>
                    
                </div>
            </div>
        </div>
        
        <!-- Modales -->
        <SchedulesModal
            v-model="modalScheduleState.showModalSchedule"
            :mode="modalScheduleState.mode"
            :scheduleData="modalScheduleState.scheduleData"
            @submit="editSchedule"
            @success="handleToastSuccess"
            @error="handleToastError"
        />

        <ScheduleRegularModal
            v-model="modalScheduleRegularState.showModalScheduleRegular"
            :scheduleRegularData="modalScheduleRegularState.scheduleRegularData"
            @submit="handleRegularScheduleSubmit"
        />

        <ScheduleDetail
            v-model="modalScheduleDetailState.showModalScheduleDetail"
            :scheduleData="modalScheduleDetailState.scheduleData"
            @submit="handleRegularScheduleSubmit"
            @editException="editSchedule"
        />

        <!-- Toast movido aquí para que prevalezca -->
        <Toast position="top-right">
            <template #message="{ message }">
                <Icon 
                    :name="message.severity === 'success' ? 'x:check-circle' : 'x:alert-circle'" 
                    class="p-toast-message-icon"
                />
                <div class="p-toast-message-text">
                    <span class="p-toast-summary">{{ message.summary }}</span>
                    <span class="p-toast-detail">{{ message.detail }}</span>
                </div>
            </template>
        </Toast>
    </div>
</template>

<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core';
import ScheduleDetail from '~/features/schedules/ScheduleDetail.vue';
import ScheduleRegularModal from '~/features/schedules/ScheduleRegularModal.vue';
import SchedulesModal from '~/features/schedules/SchedulesModal.vue';
import type { ScheduleResponseList, Schedule, ScheduleFormData, ScheduleWeek } from '~/features/schedules/type';
import type { ModalMode, ServiceError } from '~/features/users/types';
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';
import { scheduleService } from '~/services/scheduleService';

// Composables 
const toast = useToast()

const itemsBreadSchedules = getBreadcrumbItems('schedule', 'list');

// State - Cambio importante: ahora es Schedule[] directamente
const schedules = ref<ScheduleResponseList[]>([])
const loading = ref(false)
const searchSchedules = ref('')
const paginationSchedulesFirst = ref(0)
const paginationSchedulesRows = ref(10)

// State para el filtro por canal - inicializa con 'todos' por defecto
const selectedChannel = ref<string>('todos')

// State para la modal edicion
const modalScheduleState = ref<{
    showModalSchedule: boolean,
    mode: ModalMode,
    scheduleData?: ScheduleFormData,
}>({
    showModalSchedule: false,
    mode: 'create',
    scheduleData: undefined
})

// State para la modal de horarios regulares
const modalScheduleRegularState = ref<{
    showModalScheduleRegular: boolean,
    scheduleRegularData?: Schedule,
}>({
    showModalScheduleRegular: false,
    scheduleRegularData: undefined
})

// State para la modal de detalle
const modalScheduleDetailState = ref<{
    showModalScheduleDetail: boolean,
    scheduleData?: Schedule,
}>({
    showModalScheduleDetail: false,
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

// Computed para las opciones del canal basado en los datos actuales
const channelOptions = computed(() => {
    // Siempre incluir "Todos" como primera opción
    const baseOptions = [{ label: 'Todos', value: 'todos' }];
    
    if (!flatSchedules.value || flatSchedules.value.length === 0) {
        return baseOptions;
    }

    // Obtener todos los canales únicos
    const uniqueChannels = [...new Set(
        flatSchedules.value
            .map(schedule => schedule.acronym)
            .filter(acronym => acronym && acronym.trim() !== '')
    )].sort();

    // Crear las opciones finales
    const options = [
        ...baseOptions,
        ...uniqueChannels.map(channel => ({
            label: channel,
            value: channel
        }))
    ];

    console.log('Channel options generated:', options);
    return options;
});

// Filtrado actualizado - ahora incluye filtro por canal
const filteredSchedule = computed(() => {
    console.log('Filtering with selectedChannel:', selectedChannel.value);
    console.log('flatSchedules length:', flatSchedules.value.length);
    
    if (!flatSchedules.value || flatSchedules.value.length === 0) {
        return [];
    }

    const searchTerm = searchSchedules.value.toLowerCase().trim();
    
    const filtered = flatSchedules.value.filter(schedule => {
        // Filtro por canal - 'todos' o valor vacío muestra todos los registros
        if (selectedChannel.value && selectedChannel.value !== 'todos') {
            if (schedule.acronym !== selectedChannel.value) {
                return false;
            }
        }

        // Filtro por búsqueda de texto
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
    
    console.log('Filtered results:', filtered.length);
    return filtered;
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

const formatScheduleWeek = (scheduleWeek: ScheduleWeek) => {
    const daysMap: Record<keyof ScheduleWeek, string> = {
        isMondayAvailable: 'Lu',
        isTuesdayAvailable: 'Ma',
        isWednesdayAvailable: 'Mi',
        isThursdayAvailable: 'Ju',
        isFridayAvailable: 'Vi',
        isSaturdayAvailable: 'Sa',
        isSundayAvailable: 'Do'
    }
    return Object.entries(daysMap)
    .filter(([key]) => scheduleWeek[key as keyof ScheduleWeek])
    .map(([_, label]) => label)
    .join(' / ')
}

const createScheduleModal = (schedule: Schedule): void => {
    const formDataCreate = {
        code: schedule.code || '',
        acronym: schedule.acronym || '',
        transactionCode: schedule.transactionCode || '',
        transactionCodeDescription: schedule.description || schedule.description || '',
    }
    modalScheduleState.value = {
        showModalSchedule: true,
        mode: 'create',
        scheduleData: formDataCreate
    }
}

// Funciones para las acciones - Cambio importante: ahora recibe Schedule
const editSchedule = (data: { exception: any, index: number }) => {
    console.log('Editando excepción desde padre:', data.exception, 'Índice:', data.index);

    const formData = {
        acronym: data.exception.acronym || '',
        transactionCode: data.exception.transactionCode || '', // ← Corregido: transactionCode (no transacctionCode)
        transactionCodeDescription: data.exception.transactionCodeDescription || '',
        scheduleEffectiveDate: data.exception.scheduleEffectiveDate ? 
            new Date(data.exception.scheduleEffectiveDate).toISOString().split('T')[0] : '',
        startTime: data.exception.startTime || '',
        endTime: data.exception.endTime || '',
        changeReason: data.exception.changeReason || data.exception.description || '',
        base64JustificationFile: '',
        code: data.exception.code || '', // ← Usar code (no codeException)
        isActive: data.exception.isActive || false
    };

    console.log('Datos para el modal de edición:', formData);

    modalScheduleState.value = {
        showModalSchedule: true,
        mode: 'edit',
        scheduleData: formData
    }
}

const editScheduleRegularModal = (schedule: Schedule): void => {
    modalScheduleRegularState.value = {
        showModalScheduleRegular: true,
        scheduleRegularData: schedule
    }
}

const viewExtraordinarySchedule = (schedule: Schedule) => {
    console.log('Ver detalle de horario extraordinario:', schedule);
    
    modalScheduleDetailState.value = {
        showModalScheduleDetail: true,
        scheduleData: schedule
    };
}

const handleRegularScheduleSubmit = (schedule: Schedule) => {
    console.log('Editar horario Regular para:' , schedule);
    
    modalScheduleRegularState.value = {
        showModalScheduleRegular: true,
        scheduleRegularData: {
            paymentGatewayCode: schedule.code || '',
            transactionCode: schedule.transactionCode || '',
            scheduleEffectiveDate: '',
            startTime: schedule.startTime || '',
            endTime: schedule.endTime || '',
            changeReason: '',
            base64JustificationFile: ''
        }
    };
    loadSchedule()
}

// Funciones para manejar los toasts
const handleToastSuccess = (message: { summary: string, detail: string }) => {
    toast.add({
        severity: 'success',
        summary: message.summary,
        detail: message.detail,
        life: 5000
    })
    // Recargar los datos después de una operación exitosa
    loadSchedule()
}

const handleToastError = (message: { summary: string, detail: string }) => {
    toast.add({
        severity: 'error',
        summary: message.summary,
        detail: message.detail,
        life: 5000
    })
}

// Función para limpiar filtros
const clearFilters = () => {
    selectedChannel.value = 'todos';
    searchSchedules.value = '';
    paginationSchedulesFirst.value = 0;
}

// Lifecycle
onMounted(async () => {
    await loadSchedule()
})

</script>

