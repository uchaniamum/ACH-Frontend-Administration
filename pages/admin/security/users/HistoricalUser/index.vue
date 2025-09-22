<template>
    <div class="flex flex-col gap-20">
        <XHeader title="Bitacora - Usuarios" :breadcrumb-items="itemsBreadHistoricalContingency" :show-breadcrumb="true">
            <template #description>
                <p>Texto descriptivo de la sección .</p>
            </template>
        </XHeader>
        <div class="flex flex-col gap-12">
            <HistoryModule
                :config="userConfig"
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
import { userService } from '~/services/userService';

const { formatDateTimeDirect } = useDates();
const loading = ref(false);

const userHistory = ref<any[]>([]);

const itemsBreadHistoricalContingency = getBreadcrumbItems('historyContingency', 'list');

const userConfig: HistoryConfig<any> = {
    columns: [
        { field: 'userCode', header: 'Codigo', style: 'min-width: 75px;', class: 'text-left'},
        { field: 'fullname', header: 'Nombre', style: 'min-width: 195px;', class: 'text-left'},
        { field: 'email', header: 'Email', style: 'min-width: 150px;', class: 'text-left' },
        { field: 'alias', header: 'Alias', style: 'min-width: 100px;', class: 'text-left'},
        { field: 'userRole', header: 'Roles', style: 'min-width: 100px;', class: 'text-left'},
        { field: 'phoneNumber', header: 'Celular', style: 'min-width: 150px;', class: 'text-left'},
        { field: 'updatedByUser', header: 'Estado', style: 'min-width: 85px;', class: 'text-left',
            searchFormatter: (value: boolean) => getStatusUserSearchText(value),
            template: (value: boolean) => statusUserTag(value),
        },
        { field: 'updatedByUser', header: 'Usuario', style: 'min-width: 100px;', class: 'text-left'},
        { field: 'changeNumber', header: 'N° de Cambio', style: 'min-width: 75px;', class: 'text-left'},
        { field: 'updatedAt', header: 'Últ. fecha de modif.', style: 'min-width: 90px;', class: 'text-left', 
            formatter: (value: string) => formatDateTimeDirect(value)
        },
    ],
    searchFields: ['userCode', 'fullname', 'email', 'alias', 'userRole', 'phoneNumber', 'isActive', 'updatedByUser', 'changeNumber', 'updatedAt'],
    pageSize: 10,
    service:{
        getData: async () => {
            loading.value = true
            try {
                const response = await userService.getHistoryUser()
                if(response){
                    userHistory.value = response.users
                    console.log('Contingecia participantes Cargados:', userHistory.value);
                }
                return { data: response.users };
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

const statusUserTag = (isActive: boolean): { severity: string, value: string } => {
    return {
        severity: isActive ? "success" : "danger",
        value: isActive ? 'Activo' : 'Inactivo'
    };
};

const getStatusUserSearchText = (isActive: boolean): string => {
    return isActive ? 'Activo' : 'Inactivo';
};
</script>