// ~/composables/useChartUtilitarios.ts
import { ref } from "vue";
import html2canvas from "html2canvas";
import type { Plugin, ChartData } from "chart.js";

// Types
interface DatasetColors {
  [key: string]: string;
}

interface LabelMap {
  [key: string]: string;
}

interface ChartReference {
  chart: any;
}

interface CombinedData {
  label: string;
  valores: number[];
  suma: number;
}

export function useChartUtilitarios() {
  const copiado = ref(false);

  // Constants
  const DATASET_COLORS: DatasetColors = {
    QR: "#FFFFFF",
    Express: "#FFFFFF",
    Asincrono: "#1F2937",
  };

  const LABEL_MAP: LabelMap = {
    ASYNC: "ASINCRONO",
    EXPRESS: "EXPRESS",
    QR: "QR",
  };

  const FONT_CONFIG = {
    family: "Work Sans",
    weight: "400" as const,
    size: {
      small: 8,
      medium: 10,
      large: 12,
    },
  };

  // Funcion Formatear numeros
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
      maximumFractionDigits: 1,
    });

    return formatted + suffixes[suffixIndex];
  }

  function getTextColor(datasetLabel: string): string {
    return DATASET_COLORS[datasetLabel] || "#333333";
  }

  function calculateBarCenter(
    bar: any,
    indexAxis: string
  ): { x: number; y: number } {
    if (indexAxis === "y") {
      return {
        x: (bar.base + bar.x) / 2,
        y: bar.y,
      };
    } else {
      return {
        x: bar.x,
        y: (bar.base + bar.y) / 2,
      };
    }
  }

  function setupTextContext(
    ctx: CanvasRenderingContext2D,
    color: string,
    fontSize: number = FONT_CONFIG.size.medium
  ): void {
    ctx.fillStyle = color;
    ctx.font = `${FONT_CONFIG.weight} ${fontSize}px ${FONT_CONFIG.family}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
  }

  // Main Functions
  const copiarGrafico = async (containerEl: HTMLElement): Promise<void> => {
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
        setTimeout(() => (copiado.value = false), 2000);
      }, "image/png");
    } catch (err) {
      console.error("Error al copiar la imagen:", err);
      throw err;
    }
  };

  const ordenarBarras = (
    chartRef: ChartReference,
    chartData: ChartData,
    ordenAscendenteRef: { value: boolean }
  ): void => {
    if (!chartData || !chartRef?.chart) return;

    const labels = [...(chartData.labels as string[])];
    const datasets = chartData.datasets.map((d) => ({
      ...d,
      data: [...(d.data as number[])],
    }));

    const combined: CombinedData[] = labels.map((label, i) => {
      const valores = datasets.map((d) => (d.data as number[])[i]);
      const suma = valores.reduce((acc, val) => acc + val, 0);
      return { label, valores, suma };
    });

    combined.sort((a, b) =>
      ordenAscendenteRef.value ? a.suma - b.suma : b.suma - a.suma
    );

    const newChartData: ChartData = {
      labels: combined.map((c) => c.label),
      datasets: datasets.map((d, i) => ({
        ...d,
        data: combined.map((c) => c.valores[i]),
      })),
    };

    ordenAscendenteRef.value = !ordenAscendenteRef.value;
    chartRef.chart.data = newChartData;
    chartRef.chart.update();
  };

  // Plugins
  const mostrarValoresPlugin: Plugin = {
    id: "mostrarValoresPlugin",
    afterDatasetsDraw(chart: any) {
      const pluginEnabled =
        chart.config.options.plugins?.mostrarValoresPlugin?.enabled;
      if (!pluginEnabled) return;

      const ctx = chart.ctx;
      const indexAxis = chart.config.options.indexAxis || "x";
      const pluginConfig =
        chart.config.options.plugins?.mostrarValoresPlugin || {};

      chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        if (meta.hidden) return;

        meta.data.forEach((bar: any, index: number) => {
          const value = dataset.data[index];
          if (value <= 0) return;

          const textColor = getTextColor(dataset.label);
          const fontSize = pluginConfig.font?.size || FONT_CONFIG.size.medium;
          const { x, y } = calculateBarCenter(bar, indexAxis);

          ctx.save();
          setupTextContext(ctx, textColor, fontSize);
          ctx.fillText(formatNumber(value), x, y);
          ctx.restore();
        });
      });
    },
  };

  const mostrarValoresPluginSumatoria: Plugin = {
    id: "mostrarValoresPluginSumatoria",
    afterDatasetsDraw(chart: any) {
      const pluginEnabled =
        chart.config.options.plugins?.mostrarValoresPluginSumatoria?.enabled;
      if (!pluginEnabled) return;

      const ctx = chart.ctx;
      const indexAxis = chart.config.options.indexAxis || "x";

      // Mostrar valores internos
      chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
        const meta = chart.getDatasetMeta(datasetIndex);
        if (meta.hidden) return;

        meta.data.forEach((bar: any, index: number) => {
          const value = dataset.data[index];
          if (value <= 0) return;

          const textColor = getTextColor(dataset.label);
          const { x, y } = calculateBarCenter(bar, indexAxis);
          const fontSize = Math.max(11, chart.height * 0.015); // Reducido el multiplicador

          ctx.save();
          setupTextContext(ctx, textColor, fontSize);
          ctx.fillText(formatNumber(value), x, y);
          ctx.restore();
        });
      });

      // Mostrar sumatorias totales
      chart.data.labels.forEach((_: any, index: number) => {
        let total = 0;
        let barRef: any = null;

        chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          if (meta.hidden) return;

          const value = dataset.data[index] || 0;
          total += value;

          const bar = meta.data[index];
          if (bar) barRef = bar;
        });

        if (total > 0 && barRef) {
          const fontSize = Math.max(12, chart.height * 0.02); // Reducido el multiplicador

          ctx.save();
          setupTextContext(ctx, "#000000", fontSize);
          ctx.textBaseline = "bottom";

          if (indexAxis === "y") {
            ctx.fillText(formatNumber(total), barRef.x + 25, barRef.y);
          } else {
            ctx.fillText(formatNumber(total), barRef.x, barRef.y - 10);
          }
          ctx.restore();
        }
      });
    },
  };

  const mostrarTooltipBurbujaPlugin: Plugin = {
    id: "mostrarTooltipBurbujaPlugin",
    afterDatasetsDraw(chart: any) {
      const mostrar = chart.options.plugins?.mostrarValoresPie;
      if (!mostrar) return;

      const ctx = chart.ctx;
      const dataset = chart.data.datasets[0];
      const meta = chart.getDatasetMeta(0);
      const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
      const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

      meta.data.forEach((sector: any, i: number) => {
        const value = dataset.data[i];
        const rawLabel = chart.data.labels[i];
        const label = LABEL_MAP[rawLabel] || rawLabel;

        const midAngle = (sector.startAngle + sector.endAngle) / 2;
        const radius = sector.outerRadius + Math.min(35, chart.width * 0.07);

        let x = centerX + radius * Math.cos(midAngle);
        let y = centerY + radius * Math.sin(midAngle);

        const texto = `${label} ${value}%`.toUpperCase();
        const paddingX = 10;
        const boxHeight = 24;

        ctx.font = `${FONT_CONFIG.size.large}px ${FONT_CONFIG.family}`;
        const textWidth = ctx.measureText(texto).width;
        const boxWidth = textWidth + paddingX * 2;

        let boxX = x - boxWidth / 2;
        let boxY = y - boxHeight / 2;

        // Boundary adjustments
        boxX = Math.max(
          chart.chartArea.left + 5,
          Math.min(boxX, chart.chartArea.right - boxWidth - 5)
        );
        boxY = Math.max(
          chart.chartArea.top + 5,
          Math.min(boxY, chart.chartArea.bottom - boxHeight - 5)
        );

        ctx.save();

        // Draw pointer
        ctx.fillStyle = "#5C667A";
        ctx.beginPath();
        ctx.moveTo(boxX, boxY + boxHeight / 2);
        ctx.lineTo(boxX - 8, boxY + boxHeight / 2 - 6);
        ctx.lineTo(boxX - 8, boxY + boxHeight / 2 + 6);
        ctx.closePath();
        ctx.fill();

        // Draw rounded box
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 12);
        ctx.fill();

        // Draw text
        ctx.fillStyle = "#FFFFFF";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(texto, boxX + boxWidth / 2, boxY + boxHeight / 2);
        ctx.restore();
      });
    },
  };

  function drawPointCircle(ctx: any, point: any, color: string) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
  }

  function drawValueTooltip(ctx: any, point: any, value: number) {
    const texto = formatNumber(value);

    ctx.save();
    ctx.translate(point.x, point.y - 25);
    ctx.rotate(-Math.PI / 3);

    const paddingX = 8;
    const paddingY = 4;
    const textWidth = ctx.measureText(texto).width;
    const width = textWidth + paddingX * 2;
    const height = 18;

    // Dibujar burbuja redondeada
    drawRoundedRect(ctx, -width / 2, -height / 2, width, height, 6, "#6F8CCE");

    // Texto centrado
    ctx.fillStyle = "white";
    ctx.font = "10px Work Sans";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(texto, 0, 0);

    ctx.restore();
  }

  function drawRoundedRect(
    ctx: any,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillColor: string
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    ctx.fillStyle = fillColor;
    ctx.fill();
  }

  function formatPercentage(value: number, total: number): string {
    return ((value / total) * 100).toFixed(1);
  }
  function shouldGroupAsOthers(items: any[]): boolean {
    return items.length > 6 || items.some((item) => item.percent < 3);
  }

  return {
    // State
    copiado,

    // Functions
    copiarGrafico,
    ordenarBarras,
    formatNumber,
    drawPointCircle,
    drawValueTooltip,
    formatPercentage,
    shouldGroupAsOthers,

    // Plugins
    mostrarValoresPlugin,
    mostrarValoresPluginSumatoria,
    mostrarTooltipBurbujaPlugin,

    // Constants (exposed for external use if needed)
    DATASET_COLORS,
    LABEL_MAP,
    FONT_CONFIG,
  };
}
