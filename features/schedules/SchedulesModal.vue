<template>
    <XDialog 
        v-model:visible="modalSchedule" 
        modal
        :closable="false"
        :header="modalTitle"
        :style="{ width: '920px !important' }" 
    > 
        <SchedulesExForm
        :scheduleData="schedulesDetails"
        :isEdi="isEditMode"
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
        icon="x:cancel-circle"
        icon-color="text-red-500"
        :closable="false"
        title="Error de verificacion">
        <template #message>
            <div class="space-y-2">
                <p>
                    <span class="font-medium text-gray-700">No se pudo verificar el certificado público, intenta de nuevo o vuelve a cargar el archivo. </span>
                </p>
            </div>
        </template>
        <template #buttons>
            <div class="flex gap-3">
                <XButton 
                  label="Confirmar" 
                  @click="modalSchedule = true; showInfoDialog = false"
                />
            </div>
        </template> 
    </XConfirmDialog>
</template>
<script setup lang="ts">

import { useScheduleModal } from '~/componsables/useSchedules';
import type { ModalMode } from '../users/types';
import type { SchudeleFormData } from './type';
import SchedulesExForm from './SchedulesExForm.vue';
import { scheduleService } from '~/services/scheduleService';

interface Props {
    modelValue: boolean
    scheduleData?: SchudeleFormData
    mode?: ModalMode
}

interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'save', scheduleData: SchudeleFormData ): void
}

const props = withDefaults(defineProps<Props>(), {
    mode: 'create'
})

const emit = defineEmits<Emits>()

// Nueva variable para controlar el modal de error
const showInfoDialog = ref(false)

const {
    modalSchedule,
    mode: modeSchedule,
    loading,
    schedulesDetails,
    isEditMode,
    modalTitle,
    closeModal,
    loadScheduleData,
    resetForm
} = useScheduleModal();

const loadingDetails = ref(false)

// Watch para sincronizar con el prop modelValue
watch(() => props.modelValue, async (newValue) => {
    if (newValue) {
        modeSchedule.value = props.mode
        modalSchedule.value = true
        
        if (props.mode === 'edit' && props.scheduleData?.paymentGatewayCode) {
            // Cargar detalles completos desde la API para modo edición
            await loadFullScheduleDetails(props.scheduleData.transactionCode)
        } else if (props.mode === 'edit' && props.scheduleData) {
            // Usar datos proporcionados si no hay código
            loadScheduleData(props.scheduleData)
        } else {
            // Modo crear - resetear formulario
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

const loadFullScheduleDetails = async (code: string): Promise<void> => {
    loadingDetails.value = true
    try {
        const sheduleDetail = await scheduleService.getScheduleByCode(code)
        console.log('Data: ',sheduleDetail);
        //const scheduleDetail = await scheduleDetail(code)
        //console.log('Data: ',userDetails.value);
        // if (userDetail) {
        //     userDetails.value = {
        //         code: userDetail.code,
        //         name: userDetail.fullname,
        //         email: userDetail.email,
        //         alias: userDetail.alias,
        //         rol: userDetail.roleCode,
        //         numberPhone: userDetail.phoneNumber?.number || '',
        //         countryCode: userDetail.phoneNumber?.countryCode || '+591',
        //         isActive: userDetail.isActive
        //     }
        // }
    } finally {
        loadingDetails.value = false
    }
}

const handleSubmit = async (formData: SchudeleFormData): Promise<void> => {
    loading.value = true
    modalSchedule.value= false
    showInfoDialog.value = true
    try {
        console.log('Datos del formulario:', formData);
        
        // Aquí deberías llamar al servicio para guardar
        // const result = await scheduleService.saveSchedule(formData, isEditMode.value)
        
        emit('save', formData)
        handleCancel()
        
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: isEditMode.value ? 'Horario actualizado correctamente' : 'Horario creado correctamente',
            life: 5000
        })
    } catch (error) {
        console.error('Error guardando horario:', error)
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al guardar el horario',
            life: 5000
        })
    } finally {
        loading.value = false
    }
}

const handleCancel = (): void => {
    closeModal()
}

</script>