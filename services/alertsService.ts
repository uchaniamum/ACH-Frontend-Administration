import { API_CONFIG } from "~/config/api";
import type { ListAlerts, Alert } from "~/features/alerts/type";

class AlertsService {
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

    async getAlerts(filters?: { search?: string }): Promise<ListAlerts[]> {
        let endpoint = 'payment-gateways-alert';
        if (filters?.search) {
            const params = new URLSearchParams({ search: filters.search })
            endpoint += `?${params.toString()}`
        }
        return this.request<ListAlerts[]>(endpoint);
    }

    async getAlertsHistorical(filters?: { search?: string }): Promise<any[]> {
        let endpoint = 'payment-gateways-alert/historical';
        if (filters?.search) {
            const params = new URLSearchParams({ search: filters.search })
            endpoint += `?${params.toString()}`
        }
        return this.request<any[]>(endpoint);
    }

    async getAlertsByCode(data:any): Promise<Alert> {
        console.log('el valor service es: ', data)
        return this.request<Alert>(`payment-gateways-alert/${data.code}/payment-gateways/${data.gateway}/emails`)
    }

    async updateEmailsAlerts(data, paymentGatewayAlertCode, paymentGatewayCode): Promise<any> {
        console.log('Updating parameter with data:', {data, paymentGatewayAlertCode, paymentGatewayCode });
        return this.request<any>(`payment-gateways-alert/${paymentGatewayAlertCode}/payment-gateways/${paymentGatewayCode}/emails`, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }
}

export const alertsService = new AlertsService();