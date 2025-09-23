<template>
    <div>
      <div v-if="channelData" class="flex flex-col gap-8">
        <XHeader :title="`Editar canal - ${channelData.name}`" :breadcrumb-items="itemsBreadChannelsEdit" :show-breadcrumb="true" @back-click="goBack"/>
        <span class="text-normal font-normal">Registra el certificado del canal y/o modifica el centro de procesamiento.</span>
    
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
                @click="openConfirmEditModal"
                class="w-75"
                :disabled="!hasRouteChanged"
              />
            </div>
          </div>
        </div>
        </div>
      </div>
    
      <Toast position="top-right" />

    <ConfirmDialogWrapper
      v-model="confirmDialogEditChannel.visible"
      :options="confirmDialogEditChannel.options"
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
import type { RouteSelection } from '~/features/channels/type';
import ChannelsModalCertificate from '~/features/channels/ChannelsModalCertificate.vue';
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';
import ConfirmDialogWrapper from '~/components/overlay/ConfirmDialogWrapper.vue';
import { useChannelService } from '~/componsables/channels/useChannels';
//Composable
const { channelData, loading, error, loadChannelsDetails, updateChannel } = useChannelService();

const route = useRoute();
const router = useRouter();

// State
const saving = ref(false)

const selectedRouteAlias = ref<string>('')
const originalSelectedRoute = ref<string>('')
const visibleDialogCertificate = ref(false)
const visibleDialogCertificateRegister = ref(false)


const channelCode = computed(() => route.params.code as string)

const itemsBreadChannelsEdit = getBreadcrumbItems('channels', 'edit');

const confirmDialogEditChannel = ref({
    visible: false,
    options: {
        title: '',
        message: '',
        onConfirm: () => {},
        onCancel: () =>{}
    }
})

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
  const response = await loadChannelsDetails(channelCode.value)
    
    if (response?.routes && response.routes.length > 0) {
        const activeRoute = response.routes.find(r => r.isActive)
        if (activeRoute?.alias) {
            selectedRouteAlias.value = activeRoute.alias
            originalSelectedRoute.value = activeRoute.alias
        } else if (response.routes.length > 0) {
            selectedRouteAlias.value = ''
            originalSelectedRoute.value = ''
        }
    }
};

const openConfirmEditModal = () => {
  confirmDialogEditChannel.value = {
      visible: true,
      options: {
            title: 'Confirmar cambio de CPD ',
            icon: 'x:warning-circle',
            iconColor: 'text-yellow-500',
            message: `¿Estás seguro de cambiar del ${ previousRouteData.value?.alias }
                        al
                        <span class="font-semibold">${ selectedRouteData.value?.alias }</span>
                        con ruta <span class="font-semibold">${ selectedRouteData?.value?.urls.join(', ') }</span>?`,
            onConfirm: async () => {
                await handleConfirmChange()
            },
            onCancel: () => {
              console.log('Usuario canceló la acción');
            }
      }
    }
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

    const response = await updateChannel(updateData);
    if (response) {
      originalSelectedRoute.value = selectedRouteAlias.value;
      await loadChannelData();
    }    
  } catch (err) {
    console.error('Error updating channel:', err)
  } finally {
    saving.value = false
    confirmDialogEditChannel.value.visible = false
}}

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