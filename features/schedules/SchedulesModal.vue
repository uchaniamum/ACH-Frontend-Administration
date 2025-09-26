<template>
    <XDialog 
        v-model:visible="modalSchedule" 
        modal
        :closable="false"
        :header="modalTitle"
        :style="{ width: '920px !important' }" 
    > 
        <SchedulesExForm
        :key="formKey"
        :scheduleData="props.scheduleData"
        :isEdi="isEditMode"
        :loading="loading || loadingDetails"
        @submit="handleSubmitExtraordinary"
        @cancel="handleCancel"
        />
    </XDialog>
    
    <ConfirmDialogWrapper
        v-model="confirmDialogSchedules.visible"
        :options="confirmDialogSchedules.options"
    />

</template>

<script setup lang="ts">

import { useScheduleModal } from '~/componsables/schedule/useSchedules';
import type { ModalMode } from '../users/types';
import SchedulesExForm from './SchedulesExForm.vue';
import type { ScheduleExceptionRequest, ScheduleFormData } from './type';
import ConfirmDialogWrapper from '~/components/overlay/ConfirmDialogWrapper.vue';
import { scheduleService } from '~/services/scheduleService';
import { useDates } from '~/componsables/useDates';

// Composables 
// toast removido de aquí
const formKey = ref(0)
const { formatDate } = useDates();

interface Props {
    modelValue: boolean
    scheduleData?: ScheduleFormData
    mode?: ModalMode
}

interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'save', scheduleData: any ): void 
    (e: 'success', message: { summary: string, detail: string }): void // Nuevo evento
    (e: 'error', message: { summary: string, detail: string }): void   // Nuevo evento
}

const props = withDefaults(defineProps<Props>(), {
    mode: 'create'
})

const emit = defineEmits<Emits>()

const {
    modalSchedule,
    mode: modeSchedule,
    loading,
    isEditMode,
    modalTitle,
    closeModal,
    loadScheduleData,
    resetForm
} = useScheduleModal();

const loadingDetails = ref(false)

watch(() => props.modelValue, async (newValue) => {
    if (newValue) {
        modeSchedule.value = props.mode
        modalSchedule.value = true
        formKey.value++ // ← Incrementa la key para forzar re-render
        
        if (props.mode === 'edit' && props.scheduleData) {
            console.log('Datos recibidos en Modal para editar:', props.scheduleData);
            
            // Cargar datos proporcionados directamente
            loadScheduleData(props.scheduleData)
        } else {
            resetForm()
        }
    } else {
        closeModal()
    }
})

// Watch para emitir cambios del modal al padre
watch(modalSchedule, (newValue) => {
    emit('update:modelValue', newValue)
})

// State para el modal de confirmación de reseteo de contraseña
const confirmDialogSchedules = ref({
    visible: false,
    options: {
        title: '',
        message: '',
        onConfirm: () => {},
        onCancel: () => {}
    }
})

// Datos del formulario que se enviarán después de la confirmación
const pendingFormData = ref<ScheduleFormData | null>(null)

const openConfirmModalSave = (formData: ScheduleFormData): void => {
    pendingFormData.value = formData
    
    
    confirmDialogSchedules.value = {
        visible: true,
        options: {
            title: isEditMode.value ? 'Editar horario extraordinario' : 'Nuevo horario extraordinario',
            icon: 'x:warning-circle',
            iconColor: 'text-yellow-500',
            confirmLabel:  isEditMode.value ? 'Guardar' : 'Programar',
            cancelLabel:'Cancelar',
            message: isEditMode.value
                ? `¿Estás seguro de guardar los cambios del horario extraordinario? 
                    El horario quedará programado para el <span class="font-semibold">${formatDate(formData.scheduleEffectiveDate)} </span>
                    de <span class="font-semibold"> ${formData.startTime} </span> a <span class="font-semibold">${formData.endTime}</span>.`
                : `¿Estás seguro de programar un nuevo horario extraordinario para el <span class="font-semibold">${formatDate(formData.scheduleEffectiveDate)} </span>
                    de <span class="font-semibold"> ${formData.startTime} </span> a <span class="font-semibold">${formData.endTime}</span>.? 
                    Ten en cuenta que este horario tendrá prioridad sobre el horario regular actualmente establecido para la transacción.`,
            onConfirm: async () => {
                await confirmSave();
            },
            onCancel: () => {
                console.log('Usuario canceló la acción');
            }
        }
    };

}

const confirmSave = async (): Promise<void> => {
    if (!pendingFormData.value) return
    
    loading.value = true
    try {
        console.log('Datos COMPLETOS del formulario a guardar:', pendingFormData.value);
        
        const requestData: ScheduleExceptionRequest = {
            paymentGatewayCode: pendingFormData.value.code || pendingFormData.value.code || '',
            transactionCode: pendingFormData.value.transactionCode || '',
            scheduleEfectiveDate: new Date((pendingFormData.value.scheduleEffectiveDate || '') + "T00:00:00Z"),
            startTime: pendingFormData.value.startTime || '00:00:00',
            endTime: pendingFormData.value.endTime || '00:00:00',
            changeReason: pendingFormData.value.changeReason || '',
            base64JustificationFile: pendingFormData.value.base64JustificationFile || ''
        };

        // Solo en modo edición agregamos isActive
        if (isEditMode.value) {
            (requestData as any).isActive = pendingFormData.value.isActive ?? true
        }

        console.log('Datos que se enviarán a la API:', requestData);
        
        let result
        if (isEditMode.value) {
            result = await scheduleService.editScheduleException(requestData)
        } else {
            result = await scheduleService.createScheduleException(requestData)
        }

        console.log('Resultado de la operación:', result);
        if(result){
            emit('success', {
                summary: isEditMode.value ? 'Edición exitosa' : 'Horario extraordinario programado con éxito',
                detail: isEditMode.value ? '' : 'El nuevo horario extraordinario se ha programado correctamente'
            })
        }
        emit('save', requestData)
        modalSchedule.value = false
        closeModal()
    } catch (error) {
        console.error('Error guardando horario:', error)
        // Emitir evento de error al padre
        const errorMessage = {
            summary: 'Error',
            detail: `Error al ${isEditMode.value ? 'actualizar' : 'crear'} el horario extraordinario`
        };
        console.log('Emitiendo evento error:', errorMessage);
        emit('error', errorMessage)
    } finally {
        loading.value = false
        pendingFormData.value = null
    }
}

const handleSubmitExtraordinary = async (formData: ScheduleFormData): Promise<void> => {
    openConfirmModalSave(formData)
}

const handleCancel = (): void => {
    closeModal()
}

</script>