<template>
  <div class="flex flex-col gap-8">
    <span class="text-gray-700">Ingresa el archivo del certificado público para cargarlo y verificar sus datos</span>
    <XFileUpload modelValue="test" ref="fileupload" name="certificateFiles" :accept="documentsAccepted"
      :maxFileSize="5000000" :fileLimit="1" @select="onFileSelect" :showUploadButton="false" :showCancelButton="false"
      chooseLabel="Elegir archivo" :auto="false">
      <template #empty>
        <div class="mb-6 mt-4 px-[1.714rem]">
          <span class="text-normal font-normal">Arrastra y suelta archivos aquí para subirlos.</span>
        </div>
      </template>
      <template #content="{ files, removeFileCallback }">
        <div class="p-fileupload-file-list">
          <div v-for="(file, index) in files" :key="index" class="p-fileupload-file">
            <div class="p-fileupload-file-thumbnail custom-thumbnail">
              <Icon name="x:page" class="text-[48px] text-gray-200" />
            </div>
            <div class="p-fileupload-file-info">
              <div class="p-fileupload-file-name">{{ file.name }}</div>
              <span class="p-fileupload-file-size">{{ formatFileSize(file.size) }}</span>
            </div>
            <!-- <p>{{ getFileStatus(file).isLoaded }}</p> -->
            <span v-if="getFileStatus(file).isLoaded"
              class="p-badge p-component p-badge-success p-fileupload-file-badge px-4">
              Carga Completa
            </span>
            <span v-else class="p-badge p-component p-badge-warn p-fileupload-file-badge px-4">
              Cargando archivo
            </span>
            <div class="p-fileupload-file-actions">
              <button
                class="p-button p-component p-button-icon-only p-button-danger p-button-rounded p-button-text p-fileupload-file-remove-button"
                @click="removeFileCallback(index)" type="button">
                <span class="p-button-icon p-c">
                  <Icon name="x:cancel"></Icon>
                </span>
              </button>
            </div>
          </div>
        </div>
      </template>
    </XFileUpload>
    <XDivider />
  </div>
</template>
<script lang="ts" setup>
import { channelsService } from '~/services/channelsService'
import { participantsService } from '~/services/participantsService'

const { documentsAccepted = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.text,.pfx" } = defineProps<{
  documentsAccepted?: string,
}>();

const toast = useToast()

const isVerifying = ref(false)
const isVerified = ref(false)
const verificationProgress = ref(0)
const fileStates = reactive(new Map())
const selectedFile = ref<File | null>(null)
const fileBase64 = ref<string>('')
const justification = ref('')
const isChargedFile = ref(true)
const verificationData = ref<VerificationData[]>([])
let verificationPayload:any ={}

interface VerificationData {
  nroSerie: string
  validacionInicio: string
  validacionFin: string
}

export interface CertificateVerificationRequest {
  publicCertificate: {
    base64Content: string
  }
}

const emit = defineEmits<{
  'registered': [value:any],
  'verification-complete': [data: any]
}>()

const close = () => {
  // emit('cancel')
  resetUploadState()
}

const saveConfirmRegister = () => {
  // console.log('Registrando certificado con justificación:', justification.value)
  // console.log('Datos del certificado:', verificationData.value)
  // console.log('Payload de verificación:', verificationPayload)
  emit('verification-complete', {
      ...verificationPayload,
      justification: justification.value,
      certificateInfo: verificationData.value[0],
    })
  // emit('registered', isVerified.value)
  console.log('se emitio')
}

const resetUploadState = () => {
  fileStates.clear()
  isVerifying.value = false
  isVerified.value = false
  verificationProgress.value = 0
  selectedFile.value = null
  fileBase64.value = ''
  justification.value = ''
}

const onFileSelect = async (event: any) => {
  // Reiniciar estados
  isVerifying.value = false
  isVerified.value = false
  verificationProgress.value = 0
  selectedFile.value = null
  fileBase64.value = ''

  if (event.files.length > 1) {
    event.files.shift()
    onFileSelect(event);
    return
  }

  const file = event.files[0]
  selectedFile.value = file

  // Inicializar estado del archivo
  if (!file) return null
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
      emit('registered',{
        base64Content: fileBase64.value
      })
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
  return fileStates.get(fileKey) || { isLoaded: false, progress: 0 }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-BO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

// Computed para verificar si hay archivos cargados
const hasFilesLoaded = computed(() => {
  return Array.from(fileStates.values()).some(state => state.isLoaded)
})

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.includes('base64,')
        ? result.split('base64,')[1]
        : result
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

const verifyCertificate = async () => {
  console.log('test')
  if (!selectedFile.value || !fileBase64.value) {
    toast.add({
      severity: 'warn',
      summary: 'Datos incompletos',
      detail: 'Selecciona un certificado válido',
      life: 3000
    })
    return
  }

  isVerifying.value = true
  isVerified.value = false
  verificationProgress.value = 0

  try {
    verificationPayload = {
      participantCode: "test",
      publicCertificate: {
        base64Content: fileBase64.value
      }
    }
    console.log('Payload de verificación:', verificationPayload)
    const response = await participantsService.registerCertificatePublic(verificationPayload)

    
    // emit('registered', response)
    
    verificationData.value = [{
      nroSerie: response.data.serialNumber,
      validacionInicio: formatDate(response.data.ValidFrom),
      validacionFin: formatDate(response.data.ValidTo)
    }]
    
    console.log('respuesta: ', verificationData.value);
    console.log('data',response.data);

    isVerifying.value = false
    isVerified.value = true
    isChargedFile.value = false

  } catch (error) {
    isVerifying.value = false
    toast.add({
      severity: 'error',
      summary: 'Error de verificación',
      detail: 'No se pudo verificar el certificado',
      life: 5000
    })
  }
  
}
</script>