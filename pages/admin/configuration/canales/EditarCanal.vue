<template>
  <Toast position="top-right" />
  <XConfirmDialog
    v-model="visible"
    icon="x:info-empty"
    icon-color="text-blue-600"
    title="Confirmar cambio de CPD">
    <template #message>
        <div class="space-y-2">
            <p>
              <span class="font-medium text-gray-700">¿Estás seguro de cambiar del </span>
              <span class="font-semibold"> {{ canalSeleccionado.cpd.label }} a {{ canalAntiguo.cpd.label }}</span>
              <span class="font-medium text-gray-700"> con ruta </span>
              <span>{{ canalAntiguo.ruta }}</span>
            </p>
        </div>
    </template>
    <template #buttons>
            <div class="flex gap-3">
                <XButton label="Cancelar" severity="secondary" outlined @click="visible=false"/>
                <XButton label="Confirmar" @click="saveConfirm" />
            </div>
    </template>  
  </XConfirmDialog>
  <XConfirmDialog
    v-model="visibleDialogCertificateRegister"
    icon="x:warning-circle"
    icon-color="text-yellow-500"
    title="Certificado ya registrado">
    <template #message>
        <div class="space-y-2">
            <p>
              <span class="font-medium text-gray-700">Ya se cuenta con un certificado registrado, ¿Deseas continuar en el cargado de un nuevo certificado?</span>
            </p>
        </div>
    </template>
    <template #buttons>
            <div class="flex gap-3">
                <XButton label="Cancelar" severity="secondary" outlined @click="visibleDialogCertificateRegister=false"/>
                <XButton label="Confirmar" @click="visibleDialogCertificate = true; visibleDialogCertificateRegister = false" />
            </div>
    </template>  
  </XConfirmDialog>
  <XDialog 
    v-model:visible="visibleDialogCertificate" 
    modal 
    header="Registrar certificado público" 
    class="w-[calc((740/14)*1rem)]"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <template #maximizeicon="{ maximized, class: iconClass }">
      <Icon 
        :name="maximized ? 'x:collapse' : 'x:expand'" 
        :class="[iconClass, 'w-12 h-12']"
      />
    </template>
      <div class="flex flex-col gap-8">
        <span class="text-gray-700">Ingresa el archivo del certificado público para cargarlo y verificar sus datos</span>
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
                              class="flex justify-center"
                              :value="verificationProgress" 
                              style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
                          />
                      </div>
                  </div>
              </div>
          </template>
        </XFileUpload>
        <div v-if="isVerified" class="flex flex-col gap-8">
          <span class="text-gray-700">Asegúrate que los datos del certificado son correctos para registrarlo.</span>
          <DataTable :value="listVerifiaction">
            <Column field="nroSerie" header="Nro. de serie"></Column>
            <Column field="validacionInicio" header="Válido desde"></Column>
            <Column field="validacionFin" header="Válido hasta"></Column>
          </DataTable>
          <XTextarea name="justification" v-model="justification" label="Justificación" label-required placeholder="Ingresar motivo"/>
        </div>
        <XDivider />
        <div class="flex flex-row justify-end gap-4">
          <XButton @click="visibleDialogCertificate = false" variant="outlined" label="Cancelar" />
          <XButton @click="saveConfirmRegister()" label="Registrar"/> 
        </div>
      </div>
  </XDialog>
    <div>
        <div class="flex flex-col gap-8">
            <XHeader  title="Editar canal - Administradora de Cámaras de Compensación" />
            <span class="text-normal font-normal">Esta sección te permite modificar el centro de procesamiento, asegúrate de contar con los certificados y respaldos correspondientes.</span>
        </div>
        <div class="pt-12 flex flex-col gap-20">
            <div class="px-[calc((210/14)*1rem)] flex flex-col gap-12 ">
              <div class="flex justify-end">
                <!-- <XButton variant="outlined" icon="plus" label="Registrar certificado público" @click="visibleDialogCertificate = true"  canalSeleccionado/> -->
                <XButton variant="outlined" icon="plus" label="Registrar certificado público" @click="canalSeleccionado.certificado ? visibleDialogCertificateRegister = true : visibleDialogCertificate = true"   />
              </div>
              <!-- DataTable -->
              <DataTable :value="rutas" class="w-full">
                  <Column field="ruta" header="Ruta" />
                  <Column field="cpd" header="CPD">
                      <template #body="{ data, index }">
                          <div class="flex flex-row gap-4">
                          <RadioButton name="canal" v-model="canal" :value="data.cpd.label" :inputId="`canal-${ index }`"/>
                          <Xlabel :for="`canal-${ index }`">{{ data.cpd.label }}</Xlabel>
                          </div>
                      </template>
                  </Column>
              </DataTable>
              <!-- Card Rutas -->
               <XCard v-if="visibleRutes" class="border border-secondary-400">
                  <template #content>
                      <div class="flex flex-row gap-6 border-gray-500">
                          <p class="font-bold text-gray-400">
                              Rutas:
                          </p>
                          <div class="flex flex-col">
                            <p class="text-gray-400 font-medium" 
                                v-for="(ruta,index) in canalSeleccionado.rutasIntegradas" :key="index">
                                <span> {{ ruta.name }}</span>
                            </p>
                          </div>
                      </div>
                  </template>
               </XCard>
               <!-- Actions -->
               <div v-if="visibleRutes" class="flex flex-col">
                <XDivider class="mb-16"/>
                <div class="w-full flex flex-row justify-end gap-6">
                    <XButton variant="outlined" label="Cancelar"/>
                    <XButton label="Guardar" @click="visible=true"/>
                </div>
               </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ProgressSpinner, Title } from '#components'
import { ref, computed, watch, reactive } from 'vue'
import { useToast } from 'primevue/usetoast';

const justification = ref()

const listVerifiaction = ref([
  {
    nroSerie: '10A5DS100F567JWEE',
    validacionInicio: '12/05/2025',
    validacionFin: '12/05/2026'
  }
])

const testFetch = async() => {
  return await fetch('')
}

const toast = useToast();
const visibleDialogCertificate = ref(false)
const visibleDialogCertificateRegister = ref(false)
const saveConfirm = async () => {
  visible.value = false;
  await nextTick();
  toast.add({ 
      severity: 'success', 
      detail: 'Nuevo CPD SCZ asignado correctamente', 
      life: 3000 
  });
}
const saveConfirmRegister = async () => {
  visibleDialogCertificate.value = false;
  await nextTick();
  toast.add({ 
      severity: 'success', 
      detail: 'Certificado publico registrado', 
      life: 3000 
  });
}

function onAdvancedUpload(e: unknown) {
  console.log(e);
}

const rutas = [
    { 
        ruta: 'https://admicamACCLcamcvdsvdsva', 
        certificado: true,
        cpd:{ label: 'LPZ', value: false},
        rutasIntegradas: [
            {name: 'https://admicamACCLcam/Servicio de mensajería', value: '12121'},
            {name: 'https://admicamACCLcam/Servicio de consulta', value: '22222'},
            {name: 'https://admicamACCLcam/Servicio de certificado', value: '3333'},
        ]
    },
    { 
        ruta: 'https://admicamACCLcamcvdsvdsvavsvdsvdsvs', 
        cpd:{ label: 'SCZ', value: true},
        certificado: false,
        rutasIntegradas: [
            {name: 'https://admicamACCLcam/Servicio de mensajería 1', value: '4444'},
            {name: 'https://admicamACCLcam/Servicio de consulta 2', value: '5555'},
            {name: 'https://admicamACCLcam/Servicio de certificado  3', value: '6666'},
        ]
    },
    // { ruta: 'https://admicamACCLcamcvdsvdsvavs', cpd:{ label: 'CBBA', value: true} },
    // { ruta: 'https://admicamACCLcamcvdsv', cpd:{ label: 'ASF', value: false} }
]

const canal = ref(null)
const canalSeleccionado = ref()
const canalAntiguo = ref()
let visibleRutes = ref(false)
watch(canal,(newCanal:any, oldCanal:any) => {
    console.log('new value',newCanal)
    console.log('old value',oldCanal)
    canalAntiguo.value = oldCanal
    if(oldCanal != null) visibleRutes.value =true
    rutas.forEach(element => {
        if(element.cpd.label == newCanal) canalSeleccionado.value = element
    });
    rutas.forEach(element => {
        if(element.cpd.label == oldCanal) canalAntiguo.value = element
    });
    console.log(canalSeleccionado.value.ruta)
})

onMounted(() => {
  console.log(canal.value)
  const seleccionado = rutas.find(r => r.cpd.value === true)
  if (seleccionado) canal.value = seleccionado.cpd.label
})
// const editarCanal = ref([
//     { rutaCanal: 'https://admicamACCLcam... ', aliasCPD: 'COD001', ultimamodificacion: true},
//     { rutaCanal: 'https://admicamACCLcam...', aliasCPD: 'COD002', ultimamodificacion: false},
// ])

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