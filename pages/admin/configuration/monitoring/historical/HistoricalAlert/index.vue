<template>
    <div class="flex flex-col gap-12">
        <XHeader title="Bitácora de mensaje alerta">
            <template #description>
                Texto descriptivo de la sección
            </template>
        </XHeader>
        <div>
            <InputText v-model="globalFilterAlerts" @input="onGlobalFilterChangeAlerts" placeholder="Buscar"
                class="my-12" />
            <DataTable v-model:filters="filtersAlerts" :value="listAlert" paginator :rows="5"
                :rowsPerPageOptions="[5, 10, 20, 50]">
                <Column field="description" header="Alerta" />
                <Column field="paymentGatewayAcronym" header="Canal" />
                <Column field="recipientCount" header="Destinatarios" />
                <Column field="updatedByUser" header="Usuario" />
                <Column field="changeNumber" header="Nro. de Cambio" />
                <Column field="updatedAt" header="Últ. fecha de modif." />
            </DataTable>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useAlertsService } from '~/componsables/useAlerts';
import { useDates } from '~/componsables/useDates';
import { FilterMatchMode } from '@primevue/core'; 

const { alertHistorical } = useAlertsService()
const { formatDate } = useDates()

const listAlert = ref()
const globalFilterAlerts = ref("");
const onGlobalFilterChangeAlerts = (e: any) => {
  filtersAlerts.value["global"].value = e.target.value;
};
const filtersAlerts = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})
onMounted(async () => {
    try {
        const response = await alertHistorical()
        console.log("la response es: ", response)
        if (!response) return
        listAlert.value = response.historicalPaymentGatewayAlerts.map((element:any) => {
            return {
                ...element,
                updatedAt: formatDate(element.updatedAt)
            }
        })
    } catch (error) {

    }
})

</script>