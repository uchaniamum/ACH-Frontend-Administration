import { API_CONFIG } from "~/config/api";
import type { Currencies, FiltersResponse, Periods } from "~/features/dashboard/options.types";

class FiltersService {
  public baseURL = API_CONFIG.BASE_URL;
  

  private formatCodeToLabel(code: string): string {
    return code
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}/${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
      console.log("Esta es un URL", url);
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

  async getOptions(): Promise<FiltersResponse> {
    const endpoint = "/analytics/options";
    return this.request<FiltersResponse>(endpoint);
  }

  async getFilterCurrencies(): Promise<Currencies[]> {
    try {
      const response = await this.getOptions();
      if (response.currencies) {
        return response.currencies.filter((currencies) => currencies.isActive);
      }
      return [];
    } catch (error) {
      console.error("Error getting user currencies:", error);
      return [];
    }
  }

  async getFilterPeriods(): Promise<Currencies[]> {
    try {
      const response = await this.getOptions();
      if (response.periods) {
        return response.periods.filter((periods) => periods.isActive);
      }
      return [];
    } catch (error) {
      console.error("Error getting user periods:", error);
      return [];
    }
  }

    mapPeriodsToSelectOptions(periods: Periods[]) {
          return periods
              .sort((a, b) => a.order - b.order)
              .map(period => ({
                  // label: this.formatCodeToLabel(status.code),
                  label: period.displayName,
                  value: period.code,
              }))
      }
  
}
export const filtersService = new FiltersService();