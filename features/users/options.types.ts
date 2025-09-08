// Opciones para usuarios
export interface UserRoleOp {
    code: string;
    displayName: string;
    description: string;
    group: string;
    order: number;
    isActive: boolean;
    icon: string | null;
    tooltip: string | null;
    metadata: any | null;
}

export interface UserStatusOp {
    code: string;
    displayName: string;
    description: string;
    group: string;
    order: number;
    isActive: boolean;
    icon: string | null;
    tooltip: string | null;
    metadata: any | null;
}

export interface PaymentGatewayOp {
    code: string;
    displayName: string;
    description: string;
    group: string;
    order: number;
    isActive: boolean;
    icon: string | null;
    tooltip: string | null;
    metadata: any | null;
}

// types/options.ts
export interface OptionsResponse {
    users: {
        userRoles: UserRoleOp[];
        UserStatuses: UserStatusOp[];
    };
    paymentGateways: {
        paymentGatewaysActive: PaymentGatewayOp[];
    };
    // Agrega otras propiedades si existen en la respuesta
}

export interface SelectOptionUser {
    label: string;
    value: string;
}



// Validaciones oara reglas
export type ValidationRuleResult = boolean | string