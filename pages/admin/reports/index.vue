<template>
  <div>
    <XHeader
      title="Consulta de transferencias interbancarias"
      :breadcrumb-items="[
        { label: 'Inicio', url: '/' },
        { label: 'Monitoreo', url: '/transferencias' },
        { label: 'Reporte' },
      ]"
      :show-breadcrumb="true"
    >
      <template #description>
        <p>
          Consulta las transferencias interbancarias aplicando filtros en función a los criterios de búsqueda disponibles.
        </p>
      </template>
    </XHeader>
    
    <p class="flex justify-between gap-4 mt-9">
      Selecciona un tipo de movimiento y llena los campos necesarios para realizar la búsqueda.
    </p>

    <div class="flex justify-start my-9">
      <AdminReportsMovementTypeSelector v-model="useReportsStore.movementType" />
    </div>

    <div class="flex gap-6 w-full justify-between items-start">
      <AdminReportsFilterClientDetails
        v-model:customer-identifier="useReportsStore.customerIdentifier"
        v-model:customer-identifier-code="useReportsStore.customerIdentifierCode"
        :options-filters="optionsFilters"
      />
      <AdminReportsFilterTransferDetails
        v-model:formatted-date-object="useReportsStore.formattedDateObject"
        v-model:transfer-code-string="useReportsStore.transferCodeString"
        v-model:currency-code-string="useReportsStore.currencyCodeString"
        v-model:transfer-show-more="useReportsStore.transferShowMore"
        :options-filters="optionsFilters"
      />
      <AdminReportsFilterDestinationDetails
        v-model:account-number="useReportsStore.accountNumber"
        v-model:external-participant-code="useReportsStore.externalParticipantCode"
        v-model:destination-show-more="useReportsStore.destinationShowMore"
        :options-filters="optionsFilters"
        :movement-type="useReportsStore.movementType"
      />
    </div>

    <div class="mt-7">
      <XSnackBar class="flex items-center" variant="info">
        <p class="text-gray-700 ml-5">
          Recuerda que al seleccionar la opción
          <span class="font-bold">"Más criterios de búsqueda"</span>, se
          habilitarán campos adicionales que te permitirán realizar la consulta
          de manera más específica.
        </p>
      </XSnackBar>
    </div>

    <div class="flex justify-end gap-8 mt-7">
      <XButton variant="text" @click="setFilterDefaultValues">
        <div class="font-medium flex items-center px-3">
          <Icon name="x:clean" />
          <span class="ml-3">Limpiar</span>
        </div>
      </XButton>

      <XButton :disabled="!isAbleToFilter" @click="searchTransfers">
        <div class="font-medium flex items-center px-3">
          <Icon name="x:search" />
          <span class="ml-3">Buscar</span>
        </div>
      </XButton>
    </div>

    <AdminReportsMainReportTable
      v-if="useReportsStore.searched"
      class="mt-9"
      :transfers-list="useReportsStore.transfersList"
    />

    <div class="mb-30" />
  </div>
</template>

<script setup lang="ts">
  import dayjs from "dayjs";
  import { reportsService } from "~/services/reportsService";
  import type { Filters } from "~/types/admin/reports";

  definePageMeta({ middleware: "loading" }); // Show initial loading

  const optionsFilters = ref<Filters>({});

  onMounted(async () => {
    optionsFilters.value = (await reportsService.getOptions()).Filters;
  });


  const useReportsStore = useState("reports-page-data", () => ({
    movementType: "SENT",

    // Client Details
    customerIdentifierCode: "ACCOUNT",
    customerIdentifier: null,

    // Transfer Details
    formattedDateObject: null,
    transferCodeString: "ALL",
    currencyCodeString: "ALL",
    transferShowMore: false,

    // Destination Details
    accountNumber: null,
    externalParticipantCode: "ALL",
    destinationShowMore: false,

    transfersList: [],

    searched: false,
  }));
  

  // Empty filters method
  function setFilterDefaultValues() {
    useReportsStore.value.customerIdentifierCode = "ACCOUNT";
    useReportsStore.value.customerIdentifier = null;

    useReportsStore.value.formattedDateObject = null;
    useReportsStore.value.transferCodeString = "ALL";
    useReportsStore.value.currencyCodeString = "ALL";
    useReportsStore.value.transferShowMore = false;

    useReportsStore.value.accountNumber = null;
    useReportsStore.value.externalParticipantCode = "ALL";
    useReportsStore.value.destinationShowMore = false;

    useReportsStore.value.transfersList = [];

    useReportsStore.value.searched = false;
  }


  const isAbleToFilter = computed(() => useReportsStore.value.customerIdentifier && useReportsStore.value.formattedDateObject && useReportsStore.value.accountNumber);



  // Search methods
  async function searchTransfers() {
    const transfersResponse = await reportsService.postRequestTransactional({
      isInbound: ["RECEIVED", "BOTH"].includes(useReportsStore.value.movementType),
      isOutbound: ["SENT", "BOTH"].includes(useReportsStore.value.movementType),
      formattedDate: dayjs(useReportsStore.value.formattedDateObject).format(),
      customerIdentifierCode: useReportsStore.value.customerIdentifierCode,
      customerIdentifier: useReportsStore.value.customerIdentifier,
      currencyCodes: useReportsStore.value.currencyCodeString == "ALL"
                      ? optionsFilters.value.currencies.map((c: Record<string, string>) => c.code)
                      : [useReportsStore.value.currencyCodeString],
      transactionCodes: useReportsStore.value.transferCodeString == "ALL"
                          ? optionsFilters.value.transactionSchemes.map((c: Record<string, string>) => c.code)
                          : [useReportsStore.value.transferCodeString],
      accountNumber: useReportsStore.value.accountNumber,
      externalParticipantCode: useReportsStore.value.externalParticipantCode == "ALL" ? "" : useReportsStore.value.externalParticipantCode,
    });

    useReportsStore.value.transfersList = transfersResponse.transfers;
    useReportsStore.value.searched = true;
  }

</script>
