import { API_CONFIG } from "~/config/api";
import type { SumaryResponses } from "~/features/dashboard/sumary.types";

class SumaryService {
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

  async getSummaryByCode(code: string): Promise<SumaryResponses> {
    if (!code) {
      throw new Error("User code is required");
    }
    return this.request<SumaryResponses>(
      `analytics/dashboard/summary/period/${code}`
    );
  }
}
export const sumaryService = new SumaryService();
