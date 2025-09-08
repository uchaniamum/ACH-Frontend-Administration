<template>
    <div>
        <XForm @submit="onSubmit">
            <div class="flex flex-col gap-8">
                <div class="grid grid-cols-2 gap-10">
                    <XInputText 
                        v-model="formDataSchedulesRegular.acronym" 
                        name="canal"
                        label="Código" 
                        label-required
                        disabled
                    />

                    <XInputText 
                        v-model="formDataSchedulesRegular.transactionCodeDescription" 
                        name="transaccion"
                        label="Transacción" 
                        label-required
                        disabled
                    />

                    <XMultiSelect 
                        v-model="selectedDays" 
                        name="small" 
                        label="Día(s)"
                        label-required
                        :options="daysOptions" 
                        optionLabel="name" 
                        optionValue="key"
                        :maxSelectedLabels="3" 
                        showClear 
                    /> 

                    <XDatePicker
                        v-model="formDataSchedulesRegular.startTime"
                        label="Hora de inicio"
                        label-required
                        name="starTimeReg"
                        showIcon
                        iconDisplay="input"
                        timeOnly
                        icon="clock"
                    />

                    <XDatePicker
                        v-model="formDataSchedulesRegular.endTime"
                        label="Hora de fin"
                        label-required
                        name="endTimeReg"
                        showIcon
                        iconDisplay="input"
                        timeOnly
                        icon="clock"
                    />
                </div>
                <XTextarea
                    id="textarea"
                    v-model="formDataSchedulesRegular.description"
                    name="textarea"
                    label="Justificación"
                    label-required
                    placeholder="Escribe una justificación"
                />

                <span>En caso de ser necesario adjunta el/los archivos que respalden tu justificación.</span>

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
                            label="Guardar"
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
import type { ScheduleFormRegular, ScheduleRegularRequest, ScheduleWeek } from './type'

// Composables 
const toast = useToast()
const fileUpload = useFileUpload()

interface Props {
    scheduleData?: ScheduleFormRegular
    loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    loading: false
})

const emits = defineEmits(['submit', 'cancel'])

// Opciones para los días de la semana
const daysOptions = [
    { name: 'Lunes', key: 'isMondayAvailable' },
    { name: 'Martes', key: 'isTuesdayAvailable' },
    { name: 'Miércoles', key: 'isWednesdayAvailable' },
    { name: 'Jueves', key: 'isThursdayAvailable' },
    { name: 'Viernes', key: 'isFridayAvailable' },
    { name: 'Sábado', key: 'isSaturdayAvailable' },
    { name: 'Domingo', key: 'isSundayAvailable' }
]

// Días seleccionados (para el multiselect)
const selectedDays = ref<string[]>([])

const formDataSchedulesRegular = ref<ScheduleFormRegular>({
    transactionCode: '',
    code: '',
    acronym: '',
    transactionCodeDescription: '',
    startTime: '',
    endTime: '',
    description: '',
    scheduleType: '',
    scheduleWeek: {
        isMondayAvailable: false,
        isTuesdayAvailable: false,
        isWednesdayAvailable: false,
        isThursdayAvailable: false,
        isFridayAvailable: false,
        isSaturdayAvailable: false,
        isSundayAvailable: false
    },
});

// Función para convertir scheduleWeek a array de días seleccionados
const convertScheduleWeekToSelectedDays = (scheduleWeek: ScheduleWeek): string[] => {
    const days: string[] = []
    Object.entries(scheduleWeek).forEach(([key, value]) => {
        if (value && typeof value === 'boolean') {
            days.push(key)
        }
    })
    return days
}

// Función para convertir días seleccionados a scheduleWeek object
const convertSelectedDaysToScheduleWeek = (selectedDays: string[]): ScheduleWeek => {
    const scheduleWeek: ScheduleWeek = {
        isMondayAvailable: false,
        isTuesdayAvailable: false,
        isWednesdayAvailable: false,
        isThursdayAvailable: false,
        isFridayAvailable: false,
        isSaturdayAvailable: false,
        isSundayAvailable: false
    }
    
    selectedDays.forEach(day => {
        if (day in scheduleWeek) {
            (scheduleWeek as any)[day] = true
        }
    })
    
    return scheduleWeek
}

// Watch para cargar datos cuando cambien los props
watch(() => props.scheduleData, (newData) => {
    console.log('Datos recibidos en el form:', newData);
    if (newData && Object.keys(newData).length > 0) {
        // Cargar todos los datos
        formDataSchedulesRegular.value = {
            ...formDataSchedulesRegular.value,
            ...newData,
            // Convertir las horas si vienen como Date
            startTime: newData.startTime instanceof Date 
                ? newData.startTime 
                : typeof newData.startTime === 'string' && newData.startTime.includes(':')
                    ? new Date(`2000-01-01T${newData.startTime}`)
                    : newData.startTime,
            endTime: newData.endTime instanceof Date 
                ? newData.endTime 
                : typeof newData.endTime === 'string' && newData.endTime.includes(':')
                    ? new Date(`2000-01-01T${newData.endTime}`)
                    : newData.endTime
        }
        
        // Convertir scheduleWeek a días seleccionados para el multiselect
        if (newData.scheduleWeek) {
            selectedDays.value = convertScheduleWeekToSelectedDays(newData.scheduleWeek)
        }
    } else {
        // Resetear formulario si no hay datos
        formDataSchedulesRegular.value = {
            transactionCode: '',
            code: '',
            acronym: '',
            transactionCodeDescription: '',
            startTime: '',
            endTime: '',
            description: '',
            scheduleType: '',
            scheduleWeek: {
                isMondayAvailable: false,
                isTuesdayAvailable: false,
                isWednesdayAvailable: false,
                isThursdayAvailable: false,
                isFridayAvailable: false,
                isSaturdayAvailable: false,
                isSundayAvailable: false
            },
        }
        selectedDays.value = []
    }
}, { immediate: true, deep: true })

// Watch para actualizar scheduleWeek cuando cambien los días seleccionados
watch(selectedDays, (newDays) => {
    formDataSchedulesRegular.value.scheduleWeek = convertSelectedDaysToScheduleWeek(newDays)
}, { deep: true })

const onSubmit = async () => {
    try {
        // Validar fechas/horas si son Date objects
        if (formDataSchedulesRegular.value.startTime instanceof Date && 
            formDataSchedulesRegular.value.endTime instanceof Date) {
            if (formDataSchedulesRegular.value.startTime >= formDataSchedulesRegular.value.endTime) {
                toast.add({
                    severity: 'warn',
                    summary: 'Validación',
                    detail: 'La hora de inicio debe ser anterior a la hora de fin',
                    life: 5000
                })
                return
            }
        }

        // Preparar datos para envío
        const submitData: ScheduleRegularRequest = {
            //...formDataSchedulesRegular.value,
            paymentGatewayCode: formDataSchedulesRegular.value.code,
            transactionCode: formDataSchedulesRegular.value.transactionCode,
            isMondayAvailable: formDataSchedulesRegular.value.scheduleWeek.isMondayAvailable,
            isTuesdayAvailable: formDataSchedulesRegular.value.scheduleWeek.isTuesdayAvailable,
            isWednesdayAvailable: formDataSchedulesRegular.value.scheduleWeek.isWednesdayAvailable,
            isThursdayAvailable: formDataSchedulesRegular.value.scheduleWeek.isThursdayAvailable,
            isFridayAvailable: formDataSchedulesRegular.value.scheduleWeek.isFridayAvailable,
            isSaturdayAvailable: formDataSchedulesRegular.value.scheduleWeek.isSaturdayAvailable,
            isSundayAvailable: formDataSchedulesRegular.value.scheduleWeek.isSundayAvailable,
            startTime: formDataSchedulesRegular.value.startTime instanceof Date 
                ? formDataSchedulesRegular.value.startTime.toTimeString().split(' ')[0]
                : formDataSchedulesRegular.value.startTime,
            endTime: formDataSchedulesRegular.value.endTime instanceof Date 
                        ? formDataSchedulesRegular.value.endTime.toTimeString().split(' ')[0]
                        : formDataSchedulesRegular.value.endTime,
            changeReason: formDataSchedulesRegular.value.description,
            base64JustificationFile: fileUpload.fileBase64.value
        };

        console.log('Datos del formulario regular a enviar:', submitData)
        
        // Emitir el evento submit
        emits('submit', submitData)
        
    } catch (error) {
        console.error('Error en submit regular:', error)
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al procesar el formulario',
            life: 5000
        })
    }
}
</script>