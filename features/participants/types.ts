export type PaymentSystemAcronym = 'ACCL' | 'MLD' | 'LIP' | 'UNILINK' | string; 
export type StatusCode = 'ACTIVE' | 'INACTIVE'  | string; 

export interface ParticipantsList{
    ownParticipants?: ParticipantsDetail[];
    externalParticipants?: ParticipantsDetail[];
}

export interface ParticipantsDetail{
    code: string,
    paymentGatewayCode: string,
    acronym: string,
    name: boolean,
    logo: string,
    paymentSystems?: PaymentSystems[];
    // references: string[];
}

export interface PaymentSystems{
   code:string,
   paymentGatewayCode: string,
   publicCertificate: {
     base64Content: string
   },
   privateCertificate: {
     base64Content: string,
     password: string
   },
}

export interface CertificatePublicParticipantVerificationRequest {
  participantCode: string,
  paymentGatewayCode: string,
  reason: string,
  publicCertificate: {
    base64Content: string
  }
}

export interface CertificateVerificationRequest {
    publicCertificate: {
    base64Content: string
  }
}
