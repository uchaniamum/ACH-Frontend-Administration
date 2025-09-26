<template>
    <div>
        <XForm @submit="onSubmit" >
            <div class="flex flex-col gap-8">
                <div class="grid grid-cols-2 gap-10">
                    <XInputText 
                        v-model="formDataSchedules.acronym" 
                        name="canal"
                        label="Código" 
                        label-required
                        disabled
                    />

                    <XInputText 
                        v-model="formDataSchedules.transactionCodeDescription" 
                        name="transaccion"
                        label="Transacción" 
                        label-required
                        disabled
                    />

                    <XDatePicker
                        v-model="formDataSchedules.scheduleEffectiveDate"
                        label="Fecha"
                        name="datepicker"
                        :rules="[(v: any) => !!v || 'El campo es requerido']"
                        showButtonBar
                        label-required
                        showIcon 
                        fluid 
                        iconDisplay="input"
                        icon="calendar-1"
                    />

                    <XDatePicker
                        v-model="formDataSchedules.startTime"
                        label="Hora de inicio"
                        label-required
                        name="startTime"
                        showIcon
                        iconDisplay="input"
                        timeOnly
                        icon="clock"
                    />

                    <XDatePicker
                        v-model="formDataSchedules.endTime"
                        label="Hora de fin"
                        label-required
                        name="endTime"
                        showIcon
                        iconDisplay="input"
                        timeOnly
                        icon="clock"
                    />
                </div>
                
                <!--<span >En caso de ser necesario adjunta el/los archivos que respalden tu justificación.</span>
            
                <XFileUpload
                    ref="fileupload"
                    name="certificateFiles"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    @select="fileUpload.onFileSelect"
                    :showUploadButton="false"
                    :showCancelButton="false"
                    chooseLabel="Elegir archivo"
                    :auto="false"
                    :invalidFileSizeMessage="''"
                >   
                    <template #empty>
                        <div class="mb-6 mt-4 px-[1.714rem]">
                            <span class="text-normal font-normal">Arrastra y suelta archivos aquí para subirlos.</span>
                        </div>
                    </template> 
                  
                    <template #content="{ files, removeFileCallback }">
                        <div class="p-fileupload-file-list">
                            <div 
                                v-for="(file, index) in files" 
                                :key="index" 
                                class="p-fileupload-file"
                            >
                                <div class="p-fileupload-file-thumbnail custom-thumbnail">
                                    <Icon name="x:page" class="text-[48px] text-gray-200"/>
                                </div>
                                <div class="p-fileupload-file-info">
                                    <div class="p-fileupload-file-name">{{ file.name }}</div>
                                    <span class="p-fileupload-file-size">{{ fileUpload.formatFileSize(file.size) }}</span>
                                </div>
                                <span 
                                    v-if="fileUpload.getFileStatus(file).isLoaded" 
                                    class="p-badge p-component p-badge-success p-fileupload-file-badge px-4"
                                >
                                    Carga Completa
                                </span>
                                <span 
                                    v-else 
                                    class="p-badge p-component p-badge-warn p-fileupload-file-badge px-4"
                                >
                                    Cargando archivo
                                </span>
                                <div class="p-fileupload-file-actions">
                                    <button 
                                        class="p-button p-component p-button-icon-only p-button-danger p-button-rounded p-button-text p-fileupload-file-remove-button" 
                                        @click="removeFileCallback(index)"
                                        type="button"
                                    >
                                        <span class="p-button-icon p-c">
                                            <Icon name="x:cancel"></Icon>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>
                </XFileUpload>

                <div class="flex flex-col gap-4 col-span-2">
                    <XDivider />
                    <div class="flex justify-end gap-4">
                        <XButton 
                            label="Cancelar" 
                            variant="outlined" 
                            class="!w-[130px]" 
                            @click="$emit('cancel')" 
                            :disabled="loading"
                        />
                        <XButton 
                            :label="isEdit ? 'Guardar' : 'Programar'" 
                            class="!w-[130px]" 
                            type="submit"
                            :loading="loading"
                        />
                    </div>
                </div>
            </div>
        </XForm>
    </div>
    
</template>

<script setup lang="ts">
import { useFileUpload } from '~/componsables/useFileUpload'
import type { ScheduleFormData } from './type'


const fileUpload = useFileUpload()

interface Props {
    scheduleData?: ScheduleFormData
    isEdit?: boolean
    loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    isEdit: false,
    loading: false
})

const emit = defineEmits<{
    submit: [data: ScheduleFormData]
    cancel: []
}>()

const formDataSchedules = ref<any>({
    code: '', 
    acronym: '',
    transactionCodeDescription: '',
    scheduleEffectiveDate: '',
    startTime: '',
    endTime: '',
    changeReason: '',
    base64JustificationFile: '',
});


const onSubmit = async () => {
    try {
        const submitData: ScheduleFormData = {
                    ...formDataSchedules.value,
                    scheduleEffectiveDate: formDataSchedules.value.scheduleEffectiveDate instanceof Date 
                        ? formDataSchedules.value.scheduleEffectiveDate.toISOString().split('T')[0]
                        : formDataSchedules.value.scheduleEffectiveDate,
                    startTime: formDataSchedules.value.startTime instanceof Date 
                        ? formDataSchedules.value.startTime.toTimeString().split(' ')[0]
                        : formDataSchedules.value.startTime,
                    endTime: formDataSchedules.value.endTime instanceof Date 
                        ? formDataSchedules.value.endTime.toTimeString().split(' ')[0]
                        : formDataSchedules.value.endTime,
                    base64JustificationFile: fileUpload.fileBase64.value
                };

        
        // Emitir el evento submit
        emit('submit', submitData)
        
    } catch (error) {
        console.error('Error en submit:', error)
        
    }
}

watch(() => props.scheduleData, (newData) => {
    if (newData) {
        console.log('Datos recibidos en formulario (watch profundo):', newData);
        console.log('Código recibido:', newData.code);
        
        formDataSchedules.value = {
            ...formDataSchedules.value,
            ...newData
        }

        console.log('Datos después de merge:', formDataSchedules.value);
        console.log('Código después de merge:', formDataSchedules.value.code);
    }
}, { immediate: true, deep: true }) 

</script>
