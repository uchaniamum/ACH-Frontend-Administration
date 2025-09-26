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
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);

        copiado.value = true;
        setTimeout(() => (copiado.value = false), 2000); // mensaje desaparece
      }, "image/png");
    } catch (err) {
      console.error("Error al copiar la imagen:", err);
    }
  };

  // Ordenar barras por sumatoria
  const ordenarBarras = (chartRef, chartData, ordenAscendenteRef) => {
    if (!chartData || !chartRef?.chart) return;

    const labels = [...chartData.labels];
    const datasets = chartData.datasets.map((d) => ({
      ...d,
      data: [...d.data],
    }));

    const combined = labels.map((label, i) => {
      const valores = datasets.map((d) => d.data[i]);
      const suma = valores.reduce((acc, val) => acc + val, 0);
      return { label, valores, suma };
    });

    combined.sort((a, b) =>
      ordenAscendenteRef.value ? a.suma - b.suma : b.suma - a.suma
    );

    const newChartData = {
      labels: combined.map((c) => c.label),
      datasets: datasets.map((d, i) => ({
        ...d,
        data: combined.map((c) => c.valores[i]),
      })),
    };

    // Alternar orden
    ordenAscendenteRef.value = !ordenAscendenteRef.value;

    // Actualizar chart
    chartRef.chart.data = newChartData;
    chartRef.chart.update();
  };
  //mostrar tooltip burbuja chart pie
  const labelMap = {
  ASYNC: "ASINCRONO",
  EXPRESS: "EXPRESS",
  QR: "QR",
  // agrega todos los que necesites
};

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
        const rawLabel = chart.data.labels[i];
        const label = labelMap[rawLabel] || rawLabel; // si no está en el map, usamos el label original
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
        if (boxX + boxWidth > chart.chartArea.right)
          boxX = chart.chartArea.right - boxWidth - 5;
        if (boxX < chart.chartArea.left) boxX = chart.chartArea.left + 5;
        if (boxY < chart.chartArea.top) boxY = chart.chartArea.top + 5;
        if (boxY + boxHeight > chart.chartArea.bottom)
          boxY = chart.chartArea.bottom - boxHeight - 5;

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



//Función utilitaria para formatear números
function formatNumber(value: number): string {
  const suffixes = ["", "K", "M", "B", "T"];
  let newValue = value;
  let suffixIndex = 0;

  while (Math.abs(newValue) >= 1000 && suffixIndex < suffixes.length - 1) {
    newValue /= 1000;
    suffixIndex++;
  }
  const formatted = newValue.toLocaleString("es-BO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatted + suffixes[suffixIndex];
}

// Plugin: Mostrar valores internos + sumatoria total de la pila x o y 
const mostrarValoresPluginSumatoria: Plugin = {
  id: "mostrarValoresPluginSumatoria",
  afterDatasetsDraw(chart: any) {
    const pluginEnabled = chart.config.options.plugins?.mostrarValoresPluginSumatoria?.enabled;
    if (!pluginEnabled) return;

    const ctx = chart.ctx;
    const indexAxis = chart.config.options.indexAxis || "x"; // 'x' = vertical, 'y' = horizontal
    chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (meta.hidden) return;

      meta.data.forEach((bar: any, index: number) => {
        const value = dataset.data[index];
        if (value <= 0) return;

        const color = ["QR", "Express"].includes(dataset.label)
          ? "#FFFFFF"
          : "#2A303A";

        const fontSize = Math.max(11, chart.height * 0.025);

        ctx.save();
        ctx.fillStyle = color;
        ctx.font = `${fontSize}px Work Sans`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let x: number, y: number;

        if (indexAxis === "y") {
          // Barras horizontales
          x = (bar.base + bar.x) / 2;
          y = bar.y;
        } else {
          // Barras verticales
          x = bar.x;
          y = (bar.base + bar.y) / 2;
        }

        ctx.fillText(formatNumber(value), x, y);
        ctx.restore();
      });
    });

    //  Mostrar sumatoria total por cada pila
    chart.data.labels.forEach((_: any, index: number) => {
      let total = 0;
      let barRef: any = null;

      chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        if (meta.hidden) return;
        const value = dataset.data[index] || 0;
        total += value;

        const bar = meta.data[index];
        if (bar) barRef = bar; // última barra visible
      });

      if (total > 0 && barRef) {
        const fontSize = Math.max(12, chart.height * 0.03);

        ctx.save();
        ctx.fillStyle = "#000000";
        ctx.font = `${fontSize}px Work Sans`;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";

        if (indexAxis === "y") {
          // Totales para barras horizontales → al final
          ctx.fillText(formatNumber(total), barRef.x + 25, barRef.y);
        } else {
          // Totales para barras verticales → encima
          ctx.fillText(formatNumber(total), barRef.x, barRef.y - 10);
        }

        ctx.restore();
      }
    });
  },
};
// Plugin: Mostrar valores internos sin sumatoria  de la pila x o y 
const mostrarValoresPlugin: Plugin = {
  id: "mostrarValoresPlugin",
  afterDatasetsDraw(chart: any) {
    const pluginEnabled = chart.config.options.plugins?.mostrarValoresPlugin?.enabled;
    if (!pluginEnabled) return;

    const ctx = chart.ctx;
    const indexAxis = chart.config.options.indexAxis || "x"; // 'x' = vertical (default), 'y' = horizontal

    chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
      const meta = chart.getDatasetMeta(datasetIndex);
      if (meta.hidden) return;

      meta.data.forEach((bar: any, index: number) => {
        const value = dataset.data[index];
        if (value <= 0) return;

        const color = ["QR", "Express"].includes(dataset.label)
          ? "#FFFFFF"
          : "#2A303A";

        const fontSize = Math.max(11, chart.height * 0.025);

        ctx.save();
        ctx.fillStyle = color;
        ctx.font = `${fontSize}px Work Sans`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        let x: number, y: number;

        if (indexAxis === "y") {
          // Barras horizontales
          x = (bar.base + bar.x) / 2;
          y = bar.y;
        } else {
          // Barras verticales (default)
          x = bar.x;
          y = (bar.base + bar.y) / 2;
        }

        ctx.fillText(formatNumber(value), x, y);
        ctx.restore();
      });
    });
  },
};
//plugin Mostrar toltips de charts lineal 
const puntosColorYDatos = {
  id: 'puntosColorYDatos',
  afterDatasetsDraw(chart: any) {
    const { ctx } = chart;

    chart.data.datasets.forEach((dataset: any) => {
      const meta = chart.getDatasetMeta(chart.data.datasets.indexOf(dataset));
      if (!meta) return;

      meta.data.forEach((point: any, index: number) => {
        // Dibujar círculo
        ctx.save();
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = dataset.borderColor || '#000';
        ctx.stroke();
        ctx.restore();

        // Solo mostrar tooltip si está seleccionado
        if (!seleccionado.value || dataset.label !== seleccionado.value) return;

        const value = dataset.data[index];
        const texto = formatNumber(value);

        ctx.save();
        ctx.translate(point.x, point.y - 25); // un poco arriba
        ctx.rotate(-Math.PI / 3); // rotación si quieres

        const paddingX = 8;
        const paddingY = 4;
        const textWidth = ctx.measureText(texto).width;
        const width = textWidth + paddingX * 2;
        const height = 18;

        // Ajustar la burbuja
        ctx.beginPath();
        const radius = 6; // esquinas redondeadas
        ctx.moveTo(-width / 2 + radius, -height / 2);
        ctx.lineTo(width / 2 - radius, -height / 2);
        ctx.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
        ctx.lineTo(width / 2, height / 2 - radius);
        ctx.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
        ctx.lineTo(-width / 2 + radius, height / 2);
        ctx.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
        ctx.lineTo(-width / 2, -height / 2 + radius);
        ctx.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);
        ctx.closePath();

        ctx.fillStyle = '#6F8CCE';
        ctx.fill();

        // Texto centrado
        ctx.fillStyle = 'white';
        ctx.font = '10px Work Sans';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(texto, 0, 0);

        ctx.restore();
      });
    });
  }
};



  
  // Función para formatear números
/*  function formatNumber(value: number): string {
    const suffixes = ["", "K", "M", "B", "T"];
    let newValue = value;
    let suffixIndex = 0;

    while (Math.abs(newValue) >= 1000 && suffixIndex < suffixes.length - 1) {
      newValue /= 1000;
      suffixIndex++;
    }

    const formatted = newValue.toLocaleString("es-BO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

    return formatted + suffixes[suffixIndex];
  }*/

  return {
    copiado,
    copiarGrafico,
    ordenarBarras,
    mostrarTooltipBurbujaPlugin,
    formatNumber,
    mostrarValoresPluginSumatoria,
    mostrarValoresPlugin,
    
  };
}
