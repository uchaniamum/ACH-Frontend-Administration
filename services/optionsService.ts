// services/optionsService.ts
import { API_CONFIG } from '~/config/api'
import type { ApiResponse, UsersData, UserRole, UserStatus } from '~/types/api'

class OptionsService {
    private baseUrl = API_CONFIG.BASE_URL

    private formatCodeToLabel(code: string): string {
        return code
            .toLowerCase()
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    private static ROLE_MAPPING = {
        '1': 'System',
        '2': 'Admin',
        '3': 'Executive',
        '4': 'Technician',
        '5': 'Support',
        '6': 'Monitoring',
        '7': 'Operator',
        '8': 'Supervisor',
        '9': 'Reporting'
    }

    private static STATUS_MAPPING = {
        '1': 'Active',
        '2': 'Pending',
        '3': 'Verified',
        '4': 'Blocked',
        '5': 'Suspended',
        '6': 'Deactivated',
        '7': 'Deleted',
        '8': 'Expired'
    }

    private getKeyFromMapping(textValue: string, mapping: Record<string, string>): string {
        // Normalizar el texto para comparación (case insensitive)
        const normalizedText = textValue.toLowerCase().trim();

        // Buscar la clave cuyo valor mapeado coincida (también normalizado)
        const entry = Object.entries(mapping).find(([key, val]) =>
            val.toLowerCase() === normalizedText
        );

        return entry ? entry[0] : textValue; // Devolver la clave numérica si se encuentra
    }

    async getOptions(): Promise<ApiResponse<{ users: UsersData }>> {
        try {
            const response = await $fetch<ApiResponse<{ users: UsersData }>>(`${this.baseUrl}/options`)
            return response
        } catch (error: any) {
            console.error('Error fetching options:', error)
            throw {
                message: error?.data?.message || error?.message || 'Error al obtener las opciones',
                statusCode: error?.status || 500,
                data: error?.data || null
            }
        }
    }

    async getUserRoles(): Promise<UserRole[]> {
        try {
            const response = await this.getOptions()

            if (response.success && response.data?.users?.userRoles) {
                return response.data.users.userRoles.filter(role => role.isActive)
            }

            return []
        } catch (error) {
            console.error('Error getting user roles:', error)
            return []
        }
    }

    async getUserStatuses(): Promise<UserStatus[]> {
        try {
            const response = await this.getOptions()

            if (response.success && response.data?.users?.UserStatuses) {
                return response.data.users.UserStatuses.filter(status => status.isActive)
            }

            return []
        } catch (error) {
            console.error('Error getting user statuses:', error)
            return []
        }
    }

    mapRolesToSelectOptions(roles: UserRole[]) {
        return roles
            .sort((a, b) => a.order - b.order)
            .map(role => ({
                label: this.formatCodeToLabel(role.code),
                value: this.formatCodeToLabel(role.code), // Usar el código original, no formateado
            }))


    }

    mapStatusesToSelectOptions(statuses: UserStatus[]) {
        return statuses
            .sort((a, b) => a.order - b.order)
            .map(status => ({
                label: this.formatCodeToLabel(status.code),
                value: this.formatCodeToLabel(status.code),
            }))
    }


    mapRolesToFilterOptions(roles: UserRole[]) {
        return roles
            .sort((a, b) => a.order - b.order)
            .map(role => ({
                label: this.formatCodeToLabel(role.code),
                //value: this.getKeyFromMapping(role.code, OptionsService.ROLE_MAPPING) // Usar la clave numérica para el value
            value: this.formatCodeToLabel(role.code),
            }))
    }

    mapStatusesToFilterOptions(statuses: UserStatus[]) {
        return statuses
            .sort((a, b) => a.order - b.order)
            .map(status => ({
                label: this.formatCodeToLabel(status.code),
                value: this.formatCodeToLabel(status.code),// Usar la clave numérica para el value
            }))
    }

    convertToBackendFormat(code: string): string {
        return code.toUpperCase()
    }

    // Método helper para obtener valor del select (debe coincidir con el detalle)
    getRoleValueForSelect(roleCode: string): string {
        // El roleCode del detalle viene como "Admin", usar directamente
        return roleCode
    }

    getStatusValueForSelect(statusCode: string): string {
        // El statusCode del detalle viene como "Active", usar directamente  
        return statusCode
    }
}

export const optionsService = new OptionsService()


