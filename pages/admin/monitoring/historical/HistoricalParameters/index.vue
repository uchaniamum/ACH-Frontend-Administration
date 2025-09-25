<template>
    <div>
        <div class="flex flex-col gap-20">
            <XHeader title="Bitácora - Parámetros" :breadcrumb-items="itemsBreadHistoricalParameter" :show-breadcrumb="true" :show-back="true">
                <template #description>
                    <p>Texto descriptivo de la sección .</p>
                </template>
            </XHeader>
            <div class="flex flex-col gap-12">
                <HistoryModule
                    :config="parameterConfig"
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
import type { ParameterHistoryItem } from '~/features/parameters/types';
import type { ServiceError } from '~/features/users/types';
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';
import { parametersService } from '~/services/parametersService';

const itemsBreadHistoricalParameter = getBreadcrumbItems('historyParameter', 'list');
const parameterHistory = ref<ParameterHistoryItem[]>([]);
const loading = ref(false);

//const { loadHistorialParameter } = useParameterService();
const { formatDateTimeDirect } = useDates();


const parameterConfig: HistoryConfig<any> = {
    columns: [
        { field: 'paymentGatewayAcronym', header: 'Canal', class: 'text-left'},
        { field: 'paymentGatewayParameterCode', header: 'Código', class: 'text-left'},
        { field: 'value', header: 'Valor',  class: 'text-left' },
        { field: 'dataType', header: 'Tipo de Dato',  class: 'text-left'},
        { field: 'description', header: 'Descripción',  class: 'text-left'},
        { field: 'updatedByUser', header: 'Usuario',  class: 'text-left'},
        { field: 'changeNumber', header: 'Nro. de Cambio', class: 'text-left'},
        { field: 'updatedAt', header: 'Últ. fecha de modif.',  class: 'text-left',
            formatter: (value: string) =>  formatDateTimeDirect(value),
            searchFormatter: (value: string) => formatDateTimeDirect(value),

        },
    ],
    searchFields: ['paymentGatewayAcronym', 'paymentGatewayParameterCode', 'value', 'dataType', 'description','updatedByUser','changeNumber','updatedAt'],
    pageSize: 10,
    service:{
        getData: async () => {
            loading.value = true
            try {
                const response = await parametersService.getHistoryParameter()
                if(response){
                    parameterHistory.value = response.historicalParameters
                    console.log('Contingecia participantes Cargados:', parameterHistory.value);
                }
                return { data: response.historicalParameters };
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

// onMounted(async () => {
//     loadHistorialParameter()
// })

</script>