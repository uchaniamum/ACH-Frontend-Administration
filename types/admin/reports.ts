export interface GenericFilter {
  code: string;
  displayName: string;
  description: string;
  group: string;
  order: number;
  isActive: boolean;
  icon: string;
  tooltip: string;
  metadata: Record<string, string>;
}

export interface Filters {
  currencies: GenericFilter[];
  customerIdentifiers: GenericFilter[];
  externalParticipants: GenericFilter[];
  externalParticipantAcronyms: GenericFilter[];
  periods: GenericFilter[];
  transactionSchemes: GenericFilter[];
  paymentChannels: GenericFilter[];
  transactionStatuses: GenericFilter[];
}

export interface Transfers {
  traceNumber: string;
  externalTraceNumber: string;
  formattedDate: string;
  formattedHour: string;
  originatorAccountNumber: string;
  originatorParticipantAcronym: string;
  receiverTraceNumber: string;
  receiverAccountNumber: string;
  receiverParticipantAcronym: string;
  currencyDisplayName: string;
  amount: number;
  transactionSchemeDisplayName: string;
  transactionStatusCode: string;
  transactionStatusDescription: string;
}

export interface Messages {
  messageCode: string;
  attemptNumber: number;
  createdFormattedDateTime: string;
  updatedFormattedDateTime: string;
  transactionStatusCode: string;
  transactionStatusDescription: string;
  returnCode: string;
  returnCodeDescription: string;
  hasPayload: boolean;
}



export interface OptionsResponse {
  Filters: Filters;
}

export interface RequestTransactionalRequest {
  isInbound: boolean;
  isOutbound: boolean;
  formattedDate: string;
  customerIdentifierCode: string;
  customerIdentifier: string;
  currencyCodes: string[];
  transactionCodes: string[];
  accountNumber: string;
  externalParticipantCode: string;
}

export interface RequestTransactionalResponse {
  transfers: Transfers[];
}


export interface IndividualTransactionResponse {
  externalTraceNumber: string;
  formattedDate: string;
  currencyDisplayName: string;
  amount: number;
  reference: string;
  originator: {
    traceNumber: string;
    participantName: string;
    participantAcronym: string;
    accountHolderName: string;
    productNumber: string;
    productTypeDisplayName: string;
  },
  receiver: {
    traceNumber: string;
    participantName: string;
    participantAcronym: string;
    accountHolderName: string;
    productNumber: string;
    productTypeDisplayName: string;
  },
  financialTransaction: {
    formattedDate: string;
    formattedHour: string;
    productTypeDescription: string;
    productNumber: string;
    currencyDisplayName: string;
    amount: number;
    transferId: string;
  }
}


export interface IndividualTransactionMessagesResponse {
  messages: Messages[];
}


export interface IndividualTransactionMessagesXMLResponse {
  mimeType: string;
  content: string;
}
