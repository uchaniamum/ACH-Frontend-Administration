// ~/composables/chartUtilitarios.js
import { ref } from 'vue';
import html2canvas from 'html2canvas';

export function useChartUtilitarios() {
  const copiado = ref(false);

  // Copiar gráfico al portapapeles
  const copiarGrafico = async (containerEl) => {
    if (!containerEl) return;

    const scale = 4 * (window.devicePixelRatio || 1);
    try {
      const canvas = await html2canvas(containerEl, {
        scale,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
        allowTaint: true
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);

        copiado.value = true;
        setTimeout(() => copiado.value = false, 2000); // mensaje desaparece
      }, "image/png");

    } catch (err) {
      console.error("Error al copiar la imagen:", err);
    }
  };




  // Ordenar barras por sumatoria
  const ordenarBarras = (chartRef, chartData, ordenAscendenteRef) => {
    if (!chartData || !chartRef?.chart) return;

    const labels = [...chartData.labels];
    const datasets = chartData.datasets.map(d => ({ ...d, data: [...d.data] }));

    const combined = labels.map((label, i) => {
      const valores = datasets.map(d => d.data[i]);
      const suma = valores.reduce((acc, val) => acc + val, 0);
      return { label, valores, suma };
    });

    combined.sort((a, b) =>
      ordenAscendenteRef.value ? a.suma - b.suma : b.suma - a.suma
    );

    const newChartData = {
      labels: combined.map(c => c.label),
      datasets: datasets.map((d, i) => ({
        ...d,
        data: combined.map(c => c.valores[i])
      }))
    };

    // Alternar orden
    ordenAscendenteRef.value = !ordenAscendenteRef.value;

    // Actualizar chart
    chartRef.chart.data = newChartData;
    chartRef.chart.update();
  };
//mostrar tooltip burbuja chart pie
// ~/composables/useChartUtilitarios.js
const mostrarTooltipBurbujaPlugin = {
  id: "mostrarTooltipBurbujaPlugin",
  afterDatasetsDraw(chart) {
    // Leer la opción del gráfico
    const mostrar = chart.options.plugins?.mostrarValoresPie;
    if (!mostrar) return;

    const ctx = chart.ctx;
    const dataset = chart.data.datasets[0];
    const meta = chart.getDatasetMeta(0);

    meta.data.forEach((sector, i) => {
      const value = dataset.data[i];
      const label = chart.data.labels[i];

      const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
      const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

      const midAngle = (sector.startAngle + sector.endAngle) / 2;
      const radius = sector.outerRadius + Math.min(35, chart.width * 0.07);

      let x = centerX + radius * Math.cos(midAngle);
      let y = centerY + radius * Math.sin(midAngle);

      const texto = `${label} ${value}%`.toUpperCase();

      ctx.font = "12px Work Sans";
      const paddingX = 10;
      const textWidth = ctx.measureText(texto).width;
      const boxWidth = textWidth + paddingX * 2;
      const boxHeight = 24;
      let boxX = x - boxWidth / 2;
      let boxY = y - boxHeight / 2;

      // Ajuste para que no se corte
      if (boxX + boxWidth > chart.chartArea.right) boxX = chart.chartArea.right - boxWidth - 5;
      if (boxX < chart.chartArea.left) boxX = chart.chartArea.left + 5;
      if (boxY < chart.chartArea.top) boxY = chart.chartArea.top + 5;
      if (boxY + boxHeight > chart.chartArea.bottom) boxY = chart.chartArea.bottom - boxHeight - 5;

      ctx.save();
      // Dibujar piquito
      ctx.fillStyle = "#5C667A";
      ctx.beginPath();
      ctx.moveTo(boxX, boxY + boxHeight / 2);
      ctx.lineTo(boxX - 8, boxY + boxHeight / 2 - 6);
      ctx.lineTo(boxX - 8, boxY + boxHeight / 2 + 6);
      ctx.closePath();
      ctx.fill();

      // Caja redondeada
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 12);
      ctx.fill();

      // Texto
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(texto, boxX + boxWidth / 2, boxY + boxHeight / 2);
      ctx.restore();
    });
  },
};


  
  return { copiado, copiarGrafico, ordenarBarras, mostrarTooltipBurbujaPlugin };
}
