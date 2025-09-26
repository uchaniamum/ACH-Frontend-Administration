// Tipos base
// Tipo para un gateway de pago individual
export interface PaymentGateway {
  paymentGatewayCode: string;
  paymentGatewayAcronym: string;
  isPrimary: boolean;
  isOperational: boolean;
  contingencyTitle: string;
  contingencyDetail: string;
  isTemporarilyActive: boolean;
  changeReason: string;
}

export interface Transaction {
  transactionCode: string;
  IsInbound: boolean;
  isInContigency: boolean;
  isPaymentGatewayChanged: boolean;
  paymentGateways: PaymentGateway[];
}

export interface Participant {
  participantCode: string;
  participantName: string;
  canChangePaymentGateway: boolean;
  canManageContingency: boolean;
  transactions: Transaction[];
}

// Tipo para el listado de contingenci y que muestre los participantes (route-maps)
export interface ParticipantListResponse {
  participants: Participant[];
}

// Tipo para obtener el dato de un participante (matching)
export type ParticipantDetailResponse = Participant;

export interface TransactionStatus {
  mainGateway: string;
  secondaryGateway?: string;
  contingencyEnabled: boolean;
  canChangeChannel: boolean;
  isOperational: boolean;
  contingencyTitle?: string;
  contingencyDetail?: string;
  usingSecondaryChannel?: boolean;
  primaryChannelName?: string;
  secondaryChannelName?: string;
}

export interface ContingencyTableRow {
  participantCode: string;
  participantName: string;
  canChangePaymentGateway: boolean;
  canManageContingency: boolean;
  envioRegular: TransactionStatus;
  envioQR: TransactionStatus;
  recepcionRegular: TransactionStatus;
  recepcionQR: TransactionStatus;
}

export interface PaymentGatewayUpdateResponse {
  wasSaved: boolean;
  wasNew: boolean;
  summary: string;
  description: string;
  savedBy: string;
  savedAt: string;
  traceId: string;
}

export interface EnhancedTransactionStatus extends TransactionStatus {
  statusType: 'operational' | 'contingency' | 'offline-primary' | 'unavailable';
  statusLabel: string;
  showSecondary: boolean;
  activeGateway: string;
  primaryGateway: string;
  secondaryGateway: string | undefined;
}

export interface TransactionRowData {
  id: number;
  transaction: string;
  transactionCode: string;
  tooltip: string;
  gateways: Record<string, boolean>;
}

export interface GatewayAnalysis {
  label: string;
  estados: string[];
  puedeSeleccionarse: boolean[];
  countDisponible: number;
  countPrimarioActivo: number;
}

//Particpants Request
interface TransactionUpdateRequest {
  transactionCode: string;
  paymentGatewayCode: string;
}

interface ContingencyTransactionRequest extends TransactionUpdateRequest {
  isInContigency: boolean;
}

interface ParticipantUpdateRequest {
  participantCode: string;
  transactions: TransactionUpdateRequest[];
}

interface ContingencyParticipantRequest {
  participantCode: string;
  transactions: ContingencyTransactionRequest[];
}

export interface ChangeChannelRequest {
  participants: ParticipantUpdateRequest[];
  changeReason: string;
}

export interface ContingencyRequest {
  contingencyTitle: string;
  contingencyDetail: string;
  changeReason: string;
  participants: ContingencyParticipantRequest[];
}


//Channels Contingency
export interface PaymentGatewayOperational {
  code: string;
  name: string;
  acronym: string;
  isOperational: boolean;
}
export interface paymentGatewaysOpeListResponse {
  paymentGatewayOperationalRouteMaps: PaymentGatewayOperational[];
}

export interface PaymentGatewayContingencyRequest {
  isOperational: boolean;
  contingencyTitle: string;
  contingencyDetail: string;
  changeReason: string;
}

//History Participants Contingency
export interface ParticipantContingencyItem {
  paymentGatewayCode: string;
  transactionCode: string;
  participantName: string;
  changeNumber: number;
  isPrimary: boolean;
  isOperational: boolean;
  contingencyTitle: string;
  contingencyDetail: string;
  isTemporarilyActive: boolean;
  changeReason: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
  createdByUserId: number;
  updatedAt: string;
  updatedByUser: string;
}

export interface ParticipantContingencyListItem {
  participantRoutes: ParticipantContingencyItem[]
}

export interface ChannelContingencyItem {
  paymentGatewayCode: string,
  paymentGatewayAcronym: string,
  paymentGatewayName: string,
  changeNumber: number,
  isOperational: boolean,
  contingencyTitle: string,
  contingencyDetail: string,
  changeReason: string,
  createdAt: string,
  createdByUser: number,
  updatedAt: string,
  updatedByUser: string
}

export interface ParticipantContingencyListItem {
  paymentGatewayOperationals: ChannelContingencyItem[]
}