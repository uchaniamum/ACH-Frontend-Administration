// Tipos base para las transacciones
export interface Transaction {
    transactionCode: string;
    transactionDescription: string;
    incoming: boolean;
    mainPaymentGatewayCode: string;
    mainPaymentGatewayCodeDescription: string;
    mainPaymentGatewayEnabled: boolean;
    secondaryPaymentGatewayCode: string;
    secondaryPaymentGatewayDescription: string;
    secondaryPaymentGatewayEnabled: boolean;
    contingencyEnabled: boolean;
}

// Tipo para un banco individual
export interface PaymentGatewayBank {
    participantCode?: string;
    participantName?: string;
    Transactions?: Transaction[];
}

// Tipo para la lista de bancos (endpoint 1)
export type PaymentGatewayBankList = PaymentGatewayBank[];

// Tipo para obtener un solo banco (endpoint 2)
export type PaymentGatewayBankDetail = PaymentGatewayBank;

// Tipos para el endpoint de edición (PUT)

// Request para editar bancos
export interface BankUpdateRequest {
    participants: BankUpdate[];
}

export interface BankUpdate {
    transactionCode: string;
    operationalClearingHouseModified: boolean;
    operationalPaymentGatewayCode: string;
    operationalPaymentGatewayCodeDescription: string;
    contingencyEnabled: boolean;
    contingencyDescription: string;
}

// Response del endpoint de edición
export interface PaymentGatewayUpdateResponse {
    wasSaved: boolean;
    wasNew: boolean;
    summary: string;
    description: string;
    savedBy: string;
    savedAt: string; // ISO date string
    traceId: string;
}


// Para manejar estados de loading y error
export interface ApiResponse<T> {
    data?: T;
    loading: boolean;
    error?: string;
}

// Para filtros o búsquedas
export interface BankFilters {
    participantCode?: string;
    participantName?: string;
    transactionType?: 'incoming' | 'outgoing' | 'all';
}

// Para el estado de una transacción individual (útil para toggles)
export interface TransactionState {
    transactionCode: string;
    mainGatewayEnabled: boolean;
    secondaryGatewayEnabled: boolean;
    contingencyEnabled: boolean;
}

export interface TransactionStatus {
    mainGateway: string;
    secondaryGateway: string;
    contingencyEnabled: boolean;
    mainEnabled: boolean;
    secondaryEnabled: boolean;
}

export interface ContingencyTableRow {
    participantCode: string;
    participantName: string;
    envioRegular: TransactionStatus;
    envioQR: TransactionStatus;
    recepcionRegular: TransactionStatus;
    recepcionQR: TransactionStatus;
}


//Nueva version
// Constants
export const GATEWAY_CODE_MAP = {
  'ACL': '1426001',
  'MLD': '1000',
  'LIP': '900', 
  'UNI': '995'
} as const;

export const TRANSACTION_CONFIG = {
  IASYNC: {
    label: 'Envío de transferencias interbancarias IASYNC',
    tooltip: 'Información sobre transferencias interbancarias',
    switchRef: 'iasyncContingency' as const
  },
  IQR: {
    label: 'Envío de transferencias QR IQR',
    tooltip: 'Información sobre transferencias QR',
    switchRef: 'iqrContingency' as const
  },
  OASYNC: {
    label: 'Recepción transferencia interbancaria OASYNC',
    tooltip: 'Salida de transferencias regulares.',
    switchRef: 'oasyncContingency' as const
  },
  OQR: {
    label: 'Recepción transferencia QR OQR',
    tooltip: 'Procesamiento de transacciones de cobro por QR.',
    switchRef: 'oqrContingency' as const
  }
} as const;

export const TRANSACTION_DATA = Object.entries(TRANSACTION_CONFIG).map(([code, config], index) => ({
  id: index + 1,
  transaction: config.label,
  transactionCode: code,
  tooltip: config.tooltip,
  gateways: {}
}));

// Types
export interface GatewayState {
  isPrimary?: boolean;
  isOperational?: boolean;
  isTemporarilyActive?: boolean;
  paymentGatewayAcronym?: string;
  paymentGatewayCode?: string;
}

export interface ValidationResult {
  estado: string;
  isContingency: boolean;
  descripcion: string;
}