import { API_CONFIG } from "~/config/api";
import type { UserResponse } from "~/features/users/types";

class UserService {
    public baseURL = API_CONFIG.BASE_URL;

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        try {
            const url = `${this.baseURL}/${endpoint}`;

            console.log('URL de solicitud:', url);

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
            console.log(data);
            return data;
        } catch (error) {
            console.error('Error en la solicitud:', error);
            throw error;
        }
    }

    async getUsers(filters?: { search?: string }): Promise<UserResponse[]> {
        let endpoint = 'users';
        
        if (filters?.search) {
            const params = new URLSearchParams();
            params.append('search', filters.search);
            endpoint += `?${params.toString()}`;
        }

        return this.request<UserResponse[]>(endpoint);
    }
}


export const userService = new UserService();