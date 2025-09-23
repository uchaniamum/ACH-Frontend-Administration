export interface SerieTotalTransactionsRegionResponse {
  panel: string;
  dateRange: DateRange;
  currency: string;
  sent: Sent;
  received: Received;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface Sent {
  regions: Region[];
  totalsByTransaction: TotalsByTransaction[];
  grandTotal: number;
}

export interface Region {
  code: string;
  name: string;
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
  regions: Region2[];
  totalsByTransaction: TotalsByTransaction2[];
  grandTotal: number;
}

export interface Region2 {
  code: string;
  name: string;
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
