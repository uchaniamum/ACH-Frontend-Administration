<template>
    <div class="flex flex-col">
        <XHeader title="Configuración de alertas">
            <template #description>
                Incorpora y actualiza los destinatarios de los mensajes de alerta, se cuidadoso y ten en cuenta que ellos serán los que recibirán las notificaciones cuando corresponda.
            </template>
        </XHeader>
        <div>
            <InputText v-model="globalFilterAlerts" @input="onGlobalFilterChangeAlerts" placeholder="Buscar"
                class="my-12" />
            <DataTable v-model:filters="filtersAlerts" :value="listAlerts" paginator :rows="5"
                :rowsPerPageOptions="[5, 10, 20, 50]">
                <Column field="alertDescription" header="Alerta"></Column>
                <Column field="paymentGatewayDescription" header="Canal"></Column>
                <Column field="recipientCounter" header="Destinatarios" />
                <Column field="name" header="Acción">
                    <template #body="{data: { paymentGatewayAlertCode, paymentGatewayCode}}">
                        <div class="flex flex-row">
                            <XButton label="Asignar" @click="router.push(`/admin/configuration/alertas/asignacion/${paymentGatewayAlertCode}-${paymentGatewayCode}`)"/>
                        </div>
                    </template>
                </Column>                
            </DataTable>
        </div>

    </div>
</template>
<script lang="ts" setup>

import { useAlertsService } from '~/componsables/useAlerts'
import { useRouter } from 'vue-router'
import { FilterMatchMode } from '@primevue/core'; 

const { loadAlerts } = useAlertsService();

const globalFilterAlerts = ref("");
const onGlobalFilterChangeAlerts = (e: any) => {
  filtersAlerts.value["global"].value = e.target.value;
};
const filtersAlerts = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const router = useRouter();
const listAlerts = ref([])

onMounted(async () =>{
    const { paymentGatewayAlerts } = await loadAlerts();
    listAlerts.value = paymentGatewayAlerts;
    console.log('las alertas',paymentGatewayAlerts)    
    
})
</script>