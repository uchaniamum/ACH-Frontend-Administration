import { API_CONFIG } from "~/config/api";
import type { ScheduleResponseList, SchudeleDetailReponse } from "~/features/schedules/type";

class ScheduleService {
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

    async getSchedule(filters?: { search?: string }): Promise<ScheduleResponseList[]> {
        let endpoint = 'payment-gateways-transaction-schedule';
    
        if (filters?.search) {
            const params = new URLSearchParams({ search: filters.search })
            endpoint += `?${params.toString()}`
        }
        return this.request<ScheduleResponseList[]>(endpoint);
    }

    async getScheduleByCode(code: string): Promise<SchudeleDetailReponse> {
        if (!code) {
            throw new Error('User code is required')
        }
        return this.request<SchudeleDetailReponse>(`payment-gateways-transaction-schedule/${code}/schedule`)
    }
}

export const scheduleService = new ScheduleService();