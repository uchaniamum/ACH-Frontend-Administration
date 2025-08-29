<template>
    <div>
      <div v-if="channelData" class="flex flex-col gap-8">
        <XHeader :title="`Editar canal - ${channelData.name}`" />
        <span class="text-normal font-normal">Esta sección te permite modificar el centro de procesamiento, asegúrate de contar con los certificados y respaldos correspondientes.</span>
    
        <div class="pt-12 flex flex-col gap-20">
        <div class="px-[calc((210/14)*1rem)] flex flex-col gap-12 ">
          <div class="flex justify-end">
            <XButton variant="outlined" icon="plus" label="Registrar certificado público" @click="visibleDialogCertificate = true"/>
          </div>
          
          <!-- DataTable -->
          <DataTable :value="processedRoutes" class="w-full">
            <Column header="Ruta" sortable>
              <template #body="{ data }">
                <div v-for="(url, index) in data.urls" :key="index">
                    {{ url }}
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
      @cancel="confirmModalVisible = false"
    />

    <ChannelsModalCertificate
      v-model="visibleDialogCertificate"
      :channel-code="channelData?.code"
      :channel-name="channelData?.name"
      @registered="handleCertificateRegistered"
      @close="visibleDialogCertificate = false"
    />
    </div>
    
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToast } from 'primevue/usetoast';
import { channelsService } from '~/services/channelsService';
import type { ChannelsResponse } from '~/features/channels/type';
import ChannelsModalConfirm from '~/features/channels/ChannelsModalConfirm.vue';
import ChannelsModalCertificate from '~/features/channels/ChannelsModalCertificate.vue';

const route = useRoute();
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

const channelCode = computed(() => route.params.code as string)

// Computed properties
const processedRoutes = computed(() => {
  if (!channelData.value) return []
  return channelData.value.routes
})

const selectedRouteData = computed(() => {
  if (!channelData.value || !selectedRouteAlias.value) return null
  return channelData.value.routes.find(r => r.alias === selectedRouteAlias.value)
})

const previousRouteData = computed(() => {
  if (!channelData.value || !originalSelectedRoute.value) return null
  return channelData.value.routes.find(r => r.alias === originalSelectedRoute.value)
})

const hasRouteChanged = computed(() => {
  return selectedRouteAlias.value !== originalSelectedRoute.value
})



const loadChannelData = async () => {
    try {
        loading.value = true
        error.value = null
        
        const response = await channelsService.getChannelsByCode(channelCode.value)
        channelData.value = response
        
        // Encontrar la ruta activa actual
        const activeRoute = channelData.value.routes.find(r => r.isActive)
        if (activeRoute) {
            selectedRouteAlias.value = activeRoute.alias
            originalSelectedRoute.value = activeRoute.alias
        } else if (channelData.value.routes.length > 0) {
            selectedRouteAlias.value = channelData.value.routes[0].alias
            originalSelectedRoute.value = channelData.value.routes[0].alias
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


// Cambiar canal
const handleConfirmChange = async () => {
  if (!channelData.value || !selectedRouteData.value) return

  try {
    saving.value = true
    
    const updateData = {
      code: channelData.value.code,
      name: channelData.value.name,
      acronym: channelData.value.acronym,
      routes: channelData.value.routes.map(route => ({
        alias: route.alias,
        isActive: route.alias === selectedRouteAlias.value,
        urls: route.urls
      })),
      changeReason: `Cambio de CPD de ${originalSelectedRoute.value} a ${selectedRouteAlias.value}`
    }

    console.log('Update Data:', updateData);
    const response = await channelsService.updateChannels(updateData);
    console.log('Response Channels: ', response);
    if (response.wasSaved) {
      console.log('hols');
        showToast({ 
          severity: 'success', 
          summary: `Nuevo CPD ${selectedRouteAlias.value} asignado correctamente`, 
          life: 3000 
        })
    }
    
  } catch (err: any) {
    console.error('Error updating channel:', err)
    toast.add({
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
const handleCertificateRegistered = (certificateData: any) => {
  console.log('Certificado registrado:', certificateData)
  toast.add({ 
    severity: 'success', 
    summary: 'Éxito',
    detail: 'Certificado registrado correctamente', 
    life: 3000 
  })
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