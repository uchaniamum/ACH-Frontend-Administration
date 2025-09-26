import type { Alert, ListAlerts } from "~/features/alerts/type"
import { alertsService } from "~/services/alertsService"

export function useAlertsService() {
    const toast = useToast()

    const showToast = (message: any) => {
        toast.add(message)
    }

    const updateEmails = async (data,code,gateway): Promise<any | null> => {
        try {
            const response = await alertsService.updateEmailsAlerts(data,code,gateway);
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

    const loadAlerts = async (): Promise<ListAlerts | null> => {
        try {
            const response = await alertsService.getAlerts();
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

    const alertHistorical = async (): Promise<any | null> => {
        try {
            const response = await alertsService.getAlertsHistorical();
            return response
        } catch (error) {
            console.error('Error loading user details:', error)
            const serviceError = error as ServiceError
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || 'No se pudieron cargar los datos de alerta',
                life: 5000
            })
            return null
        }
    }

    const getAlertCode = async (data:any): Promise<Alert> => {
        try {
            console.log('el valor dara ',data)
            const response = await alertsService.getAlertsByCode(data)
            console.log('response compo', response)
            return response
            // Verificar si la operación fue exitosa según la estructura de tu respuesta
            // if (response.wasSaved) {
            //     showToast({
            //         severity: 'success',
            //         summary: 'Cambios guardados',
            //         detail: '',
            //         life: 4000
            //     })
            //     return true
            // } else {
            //     showToast({
            //         severity: 'error',
            //         summary: 'Error',
            //         detail: response.message || response.description || 'No se pudo actualizar el usuario',
            //         life: 8000
            //     })
            //     return false
            // }
        } catch (error) {
            console.error('Error saving user:', error)
            const serviceError = error as ServiceError
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || `Error al ${isEdit ? 'actualizar' : 'crear'} el usuario`,
                life: 5000
            })
            return false
        }
    }
    return {
        showToast,
        loadAlerts,
        getAlertCode,
        updateEmails,
        alertHistorical
    }
}