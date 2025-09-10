<template>
  <div>
  <XDialog 
    v-model:visible="visible" 
    modal 
    header="Registrar certificado público" 
    :closable="false"
    class="w-[calc((740/14)*1rem)]"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <div class="flex flex-col gap-8 min-h-[400px]">
      <!-- Contenido normal -->
      <div v-if="!isProcessing" class="flex flex-col gap-8">
        <span class="text-gray-700">Ingresa el archivo del certificado público para cargarlo y verificar sus datos</span>
        
        <XFileUpload
          ref="fileupload"
          name="certificateFiles"
          accept=".txt"
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
          
          <template #content="{ files, removeFileCallback }" v-if="!showSizeErrorSnackbar">
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
              <div v-if="hasFilesLoaded" >
                <XDivider v-if="!isVerified"/>
                <div class="flex flex-col items-center pt-12 px-12" v-if="!isVerifying && !isVerified">
                  <XButton 
                    label="Verificar certificado"
                    class="w-[160px]"  
                    @click="verifyCertificate"
                    :disabled="!hasFilesLoaded"
                  />
                </div>
                <div v-if="isVerifying" class="w-full">
                  <div class="flex items-center justify-center gap-3 mb-3">
                    <Icon name="x:loader" class="text-primary-500 animate-spin text-xl"/>
                    <span class="text-gray-700">Verificando certificado...</span>
                  </div>
                  <ProgressSpinner 
                    class="flex justify-center"
                    :value="verificationProgress" 
                    style="width: 50px; height: 50px" 
                    strokeWidth="8" 
                    fill="transparent"
                  />
                </div>
              </div>
              
              </div>
          </template>
          <template #content="{ files }" v-else>
            <div  class="p-fileupload-file-list items-center">
              <div 
                v-for="(file, index) in files" 
                :key="index" 
                class="p-fileupload-file"
              >
                <div>
                <XSnackBar 
                  variant="danger" 
                  @close="showSizeErrorSnackbar = false"
                  class="!w-[600px]"
                >
                  <h5 class="font-semibold">{{ errorFileName }}: tamaño del archivo inválido</h5>
                  <p>{{ sizeErrorMessage }}</p>
                </XSnackBar>
                </div>
              </div>
            </div>
          </template>
        </XFileUpload>

        <div v-if="isVerified" class="flex flex-col gap-8">
          <span class="text-gray-700">Asegúrate que los datos del certificado son correctos para registrarlo.</span>
          <DataTable :value="verificationData">
            <Column field="nroSerie" header="Nro. de serie">
              <template #body="{ data }">
                {{ data.nroSerie }}
              </template>
            </Column>
            <Column field="validacionInicio" header="Válido desde">
              <template #body="{ data }">
                <span>{{ data.validacionInicio }}</span>
              </template>
            </Column>
            <Column field="validacionFin" header="Válido hasta">
              <template #body="{ data }">
                <span>{{ data.validacionFin }}</span>
              </template>
            </Column>
          </DataTable>
          <XTextarea 
            name="justification" 
            v-model="justification" 
            label="Justificación" 
            label-required 
            placeholder="Ingresar motivo"
          />
        </div>
        <XDivider />
        <div class="flex flex-row justify-end gap-4">
          <XButton @click="close()" variant="outlined" label="Cancelar" />
          <XButton 
            @click="registerCertificate()" 
            label="Registrar"
            :disabled="!isVerified || justification.trim() === ''"
          /> 
        </div>
      </div>

      <!-- Estado de procesamiento (registro) -->
      <div v-else class="flex flex-col items-center justify-center h-full gap-6 m-50">
        <div class="text-center">
          <ProgressSpinner 
            style="width: 160px; height: 160px" 
            strokeWidth="4" 
            fill="transparent"
          />
          <p class="text-gray-700 font-semibold text-lg">Estamos procesando tu certificado.</p>
          <p class="text-gray-700">Por favor espera...</p>
        </div>
      </div>
    </div>
  </XDialog>

  <!-- Modal de Error Mejorado -->
  <XConfirmDialog
    v-model="showErrorDialog"
    icon="x:cancel-circle"
    icon-color="text-red-500"
    :closable="false"
    :title="getErrorTitle()">
      <template #message>
          <div class="space-y-2">
              <p>
                  <span class="font-medium text-gray-700">
                    {{ getErrorMessage() }}
                  </span>
              </p>
          </div>
      </template>
      <template #buttons>
          <div class="flex gap-3">
              <XButton 
                :label="getErrorButtonLabel()" 
                @click="handleErrorConfirm"
              />
              <XButton 
                label="Cancelar" 
                variant="outlined"
                @click="handleErrorCancel"
              />
          </div>
      </template>  
  </XConfirmDialog>
  </div>
</template> 

<script setup lang="ts">
import { ref, computed, reactive, watch, onUnmounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { CertificateVerificationRequest } from './type'
import { channelsService } from '~/services/channelsService'
import type { UserSaveResponse } from '../users/types'
import { useDates } from '~/componsables/useDates'

interface VerificationData {
  nroSerie: string
  validacionInicio: string
  validacionFin: string
}

interface Props {
  modelValue: boolean
  channelCode?: string
  channelRegistered?: boolean
  headerTitle?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  headerTitle: 'Registrar certificado público',
  description: 'Ingresa el archivo del certificado público para cargarlo y verificar sus datos',
  channelCode: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'registered': [data: UserSaveResponse]
  'cancel': []
  'verification-complete': [data: any]
}>()

const toast = useToast()
const { formatDate } = useDates();

const visible = ref(props.modelValue)
const justification = ref('')
const isVerifying = ref(false)
const isVerified = ref(false)
const isProcessing = ref(false)
const verificationProgress = ref(0)
const fileStates = reactive(new Map())
const selectedFile = ref<File | null>(null)
const fileBase64 = ref<string>('')
const remainingTime = ref(30)
const verificationData = ref<VerificationData[]>([])
const fileupload = ref<any>(null)

// Variables para manejo de errores de tamaño
const showSizeErrorSnackbar = ref(false)
const sizeErrorMessage = ref('')
const errorFileName = ref('')

// Variables mejoradas para manejo de errores
const showErrorDialog = ref(false)
const errorType = ref<'verification' | 'registration'>('verification')
const errorMessage = ref('')

let processingTimer: NodeJS.Timeout | null = null
let verificationTimer: NodeJS.Timeout | null = null

console.log('antes',props.channelRegistered);
console.log('canal',props.channelCode);

// Función helper para mostrar errores
const showError = (type: 'verification' | 'registration', message?: string) => {
  visible.value = false
  errorType.value = type
  errorMessage.value = message || ''
  isProcessing.value = false // Asegurar que se detiene el procesamiento
  
  setTimeout(() => {
    showErrorDialog.value = true
  }, 100)
}

// Funciones para el modal de error
const getErrorTitle = () => {
  return errorType.value === 'verification' ? 'Error de verificación' : 'Error de registro'
}

const getErrorMessage = () => {
  if (errorType.value === 'verification') {
    return errorMessage.value || 'No se pudo verificar el certificado público. Intenta de nuevo o vuelve a cargar el archivo.'
  } else {
    return errorMessage.value || 'No se pudo registrar el certificado público. Verifica los datos e intenta nuevamente.'
  }
}

const getErrorButtonLabel = () => {
  return errorType.value === 'verification' ? 'Intentar de nuevo' : 'Volver a intentar'
}

const handleErrorConfirm = () => {
  showErrorDialog.value = false
  
  if (errorType.value === 'verification') {
    // Volver a abrir el modal principal para intentar verificar de nuevo
    visible.value = true
  } else {
    // Para errores de registro, volver al modal principal manteniendo la verificación
    visible.value = true
    // Mantener el estado verificado para que el usuario no tenga que verificar de nuevo
    // isVerified.value sigue siendo true
  }
  
  // Limpiar el mensaje de error
  errorMessage.value = ''
}

const handleErrorCancel = () => {
  showErrorDialog.value = false
  close() // Cerrar completamente y resetear todo
}

// Convertir archivo a Base64
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

const hasFilesLoaded = computed(() => {
  return Array.from(fileStates.values()).some(state => state.isLoaded)
})

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileKey = (file: File) => {
  return `${file.name}-${file.size}-${file.lastModified}`
}

const getFileStatus = (file: File) => {
  const fileKey = getFileKey(file)
  return fileStates.get(fileKey) || { 
    isLoaded: false, 
    progress: 0 
  }
}

const onFileSelect = async (event: any) => {
  // Reiniciar estados
  isVerifying.value = false
  isVerified.value = false
  verificationProgress.value = 0
  selectedFile.value = null
  fileBase64.value = ''
  verificationData.value = []
  showSizeErrorSnackbar.value = false // Limpiar errores de tamaño previos
  
  if (event.files.length === 0) return
  
  const file = event.files[0]
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  
  console.log('Archivo seleccionado:', file.name, 'Tamaño:', file.size);
  
  // Validar tamaño del archivo
  if (file.size > MAX_FILE_SIZE) {
    errorFileName.value = file.name;
    sizeErrorMessage.value = `El tamaño máximo de carga de archivos es 5 MB.`;
    showSizeErrorSnackbar.value = true;
    
    // Limpiar el file upload inmediatamente
    setTimeout(() => {
      if (fileupload.value && typeof fileupload.value.clear === 'function') {
        fileupload.value.clear();
      }
      // También limpiar manualmente el input
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => {
        (input as HTMLInputElement).value = '';
      });
    }, 100);
    
    return;
  }

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
      fileBase64.value = await fileToBase64(file);
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

const simulateFileLoading = (fileKey: string) => {
  let progress = 0
  const interval = setInterval(() => {
    progress += 20
    
    if (fileStates.has(fileKey)) {
      const currentState = fileStates.get(fileKey)
      fileStates.set(fileKey, {
        ...currentState,
        progress: progress
      })
    }
    
    if (progress >= 100) {
      clearInterval(interval)
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

// Función de verificación mejorada
const verifyCertificate = async () => {
  if (!selectedFile.value || !fileBase64.value || !props.channelCode) {
    showError('verification', 'Datos incompletos para la verificación')
    return
  }

  isVerifying.value = true
  isVerified.value = false
  verificationProgress.value = 0
  
  try {
    const verificationPayload: CertificateVerificationRequest = {
      publicCertificate: {
        base64Content: fileBase64.value
      },
    }

    const response = await channelsService.checkCertificatePublic(verificationPayload)
    
    console.log('Response success:', response);
    
    // Verificar si la respuesta es exitosa
    if (response) {
      verificationData.value = [{
        nroSerie: response.serialNumber,
        validacionInicio: formatDate(response.ValidFrom),
        validacionFin: formatDate(response.ValidTo)
      }]
      
      isVerifying.value = false
      isVerified.value = true
      
      // Emitir evento de verificación completada
      emit('verification-complete', {
        ...verificationPayload,
        certificateInfo: verificationData
      })
    } else {
      // Si response es false, mostrar el modal de error
      isVerifying.value = false
      isVerified.value = false
      showError('verification', 'El certificado no pudo ser verificado correctamente')
    }
    
  } catch (error) {
    isVerifying.value = false
    isVerified.value = false
    showError('verification', 'Error de conexión durante la verificación')
    console.error('Error en verificación:', error)
  }
}

// Función de registro mejorada
const registerCertificate = async () => {
  // Prevenir múltiples ejecuciones simultáneas
  if (isProcessing.value) {
    console.warn('El registro ya está en proceso')
    return
  }

  if (!selectedFile.value || !fileBase64.value || !props.channelCode) {
    toast.add({
      severity: 'warn',
      summary: 'Datos incompletos',
      detail: 'Complete todos los campos requeridos',
      life: 3000
    })
    return
  }

  if (justification.value.trim() === '') {
    toast.add({
      severity: 'warn',
      summary: 'Justificación requerida',
      detail: 'Por favor ingresa una justificación',
      life: 3000
    })
    return
  }

  // Iniciar el estado de procesamiento
  isProcessing.value = true

  // Crear el payload
  const certificatePayload: CertificateVerificationRequest = {
    paymentGatewayCode: props.channelCode,
    publicCertificate: {
      base64Content: fileBase64.value
    },
    changeReason: justification.value
  }

  console.log('Iniciando registro de certificado:', certificatePayload)

  try {
    const responseRegisterCertificate = await channelsService.registerCertificatePublic(certificatePayload)
    
    console.log('Respuesta registro:', responseRegisterCertificate)
    
    if (responseRegisterCertificate) {
      // Registro exitoso
      setTimeout(() => {
        close()
        toast.add({ 
          severity: 'success', 
          summary: 'Éxito',
          detail: 'Certificado público registrado correctamente', 
          life: 5000 
        })
      }, 1000)
    } else {
      // Error en el registro - mostrar modal de error
      showError('registration', 'No se pudo registrar el certificado. Verifica los datos e intenta nuevamente.')
    }
  
  } catch (error: any) {
    console.error('Error en registro de certificado:', error)
    console.log('Error capturado:', error);
    
    // Mostrar modal de error para excepciones
    showError('registration', error.message || 'Error de conexión al registrar el certificado')
    
  } finally {
    // Limpiar timer si existía (por si acaso)
    if (processingTimer) {
      clearInterval(processingTimer)
      processingTimer = null
    }
  }
}

const close = () => {
  // Limpiar todos los timers
  if (processingTimer) {
    clearInterval(processingTimer)
    processingTimer = null
  }
  if (verificationTimer) {
    clearInterval(verificationTimer)
    verificationTimer = null
  }
  
  visible.value = false
  emit('cancel')
  resetUploadState()
}

const resetUploadState = () => {
  fileStates.clear()
  isVerifying.value = false
  isVerified.value = false
  isProcessing.value = false
  verificationProgress.value = 0
  selectedFile.value = null
  fileBase64.value = ''
  justification.value = ''
  remainingTime.value = 30
  verificationData.value = []
  showErrorDialog.value = false
  errorType.value = 'verification'
  errorMessage.value = ''
  showSizeErrorSnackbar.value = false
  errorFileName.value = ''
  sizeErrorMessage.value = ''
}

// Limpiar timers cuando el componente se desmonta
onUnmounted(() => {
  if (processingTimer) {
    clearInterval(processingTimer)
    processingTimer = null
  }
  if (verificationTimer) {
    clearInterval(verificationTimer)
    verificationTimer = null
  }
})

// Watchers
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
})

watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
  if (!newVal) {
    resetUploadState()
  }
})
</script>