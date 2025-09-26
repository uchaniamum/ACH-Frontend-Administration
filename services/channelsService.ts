import { API_CONFIG } from "~/config/api";
import type { CertificateVerificationRequest, CertificateVerificationResponse, ChannelsListItemResponse, ChannelsResponse, ChannelsSaveResponse, PaymentGatewayCertificatesHistoryListItem, PaymentGatewayRoutesHistoryListItem } from "~/features/channels/type";
import type { UserSaveResponse } from "~/features/users/types";

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

    async getChannels(filters?: { search?: string }): Promise<ChannelsListItemResponse> {
        let endpoint = 'payment-gateways';

        if (filters?.search) {
            const params = new URLSearchParams({ search: filters.search })
            endpoint += `?${params.toString()}`
        }
        return this.request<ChannelsListItemResponse>(endpoint);
    }

    async getChannelsByCode(code: string): Promise<ChannelsResponse> {
        if (!code) {
            throw new Error('User code is required')
        }
        return this.request<ChannelsResponse>(`payment-gateways/${code}`)
    }

    async updateChannels(channelsData: { code: string }): Promise<ChannelsSaveResponse> {
        return this.request<ChannelsSaveResponse>('payment-gateways', {
            method: 'PUT',
            body: JSON.stringify(channelsData)
        });
    }

    async checkCertificatePublic(data: CertificateVerificationRequest): Promise<CertificateVerificationResponse> {
        return this.request<CertificateVerificationResponse>('payment-gateways/public-certificates-checks', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async registerCertificatePublic(data: CertificateVerificationRequest): Promise<UserSaveResponse> {
        return this.request<UserSaveResponse>('payment-gateways/public-certificates', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async getHistoryPaymentGateway(): Promise<PaymentGatewayRoutesHistoryListItem> {
        const endpoint = 'payment-gateways/historical-routes';
        return this.request<PaymentGatewayRoutesHistoryListItem>(endpoint)
    }

    async getHistoryPaymentGatewayCertificates(): Promise<PaymentGatewayCertificatesHistoryListItem> {
        const endpoint = 'payment-gateways/historical-certificates';
        return this.request<PaymentGatewayCertificatesHistoryListItem>(endpoint)
    }
}

export const channelsService = new ChannelsService();