<template>
    <div>
        <div class="flex flex-col gap-8">
            <XHeader  title="Editar Canal" />
            <span class="text-normal font-normal">Esta sección te permite modificar el centro de procesamiento, asegúrate de contar con los certificados y respaldos correspondientes.</span>
        </div>

        <div class="pt-12 flex flex-col gap-20">
            <XCard class="bg-secondary-50 gap-2">
                <template #header>
                    <div class="font-semibold text-[20px] text-primary-400">Administradora de Cámaras de compensación</div>
                </template>
                <template #content>
                    <div class="flex gap-24 items-center">
                        <div class="flex gap-4 w-[200px]">
                            <span class="font-semibold  text-gray-800">Código:</span>
                            <span class="text-gray-600 font-medium">1426</span>
                        </div>
                        <div class="flex gap-4 w-[200px]">
                            <span class="font-semibold  text-gray-800 pl-9">Sigla:</span>
                            <span class="text-gray-600 font-medium">ACCL</span>
                        </div>  
                    </div>
                </template>
            </XCard>
            <div class="flex justify-end  gap-4">
                <XButton label="Registrar certificado público" icon="think-plus" @click="visible = true" />
                            <XDialog 
                v-model:visible="visible" 
                modal
                :closable="false"
                header="Registrar certificado público" 
                :style="{ width: '50rem' }" 
                :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
            > 
                <div class="flex flex-col gap-8">
                    <p class="m-0">
                        Ingresa el archivo del certificado público para cargarlo y verificar sus datos
                    </p>
                    
                    <XFileUpload
                        ref="fileupload"
                        name="demo[]"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        :maxFileSize="1000000"
                        @select="onFileSelect"
                        :showUploadButton="false"
                        :showCancelButton="false"
                        chooseLabel="Elegir archivo"
                        :auto="false"
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
                                        <span class="p-fileupload-file-size">{{ formatFileSize(file.size) }}</span>
                                        
                                        <!-- Mostrar "Cargando..." mientras se procesa -->
                                        <div v-if="!file.isLoaded" class="loading-text">
                                            <span class="text-xs text-gray-500">Cargando...</span>
                                        </div>
                                    </div>

                                    <!-- Mostrar "Carga completa" cuando termine -->
                                    <span 
                                        v-if="file.isLoaded" 
                                        class="p-badge p-component p-badge-success p-fileupload-file-badge"
                                    >
                                        Carga Completa
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

                                    <div v-if="file.isLoaded" class="verify-button-container">
                                        <XButton 
                                            label="Verificar certificado"
                                            class="!w-[160px] mt-2"  
                                            @click="verifyCertificate(file)"
                                            size="small"
                                        />
                                    </div>
                                </div>
                            </div>
                        </template>
                    </XFileUpload>

                    <XDivider />
                    
                    <div class="flex justify-end gap-4">
                        <XButton 
                            label="Cancelar"
                            variant="text"
                            class="!w-[130px]" 
                            @click="visible = false"
                        />
                        <XButton 
                            label="Registrar"
                            class="!w-[130px]"  
                            type="submit"
                            :disabled="!hasFilesLoaded"
                        />
                    </div>
                </div>
            </XDialog>
            </div>
            <XDialog 
                v-model:visible="visible" 
                modal
                :closable="false"
                header="Registrar certificado público" 
                :style="{ width: '50rem' }" 
                :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
            > 
                <div class="flex flex-col gap-8">
                    <p class="text-gray-700">Ingresa el archivo del certificado público para cargarlo y verificar sus datos</p>
                    <XFileUpload
                        ref="fileupload"
                        name="demo[]"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        :maxFileSize="1000000"
                        @select="onFileSelect"
                        :showUploadButton="false"
                        :showCancelButton="false"
                        chooseLabel="Elegir archivo"
                        :auto="false"
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
                                        <span class="p-fileupload-file-size">{{ formatFileSize(file.size) }}</span>
                                    </div>

                                    <!-- Estado de carga -->
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
                                        <!-- Botón Verificar -->
                                        <XButton 
                                            v-if="!isVerifying && !isVerified"
                                            label="Verificar certificado"
                                            class="w-[160px]"  
                                            @click="verifyCertificate(files)"
                                            :disabled="!hasFilesLoaded"
                                        />
                                    </div>
                                    <div v-if="isVerifying" class="w-full">
                                        <div class="flex items-center justify-center gap-3 mb-3">
                                            <Icon name="x:loader" class="text-primary-500 animate-spin text-xl"/>
                                            <span class="text-gray-700">Verificando certificado...</span>
                                        </div>
                                        <ProgressSpinner 
                                            :value="verificationProgress" 
                                            style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </template>
                    </XFileUpload>

                    <div v-if="isVerified" class="flex flex-col gap-8">
                        <p class="text-gray-700">Asegúrate que los datos del certificado son correctos para registrarlo.</p>
                        <DataTable :value="certificado">
                            <Column field="nroserie" header="Nro. Serie" style="width: 218px"></Column>
                            <Column field="validodesde" header="Válido desde" style="width: 218px"></Column>
                            <Column field="validohasta" header="Válido hasta" style="width: 218px"></Column>
                        </DataTable>

                        <XTextarea label="Justificación" label-required  placeholder="Ingrese un motivo" name="textarea"/>
                    </div>

                    <XDivider />
                    <div class="flex justify-end gap-4">
                        <XButton 
                            label="Cancelar"
                            variant="text"
                            class="!w-[130px]" 
                            @click="visible = false"
                        />
                        <XButton 
                            label="Registrar"
                            class="!w-[130px]"  
                            type="submit"
                            disabled
                        />
                    </div>
                </div>
            </XDialog>

            <DataTable :value="editarCanal" tableStyle="min-width: 50rem">
                <Column field="rutaCanal" header="Ruta" style="width: 456.5px"></Column>
                <Column field="aliasCPD" header="Alias CPD" style="width: 456.5px "></Column>
                <Column field="ultimamodificacion" header="Ultima Modificación" style="width: 207px ">
                    <template #body="{ data }">
                        <XRadioButton v-model="data.ultimamodificacion" :binary="true"/>
                    </template>
                </Column>
            </DataTable>

            <XCard class="border border-secondary-400">
                <template #content>
                    <div class="flex flex-row gap-6 border-gray-500">
                        <p class="font-bold text-gray-400 pl-[19px]">
                            Rutas:
                        </p>
                        <p class="text-gray-400 font-medium">
                            https://admicamACCLcam/Servicio de mensajería
                            <br>https://admicamACCLcam/Servicio de consulta</br>
                            <br>https://admicamACCLcam/Servicio de certificado</br>
                        </p>
                    </div>
                </template>
            </XCard>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ProgressSpinner } from '#components'
import { ref, computed, watch, reactive } from 'vue'

const editarCanal = ref([
    { rutaCanal: 'https://admicamACCLcam... ', aliasCPD: 'COD001', ultimamodificacion: true},
    { rutaCanal: 'https://admicamACCLcam...', aliasCPD: 'COD002', ultimamodificacion: false},
])

const visible = ref(false)
const fileStates = reactive(new Map())
const isVerifying = ref(false)
const isVerified = ref(false)
const verificationProgress = ref(0)

// Computed para verificar si hay archivos cargados
const hasFilesLoaded = computed(() => {
  return Array.from(fileStates.values()).some(state => state.isLoaded)
})

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileKey = (file) => {
  return `${file.name}-${file.size}-${file.lastModified}`
}

const getFileStatus = (file) => {
  const fileKey = getFileKey(file)
  return fileStates.get(fileKey) || { 
    isLoaded: false, 
    progress: 0 
  }
}

const onFileSelect = (event) => {
  // Reiniciar estados de verificación al seleccionar nuevo archivo
  isVerifying.value = false
  isVerified.value = false
  verificationProgress.value = 0
  
  // Inicializar estado para cada archivo
  event.files.forEach(file => {
    const fileKey = getFileKey(file)
    if (!fileStates.has(fileKey)) {
      fileStates.set(fileKey, {
        isLoaded: false,
        progress: 0,
        file: file
      })
      
      // Simular carga del archivo
      simulateFileLoading(fileKey)
    }
  })
}

const simulateFileLoading = (fileKey) => {
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

const verifyCertificate = (files) => {
  // Iniciar verificación
  isVerifying.value = true
  isVerified.value = false
  verificationProgress.value = 0
  
  console.log('Iniciando verificación de certificado...', files)
  
  // Simular proceso de verificación
  simulateVerification()
}

const simulateVerification = () => {
  let progress = 0
  const interval = setInterval(() => {
    progress += 10
    verificationProgress.value = progress
    
    if (progress >= 100) {
      clearInterval(interval)
      
      // Verificación completada
      isVerifying.value = false
      isVerified.value = true
      
      console.log('Certificado verificado exitosamente')
    }
  }, 300) // Simular 3 segundos de verificación
}

const resetUploadState = () => {
  // Reiniciar todos los estados
  fileStates.clear()
  isVerifying.value = false
  isVerified.value = false
  verificationProgress.value = 0
}

// Reiniciar estado cuando se abre/cierra el diálogo
watch(visible, (newVal) => {
  if (!newVal) {
    resetUploadState()
  }
})


const certificado = ref([
    { nroserie: '10A5DS100F567JWEE', validodesde: '12/05/2025', validohasta:'12/05/2026' },
    
]);
</script>