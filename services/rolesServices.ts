import { API_CONFIG } from "~/config/api";
import type { RoleFeaturesResponse } from "~/features/roles/type";

class RolesService {
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

    async getRolesAcces(filters?: {search?: string}): Promise<RoleFeaturesResponse>{
        let endpoint = 'users-features';

        if(filters?.search){
            const params = new URLSearchParams({ search: filters.search })
            endpoint += `?${params.toString()}`
        }
        console.log('Esta es un URL', this.request<RoleFeaturesResponse>(endpoint));
        return this.request<RoleFeaturesResponse>(endpoint);
    }
}

export const rolesService = new RolesService();