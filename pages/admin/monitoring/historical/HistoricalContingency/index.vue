<template>
    <div class="flex flex-col gap-20">
        <XHeader title="Bitácora - Enrutamiento y operabilidad" :breadcrumb-items="itemsBreadHistoricalContingency" :show-breadcrumb="true">
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
                            <span class="font-bold whitespace-nowrap">Participantes</span>
                        </div>
                    </XTab>
                    <XTab value="1">
                        <div class="flex gap-4 items-center">
                            <span class="font-bold whitespace-nowrap">Canal</span>
                        </div>
                    </XTab>
                </XTabList>
                <XTabPanels class="!p-0">
                    <XTabPanel value="0">
                        <HistoryModule
                            :config="contingenciParticipantConfig"
                            search-placeholder="Buscar"
                        />
                    </XTabPanel>
                    <XTabPanel value="1">
                        <HistoryModule
                            :config="contingencyChannelConfig"
                            search-placeholder="Buscar"
                        />
                    </XTabPanel>
                </XTabPanels>
            </XTabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import HistoryModule from '~/components/historical/HistoryModule.vue';
import type { HistoryConfig } from '~/componsables/historical/type';
import { useDates } from '~/componsables/useDates';
import type { ChannelContingencyItem, ParticipantContingencyItem } from '~/features/contingency/type';
import type { ServiceError } from '~/features/users/types';
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';
import { contingencyService } from '~/services/contingencySevice';

const itemsBreadHistoricalContingency = getBreadcrumbItems('historyContingency', 'list');

const contingencyParticipantHistory = ref<ParticipantContingencyItem[]>([]);
const contingencyChannelHistory = ref<ChannelContingencyItem[]>([]);
const loading = ref(false);

const { formatDateTimeDirect } = useDates();

const contingenciParticipantConfig : HistoryConfig<any> = {
    columns: [
        { field: 'participantName', header: 'Participante', style: 'min-width: 200px;', class: 'text-left'},
        { field: 'paymentGatewayCode', header: 'Canal', style: 'min-width: 80px;', class: 'text-left'},
        { field: 'transactionCode', header: 'Transacción', style: 'min-width: 175px;', class: 'text-left'},
        { field: 'isPrimary', header: 'Canal ppal.', style: 'min-width: 65px;', class: 'text-left',
            searchFormatter: (value: boolean) => getPriOpeAltSearchText(value),
            formatter: (value: boolean) =>  getPriOpeAltSearchText(value),
        },
        { field: 'isOperational', header: 'Estado oper.', style: 'min-width: 65px;', class: 'text-left',
            searchFormatter: (value: boolean) => getPriOpeAltSearchText(value),
            formatter: (value: boolean) =>  getPriOpeAltSearchText(value),
        },
        { field: 'isTemporarilyActive', header: 'Es alterno', style: 'min-width: 65px;', class: 'text-left',
            searchFormatter: (value: boolean) => getPriOpeAltSearchText(value),
            formatter: (value: boolean) =>  getPriOpeAltSearchText(value),
        },
        { field: 'contingencyTitle', header: 'Título de conting.', style: 'min-width: 200px;', class: 'text-left'},
        { field: 'contingencyDetail', header: 'Mensaje de conting.', style: 'min-width: 200px;', class: 'text-left'},
        { field: 'changeReason', header: 'Justificación', style: 'min-width: 200px;', class: 'text-left',}, 
        { field: 'updatedByUser', header: 'Usuario', style: 'min-width: 80px;', class: 'text-left' },
        { field: 'changeNumber', header: 'Nro. de Cambio', style: 'min-width: 75px;', class: 'text-left'},
        { field: 'updatedAt', header: 'Última fecha de modificación', style: 'min-width: 90px;', class: 'text-left',
            formatter: (value: string) =>  formatDateTimeDirect(value),
            searchFormatter: (value: string) => formatDateTimeDirect(value),
        },
    ],
    searchFields: ['participantName','paymentGatewayCode', 'transactionCode' ,'isPrimary','isOperational','isTemporarilyActive', 'contingencyTitle' ,'contingencyDetail','changeReason', 'updatedByUser', 'changeNumber', 'updatedAt'],
    pageSize: 10,
    service:{
        getData: async () => {
            loading.value = true
            try {
                const response = await contingencyService.getHistoryContingencyParticipants()
                if(response){
                    contingencyParticipantHistory.value = response.participantRoutes
                    console.log('Contingecia participantes Cargados:', contingencyParticipantHistory.value);
                }
                return { data: response.participantRoutes };
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

const contingencyChannelConfig : HistoryConfig<any> = {
    columns: [
        { field: 'paymentGatewayAcronym', header: 'Canal', style: 'min-width: 200px;', class: 'text-left'},
        { field: 'isOperational', header: 'Estado', style: 'min-width: 80px;', class: 'text-left',
            searchFormatter: (value: boolean) => getStatusChannelSearchText(value),
            formatter: (value: boolean) =>  getStatusChannelSearchText(value),
        },
        { field: 'updatedByUser', header: 'Usuario', style: 'min-width: 80px;', class: 'text-left' },
        { field: 'changeNumber', header: 'Nro. de Cambio', style: 'min-width: 75px;', class: 'text-left'},
        { field: 'updatedAt', header: 'Última fecha de modificación', style: 'min-width: 90px;', class: 'text-left',
            formatter: (value: string) =>  formatDateTimeDirect(value),
            searchFormatter: (value: string) => formatDateTimeDirect(value),
        },
    ],
    searchFields: ['participantName','paymentGatewayCode', 'transactionCode' ,'isPrimary','isOperational','isTemporarilyActive', 'contingencyTitle' ,'contingencyDetail','changeReason', 'updatedByUser', 'changeNumber', 'updatedAt'],
    pageSize: 10,
    service:{
        getData: async () => {
            loading.value = true
            try {
                const response = await contingencyService.getHistoryContingencyChannels()
                if(response){
                    contingencyChannelHistory.value = response.paymentGatewayOperationals
                    console.log('Contingecia participantes Cargados:', contingencyChannelHistory.value);
                }
                return { data: response.paymentGatewayOperationals };
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

const getPriOpeAltSearchText = (isVariable: boolean): string => {
    return isVariable ? 'Si' : 'No';
};


const getStatusChannelSearchText = (isVariable: boolean): string => {
    return isVariable ? 'Operacional' : 'Con Contingencia';
};
</script>