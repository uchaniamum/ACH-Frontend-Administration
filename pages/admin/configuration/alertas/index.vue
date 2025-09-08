<template>
    <div class="flex flex-col gap-20">
        <XHeader title="Configuración de alertas">
            <template #description>
                Incorpora y actualiza los destinatarios de los mensajes de alerta, se cuidadoso y ten en cuenta que ellos serán los que recibirán las notificaciones cuando corresponda.
            </template>
        </XHeader>
        <div class="flex flex-col">
            <DataTable :value="listAlerts" tableStyle="min-width: 50rem" class="my-10">
                <Column field="alertDescription" header="Alerta"></Column>
                <Column field="paymentGatewayDescription" header="Canal"></Column>
                <Column header="Destinatarios" style="min-width: 250px; white-space: normal;">
                    <template #body="{ data: { emailRecipientAddress } }">
                        <div class="whitespace-normal break-words flex flex-col gap-4">
                            <Chip v-for="(email, index ) in emailRecipientAddress" :key="index">
                                {{ email }}
                            </Chip>
                        </div>
                    </template>
                </Column>
                <Column field="name" header="Acción">
                    <template #body="{data: { paymentGatewayAlertCode, paymentGatewayCode}}">
                        <div class="flex flex-row">
                            <XButton label="Asignar" @click="router.push(`alertas/asignacion/${paymentGatewayAlertCode}-${paymentGatewayCode}`)"/>
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
const { loadAlerts, getAlertByCode } = useAlertsService();


const router = useRouter();
const listAlerts = ref([])

onMounted(async () =>{
    const { paymentGatewayAlerts } = await loadAlerts();
    listAlerts.value = paymentGatewayAlerts;
    console.log('las alertas',paymentGatewayAlerts)    
    
})
</script>