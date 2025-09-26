import type { ParticipantsDetail } from "~/features/participants/types";
import type {  ServiceError } from "~/features/users/types";
import { participantsService } from "~/services/participantsService";

export function usePartipantsService() {
    const toast = useToast()

    const showToast = (message: any) => {
        toast.add(message)
    }

    const loadParticipantExternal = async (code: string): Promise<any | null> => {
        try {
            const response = await participantsService.getParticipantByCode(code)
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

    const updateCertificatePublicParticipantExternal = async (data: any, participantCode:string, paymentGatewayCode:string): Promise<any> => {
        try {
            const response = await participantsService.updateCertificatePublicParticipantExternal(data,participantCode,paymentGatewayCode)
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

    const registerCertificatePublicExternal = async (data: any): Promise<any> => {
    try {
        const response = await participantsService.registerCertificatePublic(data)
        return response
    } catch (error) {
        console.error('Error loading user details:', error)
        const serviceError = error as ServiceError
        showToast({
            severity: 'error',
            summary: 'Error',
            detail: 'El certificado no es valido',
            life: 5000
        })
        return null
    }
    }

    const chargeCertificatePrivate = async (data: any): Promise<any> => {
        try {
            console.log('data en el participante',data)
            const response = await participantsService.registerCertificatePrivate(data)
            return response
        } catch (error) {
            console.error('Error loading user details:', error)
            const serviceError = error as ServiceError
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: 'El certificado no es valido',
                life: 5000
            })
            return null
        }
    }

    const getHistorial = async (participantCode:string, paymentGatewayCode:string): Promise<any> => {
    try {
        const response = await participantsService.getHistorialChannel(participantCode, paymentGatewayCode)
        return response
    } catch (error) {
        console.error('Error loading user details:', error)
        const serviceError = error as ServiceError
        showToast({
            severity: 'error',
            summary: 'Error',
            detail: 'El certificado no es valido',
            life: 5000
        })
        return null
    }
    }


    const registerParticipant = async (data: any): Promise<any> => {
    try {
        console.log('composable', data)
        const response = await participantsService.registerNewParticipant(data)
        console.log('la response es',response)
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

    const registerParticipantOwn = async (data: any): Promise<any> => {
    try {
        console.log('composable', data)
        const response = await participantsService.registerNOwnParticipant(data)
        console.log('la response es',response)
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

    const UpdateParticipantExrternal = async (data: any): Promise<any> => {
    try {
        console.log('composable', data)
        const response = await participantsService.updateParticipantExternal(data)
        console.log('la response es',response)
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

    

    const getChannels = async(): Promise<any> => {
        try {
            return await participantsService.getChannelsParticipantRegister();
        } catch (error) {
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

    
    const getParticipantOwn = async(): Promise<any> => {
        try {
            return await participantsService.getParticipantsOwn();
        } catch (error) {
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

    const getHistoricParticipants = async (): Promise<any> => {
        try {
            const response = await participantsService.gethistoricalParticipants()
            return response
        } catch (error) {
            console.error('Error loading user details:', error)
            const serviceError = error as ServiceError
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al cargar el historial de participantes',
                life: 5000
            })
            return null
        }
    }

    const getHistoricCertificates = async (): Promise<any> => {
        try {
            const response = await participantsService.getHistoricalCertificates()
            return response
        } catch (error) {
            console.error('Error loading user details:', error)
            const serviceError = error as ServiceError
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al cargar el historial de certificados',
                life: 5000
            })
            return null
        }
    }

    const getHistoricGateways = async (): Promise<any> => {
        try {
            const response = await participantsService.getHistoricalGateway()
            return response
        } catch (error) {
            console.error('Error loading user details:', error)
            const serviceError = error as ServiceError
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al cargar el historial de canales',
                life: 5000
            })
            return null
        }
    }

    

    return{
        loadParticipantExternal,
        registerParticipant,
        getChannels,
        registerCertificatePublicExternal,
        chargeCertificatePrivate,
        updateCertificatePublicParticipantExternal,
        UpdateParticipantExrternal,
        registerParticipantOwn,
        getHistorial,
        getHistoricParticipants,
        getHistoricCertificates,
        getHistoricGateways,
        getParticipantOwn
    }
}