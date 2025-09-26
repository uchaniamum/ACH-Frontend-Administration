<template>
    <Dialog v-model:visible="visible" modal :closable="false" :header="`${update ? 'Modificar': 'Registrar'} certificado ${private ? 'privado' : 'publico'}`"
        class="w-[53rem]">
        <div class="flex flex-col">
            <!-- <XFileUpload v-bind="$attrs" :name=props.name :accept="documentsAccepted" :maxFileSize="5000000" -->
             <XFileUpload v-bind="$attrs" name="files" accept=".txt,.pfx" :maxFileSize="5000000"
                :fileLimit="1" @select="onFileSelect($event)" :showUploadButton="false" :showCancelButton="false"
                chooseLabel="Elegir archivo" :auto="false">
                <template #empty>
                    <div class="mb-6 mt-4 px-[1.714rem]">
                        <span class="text-normal font-normal">Arrastra y suelta archivos aquí para subirlos.</span>
                    </div>
                </template>
                <template #content="{ files, removeFileCallback, removeUploadedFileCallback }">
                    <div class="p-fileupload-file-list">
                        <div v-for="(file, index) in files" :key="index" class="p-fileupload-file">
                            <div class="p-fileupload-file-thumbnail custom-thumbnail">
                                <Icon name="x:page" class="text-[48px] text-gray-200" />
                            </div>
                            <div class="p-fileupload-file-info">
                                <div class="p-fileupload-file-name">{{ file.name }}</div>
                                <span class="p-fileupload-file-size">{{ formatFileSize(file.size) }}</span>
                            </div>
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
                                    @click="onRemoveFile(file, index, removeFileCallback, removeUploadedFileCallback, files)"
                                    type="button">
                                    <span class="p-button-icon p-c">
                                        <Icon name="x:cancel"></Icon>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </template>
            </XFileUpload>
            <div v-if="props.private" class="py-12">
                <XInputText name="password" v-model="password" label="Contraseña" label-required :rules="[
                    (v: any) => !!v || 'El campo es requerido'
                ]"/>    
             </div>
            <!-- Verification public certificate -->
            <div v-if="!props.private  && hasFilesLoaded" class="flex justify-center items-center py-4">
                <XButton label="Verificar Certificado" @click="verificateCertificadePublic()"/>
            </div>  
            <!-- Verificacion de certificado privado -->
            <div v-if="props.private && hasFilesLoaded && !!password" class="flex justify-center items-center py-4">
                <XButton label="Verificar Certificado Privado" @click="verificateCertificadePrivate()"/>
            </div>  
            <div v-if="verificationCertificate">
                <DataTable :value="verificationCertifcateData">
                    <Column field="serialNumber" header="Nro. de serie"/>
                    <Column field="validFrom" header="Válido desde"/>
                    <Column field="validTo" header="Válido hasta"/>
                </DataTable>
            </div>
            <XTextarea v-if="update && verificateCertificate" v-model="reason" label="Justificación" label-required rows="5" cols="30" name="reason" :rules="[(v:any) => !!v || 'El campo es requerido']" />
            <XDivider class="my-8"/>
            <div v-if="!props.private" class="flex justify-end">
                <XButton variant="text" label="Cancelar" @click="closeModal"/>
                <XButton label="Cargar publico" @click="certificateChargePublic" :disabled="!verificateCertificate"/>
            </div>
            <div v-if="props.private" class="flex justify-end">
                <!-- <div>verificate: {{ !verificateCertificate }}</div>
                <div>pass:  {{ !!!password }}</div> -->
                <XButton variant="text" label="Cancelar" @click="closeModal"/>
                <XButton label="Cargar Privado" @click="certificateChargePrivate" :disabled="!verificateCertificate"/>
            </div>
        </div>
    </Dialog>
</template>
<script lang="ts" setup>

const { registerCertificatePublicExternal, chargeCertificatePrivate } = usePartipantsService()
const { formatDate } = useDates();

const visible = defineModel<boolean>('visible')
const reason = ref("")
const password = ref();
const uploadStatus = ref({})
const fileupload = ref(null);
const isVerifying = ref(false)
const isVerified = ref(false)
const verificationProgress = ref(0)
const fileStates = reactive(new Map())
const selectedFile = ref<File | null>(null)
const fileBase64 = ref<string>('')
const justification = ref('')
const isChargedFile = ref(true)
const verificationData = ref<VerificationData[]>([])
const verificationCertificate = ref<boolean>(false)
const verificationCertifcateData = ref<any[]>()
const props = defineProps<{
    private?: boolean
    update?: boolean
}>();

import { useField, type RuleExpression } from 'vee-validate';
import { useDates } from '~/componsables/useDates';
import { usePartipantsService } from '~/componsables/useParticipants';

// const props = defineProps<{
//     documentsAccepted?: '.txt',
//     name:string,
//     modelValue: any | null,
//     rules?: MaybeRef<RuleExpression<string | null | undefined>>;
// }>();

const { value, errorMessage } = useField(props.name || '', props.rules)

// watch(() => props.modelValue, (v: any | null | undefined) => value.value = v);

const emit = defineEmits<{
  (event: "certificate", certificate?: any | null): void;
}>();

function onFileSelect(event: any) {
    console.log('el file es: ', event)
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
    }
    // emit("update:modelValue", value.value);
}

function onRemoveFile(file, index, removeFileCallback, removeUploadedFileCallback) {
    removeFileCallback(index);
    removeUploadedFileCallback(file);
    value.value = undefined
    resetUploadState()
    verificationCertificate.value = false
    verificationCertifcateData.value = null
    emit("update:modelValue", value);
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

const getFileKey = (file: any) => {
    return `${file.name}-${file.size}-${file.lastModified}`
}

const verificateCertificate = computed(() => !!verificationCertifcateData.value)

const hasFilesLoaded = computed(() => {
  return Array.from(fileStates.values()).some(state => state.isLoaded)
})

const verificateCertificadePublic = async () =>{
    console.log('el archivo selleccionado es: ', selectedFile.value)
    try {
        if(!selectedFile.value) return
        fileBase64.value =  await fileToBase64(selectedFile.value)
        const response = await registerCertificatePublicExternal({
            publicCertificate: {
                base64Content: fileBase64.value
            }
        })
        if(!response) return
        verificationCertifcateData.value = [{
            serialNumber: response.serialNumber,
            validFrom :formatDate(response.ValidFrom),
            validTo :formatDate(response.ValidTo)
        }]
        verificationCertificate.value = true

    } catch (error) {
        console.log('error')
    }
}

const verificateCertificadePrivate = async () =>{
    console.log('el valor es: ', {
        file: selectedFile.value,
        pass: password.value
    })
    try {
        if(!selectedFile.value && !!!password.value) return
        fileBase64.value =  await fileToBase64(selectedFile.value)
        const response = await chargeCertificatePrivate({
            privateCertificate: {
                base64Content: fileBase64.value,
                password: password.value
            }
        })
        console.log('la respuesta es: ', response)
        if(!response) return
        verificationCertifcateData.value = [{
            serialNumber: response.serialNumber,
            validFrom :formatDate(response.ValidFrom),
            validTo :formatDate(response.ValidTo)
        }]
        verificationCertificate.value = true

    } catch (error) {
        console.log('error')
    }
}

watch(visible,()=>{
    resetUploadState()
    password.value = ""
    reason.value=""
    verificationCertificate.value = false
    verificationCertifcateData.value = null
})


const closeModal = () => {
    visible.value = false
    resetUploadState()
    verificationCertificate.value = false
    verificationCertifcateData.value = null
}

function certificateChargePublic(){
    if(!fileBase64.value && !password.value) return
    if (props.update) {
        emit('certificate', {
            base64: fileBase64.value,
            dataCertificate: verificationCertifcateData.value,
            reason: reason.value
        })
    }else{
        emit('certificate', {
            base64: fileBase64.value,
            dataCertificate: verificationCertifcateData.value
        })
    }
    visible.value = false
}

function certificateChargePrivate(){
    console.log("el certificado privado es: ",{
        base64: fileBase64.value,
        password: password.value,
    })
    if(!fileBase64.value && !password.value) return
    emit('update:modelValue', {
        base64: fileBase64.value,
        pass: password.value
    })
}

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

const resetUploadState = () => {
  fileStates.clear()
  isVerifying.value = false
  isVerified.value = false
  verificationProgress.value = 0
  selectedFile.value = null
  fileBase64.value = ''
  justification.value = ''
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
</script>