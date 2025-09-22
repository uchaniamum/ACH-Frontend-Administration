import { API_CONFIG } from "~/config/api";
import type { SeriesEvolutivaResponse } from "~/features/dashboard/serieEvolutiva.type";
import type { SerieUsabilityChannelResponse } from "~/features/dashboard/serieUsabilityChannel.types";

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
}
export const seriesService = new SeriesService();
