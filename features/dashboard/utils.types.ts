// Interfaces para tipar el gráfico
interface ChartDataSet {
  label: string;
  data: number[];
  backgroundColor: string;
}

interface ChartDataResponse {
  labels: string[];
  datasets: ChartDataSet[];
}
