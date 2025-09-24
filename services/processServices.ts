import { API_CONFIG } from "~/config/api";
import type { PaymentGatewayBackUpdateResponse, Processes, ProcessesListResponse, ProcessHistoryListItem } from "~/features/processes/type";


class ProccessService {
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

    async getProcesses(): Promise<ProcessesListResponse> {
        const endpoint = 'payment-gateways/background';
        return this.request<ProcessesListResponse>(endpoint);
    }

    async updateProcess(dataBackground: Processes, paymentGatewayBackgroundCode: string | undefined): Promise<PaymentGatewayBackUpdateResponse> {
        return this.request<PaymentGatewayBackUpdateResponse>(`payment-gateways/${paymentGatewayBackgroundCode}/background`, {
            method: 'PATCH',
            body: JSON.stringify(dataBackground)
        });
    }

    async getHistoryProcess(): Promise<ProcessHistoryListItem> {
        const endpoint = 'payment-gateways/background/historical';
        return this.request<ProcessHistoryListItem>(endpoint);
    }
}


export const proccessServices = new ProccessService();


