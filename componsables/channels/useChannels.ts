import type { ToastMessageOptions } from "primevue";
import type { ChannelsListItem, ChannelsResponse, ChannelsSaveResponse } from "~/features/channels/type";
import type { ServiceError } from "~/features/users/types";
import { channelsService } from "~/services/channelsService";

export function useChannelService() {
    const channels = ref<ChannelsListItem[]>([]);
    const channelData = ref<ChannelsResponse | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const toast = useToast()

    const showToast = (message: ToastMessageOptions) => {
        toast.add(message)
    }

    const loadChannels = async (): Promise<void> => {
        loading.value = true
        error.value = null
        try {
            const response = await channelsService.getChannels()
            if (response) {
                channels.value = response.paymentSystems
            }
        } catch (err) {
            const serviceError = err as ServiceError
            error.value = serviceError.message || 'Error loading channels'
            
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || 'Error al cargar los canales',
                life: 5000
            })
            
            throw err
        } finally {
            loading.value = false
        }
    }

    const loadChannelsDetails = async (channelCode: string): Promise<ChannelsResponse | null> => {
        loading.value = true
        error.value = null
        try {
            const response = await channelsService.getChannelsByCode(channelCode)
            if (response) {
                channelData.value = response
                return response
            }
            return null
        } catch (err) {
            const serviceError = err as ServiceError
            error.value = serviceError.message || 'Error al cargar la información del canal'
            
            console.error('Error loading channel data:', err)
            
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || 'Error al cargar la información del canal',
                life: 5000
            })
            
            return null
        } finally {
            loading.value = false
        }
    }

    const updateChannel = async (updateData: ChannelsSaveResponse): Promise<boolean> => {
        try {
            console.log('Update Data:', updateData);
            const response = await channelsService.updateChannels(updateData);
            console.log('Response Channels: ', response);
            
            if (response) {
                console.log('Operación exitosa');
                
                // Encontrar el alias del CPD activo para el mensaje
                const activeRoute = updateData.routes?.find(r => r.isActive);
                const activeAlias = activeRoute?.alias || 'desconocido';
                
                showToast({ 
                    severity: 'success', 
                    summary: `Nuevo CPD ${activeAlias} asignado correctamente`,
                    // detail: `Nuevo CPD ${activeAlias} asignado correctamente`, 
                    life: 3000 
                });
                
                return true;
            } else {
                console.log('Respuesta no exitosa del servidor');
                showToast({ 
                    severity: 'error', 
                    summary: 'Error',
                    detail: 'Error al procesar la solicitud', 
                    life: 3000 
                });
                
                return false;
            }
            
        } catch (err) {
            const serviceError = err as ServiceError;
            console.error('Error updating channel:', err);
            
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || 'Error al guardar los cambios',
                life: 5000
            });
            
            throw err;
        }
    };

    return {
        //State
        channels,
        channelData,
        loading,
        error,
        //Methods
        loadChannels,
        loadChannelsDetails,
        updateChannel,
        showToast
    }
}