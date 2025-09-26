export interface SerieUsabilityChannelResponse {
  panel: string;
  dateRange: DateRange;
  basis: string;
  currency: any;
  sent: Sent;
  received: Received;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface Sent {
  items: Item[];
  totalCount: number;
  totalAmount: any;
}

export interface Item {
  paymentChannelCode: string;
  percent: number;
}

export interface Received {
  items: Item2[];
  totalCount: number;
  totalAmount: any;
}

export interface Item2 {
  paymentChannelCode: string;
  percent: number;
}
