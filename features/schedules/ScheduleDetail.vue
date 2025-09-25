<template>
    <XDialog 
        v-model:visible="modalScheduleDetail" 
        modal
        header="Ver horario(s) extraordinario(s)"
        :style="{ width: '720px !important' }" 
    > 
        <div>
            <div v-if="loading || loadingDetails" class="flex justify-center items-center py-8">
                <div class="flex flex-col items-center gap-4">
                    <Icon name="x:loader" class="animate-spin text-2xl text-primary-500" />
                    <span class="text-gray-600">Cargando detalles del horario...</span>
                </div>
            </div>

            <div v-else class="flex flex-col gap-12">
                <div class="flex flex-col gap-2">
                    <div class="flex gap-4">
                        <span class="font-semibold text-gray-700">Canal:</span>
                        <span>{{ schedulesDetails?.acronym || 'No disponible' }}</span>
                    </div>
                    <div class="flex gap-4">
                        <span class="font-semibold text-gray-700">Transacción:</span>
                        <span>{{ schedulesDetails?.transactionCodeDescription || schedulesDetails?.description || 'No disponible' }}</span>
                    </div>
                </div>
                <!-- Horarios extraordinarios/excepciones -->
                    <div v-if="activeScheduleExceptions && activeScheduleExceptions.length > 0">
                        <div v-for="(exception, index) in activeScheduleExceptions" 
                                :key="exception.code + index">
                                <XAccordion value="0">
                                    <XAccordionPanel value="0">
                                        <XAccordionHeader>Horario Extraordinario {{ index+1 }}</XAccordionHeader>
                                        <XAccordionContent>
                                            <div class="flex flex-col gap-12">
                                                <div class="flex flex-col gap-2">
                                                    <div class="flex gap-4">
                                                        <span class="font-semibold text-gray-700">Fecha:</span>
                                                        <span>{{ formatDate(exception.effectiveOn) }}</span>
                                                    </div>
                                                    <div class="flex gap-4">
                                                        <span class="font-semibold text-gray-700">Hora inicio:</span>
                                                        <span>{{ formatTime(exception.startTime) }}</span>
                                                    </div>
                                                    <div class="flex gap-4">
                                                        <span class="font-semibold text-gray-700">Hora fin:</span>
                                                        <span>{{ formatTime(exception.endTime) }}</span>
                                                    </div>
                                                    <div class="flex gap-4">
                                                        <span class="font-semibold text-gray-700">Justificación:</span>
                                                        <span>{{ exception.description || 'Sin justificación' }}</span>
                                                    </div>
                                                </div>
                                                <div class="flex justify-end gap-4">
                                                    <XButton 
                                                        label="Eliminar" 
                                                        variant="text" 
                                                        class="!w-[150px]" 
                                                        @click="handleDelete(exception, index)"
                                                        :disabled="loading"
                                                    />
                                                    <XButton 
                                                        label="Editar"
                                                        class="!w-[150px]"
                                                        variant="outlined"
                                                        @click="handleEditSchuleException(exception, index)"
                                                        :loading="loading"
                                                    />
                                                </div>
                                            </div>
                                        </XAccordionContent>
                                    </XAccordionPanel>
                                </XAccordion>
                        </div>
                </div>

                <div v-else>
                    <div class="flex flex-col gap-4">
                        <div class="flex gap-4">
                            <span class="font-semibold text-gray-700">Código:</span>
                            <span>{{ schedulesDetails?.code || 'No disponible' }}</span>
                        </div>
                        <div class="flex gap-4">
                            <span class="font-semibold text-gray-700">Tipo:</span>
                            <span>{{ schedulesDetails?.scheduleType || 'No disponible' }}</span>
                        </div>
                        <div class="flex gap-4">
                            <span class="font-semibold text-gray-700">Hora de inicio:</span>
                            <span>{{ formatTime(schedulesDetails?.startTime) || 'No disponible' }}</span>
                        </div>
                        <div class="flex gap-4">
                            <span class="font-semibold text-gray-700">Hora de fin:</span>
                            <span>{{ formatTime(schedulesDetails?.endTime) || 'No disponible' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </XDialog>
    <ConfirmDialogWrapper
        v-model="confirmDialogInActiveSchedule.visible"
        :options="confirmDialogInActiveSchedule.options"
    />
</template>

<script setup lang="ts">
import type { ScheduleDetailReponse, ScheduleExceptions, ScheduleFormData, ScheduleInActiveException } from './type';
import { useScheduleModalDetail } from '~/componsables/schedule/useScheduleDetalle';
import ConfirmDialogWrapper from '~/components/overlay/ConfirmDialogWrapper.vue';
import { scheduleService } from '~/services/scheduleService';
import { useDates } from '~/componsables/useDates';

const toast = useToast()
const { formatDate, formatTime } = useDates();

interface Props {
    modelValue: boolean
    scheduleData?: ScheduleDetailReponse
}

interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'editException', data: { exception: ScheduleFormData, index: number }): void
    (e: 'delete', data: { exception: ScheduleFormData, index: number }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
    modalScheduleDetail,
    loading,
    schedulesDetails,
    closeModal,
    loadScheduleData,
    resetData
} = useScheduleModalDetail();

const loadingDetails = ref(false)

// State para el modal de confirmación
const confirmDialogInActiveSchedule = ref({
    visible: false,
    options: {
        title: '',
        message: '',
        onConfirm: () => {}
    }
})

// Datos para la eliminación (incluyendo index)
const deleteFormData = ref<{
    scheduleData: ScheduleInActiveException,
    index: number
} | null>(null)

const activeScheduleExceptions = computed(() => {
    if (!schedulesDetails.value?.scheduleExceptions) return [];
    
    return schedulesDetails.value.scheduleExceptions.filter(exception => {
        const isActive = exception.isActive !== undefined ? exception.isActive : 
                        exception.active !== undefined ? exception.active :
                        exception.status === 'active' ||
                        exception.status === 'ACTIVE' ||
                        true;
        return isActive;
    });
});

const openConfirmModalDelete = (scheduleInActive: ScheduleInActiveException, index: number): void => {
    deleteFormData.value = {
        scheduleData: scheduleInActive,
        index
    }

    confirmDialogInActiveSchedule.value = {
        visible: true,
        options: {
            title:'Eliminar horario extraordinario',
            icon: 'x:warning-circle',
            iconColor: 'text-yellow-500',
            message: '¿Estás seguro de eliminar el horario extraordinario? Ten en cuenta que esta acción es irreversible.',
            onConfirm: async () => {
                await confirmDelete();
            }
        }
    };
}

// Watch para sincronizar con el prop modelValue
watch(() => props.modelValue, async (newValue) => {
    if (newValue) {
        modalScheduleDetail.value = true
        
        if (props.scheduleData?.transactionCode) {
            await loadFullScheduleDetails(props.scheduleData.transactionCode)
        } else if (props.scheduleData) {
            loadScheduleData(props.scheduleData)
        } else {
            resetData()
        }
    } else {
        closeModal()
    }
}) 

// Watch para emitir cambios del modal al padre
watch(modalScheduleDetail, (newValue) => {
    emit('update:modelValue', newValue)
})

const loadFullScheduleDetails = async (code: string): Promise<void> => {
    loadingDetails.value = true
    try {
        const scheduleDetail = await scheduleService.getScheduleByCode(code)
        
        console.log('Respuesta completa del API:', scheduleDetail);
        
        if (scheduleDetail) {
            schedulesDetails.value = {
                transactionCode: scheduleDetail.transactionCode || '',
                code: scheduleDetail.code || '',
                acronym: scheduleDetail.acronym || '',
                transactionCodeDescription: scheduleDetail.transactionCodeDescription || '',
                scheduleWeek: {
                    isMondayAvailable: scheduleDetail.scheduleWeek?.isMondayAvailable || false,
                    isTuesdayAvailable: scheduleDetail.scheduleWeek?.isTuesdayAvailable || false,
                    isWednesdayAvailable: scheduleDetail.scheduleWeek?.isWednesdayAvailable || false,
                    isThursdayAvailable: scheduleDetail.scheduleWeek?.isThursdayAvailable || false,
                    isFridayAvailable: scheduleDetail.scheduleWeek?.isFridayAvailable || false,
                    isSaturdayAvailable: scheduleDetail.scheduleWeek?.isSaturdayAvailable || false,
                    isSundayAvailable: scheduleDetail.scheduleWeek?.isSundayAvailable || false,
                },
                startTime: scheduleDetail.startTime || '',
                endTime: scheduleDetail.endTime || '',
                description: scheduleDetail.description || '',
                scheduleType: scheduleDetail.scheduleType || '',
                scheduleExceptions: scheduleDetail.scheduleExceptions || []
            }
            
            // Debug específico para scheduleExceptions
            console.log('scheduleExceptions encontradas:', scheduleDetail.scheduleExceptions);
            if (scheduleDetail.scheduleExceptions && scheduleDetail.scheduleExceptions.length > 0) {
                scheduleDetail.scheduleExceptions.forEach((exception, index) => {
                    console.log(`Exception ${index}:`, exception);
                    console.log(`Exception ${index} keys:`, Object.keys(exception));
                    console.log(`Exception ${index} isActive:`, exception.isActive);
                });
            }
        }
    } catch (error) {
        console.error('Error cargando detalle del horario:', error)
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al cargar el detalle del horario',
            life: 5000
        })
    } finally {
        loadingDetails.value = false
    }
}


const handleEditSchuleException = (exception: ScheduleExceptions, index: number) => {
    console.log('Editando excepción:', exception, 'Índice:', index);
    console.log('Detalles completos del schedule:', schedulesDetails.value);
    console.log('exception.isActive:', exception.isActive);
    console.log('Propiedades de exception:', Object.keys(exception));

    const scheduleExceptionData = {
        code: schedulesDetails.value?.code,
        transactionCode: schedulesDetails.value?.transactionCode,
        acronym: schedulesDetails.value?.acronym,
        transactionCodeDescription: schedulesDetails.value?.transactionCodeDescription,
        scheduleEffectiveDate: exception.effectiveOn,
        startTime: exception.startTime,
        endTime: exception.endTime,
        changeReason: exception.description,
        // Asegurar que isActive tenga un valor
        isActive: exception.isActive !== undefined ? exception.isActive : true
    }
    
    console.log('Datos enviados para editar (con isActive verificado):', scheduleExceptionData);

    emit('editException', {
        exception: scheduleExceptionData,
        index: index
    })
    closeModal()
}

const handleDelete = async (exception: ScheduleExceptions, index: number) => {
    console.log('Eliminando excepción:', exception, 'Índice:', index);
    console.log('exception.isActive:', exception.isActive);
    console.log('Propiedades de exception:', Object.keys(exception));
    
    // Verificar todas las propiedades relacionadas con "active"
    const possibleActiveFields = Object.keys(exception).filter(key => 
        key.toLowerCase().includes('active') || 
        key.toLowerCase().includes('enabled') ||
        key.toLowerCase().includes('status')
    );
    console.log('Campos relacionados con active/status:', possibleActiveFields);
    
    const scheduleExceptionData: ScheduleInActiveException = {
        paymentGatewayCode: schedulesDetails.value?.code || '',
        transactionCode: schedulesDetails.value?.transactionCode || '',
        scheduleEfectiveDate: exception.effectiveOn || '',
        isActive: false,
    }
    
    console.log('Datos para eliminar con index:', { data: scheduleExceptionData, index });
    openConfirmModalDelete(scheduleExceptionData, index);
}

const confirmDelete = async (): Promise<void> => {
    if (!deleteFormData.value) return
    
    loading.value = true
    try {
        console.log('Eliminando horario con datos:', deleteFormData.value.scheduleData);
        console.log('Índice del elemento:', deleteFormData.value.index);
        console.log('isActive para eliminar:', deleteFormData.value.scheduleData.isActive);
        
        const result = await scheduleService.inActivScheduleException(deleteFormData.value.scheduleData)
        console.log('Resultado de eliminación:', result);
        
        if(result){
            toast.add({
                severity: 'success',
                summary: 'Horario extraordinario eliminado',
                life: 5000
            })
        }
        
    } catch (error) {
        console.error('Error eliminando horario:', error)
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar el horario extraordinario',
            life: 5000
        })
    } finally {
        loading.value = false
        deleteFormData.value = null
    }
}

</script>