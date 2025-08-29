import { API_CONFIG } from "~/config/api";
import type { CertificateVerificationRequest, ChannelsListItem, ChannelsResponse, ChannelsSaveResponse } from "~/features/channels/type";

class ChannelsService {
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

    async getChannels(filters?: { search?: string }): Promise<ChannelsListItem[]> {
        let endpoint = 'payment-gateways';

        if (filters?.search) {
            const params = new URLSearchParams({ search: filters.search })
            endpoint += `?${params.toString()}`
        }
        return this.request<ChannelsListItem[]>(endpoint);
    }

    async getChannelsByCode(code: string): Promise<ChannelsResponse> {
        if (!code) {
            throw new Error('User code is required')
        }
        return this.request<ChannelsResponse>(`payment-gateways/${code}`)
    }

    async updateChannels(channelsData: { code: string }): Promise<ChannelsSaveResponse> {
        console.log('Updating parameter with data:', channelsData);
        return this.request<ChannelsSaveResponse>('payment-gateways', {
            method: 'PUT',
            body: JSON.stringify(channelsData)
        });
    }

    async registerCertificatePublic(data: CertificateVerificationRequest): Promise<void> {
        return this.request<void>('payment-gateways/public-certificates', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
}

export const channelsService = new ChannelsService();