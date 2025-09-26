<template>
  <div>
    <XHeader
      title="Detalle de transferencias interbancarias"
      :breadcrumb-items="[
        { label: 'Inicio', url: '/' },
        { label: 'Monitoreo', url: '/transferencias' },
        { label: 'Reporte', url: '/admin/reports' },
        { label: `Transferencia [${traceNumber}]` },
      ]"
      :show-breadcrumb="true"
      @back-click="goBack"
    />
    
    <p class="flex justify-between gap-4 mt-9">
      A continuación se presenta los datos correspondientes a la operación seleccionada.
    </p>

    <div class="flex flex-wrap gap-10 mt-15">
      <section class="text-gray-800 border border-primary-300 rounded-xl p-10 w-1/2 flex-[0_0_calc(50%-5*(2/14)*1rem)]">
        <h3 class="mb-5 text-lg font-semibold">Datos del originante</h3>
        <div class="mt-2">
          <span class="font-semibold">Banco: </span>
          <span>
            {{
              transfersResponse.originator?.participantName
              ? `${transfersResponse.originator?.participantName} (${transfersResponse.originator?.participantAcronym})`
              : "-"
            }}
          </span>
        </div>
        <div class="mt-2">
          <span class="font-semibold">Nombre: </span>
          <span>{{ transfersResponse.originator?.accountHolderName ?? "-" }}</span>
        </div>
        <div class="mt-2">
          <span class="font-semibold">Nro. de producto: </span>
          <span>{{ transfersResponse.originator?.productNumber ?? "-" }}</span>
        </div>
        <div class="mt-2">
          <span class="font-semibold">Nro. de orden originante: </span>
          <span>{{ transfersResponse.originator?.traceNumber ?? "-" }}</span>
        </div>
      </section>

      <section class="text-gray-800 border border-primary-300 rounded-xl p-10 w-1/2 flex-[0_0_calc(50%-5*(2/14)*1rem)]">
        <h3 class="mb-5 text-lg font-semibold">Destino / enviado a</h3>
        <div class="mt-2">
          <span class="font-semibold">Banco: </span>
          <span>
            {{
              transfersResponse.receiver?.participantName
              ? `${transfersResponse.receiver?.participantName} (${transfersResponse.receiver?.participantAcronym})`
              : "-"
            }}
          </span>
        </div>
        <div class="mt-2">
          <span class="font-semibold">Nombre: </span>
          <span>{{ transfersResponse.receiver?.accountHolderName ?? "-" }}</span>
        </div>
        <div class="mt-2">
          <span class="font-semibold">Nro. de producto: </span>
          <span>{{ transfersResponse.receiver?.productNumber ?? "-" }}</span>
        </div>
        <div class="mt-2">
          <span class="font-semibold">Tipo de producto: </span>
          <span>{{ transfersResponse.receiver?.productTypeDisplayName ?? "-" }}</span>
        </div>
        <div class="mt-2">
          <span class="font-semibold">Tipo de producto: </span>
          <span>{{ transfersResponse.receiver?.traceNumber ?? "-" }}</span>
        </div>
      </section>

      <section class="text-gray-800 border border-primary-300 rounded-xl p-10 w-1/2 flex-[0_0_calc(50%-5*(2/14)*1rem)]">
        <h3 class="mb-5 text-lg font-semibold">Detalle de la transferencia</h3>
        <div class="mt-2">
          <span class="font-semibold">Nro. de orden ACH: </span>
          <span>{{ transfersResponse.externalTraceNumber ?? "-" }}</span>
        </div>
        <div class="mt-2">
          <span class="font-semibold">Fecha de transferencia: </span>
          <span>{{ transfersResponse.formattedDate ?? "-" }}</span>
        </div>
        <div class="mt-2">
          <span class="font-semibold">Moneda: </span>
          <span>{{ transfersResponse.currencyDisplayName ?? "-" }}</span>
        </div>
        <div class="mt-2">
          <span class="font-semibold">Importe: </span>
          <span>{{ transfersResponse.amount ?? "-" }}</span>
        </div>
      </section>

      <section class="text-gray-800 border border-primary-300 rounded-xl p-10 w-1/2 flex-[0_0_calc(50%-5*(2/14)*1rem)]">
        <h3 class="mb-5 text-lg font-semibold">Glosa</h3>
        <div class="mt-2">
          <span class="font-semibold">Descripción: </span>
          <span>{{ transfersResponse.reference ?? "-" }}</span>
        </div>
      </section>

      <section class="text-gray-800 border border-primary-300 rounded-xl p-10 w-full">
        <h3 class="mb-5 text-lg font-semibold">Detalle del débito del sistema</h3>
        <div class="mt-2">
          <span class="font-semibold">Fecha: </span>
          <span>{{ transfersResponse.financialTransaction?.formattedDate ?? "-" }}</span>
        </div>
        <div class="mt-2">
          <span class="font-semibold">Hora: </span>
          <span>{{ transfersResponse.financialTransaction?.formattedHour ?? "-" }}</span>
        </div>
        <div class="mt-2">
          <span class="font-semibold">Tipo de producto: </span>
          <span>{{ transfersResponse.financialTransaction?.productTypeDescription ?? "-" }}</span>
        </div>
        <div class="mt-2">
          <span class="font-semibold">Nro. de producto: </span>
          <span>{{ transfersResponse.financialTransaction?.productNumber ?? "-" }}</span>
        </div>
        <div class="mt-2">
          <span class="font-semibold">Moneda: </span>
          <span>{{ transfersResponse.financialTransaction?.currencyDisplayName ?? "-" }}</span>
        </div>
        <div class="mt-2">
          <span class="font-semibold">Importe: </span>
          <span>{{ transfersResponse.financialTransaction?.amount ?? "-" }}</span>
        </div>
        <div class="mt-2">
          <span class="font-semibold">ID de transferencia: </span>
          <span>{{ transfersResponse.financialTransaction?.transferId ?? "-" }}</span>
        </div>
      </section>
    </div>

    <div class="mb-30" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from "vue";
  import type { IndividualTransactionResponse } from "~/types/admin/reports";
  import { reportsService } from "~/services/reportsService";

  definePageMeta({ middleware: "loading" }); // Show initial loading

  const route = useRoute();

  const traceNumber = ref("");

  const transfersResponse = ref<IndividualTransactionResponse>({});

  onMounted(async () => {
    traceNumber.value = route.params.traceNumber;

    transfersResponse.value = await reportsService.getIndividualTransaction(traceNumber.value);
  });


  function goBack() {
    useRouter().push("/admin/reports");
  }
</script>
