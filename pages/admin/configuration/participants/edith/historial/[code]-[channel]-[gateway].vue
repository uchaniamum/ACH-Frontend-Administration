<template>
    <div class="flex flex-col">
        <XHeader :title='`Historial de certificaciones - ${channel}`' @click="router.back()" class="cursor-pointer"/>
        <span class="mt-10">Esta sección te presenta el historial de acciones asociados a los certificados, permitiéndote consultar y filtrar la información en función a lo que requieras.</span>
        <DataTable :value="newListHistorial" class="mt-20">
            <Column field="serialNumber" header="Nro. de serie"/>
            <Column field="validFrom" header="Válido desde"/>
            <Column field="validTo" header="Válido hasta"/>
            <Column field="updatedAt" header="Último cambio"/>
            <Column field="updatedByUserAlias" header="Usuario 1"/>
        </DataTable>
    </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { usePartipantsService } from '~/componsables/useParticipants';
import { useDates } from '~/componsables/useDates';
    const { getHistorial } = usePartipantsService();
    const { formatDate } = useDates();
    const { params: { code, channel, gateway}} = useRoute();
    const router = useRouter();
    const response = ref()
    const newListHistorial = ref()
    onMounted(async () => {
        console.log(code,channel,gateway)
        response.value = await getHistorial(code, gateway);
        newListHistorial.value = response.value?.certificates.map( item => {
            return { 
                ...item,
                validFrom: formatDate(item?.validFrom),
                validTo: formatDate(item?.validTo),
                updatedAt: formatDate(item?.updatedAt)
            }
        })
        console.log('new list: ', newListHistorial.value)
    })
</script>