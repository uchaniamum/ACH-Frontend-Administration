export interface ChannelsListItem {
    code?: string
    name?: string
    acronym?: string
    routes?: ChannelsRoutes[]
    updatedAt?:string
}

export interface ChannelsRoutes{
    alias?: string
    isActive?: boolean
    urls?: string[]   
}

export interface ChannelsResponse{
    code?: string
    name?: string
    acronym?: string
    routes?: ChannelsRoutes[]
    updatedAt?:string
    certificateRegistered?: boolean
}

export interface ChannelsSaveResponse{
    code?: string
    name?: string
    acronym?: string
    routes?: ChannelsRoutes[]
    changeReason?: string
}

export interface CertificateVerificationRequest {
  paymentGatewayCode: string
  publicCertificate: {
    base64Content: string
  }
}