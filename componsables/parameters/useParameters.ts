import type { ToastMessageOptions } from "primevue";
import type { ParameterDetailResponse, ParameterHistoryItem, ParameterListItem, ParameterRequest, ParameterSaveResponse } from "~/features/parameters/types"
import type { ServiceError } from "~/features/users/types"
import { parametersService } from "~/services/parametersService"

export function useParameterService() {
    const parameters = ref<ParameterListItem[]>([]);
    const parameterHistory = ref<ParameterHistoryItem[]>([]);

    const loading = ref(false);
    const error = ref<string | null>(null);

    const toast = useToast()

    const showToast = (message: ToastMessageOptions) => {
        toast.add(message)
    }

    const loadParameters = async (): Promise<void> => {
        loading.value = true
        error.value = null
        try {
            const response = await parametersService.getParameters()
            parameters.value = response.parameters
        } catch (err) {
            const serviceError = err as ServiceError

            error.value = serviceError.message || 'Error loading parameters'

            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || 'Error al cargar los parámetros',
                life: 5000
            })

            throw err
        } finally {
            loading.value = false
        }
    }

    const loadParameterDetails = async (parameterCode: string): Promise<ParameterDetailResponse | null> => {
        try {
            const response = await parametersService.getParameterByCode(parameterCode)
            return response
        } catch (error) {
            console.error('Error loading user details:', error)
            const serviceError = error as ServiceError
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || 'No se pudieron cargar los detalles del usuario',
                life: 5000
            })
            return null
        }
    }

    const updateParameter = async (parameterData: ParameterRequest): Promise<ParameterSaveResponse> => {
        try {
            const response = await parametersService.updateParameter(parameterData)
            
            if (response.wasSaved) {
                await loadParameters()
                showToast({
                    severity: 'success',
                    //summary: 'Éxito',
                    summary: response.summary ||'Parámetro actualizado correctamente',
                    life: 5000
                })
            }
            
            return response
        } catch (err) {
            const serviceError = err as ServiceError
            
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || 'Error al actualizar el parámetro',
                life: 5000
            })
            
            throw err
        }
    }

    const loadHistorialParameter = async (): Promise<any> => {
        loading.value = true
        error.value = null
        try {
            const response = await parametersService.getHistoryParameter()
            parameterHistory.value = response.historicalParameters
            console.log(response.historicalParameters);
            return { data: response.historicalParameters };
        } catch (err) {
            const serviceError = err as ServiceError

            error.value = serviceError.message || 'Error loading parameters'

            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || 'Error al cargar los parámetros',
                life: 5000
            })

            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        // State
        parameters,
        loading,
        error,
        // Methods
        loadParameters,
        loadParameterDetails,
        updateParameter,
        loadHistorialParameter,
        //Toast
        showToast
    }
}