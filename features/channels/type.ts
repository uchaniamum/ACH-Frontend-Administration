export interface ChannelsListItem {
    code: string
    name: string
    acronym: string
    routes: ChannelsRoutes[]
    updatedAt:string
}

export interface ChannelsListItemResponse{
  paymentSystems: ChannelsListItem[]
}

export interface ChannelsRoutes{
    alias?: string
    isActive?: boolean
    urls?: string[] 
    target?:number  
}

export interface ChannelsResponse{
    code: string
    name: string
    acronym: string
    routes: ChannelsRoutes[]
    updatedAt?:string
    certificateRegistered?: boolean
}

export interface ChannelsSaveResponse{
    code: string
    name: string
    acronym: string
    routes: ChannelsRoutes[]
    changeReason?: string
}

export interface CertificateVerificationRequest {
  paymentGatewayCode?: string
  publicCertificate: {
    base64Content: string
  }
  changeReason?: string
}

export interface CertificateVerificationResponse{
  paymentGatewayCode: string,
  serialNumber: string,
  ValidFrom: string,
  ValidTo: string
}

export interface RouteSelection {
  alias: string
  isActive: boolean
  urls: string[]
}
