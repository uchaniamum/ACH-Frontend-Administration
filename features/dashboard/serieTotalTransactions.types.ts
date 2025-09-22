export interface SerieTotalTransactionsResponse {
  panel: string;
  dateRange: DateRange;
  basis: string;
  currency: string;
  sent: Sent;
  received: Received;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface Sent {
  externalParticipants: ExternalParticipant[];
  totalsByTransaction: TotalsByTransaction[];
  grandTotal: number;
}

export interface ExternalParticipant {
  code: string;
  items: Item[];
  total: number;
}

export interface Item {
  transactionCode: string;
  value: number;
}

export interface TotalsByTransaction {
  transactionCode: string;
  value: number;
}

export interface Received {
  externalParticipants: ExternalParticipant2[];
  totalsByTransaction: TotalsByTransaction2[];
  grandTotal: number;
}

export interface ExternalParticipant2 {
  code: string;
  items: Item2[];
  total: number;
}

export interface Item2 {
  transactionCode: string;
  value: number;
}

export interface TotalsByTransaction2 {
  transactionCode: string;
  value: number;
}
