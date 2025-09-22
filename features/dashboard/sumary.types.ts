export interface SumaryResponses {
  panel: string;
  panelDescription: string;
  dateRange: DateRange;
  currency: string;
  amount: Amount;
  count: Count;
  efficiency: Efficiency;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface Amount {
  received: Received;
  sent: Sent;
}

export interface Received {
  items: Item[];
  total: number;
}

export interface Item {
  transactionCode: string;
  value: number;
}

export interface Sent {
  items: Item2[];
  total: number;
}

export interface Item2 {
  transactionCode: string;
  value: number;
}

export interface Count {
  received: Received2;
  sent: Sent2;
}

export interface Received2 {
  items: Item3[];
  total: number;
}

export interface Item3 {
  transactionCode: string;
  value: number;
}

export interface Sent2 {
  items: Item4[];
  total: number;
}

export interface Item4 {
  transactionCode: string;
  value: number;
}

export interface Efficiency {
  received: Received3;
  sent: Sent3;
  overall: number;
}

export interface Received3 {
  numerator: number;
  denominator: number;
  percent: number;
}

export interface Sent3 {
  numerator: number;
  denominator: number;
  percent: number;
}
