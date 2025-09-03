<template>
    <div>
        <XForm @submit="onSubmit" >
            <div class="flex flex-col gap-8">
                <div class="grid grid-cols-2 gap-10">
                    <XInputText 
                        v-model="formDataSchedules.paymentGatewayCode" 
                        name="canal"
                        label="Código de usuario" 
                        label-required
                        :disabled="isEdit" 
                    />

                    <XInputText 
                        v-model="formDataSchedules.transactionCode" 
                        name="transaccion"
                        label="Transacción" 
                        label-required
                    />

                    <XDatePicker
                        v-model="formDataSchedules.scheduleEfectiveDate"
                        label="DatePicker"
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
                        name="datetimepicker"
                        showIcon
                        iconDisplay="input"
                        timeOnly
                        icon="clock"
                    />

                    <XDatePicker
                        v-model="formDataSchedules.endTime"
                        label="Hora de fin"
                        label-required
                        name="datetimepicker"
                        showIcon
                        iconDisplay="input"
                        timeOnly
                        icon="clock"
                    />
                </div>

                <XTextarea
                    id="textarea"
                    v-model="formDataSchedules.changeReason"
                    name="textarea"
                    label="Justificación"
                    label-required
                    placeholder="Escribe una justificación"
                    size="small"
                />

                <span >En caso de ser necesario adjunta el/los archivos que respalden tu justificación.</span>
            
                <XFileUpload
                    ref="fileupload"
                    name="certificateFiles"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    @select="onFileSelect"
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
              <div  class="p-fileupload-file-list">
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
                  <span class="p-fileupload-file-size">{{ formatFileSize(file.size) }}</span>
                </div>
                <span 
                  v-if="getFileStatus(file).isLoaded" 
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
import type { SchudeleFormData } from './type'


const props = defineProps({
    schudeleData: { type: Object, default: () => ({}) },
    isEdit: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
})

const emits = defineEmits(['submit', 'cancel'])

const isVerifying = ref(false)
const isVerified = ref(false)
const verificationProgress = ref(0)
const fileStates = reactive(new Map())
const selectedFile = ref<File | null>(null)
const fileBase64 = ref<string>('')
const fileupload = ref<any>(null)

const formDataSchedules = ref<SchudeleFormData>({
    paymentGatewayCode: '',
    transactionCode: '',
    scheduleEffectiveDate: '',
    startTime: '',
    endTime: '',
    changeReason: '',
    base64JustificationFile: '',
});

const onFileSelect = async (event: any) => {
  // Reiniciar estados
  isVerifying.value = false
  isVerified.value = false
  verificationProgress.value = 0
  selectedFile.value = null
  fileBase64.value = ''

  if (event.files.length === 0) return

  const file = event.files[0]
  selectedFile.value = file

  // Inicializar estado del archivo
  const fileKey = getFileKey(file)
  if (!fileStates.has(fileKey)) {
    fileStates.set(fileKey, {
      isLoaded: false,
      progress: 0,
      file: file
    })
    simulateFileLoading(fileKey)

    try {
      fileBase64.value = await fileToBase64(file)
      console.log('Archivo convertido a Base64')

    } catch (error) {
      console.error('Error procesando archivo:', error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo procesar el archivo',
        life: 5000
      })
    }
  }
}
const simulateFileLoading = (fileKey: any) => {
  let progress = 0
  const interval = setInterval(() => {
    progress += 20

    // Actualizar progreso de carga
    if (fileStates.has(fileKey)) {
      const currentState = fileStates.get(fileKey)
      fileStates.set(fileKey, {
        ...currentState,
        progress: progress
      })
    }

    if (progress >= 100) {
      clearInterval(interval)

      // Marcar como cargado completo
      if (fileStates.has(fileKey)) {
        const currentState = fileStates.get(fileKey)
        fileStates.set(fileKey, {
          ...currentState,
          isLoaded: true,
          progress: 100
        })
      }
    }
  }, 200)
}

const getFileKey = (file: any) => {
  return `${file.name}-${file.size}-${file.lastModified}`
}

const formatFileSize = (bytes: any) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileStatus = (file: any) => {
  const fileKey = getFileKey(file)
  return fileStates.get(fileKey) || {
    isLoaded: false,
    progress: 0
  }
}

const onSubmit = async () => {
    try {
        // Validar campos requeridos
        if (!formDataSchedules.value.paymentGatewayCode.trim()) {
            toast.add({
                severity: 'warn',
                summary: 'Validación',
                detail: 'El código de usuario es requerido',
                life: 5000
            })
            return
        }

        if (!formDataSchedules.value.transactionCode.trim()) {
            toast.add({
                severity: 'warn',
                summary: 'Validación',
                detail: 'El código de transacción es requerido',
                life: 5000
            })
            return
        }

        if (!formDataSchedules.value.changeReason.trim()) {
            toast.add({
                severity: 'warn',
                summary: 'Validación',
                detail: 'La justificación es requerida',
                life: 5000
            })
            return
        }

        // Validar fechas/horas si son Date objects
        if (formDataSchedules.value.startTime instanceof Date && 
            formDataSchedules.value.endTime instanceof Date) {
            if (formDataSchedules.value.startTime >= formDataSchedules.value.endTime) {
                toast.add({
                    severity: 'warn',
                    summary: 'Validación',
                    detail: 'La hora de inicio debe ser anterior a la hora de fin',
                    life: 5000
                })
                return
            }
        }

        // Convertir fechas a strings si es necesario
        const submitData: SchudeleFormData = {
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
            base64JustificationFile: fileBase64.value
        };

        console.log('Datos del formulario a enviar:', submitData)
        
        // Emitir el evento submit
        emit('submit', submitData)
        
    } catch (error) {
        console.error('Error en submit:', error)
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al procesar el formulario',
            life: 5000
        })
    }
}

</script>
