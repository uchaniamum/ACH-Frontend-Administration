// INTERFACES Y TIPOS
export interface ChartDataSet {
  label: string;
  data: number[];
  backgroundColor: string;
  hidden?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataSet[];
}
