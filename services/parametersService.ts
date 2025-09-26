import { API_CONFIG } from "~/config/api";
import type { ParameterDetailHistorialResponse, ParameterDetailResponse, ParameterHistoryListItem, ParameterSaveResponse, ParametersListResponse } from "~/features/parameters/types";

class ParameterService {
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

    async getParameters(filters?: { search?: string }): Promise<ParametersListResponse> {
        let endpoint = 'parameters';

        if (filters?.search) {
            const params = new URLSearchParams({ search: filters.search })
            endpoint += `?${params.toString()}`
        }
        return this.request<ParametersListResponse>(endpoint);
    }

    async getParameterByCode(code: string): Promise<ParameterDetailResponse> {
        if (!code) {
            throw new Error('Parameter code is required')
        }
        return this.request<ParameterDetailResponse>(`parameters/${code}`)
    }

    async updateParameter(parameterData: { code: string; value: string }): Promise<ParameterSaveResponse> {
        return this.request<ParameterSaveResponse>('parameters', {
            method: 'PATCH',
            body: JSON.stringify(parameterData)
        });
    }

    async getParameterHistorical(code: string): Promise<ParameterDetailHistorialResponse> {
        if (!code) {
            throw new Error('Parameter code is required')
        }
        return this.request<ParameterDetailHistorialResponse>(`historical-parameters/${code}`)
    }

    async getHistoryParameter(): Promise<ParameterHistoryListItem> {
        const endpoint = 'parameters/historicals';
        return this.request<ParameterHistoryListItem>(endpoint)
    }
}

export const parametersService = new ParameterService();