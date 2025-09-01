import type {  ParameterDetailResponse } from "~/features/parameters/types"
import type { ServiceError } from "~/features/users/types"
import { parametersService } from "~/services/parametersService"

export function useParameterService() {
    const toast = useToast()

    const showToast = (message: any) => {
        toast.add(message)
    }

    const loadParameterDetails = async (parameterCode: string): Promise<ParameterDetailResponse[] | null> => {
        try {
            const response = await parametersService.getParameterByCode(parameterCode)
            console.log('Data Parameters: ',response.data);
            return response.data
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

    return {
        loadParameterDetails,
        showToast
    }
}