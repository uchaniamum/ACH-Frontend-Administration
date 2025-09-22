import { API_CONFIG } from "~/config/api";
import type {  ChangeChannelRequest, ContingencyRequest, Participant, ParticipantListResponse, PaymentGatewayContingencyRequest, paymentGatewaysOpeListResponse, PaymentGatewayUpdateResponse } from "~/features/contingency/type";


class ContingencyService {
    public baseURL = API_CONFIG.BASE_URL;

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

    // Endpoint 1: Obtener lista de bancos
    async getBanks(filters?: any): Promise<ParticipantListResponse> {
        let endpoint = 'participants/route-maps-xxx';
        if (filters) {
            const params = new URLSearchParams();
            if (filters.participantCode) params.append('participantCode', filters.participantCode);
            if (filters.participantName) params.append('participantName', filters.participantName);
            if (filters.transactionType && filters.transactionType !== 'all') {
                params.append('transactionType', filters.transactionType);
            }

            if (params.toString()) {
                endpoint += `?${params.toString()}`;
            }
        }

        return this.request<ParticipantListResponse>(endpoint);
    }

    async getParticipantsByCode(participantCodes: string[]): Promise<Participant> {
        return this.request<Participant>(`participants/route-maps/matching-xxx`, {
            method: 'POST',
            body: JSON.stringify({
                participantCodes: participantCodes
            })
        });
    }

    async updateChangeChannel(bankData: ChangeChannelRequest): Promise<PaymentGatewayUpdateResponse> {
        return this.request<PaymentGatewayUpdateResponse>('participants/route-maps/operational-gateway-xxx', {
            method: 'PUT',
            body: JSON.stringify(bankData)
        });
    }

    async updateContingency(bankData: ContingencyRequest): Promise<PaymentGatewayUpdateResponse> {
        return this.request<PaymentGatewayUpdateResponse>('participants/route-maps/contingency-xxx', {
            method: 'PUT',
            body: JSON.stringify(bankData)
        });
    }

    async getPaymentGatewayRoutes(): Promise<any> {
        const endpoint = 'payment-gateways/route-maps-operational';
        return this.request<paymentGatewaysOpeListResponse>(endpoint);
    }

    async updatePaymentGateway(dataPaymentGateway: PaymentGatewayContingencyRequest, paymentGatewayCode: string | undefined): Promise<PaymentGatewayUpdateResponse> {
        return this.request<PaymentGatewayUpdateResponse>(`payment-gateways/${paymentGatewayCode}/route-maps-operational`, {
            method: 'PATCH',
            body: JSON.stringify(dataPaymentGateway)
        });
    }

    //Service history contingency participants
    async getHistoryContingencyParticipants(): Promise<any> {
        const endpoint = 'participants/route-maps/historical';
        return this.request<any>(endpoint);
    }
}


export const contingencyService = new ContingencyService();


