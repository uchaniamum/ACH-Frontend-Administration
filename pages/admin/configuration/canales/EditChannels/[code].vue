<template>
    <div>
      <div v-if="channelData" class="flex flex-col gap-8">
        <XHeader :title="`Editar canal - ${channelData.name}`"  @back-click="goBack"/>
        <span class="text-normal font-normal">Esta sección te permite modificar el centro de procesamiento, asegúrate de contar con los certificados y respaldos correspondientes.</span>
    
        <div class="pt-12 flex flex-col gap-20">
        <div class="px-[calc((210/14)*1rem)] flex flex-col gap-12 ">
          <div class="flex justify-end">
            <XButton variant="outlined" icon="plus" label="Registrar certificado público" @click="handleCertificateRegistered"/>
          </div>
          
          <!-- DataTable -->
          <DataTable :value="processedRoutes" class="w-full">
            <Column header="Ruta" sortable>
              <template #body="{ data }">
                <div v-for="(url, index) in data.urls" :key="index">
                    <div v-if="index === 0">
                      {{ url }} ...
                    </div>
                </div>
              </template>
            </Column>
            
            <Column header="CPD" sortable>
              <template #body="{ data, index }">
                <div class="flex flex-row gap-4 items-center">
                  <XRadioButton 
                    name="canal" 
                    v-model="selectedRouteAlias" 
                    :value="data.alias" 
                    :inputId="`canal-${index}`"
                  />
                  <span :for="`canal-${index}`">{{ data.alias }}</span>
                </div>
              </template>
            </Column>
          </DataTable>
          
          <XCard v-if="selectedRouteData" class="border border-secondary-400">
              <template #content>
                  <div class="flex flex-row gap-6 border-gray-500">
                      <p class="font-bold text-gray-400">
                          Rutas:
                      </p>
                      <div class="flex flex-col">
                        <p class="text-gray-400 font-medium" 
                            v-for="(url, index) in selectedRouteData.urls" :key="index">
                            <span>{{ url }}</span>
                        </p>
                      </div>
                  </div>
              </template>
          </XCard>
          <!-- Actions -->
          <div v-if="hasRouteChanged" class="flex flex-col">
            <XDivider class="mb-6"/>
            <div class="w-full flex flex-row justify-end gap-6">
              <XButton 
                variant="outlined" 
                label="Cancelar" 
                @click="resetSelection"
                class="w-75"
              />
              <XButton 
                label="Guardar" 
                @click="confirmModalVisible = true"
                class="w-75"
              />
            </div>
          </div>
        </div>
        </div>
      </div>
    
      <Toast position="top-right" />

    <ChannelsModalConfirm
      v-model="confirmModalVisible"
      :current-selection="selectedRouteData"
      :previous-selection="previousRouteData"
      @confirm="handleConfirmChange"
      @cancel="handleCloseCertificateModal"
      
    />

    <ChannelsModalCertificate
      v-model="visibleDialogCertificate"
      :channel-code="channelData?.code"
      :channel-name="channelData?.name"
      @close="visibleDialogCertificate = false"
    />

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
                  <XButton label="Cancelar" variant="outlined" @click="visibleDialogCertificateRegister=false" class="w-65"/>
                  <XButton label="Continuar" @click="visibleDialogCertificate = true; visibleDialogCertificateRegister = false" class="w-65"/>
              </div>
      </template>  
    </XConfirmDialog>
    </div>
    
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToast } from 'primevue/usetoast';
import { channelsService } from '~/services/channelsService';
import type { ChannelsResponse } from '~/features/channels/type';
import ChannelsModalConfirm, { type RouteSelection } from '~/features/channels/ChannelsModalConfirm.vue';
import ChannelsModalCertificate from '~/features/channels/ChannelsModalCertificate.vue';

const route = useRoute();
const router = useRouter();

const toast = useToast();

// Estados
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const channelData = ref<ChannelsResponse | null>(null)
const selectedRouteAlias = ref<string>('')
const originalSelectedRoute = ref<string>('')
const confirmModalVisible = ref(false)
const visibleDialogCertificate = ref(false)
const visibleDialogCertificateRegister = ref(false)


const channelCode = computed(() => route.params.code as string)

// Computed properties
const processedRoutes = computed(() => {
  if (!channelData.value) return []
  return channelData.value.routes
})

const selectedRouteData = computed<RouteSelection | undefined>(() => {
  if (!channelData.value || !selectedRouteAlias.value) return undefined
  const found = channelData.value.routes?.find(r => r.alias === selectedRouteAlias.value)
  return found
    ? {
        alias: found.alias ?? '',
        isActive: found.isActive ?? false,
        urls: found.urls ?? [],
      }
    : undefined
})

const previousRouteData = computed<RouteSelection | undefined>(() => {
  if (!channelData.value || !originalSelectedRoute.value) return undefined
  const found = channelData.value.routes?.find(r => r.alias === originalSelectedRoute.value)
  return found
    ? {
        alias: found.alias ?? '',
        isActive: found.isActive ?? false,
        urls: found.urls ?? [],
      }
    : undefined
})

const hasRouteChanged = computed(() => {
  return selectedRouteAlias.value !== originalSelectedRoute.value
})

const loadChannelData = async () => {
    try {
        loading.value = true
        error.value = null
        
        const response = await channelsService.getChannelsByCode(channelCode.value)
        if(response){
          channelData.value = response
          
          if (channelData.value.routes && channelData.value.routes.length > 0) {
            const activeRoute = channelData.value.routes.find(r => r.isActive)
            if (activeRoute?.alias) {
                selectedRouteAlias.value = activeRoute.alias
                originalSelectedRoute.value = activeRoute.alias
            } else if (channelData.value.routes.length > 0) {
                selectedRouteAlias.value = ''
                originalSelectedRoute.value = ''
            }
        }
      }
    } catch (err: any) {
        console.error('Error loading channel data:', err)
        error.value = err.message || 'Error al cargar la información del canal'
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.value,
            life: 5000
        })
    } finally {
        loading.value = false
    }
};

const showToast = (message: any) => {
    toast.add(message)
}

// NAVEGACIÓN
const goBack = () => {
    router.back();
};

const handleConfirmChange = async () => {
  if (!channelData.value || !selectedRouteData.value) return

  try {
    saving.value = true
    
    const updateData = {
      code: channelData.value.code,
      name: channelData.value.name,
      acronym: channelData.value.acronym,
      routes: channelData.value.routes?.map(route => ({
        alias: route.alias,
        isActive: route.alias === selectedRouteAlias.value,
        urls: route.urls,
        target: route.target
      })),
      changeReason: `Cambio de CPD de ${originalSelectedRoute.value} a ${selectedRouteAlias.value}`
    }

    console.log('Update Data:', updateData);
    const response = await channelsService.updateChannels(updateData);
    console.log('Response Channels: ', response);
    
    if (response) {
      console.log('Operación exitosa');
      
      originalSelectedRoute.value = selectedRouteAlias.value;
      showToast({ 
        severity: 'success', 
        summary: 'Éxito',
        detail: `Nuevo CPD ${selectedRouteAlias.value} asignado correctamente`, 
        life: 3000 
      });
      
      // Opcional: Recargar los datos para sincronizar con el servidor
      await loadChannelData();
      
    } else {
      // Manejar respuesta no exitosa del servidor
      console.log('Respuesta no exitosa del servidor');
      showToast({ 
        severity: 'error', 
        summary: 'Error',
        detail: 'Error al procesar la solicitud', 
        life: 3000 
      });
    }
    
  } catch (err: any) {
    console.error('Error updating channel:', err)
    showToast({
      severity: 'error',
      summary: 'Error',
      detail: err.message || 'Error al guardar los cambios',
      life: 5000
    })
  } finally {
    saving.value = false
    confirmModalVisible.value = false
  }
}

const resetSelection = () => {
  selectedRouteAlias.value = originalSelectedRoute.value
}

//Cambiar certificado
const handleCertificateRegistered = () => {
  if(channelData.value?.certificateRegistered){
    visibleDialogCertificate.value = false;
    visibleDialogCertificateRegister.value = true;
  }else{

    visibleDialogCertificate.value = true;
  }
}

const handleCloseCertificateModal = async () => {
  visibleDialogCertificate.value = false
  await loadChannelData()
}


// Lifecycle
onMounted(() => {
  if (channelCode.value) {
    loadChannelData()
  } else {
    error.value = 'Código de canal no especificado'
    loading.value = false
  }
})

// Watcher para cambios en el código del canal
watch(channelCode, (newCode) => {
  if (newCode) {
    loadChannelData()
  }
})


</script>