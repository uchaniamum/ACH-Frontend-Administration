<template>
    <div class="flex flex-col gap-12"> 
        <div class="flex flex-row justify-between">
            <div class="self-center">
                <XIconField>
                    <InputText 
                        v-model="searchTermGatewayContingency"
                        placeholder="Buscar" 
                        class="!w-[250px]"
                    />
                    <XInputIcon icon="search" @click="handleSearch" />
                </XIconField>
            </div>
            <div class="self-center flex gap-8">
                <XButton 
                    label="Configurar contingencia" 
                    @click="openModalChannel()"
                    :disabled="selectedPaymentsGateway.length === 0"
                />
            </div>
        </div>

        <DataTable 
            :value="filteredContingencyGateway" 
            :loading="loading"
            dataKey="channelAcronym"
        >
            <Column class="min-w-[75px] items-start" >
                <template #body="{ data }">
                    <XRadioButton 
                        :modelValue="selectedPaymentsGateway.includes(data.code)"
                        @update:modelValue="togglePaymentGatewaySelection(data.code)"
                        :binary="true"
                    />
                </template>
            </Column> 

            <Column field="channelAcronym" header="Canal" :showFilterMenu="false" class="min-w-[209px]" >
                <template #body="{ data }">
                    {{ data.acronym }}
                </template>
            </Column>
            <Column field="channelName" header="Descripción Canal" :showFilterMenu="false" class="min-w-[209px]" >
                <template #body="{ data }">
                    {{ data.name }}
                </template>
            </Column>
            <Column field="channelOperation" header="Operacional" class="min-w-[209px]" >
                <template #body="{ data }">
                    <Tag 
                        :value="data.isOperational ? 'Operativo' : 'En Contingencia'" 
                        :severity="data.isOperational ? 'success' : 'danger'"
                    />
                </template>
            </Column>
        </DataTable>

        <!-- Modal de contingencia para canales -->
        <ChannelContingencyModal
            v-model="modalChannelContingency.modalChannelContingency" 
            :paymentGatewayData="modalChannelContingency.paymentGatewayData"
            @successToast="handleToastSuccess"
            @errorToast="handleToastError"
        />
    </div>
</template>

<script setup lang="ts">
import ChannelContingencyModal from '~/features/contingency/ChannelContingencyModal.vue';
import type { ServiceError } from '~/features/users/types';
import { contingencyService } from '~/services/contingencySevice';

// Composables
const toast = useToast()

// State
const contingencyChannelData = ref<any[]>([]);
const selectedPaymentsGateway = ref('' as string);
const searchTermGatewayContingency = ref('');
const loading = ref(false);

const modalChannelContingency = ref<{
    modalChannelContingency: boolean,
    paymentGatewayData?: any,
}>({
    modalChannelContingency: false,
    paymentGatewayData: undefined
})

// Computed
const filteredContingencyGateway = computed(() => {
    if (!contingencyChannelData.value?.length) return [];

    let filtered = contingencyChannelData.value;

    // Filtrar por término de búsqueda global
    if (searchTermGatewayContingency.value.trim()) {
        const search = searchTermGatewayContingency.value.toLowerCase().trim();
        filtered = filtered.filter(channel =>
            channel.acronym?.toLowerCase().includes(search) ||
            channel.name?.toLowerCase().includes(search) ||
            (channel.isOperational ? 'sin contingencia' : 'con contingencia')
                .toLowerCase()
                .includes(search)
        );
    }

    return filtered;
});

// Methods
const loadChannels = async (): Promise<void> => {
    loading.value = true;
    try {
        const response = await contingencyService.getPaymentGatewayRoutes();
        contingencyChannelData.value = response.paymentGatewayOperationalRouteMaps;
    } catch (error) {
        console.error('Error loading contingency:', error);
        const serviceError = error as ServiceError;

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: serviceError.message || 'Error al cargar los bancos',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
}

const togglePaymentGatewaySelection = (paymentGatewayCode: string) => {
    if(selectedPaymentsGateway.value === paymentGatewayCode){
        selectedPaymentsGateway.value = '';
        console.log('Canal deseleccionado:', paymentGatewayCode);
    }else{
        selectedPaymentsGateway.value = paymentGatewayCode;
        console.log('Canal seleccionado:', paymentGatewayCode);
    }
};

const openModalChannel = ()=>{
    const validSelected = contingencyChannelData.value
        .filter(channel => 
            selectedPaymentsGateway.value.includes(channel.code)
        )
        .map(channel => ({ code: channel.code, isOper: channel.isOperational, acronym: channel.acronym }));

    console.log('Canal(es) seleccionado(s) para contingencia:', validSelected);
    modalChannelContingency.value = {
        modalChannelContingency: true,
        paymentGatewayData:{
            paymentGatewayCodes: validSelected[0].code,
            paymentGatewayIsOperational: validSelected[0].isOper,
            paymentGatewayAcronym: validSelected[0].acronym
        }
    }
}

const handleSearch = () => {
    // Funcionalidad de búsqueda si es necesaria
}

// Funciones para manejar los toasts
const handleToastSuccess = (message: { summary: string, detail: string }) => {
    toast.add({
        severity: 'success',
        summary: message.summary,
        detail: message.detail,
        life: 5000
    })
    // Recargar los datos después de una operación exitosa
    loadChannels()
}

const handleToastError = (message: { summary: string, detail: string }) => {
    toast.add({
        severity: 'error',
        summary: message.summary,
        detail: message.detail,
        life: 5000
    })
}

// Cargar datos al montar el componente
onMounted(() => {
    loadChannels();
});
</script>