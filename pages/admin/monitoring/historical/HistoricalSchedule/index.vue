<template>
    <div class="flex flex-col gap-20">
        <XHeader title="Bitácora - Horarios de atención" :breadcrumb-items="itemsBreadHistoricalShedule" :show-breadcrumb="true">
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
                            <span class="font-bold whitespace-nowrap">Regular</span>
                        </div>
                    </XTab>
                    <XTab value="1">
                        <div class="flex gap-4 items-center">
                            <span class="font-bold whitespace-nowrap">Extraordinario</span>
                        </div>
                    </XTab>
                </XTabList>
                <XTabPanels class="!p-0">
                    <XTabPanel value="0">
                        <HistoryModule
                            :config="scheduleRegularConfig"
                            search-placeholder="Buscar"
                        />
                    </XTabPanel>
                    <XTabPanel value="1">
                        <HistoryModule
                            :config="scheduleExceptionConfig"
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
import type { ScheduleExceptionHistoryItem, SheduleRegularHistoryItem } from '~/features/schedules/type';
import type { ServiceError } from '~/features/users/types';
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';
import { scheduleService } from '~/services/scheduleService';

const itemsBreadHistoricalShedule = getBreadcrumbItems('historyContingency', 'list');
const { formatDateTimeDirect, formatTime, formatDate } = useDates();

const scheduleRegularHistory = ref<SheduleRegularHistoryItem[]>([]);
const scheduleExceptionHistory = ref<ScheduleExceptionHistoryItem[]>([]);

const loading = ref(false);


const scheduleRegularConfig : HistoryConfig<any> = {
    columns: [
        { field: 'paymentGatewayAcronym', header: 'Canal', style: 'min-width: 100px;', class: 'text-left'},
        { field: 'paymentGatewayName', header: 'Transacción', style: 'min-width: 130px;', class: 'text-left',
            iconConfig: {
                conditionalIcon: {
                    condition: (rowData) => rowData.isInbound,
                    trueIcon: 'x:arrow-tr',
                    falseIcon: 'x:arrow-bl',
                    trueIconClass: 'text-sky-500',
                    falseIconClass: 'text-red-500 text-[12px]'
                },
            }
        },
        { field: 'paymentGatewayCode', header: 'Día', style: 'min-width: 150px;', class: 'text-left',
            formatter: (value: string, rowData: SheduleRegularHistoryItem) => formatScheduleWeek(value, rowData),
            searchFormatter: (value: string, rowData: SheduleRegularHistoryItem) => formatScheduleWeek(value, rowData),
        },
        { field: 'startTime', header: 'Hora inicio', style: 'min-width: 100px;', class: 'text-left',
            formatter: (value: string ) =>  formatTime(value),
        },
        { field: 'endTime', header: 'Hora fin', style: 'min-width: 100px;', class: 'text-left', 
            formatter: (value: string ) =>  formatTime(value),
        },
        { field: 'description', header: 'Detalle', style: 'min-width: 200px;', class: 'text-left'},
        { field: 'updatedByUser', header: 'Usuario', style: 'min-width: 80px;', class: 'text-left' },
        { field: 'lastChangeNumber', header: 'Nro. de Cambio', style: 'min-width: 75px;', class: 'text-left'},
        { field: 'updatedAt', header: 'Última fecha de modificación', style: 'min-width: 90px;', class: 'text-left',
            formatter: (value: string) =>  formatDateTimeDirect(value),
            searchFormatter: (value: string) => formatDateTimeDirect(value),
        },
    ],
    searchFields: ['paymentGatewayAcronym','paymentGatewayName','paymentGatewayCode', 'isActive' ,'startTime','endTime','description', 'updatedByUser', 'changeNumber', 'updatedAt'],
    pageSize: 10,
    service:{
        getData: async () => {
            loading.value = true
            try {
                const response = await scheduleService.getHistoryScheduleRegular()
                if(response){
                    scheduleRegularHistory.value = response.historicalPaymentGatewayCertificates
                    console.log('Contingecia participantes Cargados:', scheduleRegularHistory.value);
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

const scheduleExceptionConfig : HistoryConfig<any> = {
    columns: [
        { field: 'paymentGatewayAcronym', header: 'Canal', style: 'min-width: 100px;', class: 'text-left'},
        { field: 'transactionCode', header: 'Transacción', style: 'min-width: 110px;', class: 'text-left'},
        { field: 'effectiveOn', header: 'Fecha', style: 'min-width: 110px;', class: 'text-left',
            formatter: (value: string ) =>  formatDate(value),
            searchFormatter: (value: string) => formatDate(value),
        },
        { field: 'startTime', header: 'Hora inicio', style: 'min-width: 100px;', class: 'text-left', 
            formatter: (value: string ) =>  formatTime(value),
        },
        { field: 'endTime', header: 'Hora fin', style: 'min-width: 100px;', class: 'text-left', 
            formatter: (value: string ) =>  formatTime(value),
        },
        { field: 'description', header: 'Justificación', style: 'min-width: 220px;', class: 'text-left'},
        { field: 'updatedByUser', header: 'Usuario', style: 'min-width: 80px;', class: 'text-left' },
        { field: 'changeNumber', header: 'Nro. de Cambio', style: 'min-width: 75px;', class: 'text-left'},
        { field: 'updatedAt', header: 'Última fecha de modificación', style: 'min-width: 90px;', class: 'text-left',
            formatter: (value: string) =>  formatDateTimeDirect(value),
            searchFormatter: (value: string) => formatDateTimeDirect(value),
        },
    ],
    searchFields: ['paymentGatewayAcronym','transactionCode','effectiveOn', 'startTime' ,'endTime','description', 'updatedByUser', 'changeNumber', 'updatedAt'],
    pageSize: 10,
    service:{
        getData: async () => {
            loading.value = true
            try {
                const response = await scheduleService.getHistoryScheduleException()
                if(response){
                    scheduleExceptionHistory.value = response.historicalPaymentGatewayScheduleExceptions
                    console.log('Contingecia participantes Cargados:', scheduleExceptionHistory.value);
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


const formatScheduleWeek = (value, rowData: SheduleRegularHistoryItem): string => {
    if (!rowData) {
        return 'Sin datos';
    }
    
    const daysMap = [
        { key: 'isMondayAvailable', label: 'Lu' },
        { key: 'isTuesdayAvailable', label: 'Ma' },
        { key: 'isWednesdayAvailable', label: 'Mi' },
        { key: 'isThursdayAvailable', label: 'Ju' },
        { key: 'isFridayAvailable', label: 'Vi' },
        { key: 'isSaturdayAvailable', label: 'Sa' },
        { key: 'isSundayAvailable', label: 'Do' }
    ];
    
    const activeDays = daysMap

        .filter(day => rowData[day.key as keyof SheduleRegularHistoryItem] === true)
        .map(day => day.label);
    const result = activeDays.length > 0 ? activeDays.join(' / ') : 'Ningún día';
    
    return result;
};


</script>