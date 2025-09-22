<template>
    <div>
        <div class="flex flex-col gap-20">
            <XHeader title="Bitácora - Administrador canales" :breadcrumb-items="itemsBreadHistoricalChannels" :show-breadcrumb="true">
                <template #description>
                    <p>Texto descriptivo de la sección .</p>
                </template>
            </XHeader>

            <div class="flex flex-col gap-12">
                <XTabs value="0" class="flex gap-16">
                    <XTabList :pt="{
                        root: { class: '!border-b-0 p-tab-extended-line' },
                        tabList: {
                            root: ({ context }) => ({
                                class: [
                                    'relative z-10',
                                    context.active 
                                        ? 'border-b-[4px] border-primary text-primary' 
                                        : 'border-b-0 text-gray-900'
                                ]
                            }),
                            action: { class: 'pb-4' }
                        }
                    }">
                        <XTab value="0">
                            <div class="flex gap-4 items-center">
                                <span class="font-bold whitespace-nowrap">Canales</span>
                            </div>
                        </XTab>
                        <XTab value="1">
                            <div class="flex gap-4 items-center">
                                <span class="font-bold whitespace-nowrap">Certificados</span>
                            </div>
                        </XTab>
                    </XTabList>
                    <XTabPanels class="!p-0">
                        <XTabPanel value="0">
                            <HistoryModule
                                :config="channelsConfig"
                                search-placeholder="Buscar"
                            />
                        </XTabPanel>
                        <XTabPanel value="1">
                            <HistoryModule
                                :config="channelsCertificateConfig"
                                search-placeholder="Buscar"
                            />
                        </XTabPanel>
                    </XTabPanels>
                </XTabs>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import HistoryModule from '~/components/historical/HistoryModule.vue';
import type { HistoryConfig } from '~/componsables/historical/type';
import { useDates } from '~/componsables/useDates';
import type { PaymentGatewayCertificatesHistoryItem, PaymentGatewayRoutesHistoryItem } from '~/features/channels/type';
import type { ServiceError } from '~/features/users/types';
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';
import { channelsService } from '~/services/channelsService';

const { formatDateTimeDirect, formatDate } = useDates();

const itemsBreadHistoricalChannels = getBreadcrumbItems('historyChannels', 'list');
const loading = ref(false);

const channelsHistory = ref<PaymentGatewayRoutesHistoryItem[]>([]);
const channlsCertificateHistory = ref<PaymentGatewayCertificatesHistoryItem[]>([]);


const channelsConfig: HistoryConfig<any> = {
    columns: [
        { field: 'paymentGatewayCode', header: 'Código', style: 'min-width: 90px;', class: 'text-left'},
        { field: 'description', header: 'Canales ', style: 'min-width: 360px;', class: 'text-left'},
        { field: 'paymentGatewayAcronym', header: 'Sigla', style: 'min-width: 130px;', class: 'text-left' },
        { field: 'alias', header: 'Alias CPD', style: 'min-width: 130px;', class: 'text-left'},
        { field: 'updatedByUser', header: 'Usuario', style: 'min-width: 130px;', class: 'text-left'},
        { field: 'changeNumber', header: 'Nro. de Cambio', style: 'min-width: 75px;', class: 'text-left'},
        { field: 'updatedAt', header: 'Últ. fecha de modif.', style: 'min-width: 164px;', class: 'text-left',
            formatter: (value: string) =>  formatDateTimeDirect(value),
            searchFormatter: (value: string) => formatDateTimeDirect(value),

        },
    ],
    searchFields: ['paymentGatewayCode', 'description', 'paymentGatewayAcronym', 'alias', 'updatedByUser','changeNumber','updatedAt'],
    pageSize: 10,
    service:{
        getData: async () => {
            loading.value = true
            try {
                const response = await channelsService.getHistoryPaymentGateway()
                if(response){
                    channelsHistory.value = response.historicalPaymentGatewayRoutes
                    console.log('Contingecia participantes Cargados:', channelsHistory.value);
                }
                return { data: response.historicalPaymentGatewayRoutes };
            } catch (error) {
                console.error('Error loading channels:', error)
                const serviceError = error as ServiceError
                console.log('Service Error:', serviceError);
                return [];
            } finally {
                loading.value = false
            }
        }
    }
}

const channelsCertificateConfig: HistoryConfig<any> = {
    columns: [
        { field: 'paymentGatewayCode', header: 'Canal ', style: 'min-width: 100px;', class: 'text-left'},
        { field: 'acronym', header: 'Identificador', style: 'min-width: 110px;', class: 'text-left' },
        { field: 'serialNumber', header: 'Nro. serie', style: 'min-width: 160px;', class: 'text-left'},
        { field: 'validFrom', header: 'Val. desde', style: 'min-width: 100px;', class: 'text-left',
            formatter: (value: string) =>  formatDate(value),
            searchFormatter: (value: string) => formatDate(value),
        },
        { field: 'validTo', header: 'Val. hasta', style: 'min-width: 100px;', class: 'text-left',
            formatter: (value: string) =>  formatDate(value),
            searchFormatter: (value: string) => formatDate(value),
        },
        { field: 'hasPrivateKey', header: 'Tipo certificado', style: 'min-width: 80px;', class: 'text-left',
            formatter: (value: boolean) => getTypeCertificateText(value),
            searchFormatter: (value: boolean) => getTypeCertificateText(value),
        },
        { field: 'isActive', header: 'En uso', style: 'min-width: 75px;', class: 'text-left',
            formatter: (value: boolean) => getStatusCertificateText(value),
            searchFormatter: (value: boolean) => getStatusCertificateText(value),
        },
        { field: 'updatedByUser', header: 'Usuario', style: 'min-width: 100px;', class: 'text-left'},
        { field: 'changeNumber', header: 'Nro. de Cambio', style: 'min-width: 75px;', class: 'text-left'},
        { field: 'updatedAt', header: 'Últ. fecha de modif.', style: 'min-width: 90px;', class: 'text-left',
            formatter: (value: string) =>  formatDateTimeDirect(value),
            searchFormatter: (value: string) => formatDateTimeDirect(value),
        },
    ],
    searchFields: ['paymentGatewayCode', 'acronym', 'serialNumber', 'validFrom', 'validTo','hasPrivateKey','isActive','updatedByUser','changeNumber','updatedAt'],
    pageSize: 10,
    service:{
        getData: async () => {
            loading.value = true
            try {
                const response = await channelsService.getHistoryPaymentGatewayCertificates()
                if(response){
                    channlsCertificateHistory.value = response.historicalPaymentGatewayCertificates
                    console.log('Contingecia Certificados Cargados:', channlsCertificateHistory.value);
                }
                return { data: response.historicalPaymentGatewayCertificates };
            } catch (error) {
                console.error('Error loading channels:', error)
                const serviceError = error as ServiceError
                console.log('Service Error:', serviceError);
                return [];
            } finally {
                loading.value = false
            }
        }
    }
}

const getTypeCertificateText = (hasPrivateKey: boolean): string => {
    return hasPrivateKey ? 'Privado' : 'Público';
};

const getStatusCertificateText = (isActive: boolean): string => {
    return isActive ? 'Sí' : 'No';
};
</script>