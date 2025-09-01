import type { ParticipantsDetail } from "~/features/participants/types";
import type {  ServiceError } from "~/features/users/types";
import { participantsService } from "~/services/participantsService";

export function usePartipantsService() {
    const toast = useToast()

    const showToast = (message: any) => {
        toast.add(message)
    }

    const loadParticipant = async (code: string): Promise<any | null> => {
        try {
            const response = await participantsService.getParticipantByCode(code)
            return response.data
        } catch (error) {
            console.error('Error loading user details:', error)
            const serviceError = error as ServiceError
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || 'No se pudieron cargar los detalles del participante',
                life: 5000
            })
            return null
        }
    }

    const updateCertificatePublicParticipant = async (data: any): Promise<any> => {
        try {
            const response = await participantsService.updateCertificatePublicParticipant(data)
            return response
        } catch (error) {
            console.error('Error loading user details:', error)
            const serviceError = error as ServiceError
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || 'No se pudieron cargar los detalles del participante',
                life: 5000
            })
            return null
        }
    }

    const registerParticipant = async (data: any): Promise<any> => {
    try {
        const response = await participantsService.registerNewParticipant(data)
        return response
        } catch (error) {
            console.error('Error loading user details:', error)
            const serviceError = error as ServiceError
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || 'No se pudo registrar al participante',
                life: 5000
            })
            return null
        }
    }

    return{
        loadParticipant,
        registerParticipant,
        updateCertificatePublicParticipant
    }
}