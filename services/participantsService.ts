import { API_CONFIG } from "~/config/api";
import type { CertificatePublicParticipantVerificationRequest, CertificateVerificationRequest, ParticipantsDetail, ParticipantsList, CertificateVerificationPrivateRequest } from "~/features/participants/types";

class ParticipantsService {
    private baseURL = API_CONFIG.BASE_URL;

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        try {
            const url = `${this.baseURL}/${endpoint}`;

            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en la solicitud:', error);
            throw error;
        }
    }

    async getParticipantsExternal(filters?: { search?: string }): Promise<ParticipantsList[]> {
        let endpoint = 'external-participants/';
        if (filters?.search) {
            const params = new URLSearchParams({ search: filters.search })
            endpoint += `?${params.toString()}`
        }
        return this.request<ParticipantsList[]>(endpoint);
    }

    async getParticipantsOwn(filters?: { search?: string }): Promise<ParticipantsList[]> {
    let endpoint = 'own-participants';
    if (filters?.search) {
        const params = new URLSearchParams({ search: filters.search })
        endpoint += `?${params.toString()}`
    }
    return this.request<ParticipantsList[]>(endpoint);
    }
    

    async registerCertificatePublic(data: CertificateVerificationRequest): Promise<void> {
        return this.request<void>('certificates/public-certificates-validate', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async registerCertificatePrivate(data: CertificateVerificationPrivateRequest): Promise<void> {
        console.log('service: ',data)
        return this.request<void>('certificates/private-certificates-validate', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }


    async getParticipantByCode(code: string): Promise<any> {
        if (!code) {
            throw new Error('participant code is required')
        }
        return this.request<any>(`external-participants/${code}`)
    }

    // Actualizar certificado publico
    async updateCertificatePublicParticipantExternal(data: CertificatePublicParticipantVerificationRequest, participantCode:string, paymentGatewayCode:string): Promise<void> {
        console.log('el service es: ',data)
        return this.request<void>(`external-participants/${participantCode}/payment-gateways/${paymentGatewayCode}/public-certificates`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async registerNewParticipant(data: ParticipantsDetail): Promise<void> {
    return this.request<void>('external-participants', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    }

    async registerNOwnParticipant(data: ParticipantsDetail): Promise<void> {
    return this.request<void>('own-participants', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    }

    async updateParticipantExternal(data: ParticipantsDetail): Promise<void> {
    return this.request<void>('external-participants', {
        method: 'PUT',
        body: JSON.stringify(data)
    });
    }

     async getChannelsParticipantRegister(){
        const { paymentGateways: { paymentGatewaysActive } } = await this.request<any>('options', {
            method: 'GET'
        })
        return paymentGatewaysActive
     }

    async getHistorialChannel(participantCode:string, paymentGatewayCode:string){
        const response = await this.request<any>(`certificates/${participantCode}/payment-gateways/${paymentGatewayCode}/certificates`, {
            method: 'GET'
        })
        return response
     }

}

export const participantsService = new ParticipantsService();