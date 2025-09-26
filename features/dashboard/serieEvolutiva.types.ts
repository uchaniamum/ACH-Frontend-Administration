export interface SeriesEvolutivaResponse {
  panel: string;
  dateRange: DateRange;
  granularity: string;
  currency: string;
  sent: Sent;
  received: Received;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface Sent {
  series: Series[];
  total: Total;
  periodSum: number;
}

export interface Series {
  transactionCode: string;
  points: Point[];
}

export interface Point {
  date: string;
  value: number;
}

export interface Total {
  points: Point2[];
}

export interface Point2 {
  date: string;
  value: number;
}

export interface Received {
  series: Series2[];
  total: Total2;
  periodSum: number;
}

export interface Series2 {
  transactionCode: string;
  points: Point3[];
}

export interface Point3 {
  date: string;
  value: number;
}

export interface Total2 {
  points: Point4[];
}

export interface Point4 {
  date: string;
  value: number;
}
