<template>
    <div>
        <div class="flex flex-col gap-20">
            <XHeader title="Bitácora de procesos" :breadcrumb-items="itemsBreadHistoricalProcesos" :show-breadcrumb="true">
                <template #description>
                    <p>Texto descriptivo de la sección .</p>
                </template>
            </XHeader>
            <div class="flex flex-col gap-12">
                <HistoryModule
                    :config="processConfig"
                    search-placeholder="Buscar"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import HistoryModule from '~/components/historical/HistoryModule.vue';
import type { HistoryConfig } from '~/componsables/historical/type';
import { useDates } from '~/componsables/useDates';
import type { ProcessHistoryItem } from '~/features/processes/type';
import type { ServiceError } from '~/features/users/types';
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';
import { proccessServices } from '~/services/processServices';

const itemsBreadHistoricalProcesos = getBreadcrumbItems('historyProcess', 'list');

const processHistory = ref<ProcessHistoryItem[]>([]);
const loading = ref(false);

const { formatDateTimeDirect } = useDates();

const processConfig: HistoryConfig<any> = {
    columns: [
        { field: 'paymentGatewayAcronym', header: 'Canal', style: 'min-width: 75px;', class: 'text-left'},
        { field: 'code', header: 'Proceso', style: 'min-width: 100px;', class: 'text-left'},
        { field: 'description', header: 'Descripción', style: 'min-width: 171px;', class: 'text-left' },
        { field: 'lastExecutionAt', header: 'Última ejecución', style: 'min-width: 120px;', class: 'text-left',
            formatter: (value: string) =>  formatDateTimeDirect(value), 
            searchFormatter: (value: string) => formatDateTimeDirect(value),
        },
        { field: 'nextExecutionAt', header: 'Próxima ejecución', style: 'min-width: 120px;', class: 'text-left',
            formatter: (value: string) =>  formatDateTimeDirect(value), 
            searchFormatter: (value: string) => formatDateTimeDirect(value),
        },
        { field: 'isRunning', header: 'Ejecución', style: 'min-width: 129px;', class: 'text-left',
            formatter: (value: boolean) => getIsRunningeSearchText(value),
            searchFormatter: (value: boolean) => getIsRunningeSearchText(value),
        },
        { field: 'executionBackgroundStatus', header: 'Estado ult. ejecución', style: 'min-width: 115px;', class: 'text-left'},
        { field: 'updatedByUser', header: 'Usuario', style: 'min-width: 100px;', class: 'text-left'},
        { field: 'changeNumber', header: 'Nro. de Cambio', style: 'min-width: 75px;', class: 'text-left'},
        { field: 'updatedAt', header: 'Últ. fecha de modif.', style: 'min-width: 115px;', class: 'text-left',
            formatter: (value: string) =>  formatDateTimeDirect(value), 
            searchFormatter: (value: string) => formatDateTimeDirect(value),

        },
    ],
    searchFields: ['paymentGatewayAcronym', 'code', 'description', 'lastExecutionAt', 'nextExecutionAt','isRunning', 'executionBackgroundStatus','updatedByUser','changeNumber','updatedAt'],
    pageSize: 10,
    service:{
        getData: async () => {
            loading.value = true
            try {
                const response = await proccessServices.getHistoryProcess()
                if(response){
                    processHistory.value = response.historicalPaymentGatewayScheduleExceptions
                    console.log('Contingecia participantes Cargados:', processHistory.value);
                }
                return { data: response.historicalPaymentGatewayScheduleExceptions };
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

const getIsRunningeSearchText = (isRunning: boolean): string => {
    return isRunning ? 'En ejecución': 'Pausado';
    //return `${countryCode} ${cellPhone}`.trim();
};
</script>