export interface UserResponse {
    code: string
    email: string
    alias: string
    fullname: string
    roleCode: string
    roleDescription: string
    isActive: boolean
    statusCode: string
    statusDescription: string
}


export interface UserRequest {
    code?: string        
    email: string
    alias: string
    fullname: string
    phone: {
        countryCode: string
        number: string
        isMobile: boolean
        verificationHash?: string
    }
    roleCode: string
}

export interface User {
    code?: string
    email: string
    alias: string
    fullname: string
    roleCode: string
    roleDescription?: string
    isActive?: boolean
    phone?: {
        countryCode: string
        number: string
        isMobile: boolean
    }
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'