<template>
    <div class="flex flex-col gap-12">
        <XHeader title="Bitácora - Participantes">
            <template #description>
                Texto descriptivo de la sección
            </template>
        </XHeader>
        <Tabs :value="activeTab">
            <TabList>
                <Tab value="0">Datos del participante</Tab>
                <Tab value="1">Canal</Tab>
                <Tab value="2">Certificados</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0">
                    <InputText
                          v-model="globalFilterParticipants"
                          @input="onGlobalFilterChangeParticipants"
                          placeholder="Buscar"
                          class="my-12"
                    />
                    <DataTable v-model:filters="filtersParticipants" :value="participantsList" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
                        <Column field="participantCode" header="Código"/>
                        <Column field="participantAcronym" header="Sigla"/>
                        <Column field="participantName" header="Entidad"/>
                        <Column field="paymentGatewayAcronym" header="Canal Principal"/>
                        <Column field="updatedByUser" header="Usuario"/>
                        <Column field="createdAt" header="Nro. de Cambio"/>
                        <Column field="updatedAt" header="Últ. fecha de modif."/>
                    </DataTable>
                </TabPanel>
                <TabPanel value="1">
                    <InputText
                          v-model="globalFilterChannels"
                          @input="onGlobalFilterChangeChannels"
                          placeholder="Buscar"
                          class="my-12"
                    />
                    <DataTable v-model:filters="filtersChannels" :value="channelsList" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
                        <Column field="acronym" header="Participante"/>
                        <Column field="paymentGatewayAcronym" header="Canal"/>
                        <Column field="isActive" header="Estado"/>
                        <Column field="updatedByUser" header="Usuario"/>
                        <Column field="changeNumber" header="Nro. de Cambio"/>
                        <Column field="updatedAt" header="Últ. fecha de modif."/>
                    </DataTable>
                </TabPanel>
                <TabPanel value="2">
                    <InputText
                          v-model="globalFilterCertificates"
                          @input="onGlobalFilterChangeCertificates"
                          placeholder="Buscar"
                          class="my-12"
                    />
                    <DataTable v-model:filters="filtersCertificates" :value="certificatesList" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
                        <Column field="acronym" header="Participante"/>
                        <Column field="paymentGatewayAcronym" header="Canal"/>
                        <Column field="thumbprint" header="Identificador"/>
                        <Column field="serialNumber" header="Nro. serie"/>
                        <Column field="validFrom" header="Val. desde"/>
                        <Column field="validTo" header="Val. hasta"/>
                        <Column field="hasPrivateKey" header="Tipo certificado"/>
                        <Column field="isAvailable" header="En uso"/>
                        <Column field="updatedByUser" header="Usuario"/>
                        <Column field="changeNumber" header="Nro. de Cambio"/>
                        <Column field="updatedAt" header="Últ. fecha de modif."/>
                    </DataTable>
                </TabPanel>
            </TabPanels>
        </Tabs>
    </div>
</template>
<script lang="ts" setup>
import { useDates } from '~/componsables/useDates';
import { FilterMatchMode } from '@primevue/core'; 
import { usePartipantsService } from '~/componsables/useParticipants';

const participantsList = ref()
const channelsList = ref()
const certificatesList = ref()
const activeTab = ref("0")
// Filtro de prticipantes
const globalFilterParticipants = ref("");
const onGlobalFilterChangeParticipants = (e: any) => {
  filtersParticipants.value["global"].value = e.target.value;
};
const filtersParticipants = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

// Filtro de busqueda para canales
const globalFilterChannels = ref("");
const onGlobalFilterChangeChannels = (e: any) => {
  filtersChannels.value["global"].value = e.target.value;
};
const filtersChannels = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})


const globalFilterCertificates = ref("");
const onGlobalFilterChangeCertificates = (e: any) => {
  filtersCertificates.value["global"].value = e.target.value;
};
const filtersCertificates = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

const { getHistoricParticipants, getHistoricCertificates, getHistoricGateways  } = usePartipantsService();
const { formatDate } = useDates()
onMounted(async () => {
    const [ participants, channels, certificates] = await Promise.all([
        await getHistoricParticipants(),
        await getHistoricGateways(),
        await getHistoricCertificates()
    ])
    if(!participants) return
    participantsList.value = participants.map((element:any) =>{
        return {
            ...element,
            updatedAt: formatDate(element.updatedAt),
            createdAt: formatDate(element.createdAt)
        }
    })
    if(!channels) return
    channelsList.value = channels.map((element:any) =>{
        return {
            ...element,
            updatedAt: formatDate(element.updatedAt),
            createdAt: formatDate(element.createdAt),
            isActive: element.isActive ? 'Activo' : 'Inactivo'
        }
    })
    if(!certificates) return
    certificatesList.value = certificates.map((element:any) =>{
        return {
            ...element,
            updatedAt: formatDate(element.updatedAt),
            createdAt: formatDate(element.createdAt),
            validFrom: formatDate(element.validFrom),
            validTo: formatDate(element.validTo),
            hasPrivateKey: element.hasPrivateKey ? 'Privado' : 'Público',
            isAvailable: element.isAvailable ? 'Si' : 'No'
        }
    })

    console.log('los datos cargados son', {
        data1: participants,
        dato2: channels,
        dato3: certificates
    })
})

</script>