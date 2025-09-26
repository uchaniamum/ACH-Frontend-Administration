import type {
  PaymentGatewayOp,
  UserRoleOp,
  UserStatusOp,
} from "~/features/users/options.types";
import type { ServiceError } from "~/features/users/types";
import { filtersService } from "~/services/filtersService";

export function useAnalyticsOptions() {
  const currenciesOptions = ref<{ label: string; value: string }[]>([]);
  const currenciesFilterOptions = ref<{ label: string; value: string }[]>([]);
  const externalParticipantsOptions = ref<{ label: string; value: string }[]>(
    []
  );
  const externalParticipantsFilterOptions = ref<
    { label: string; value: string }[]
  >([]);
  const externalParticipantAcronymsOptions = ref<
    { label: string; value: string }[]
  >([]);
  const externalParticipantAcronymsFilterOptions = ref<
    { label: string; value: string }[]
  >([]);
  const periodsOptions = ref<{ label: string; value: string }[]>([]);
  const periodsFilterOptions = ref<{ label: string; value: string }[]>([]);
  const transactionsOptions = ref<{ label: string; value: string }[]>([]);
  const transactionsFilterOptions = ref<{ label: string; value: string }[]>([]);
  const paymentChannelsOptions = ref<{ label: string; value: string }[]>([]);
  const paymentChannelsFilterOptions = ref<{ label: string; value: string }[]>(
    []
  );

  const loading = ref(false);
  const error = ref<string | null>(null);
  const loadperiodsOptions = async () => {
    try {
      loading.value = true;
      error.value = null;

      const periods = await filtersService.getFilterPeriods();
      periodsOptions.value = filtersService.mapPeriodsToSelectOptions(periods);
    } catch (err) {
      const serviceError = err as ServiceError;
      error.value = serviceError.message || "Error al cargar los periodos";
      console.error("Error loading periods options:", err);

      // Fallback en caso de error
      periodsOptions.value = [{ label: "0", value: "Sin periodo" }];
    } finally {
      loading.value = false;
    }
  };

  const loadBanckOptions = async () => {
    try {
      loading.value = true;
      error.value = null;

      const bancks = await filtersService.getFilterBanck();
      externalParticipantAcronymsOptions.value =
        filtersService.mapPeriodsToSelectOptions(bancks);
    } catch (err) {
      const serviceError = err as ServiceError;
      error.value = serviceError.message || "Error al cargar los periodos";
      console.error("Error loading periods options:", err);

      // Fallback en caso de error
      externalParticipantAcronymsOptions.value = [
        { label: "0", value: "Sin banco" },
      ];
    } finally {
      loading.value = false;
    }
  };

  const resetOptions = () => {
    periodsOptions.value = [];
    error.value = null;
  };
  return {
    periodsOptions: readonly(periodsOptions),
    periodsFilterOptions: readonly(periodsFilterOptions),
    externalParticipantAcronymsOptions: readonly(
      externalParticipantAcronymsOptions
    ),
    externalParticipantAcronymsFilterOptions: readonly(
      externalParticipantAcronymsFilterOptions
    ),

    loading: readonly(loading),
    error: readonly(error),
    loadperiodsOptions,
    loadBanckOptions,
  };
}
