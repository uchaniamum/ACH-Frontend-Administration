import { API_CONFIG } from "~/config/api";
import type { CertificatePublicParticipantVerificationRequest, CertificateVerificationRequest, ParticipantsDetail, ParticipantsList } from "~/features/participants/types";

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

    async getParticipants(filters?: { search?: string }): Promise<ParticipantsList[]> {
        let endpoint = 'participants';
        if (filters?.search) {
            const params = new URLSearchParams({ search: filters.search })
            endpoint += `?${params.toString()}`
        }
        return this.request<ParticipantsList[]>(endpoint);
    }

    async registerCertificatePublic(data: CertificateVerificationRequest): Promise<void> {
        return this.request<void>('participants/public-certificates', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async getParticipantByCode(code: string): Promise<any> {
        if (!code) {
            throw new Error('participant code is required')
        }
        return this.request<any>(`participants/${code}`)
    }

    // Actualizar certificado publico
    async updateCertificatePublicParticipant(data: CertificatePublicParticipantVerificationRequest): Promise<void> {
        return this.request<void>('participants/public-certificate', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async registerNewParticipant(data: ParticipantsDetail): Promise<void> {
    return this.request<void>('participants', {
        method: 'POST',
        body: JSON.stringify(data)
    });
    }

}

export const participantsService = new ParticipantsService();