import { API_CONFIG } from "~/config/api";
import type { SeriesEvolutivaResponse } from "~/features/dashboard/serieEvolutiva.types";
import type { SerieUsabilityChannelResponse } from "~/features/dashboard/serieUsabilityChannel.types";
import type { SerieUsabilityTransferResponse } from "~/features/dashboard/serieUsabilityTransfer.types";
import type { SerieTotalTransactionsResponse } from "~/features/dashboard/serieTotalTransactions.types";
import type { SerieTotalTransactionsRegionResponse } from "~/features/dashboard/serieTotalTransaccionsRegion.types";


class SeriesService {
  public baseURL = API_CONFIG.BASE_URL;

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${this.baseURL}/${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  }

  async getSerieEvolutivaByCode(
    code: string
  ): Promise<SeriesEvolutivaResponse> {
    if (!code) {
      throw new Error("User code is required");
    }
    return this.request<SeriesEvolutivaResponse>(
      `analytics/dashboard/series/amount/period/${code}`
    );
  }

  async getSerieEvolutivaCountByCode(
    code: string
  ): Promise<SeriesEvolutivaResponse> {
    if (!code) {
      throw new Error("User code is required");
    }
    return this.request<SeriesEvolutivaResponse>(
      `analytics/dashboard/series/count/period/${code}`
    );
  }

  async getSerieUsabilityByChannelByCode(
    code: string
  ): Promise<SerieUsabilityChannelResponse> {
    if (!code) {
      throw new Error("User code is required");
    }
    const response = await this.request<SerieUsabilityChannelResponse>(
      `analytics/dashboard/transfers/usability/payment-channel/period/${code}`
    );
    console.log("DEBUG - respuesta del servidor:", response); // <-- aquí
    return response;
  }

  async getSerieUsabilityByTransferByCode(
    code: string
  ): Promise<SerieUsabilityTransferResponse> {
    if (!code) {
      throw new Error("User code is required");
    }
    const response = await this.request<SerieUsabilityTransferResponse>(
      `analytics/dashboard/transfers/usability/transfer/period/${code}` // cxambiar ruta
    );
    console.log("DEBUG - respuesta del servidor:", response); // <-- aquí
    return response;
  }

  async getSerieTotalTransactionsByCode(
    code: string,
    tipo: "mount" | "count" = "mount" // por defecto "mount"
  ): Promise<SerieTotalTransactionsResponse> {
    if (!code) {
      throw new Error("User code is required");
    }
    // Aquí usamos "tipo" en la ruta
    const response = await this.request<SerieTotalTransactionsResponse>(
      `analytics/dashboard/transfers/external-participant-totals/${tipo}/period/${code}`
    );
    return response;
  }

  async getSerieTotalTransactionsRegionByCode(
    code: string,
    tipo: "mount" | "count" = "mount" // por defecto "mount"
  ): Promise<SerieTotalTransactionsRegionResponse> {
    if (!code) {
      throw new Error("User code is required");
    }
    const response = await this.request<SerieTotalTransactionsRegionResponse>(
      `analytics/dashboard/regions/${tipo}/period/${code}` // cxambiar ruta
    );
    console.log("DEBUG - respuesta del servidor:", response); // <-- aquí
    return response;
  }

  async getSerieTotalTransactionsRegionCountByCode(
    code: string
  ): Promise<SerieTotalTransactionsRegionResponse> {
    if (!code) {
      throw new Error("User code is required");
    }
    const response = await this.request<SerieTotalTransactionsRegionResponse>(
      `analytics/dashboard/regions/count/period/${code}` // cxambiar ruta
    );
    console.log("DEBUG - respuesta del servidor:", response); // <-- aquí
    return response;
  }
}
export const seriesService = new SeriesService();
