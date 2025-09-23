import { API_CONFIG } from "~/config/api";
import type { ScheduleDetailReponse, ScheduleExceptionHistoryListItem, ScheduleExceptionRequest, ScheduleInActiveException, ScheduleRegularHistoryListItem, ScheduleResponseList } from "~/features/schedules/type";
import type { UserSaveResponse } from "~/features/users/types";

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

    async getScheduleByCode(code: string): Promise<ScheduleDetailReponse> {
        if (!code) {
            throw new Error('User code is required')
        }
        return this.request<ScheduleDetailReponse>(`payment-gateways-transaction-schedule/${code}/schedule`)
    }

    async createScheduleException(scheduleData: ScheduleExceptionRequest): Promise<UserSaveResponse> {
        return this.request<any>('payment-gateways-transaction-schedule/exception', {
            method: 'POST',
            body: JSON.stringify(scheduleData)
        });
    }

    async editScheduleException(scheduleData: ScheduleExceptionRequest): Promise<UserSaveResponse> {
        return this.request<any>('payment-gateways-transaction-schedule/exception', {
            method: 'PUT',
            body: JSON.stringify(scheduleData)
        });
    }

    async editScheduleRegular(scheduleDataRegular: any): Promise<UserSaveResponse> {
        return this.request<any>('payment-gateways-transaction-schedule', {
            method: 'PUT',
            body: JSON.stringify(scheduleDataRegular)
        });
    }

    async inActivScheduleException(scheduleExceptionRegular: ScheduleInActiveException): Promise<UserSaveResponse> {
        return this.request<any>('payment-gateways-transaction-schedule/exception', {
            method: 'PATCH',
            body: JSON.stringify(scheduleExceptionRegular)
        });
    }

    async getHistoryScheduleRegular(): Promise<ScheduleRegularHistoryListItem> {
        const endpoint = 'payment-gateways-transaction-schedule/historical';
        return this.request<ScheduleRegularHistoryListItem>(endpoint);
    }

    
    async getHistoryScheduleException(): Promise<ScheduleExceptionHistoryListItem> {
        const endpoint = 'payment-gateways-transaction-schedule-exception/historical';
        return this.request<ScheduleExceptionHistoryListItem>(endpoint);
    }
}

export const scheduleService = new ScheduleService()