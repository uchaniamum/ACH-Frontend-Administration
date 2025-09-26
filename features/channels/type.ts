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
  paymentGatewayCode: string;
  serialNumber: string;
  ValidFrom: string;
  ValidTo: string
}

export interface RouteSelection {
  alias: string
  isActive: boolean
  urls: string[]
}


export interface PaymentGatewayRoutesHistoryItem{
  paymentGatewayCode: string;
  paymentGatewayAcronym: string;
  target: string;
  changeNumber: number;
  alias: string;
  baseUrl: string;
  description: string;
  changeReason: string;
  isActive: boolean;
  createdAt: string;
  createdByUser: string;
  updatedAt: string;
  updatedByUser: string;
}

export interface PaymentGatewayRoutesHistoryListItem{
  historicalPaymentGatewayRoutes: PaymentGatewayRoutesHistoryItem[]
}

export interface PaymentGatewayCertificatesHistoryItem{
  paymentGatewayCode: string;
  acronym: string;
  thumbprint: string;
  changeNumber: number;
  serialNumber: string;
  format: string;
  subject: string;
  issuer: string;
  version: string;
  validFrom: string;
  validTo: string;
  signatureAlgorithm: string;
  publicKeyAlgorithm: string;
  publicKeyParameters: string;
  hasPrivateKey: boolean;
  isEncrypted: boolean;
  encryptedPassword: string;
  subjectAlternativeNames: string;
  keyUsage: string;
  extendedKeyUsage: string;
  certificatePolicies: string;
  crlDistributionPoints: string;
  authorityKeyIdentifier: string;
  subjectKeyIdentifier: string;
  isSelfSigned: boolean;
  isActive: boolean;
  isAvailable: boolean;
  createdAt: string;
  createdByUser: string;
  updatedAt: string;
  updatedByUser: string;
}

export interface PaymentGatewayCertificatesHistoryListItem{
  historicalPaymentGatewayCertificates: PaymentGatewayCertificatesHistoryItem[]
}