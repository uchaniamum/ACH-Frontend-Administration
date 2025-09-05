import { API_CONFIG } from "~/config/api";
import type { BankFilters, BankUpdateRequest, PaymentGatewayBankDetail, PaymentGatewayBankList, PaymentGatewayUpdateResponse } from "~/features/contingency/type";


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

            console.log('Esta es un URL', url);

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
    async getBanks(filters?: BankFilters): Promise<PaymentGatewayBankList> {
        //let endpoint = 'payment-gateways-transaction/contingency';
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

        console.log('Esta es un URL contingency list', this.request<PaymentGatewayBankList>(endpoint));
        return this.request<PaymentGatewayBankList>(endpoint);
    }

    async getBankByCode(participantCode: string): Promise<PaymentGatewayBankDetail> {
        if (!participantCode) {
            throw new Error('Participant code is required');
        }
        return this.request<PaymentGatewayBankDetail>(`participants/route-maps-xxx`);
    }

    async getBankByCodeAnterior(participantCode: string): Promise<PaymentGatewayBankDetail> {
        if (!participantCode) {
            throw new Error('Participant code is required');
        }
        return this.request<PaymentGatewayBankDetail>(`payment-gateways-transaction-contingency/${participantCode}`);
    }

    // Endpoint 3: Actualizar configuración de bancos (PUT)
    async updateBankConfiguration(bankData: BankUpdateRequest): Promise<PaymentGatewayUpdateResponse> {
        return this.request<PaymentGatewayUpdateResponse>('payment-gateways-transaction-contingency', {
            method: 'PUT',
            body: JSON.stringify(bankData)
        });
    }
}


export const contingencyService = new ContingencyService();