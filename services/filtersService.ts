import { API_CONFIG } from "~/config/api";
import type {
  Currencies,
  ExternalParticipantAcronyms,
  FiltersRespuesta,
  Periods,
} from "~/features/dashboard/options.types";

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

  async getOptions(): Promise<FiltersRespuesta> {
    const endpoint = "analytics/options";
    return this.request<FiltersRespuesta>(endpoint);
  }

  async getFilterCurrencies(): Promise<Currencies[]> {
    try {
      const response = await this.getOptions();
      if (response.Filters?.currencies) {
        return response.Filters.currencies.filter(
          (currencies) => currencies.isActive
        );
      }
      return [];
    } catch (error) {
      console.error("Error getting user currencies:", error);
      return [];
    }
  }

  async getFilterPeriods(): Promise<Periods[]> {
    try {
      const response = await this.getOptions();
      console.log("mis peridos son", response);
      if (response.Filters?.periods) {
        return response.Filters.periods.filter((periods) => periods.isActive);
      }
      return [];
    } catch (error) {
      console.error("Error getting user periods:", error);
      return [];
    }
  }

  mapPeriodsToSelectOptions(periods: Periods[]) {
    console.log("mis datos de peridos son", periods);
    return periods
      .sort((a, b) => a.order - b.order)
      .map((period) => ({
        // label: this.formatCodeToLabel(status.code),
        label: period.displayName,
        value: this.formatCodeToLabel(period.code),
      }));
  }

  async getFilterBanck(): Promise<ExternalParticipantAcronyms[]> {
    try {
      const response = await this.getOptions();
      console.log("mis peridos son", response);
      if (response.Filters?.externalParticipantAcronyms) {
        return response.Filters.externalParticipantAcronyms.filter(
          (externalParticipantAcronyms) => externalParticipantAcronyms.isActive
        );
      }
      return [];
    } catch (error) {
      console.error("Error getting user periods:", error);
      return [];
    }
  }

  mapBancksOptions(externalParticipantAcronyms: Periods[]) {
    console.log("mis datos de peridos son", externalParticipantAcronyms);
    return externalParticipantAcronyms
      .sort((a, b) => a.order - b.order)
      .map((bancks) => ({
        // label: this.formatCodeToLabel(status.code),
        label: bancks.displayName,
        value: this.formatCodeToLabel(bancks.code),
      }));
  }
}
export const filtersService = new FiltersService();
