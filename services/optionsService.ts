import { API_CONFIG } from '~/config/api'
import type { OptionsResponse, PaymentGatewayOp, UserRoleOp, UserStatusOp } from '~/features/users/options.types'


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


    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        try {
            const url = `${this.baseUrl}/${endpoint}`;

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


    // services/optionsService.ts
    async getOptions(): Promise<OptionsResponse> {
        const endpoint = 'options';
        return this.request<OptionsResponse>(endpoint);
    }

    async getUserRoles(): Promise<UserRoleOp[]> {
        try {
            const response = await this.getOptions()
            if (response.users?.userRoles) {
                return response.users.userRoles.filter(role => role.isActive)
            }

            return []
        } catch (error) {
            console.error('Error getting user roles:', error)
            return []
        }
    }

    async getUserStatuses(): Promise<UserStatusOp[]> {
        try {
            const response = await this.getOptions()

            if (response.users?.UserStatuses) {
                return response.users.UserStatuses.filter(status => status.isActive)
            }

            return []
        } catch (error) {
            console.error('Error getting user statuses:', error)
            return []
        }
    }

    async getPaymentGateways(): Promise<PaymentGatewayOp[]> {
        try {
            const response = await this.getOptions()
            if (response.paymentGateways?.paymentGatewaysActive) {
                return response.paymentGateways.paymentGatewaysActive.filter(gateway => gateway.isActive)
            }
            return []
        } catch (error) {
            console.error('Error getting payment gateways:', error)
            return []
        }
    }

    mapRolesToSelectOptions(roles: UserRoleOp[]) {
        console.log('Roles: ', roles);
        return roles
            .sort((a, b) => a.order - b.order)
            .map(role => ({
                // label: this.formatCodeToLabel(role.code),
                label: role.displayName,
                value: this.formatCodeToLabel(role.code),
            }))
    }

    mapStatusesToSelectOptions(statuses: UserStatusOp[]) {
        return statuses
            .sort((a, b) => a.order - b.order)
            .map(status => ({
                // label: this.formatCodeToLabel(status.code),
                label: status.displayName,
                value: status.code,
            }))
    }


    mapRolesToFilterOptions(roles: UserRoleOp[]) {
        return roles
            .sort((a, b) => a.order - b.order)
            .map(role => ({
                label: role.displayName,
                value: this.formatCodeToLabel(role.code),
            }))
    }

    mapStatusesToFilterOptions(statuses: UserStatusOp[]) {
        return statuses
            .sort((a, b) => a.order - b.order)
            .map(status => ({
                // label: this.formatCodeToLabel(status.code),
                label: status.displayName,
                value: this.formatCodeToLabel(status.code),// Usar la clave numérica para el value
            }))
    }

        // Nuevos métodos para PaymentGateways
    mapPaymentGatewaysToSelectOptions(gateways: PaymentGatewayOp[]) {
        return gateways
            .sort((a, b) => a.order - b.order)
            .map(gateway => ({
                label: gateway.displayName,
                value: gateway.code,
            }))
    }

    mapPaymentGatewaysToFilterOptions(gateways: PaymentGatewayOp[]) {
        return gateways
            .sort((a, b) => a.order - b.order)
            .map(gateway => ({
                label: gateway.displayName,
                value: this.formatCodeToLabel(gateway.code),
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

