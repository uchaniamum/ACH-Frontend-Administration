<template>
    <XDialog 
        v-model:visible="modalScheduleRegular" 
        modal
        :closable="false"
        header="Editar horario regular"
        :style="{ width: '920px !important' }" 
    > 
        <ScheduleRegularForm
            :scheduleData="schedulesDetails"
            :loading="loading || loadingDetails"
            @submit="handleSubmit"
            @cancel="handleCancel"
        />
    </XDialog>
    
    <Toast position="top-right">
        <template #message="{ message }">
            <Icon 
                name="x:check-circle" 
                class="p-toast-message-icon"
            />
            <div class="p-toast-message-text">
                <span class="p-toast-summary">{{ message.summary }}</span>
                <span class="p-toast-detail">{{ message.detail }}</span>
            </div>
        </template>
    </Toast>
    
    <XConfirmDialog
        v-model="showInfoDialog"
        icon="x:check-circle"
        icon-color="text-green-500"
        :closable="false"
        title="Horario actualizado">
        <template #message>
            <div class="space-y-2">
                <p>
                    <span class="font-medium text-gray-700">El horario regular ha sido actualizado correctamente.</span>
                </p>
            </div>
        </template>
        <template #buttons>
            <div class="flex gap-3">
                <XButton 
                    label="Confirmar" 
                    @click="handleConfirm"
                />
            </div>
        </template> 
    </XConfirmDialog>
</template>

<script setup lang="ts">
import type { Schedule, ScheduleFormRegular } from './type';
import { scheduleService } from '~/services/scheduleService';
import ScheduleRegularForm from './ScheduleRegularForm.vue';
import { useScheduleModalRegular } from '~/componsables/schedule/useScheduleRegular';

interface Props {
    modelValue: boolean
    scheduleRegularData?: Schedule
}

interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'submit', scheduleRegularData: ScheduleFormRegular): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Composables
const toast = useToast()

// Variable para controlar el modal de confirmación
const showInfoDialog = ref(false)

const {
    modalScheduleRegular,
    loading,
    schedulesDetails,
    closeModal,
    loadScheduleData,
    resetForm
} = useScheduleModalRegular();

const loadingDetails = ref(false)

// Watch para sincronizar con el prop modelValue
watch(() => props.modelValue, async (newValue) => {
    if (newValue) {
        modalScheduleRegular.value = true
        
        if (props.scheduleRegularData?.transactionCode) {
            // Cargar detalles completos desde la API
            await loadFullScheduleDetails(props.scheduleRegularData.transactionCode)
        } else if (props.scheduleRegularData) {
            // Usar datos proporcionados directamente
            loadScheduleData(props.scheduleRegularData)
        } else {
            // Resetear formulario si no hay datos
            resetForm()
        }
    } else {
        closeModal()
    }
}) 

// Watch para emitir cambios del modal al padre
watch(modalScheduleRegular, (newValue) => {
    emit('update:modelValue', newValue)
})

const loadFullScheduleDetails = async (code: string): Promise<void> => {
    loadingDetails.value = true
    try {
        const scheduleDetailRegular = await scheduleService.getScheduleByCode(code)
        console.log('Datos cargados desde API:', scheduleDetailRegular);
        
        if (scheduleDetailRegular) {
            // Asegurarse de que los datos se mapeen correctamente
            schedulesDetails.value = {
                transactionCode: scheduleDetailRegular.transactionCode || '',
                code: scheduleDetailRegular.code || '',
                acronym: scheduleDetailRegular.acronym || '',
                transactionCodeDescription: scheduleDetailRegular.transactionCodeDescription || '',
                scheduleWeek: scheduleDetailRegular.scheduleWeek || {
                    isMondayAvailable: false,
                    isTuesdayAvailable: false,
                    isWednesdayAvailable: false,
                    isThursdayAvailable: false,
                    isFridayAvailable: false,
                    isSaturdayAvailable: false,
                    isSundayAvailable: false,
                },
                startTime: scheduleDetailRegular.startTime || '',
                endTime: scheduleDetailRegular.endTime || '',
                description: scheduleDetailRegular.description || '',
                scheduleType: scheduleDetailRegular.scheduleType || '',
            }
            
            console.log('Datos mapeados para el form:', schedulesDetails.value);
        }
    } catch (error) {
        console.error('Error cargando detalles del horario:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los detalles del horario',
            life: 5000
        })
    } finally {
        loadingDetails.value = false
    }
}

const handleSubmit = async (formData: ScheduleFormRegular): Promise<void> => {
    loading.value = true
    try {
        console.log('Datos del formulario regular recibidos en modal:', formData);

        const result = await scheduleService.editScheduleRegular(formData)
        console.log(result);
        // Emitir al componente padre
        if(result){
            emit('submit', formData)
            modalScheduleRegular.value = false
            toast.add({
                severity: 'success',
                summary: 'Edición exitosa',
                detail: 'Los cambios en el horario de la transacción se guardaron con éxito.',
                life: 5000
            })
        }
        
    } catch (error) {
        console.error('Error guardando horario regular:', error)
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el horario regular',
            life: 5000
        })
    } finally {
        loading.value = false
    }
}

const handleCancel = (): void => {
    closeModal()
}

const handleConfirm = (): void => {
        // Cerrar completamente el modal
    handleCancel()
    
    

}
</script>


