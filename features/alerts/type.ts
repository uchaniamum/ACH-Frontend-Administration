export interface Alert {
  paymentGatewayAlertCode: string,
  alertDescription: string,
  paymentGatewayCode: string,
  paymentGatewayDescription: string,
  emailRecipientAddress: string[]
  recipientCounter: number
}

export interface ListAlerts {
    paymentGatewayAlerts: Alert[]
}

