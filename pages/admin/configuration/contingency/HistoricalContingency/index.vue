<template>
    <div class="flex flex-col gap-20">
        <XHeader title="Bitacora - Contingencia" :breadcrumb-items="itemsBreadHistoricalContingency" :show-breadcrumb="true">
            <template #description>
                <p>Texto descriptivo de la sección .</p>
            </template>
        </XHeader>
        <div class="flex flex-col gap-12">
            <HistoryModule
                :config="contingenciChannelConfig"
                search-placeholder="Buscar"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import HistoryModule from '~/components/historical/HistoryModule.vue';
import type { HistoryConfig } from '~/componsables/historical/type';
import { useDates } from '~/componsables/useDates';
import type { ServiceError } from '~/features/users/types';
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';
import { contingencyService } from '~/services/contingencySevice';

const itemsBreadHistoricalContingency = getBreadcrumbItems('historyContingency', 'list');

const contingencyParticipantHistory = ref<any[]>([]);
const loading = ref(false);

const { formatDateTimeDirect } = useDates();

const contingenciChannelConfig: HistoryConfig<any> = {
    columns: [
        { field: 'paymentGatewayCode', header: 'Canal', style: 'min-width: 224px;', class: 'text-left'},
        { field: 'isOperational', header: 'Estado', style: 'min-width: 224px;', class: 'text-left',
            searchFormatter: (value: boolean) => getStatusSearchText(value),
            template: (value: boolean) => createStatusTag(value),
        },
        { field: 'updatedByUser', header: 'Usuario', style: 'min-width: 224px;', class: 'text-left' },
        { field: 'changeNumber', header: 'Nro. de Cambio', style: 'min-width: 224px;', class: 'text-left'},
        { field: 'updatedAt', header: 'Última fecha de modificación', style: 'min-width: 224px;', class: 'text-left',
            formatter: (value: string) =>  formatDateTimeDirect(value)
        },
    ],
    searchFields: ['paymentGatewayCode', 'isOperational', 'updatedByUser', 'changeNumber', 'updatedAt'],
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
const createStatusTag = (isOperational: boolean): { severity: string, value: string } => {
    return {
        severity: isOperational ? "success" : "danger",
        value: isOperational ? 'Operativo' : 'No operativo'
    };
};

const getStatusSearchText = (isOperational: boolean): string => {
    return isOperational ? 'Operativo' : 'No operativo';
};
</script>