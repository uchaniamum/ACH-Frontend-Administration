<template>
    <div class="flex flex-col gap-20">
        <div class="flex flex-col gap-8">
            <XHeader title="Historial de procesos" :breadcrumb-items="itemsBreadProcesses" :show-breadcrumb="true" @back-click="goBack"/>
            <span class="text-normal font-normal">Texto descriptivo del flujo.</span>
        </div>

        <div class="flex flex-col gap-12 pb-40">
            <!-- <div class="flex justify-between gap-4">
                <div class="self-center">
                    <XIconField>
                        <XInputText name="searchProcessesHistory" placeholder="Buscar" v-model="searchTermProcessesHistory"/>
                        <XInputIcon icon="search"/>
                    </XIconField>
                </div>
            </div> -->

            <!-- <DataTable
                :value="filteredProccessHistory"
                :loading="loading"
            >
                <Column field="paymentGateway" header="Canal" style="min-width: 104px;" class="text-left">
                    <template #body="{ data }">
                        {{ data.channel }}
                    </template>
                </Column>
                <Column field="processes" header="Proceso"  style="min-width: 130px;" class="text-left">
                    <template #body="{ data }">
                        {{ data.process }}
                    </template>
                </Column>
                <Column field="description" header="Descripción"  style="min-width: 242px;" class="text-left">
                    <template #body="{ data }">
                        {{ data.description }}
                    </template>
                </Column>
                <Column field="lastExecution" header="Última ejecución"  style="min-width: 160px;" class="text-left">
                    <template #body="{ data }">
                        {{ data.lastExecution }}
                    </template>
                </Column>
                <Column field="nextExecution" header="Próxima ejecución" style="min-width: 160px;" class="text-left">
                    <template #body="{ data }">
                        {{ data.nextExecution }}
                    </template>
                </Column>
                <Column field="status" header="Estado"  style="min-width: 145px;" class="text-left">
                    <template #body="{ data }">
                        {{ data.executionStatus ? 'Ejecutado' : 'No ejecutado' }}
                    </template>
                </Column>
                <Column field="users" header="Usuario"  style="min-width: 114px;" class="text-left">
                    <template #body="{ data }">
                        {{ data.lastExecution }}
                    </template>
                </Column>
                <Column field="lastDate" header="Última fecha de modificación" style="min-width: 164px;" class="text-left">
                    <template #body="{ data }">
                        {{ data.nextExecution }}
                    </template>
                </Column>
            </DataTable> -->
        
            <HistoryModule
                :config="processesConfig"
                search-placeholder="Buscar"
            />
        </div>
    </div>
    
    
</template>

<script setup lang="ts">
import HistoryModule from '~/components/historical/HistoryModule.vue';
import type { HistoryConfig } from '~/componsables/historical/type';
import type { Processes } from '~/features/processes/type';
import type { ServiceError } from '~/features/users/types';
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';
import { proccessServices } from '~/services/processServices';

const router = useRouter();

const itemsBreadProcesses = getBreadcrumbItems('processes', 'list');

const processesHistory = ref<Processes[]>([]);
const loading = ref(false);

const searchTermProcessesHistory = ref('');

// Cargar procesos historial
const loadProcessHistory = async (): Promise<void> => {
    loading.value = true
    try {
        const response = await proccessServices.getProcesses()
        if(response){
            processesHistory.value = response.data
            //console.log('Procesos Cargados:', processesHistory.value);
        }
        
        
    } catch (error) {
        console.error('Error loading channels:', error)
        const serviceError = error as ServiceError
        console.log('Service Error:', serviceError);
    } finally {
        loading.value = false
    }
}

const filteredProccessHistory = computed(() => {
    if (!processesHistory.value?.length) return [];

    let filtered = processesHistory.value;

    // Filtrar por término de búsqueda global
    if (searchTermProcessesHistory.value.trim()) {
        const search = searchTermProcessesHistory.value.toLowerCase().trim();
        filtered = filtered.filter(process =>
            process.process?.toLowerCase().includes(search) ||
            process.channel?.toLowerCase().includes(search) ||
            process.lastExecution.toLowerCase().includes(search) ||
            process.nextExecution.toLowerCase().includes(search) ||
            process.description?.toLowerCase().includes(search)
        );
    }

    return filtered;
});

// NAVEGACIÓN
const goBack = () => {
    router.back();
};

///NUEVA FORMA DE MANEJAR ESTO DEL HISTORIAL
const processesConfig: HistoryConfig<Processes> = ref({
    columns: [
        { field: 'channel', header: 'Canal', style: 'min-width: 104px;', class: 'text-left', sortable: true },
        { field: 'process', header: 'Proceso', style: 'min-width: 130px;', class: 'text-left', sortable: true },
        { field: 'description', header: 'Descripción', style: 'min-width: 242px;', class: 'text-left', sortable: false },
        { field: 'lastExecution', header: 'Última ejecución', style: 'min-width: 160px;', class: 'text-left', sortable: true },
        { field: 'nextExecution', header: 'Próxima ejecución', style: 'min-width: 160px;', class: 'text-left', sortable: true },
        { field: 'executionStatus', header: 'Estado', style: 'min-width: 145px;', class: 'text-left', sortable: true,
            formatter: (value: boolean) => value ? 'Ejecutado' : 'No ejecutado' 
        },
        { field: 'user', header: 'Usuario', style: 'min-width: 114px;', class: 'text-left', sortable: true },
        { field: 'lastModifiedDate', header: 'Última fecha de modificación', style: 'min-width: 164px;', class: 'text-left', sortable: true },
    ],
    searchFields: ['channel', 'process', 'description', 'lastExecution', 'nextExecution', 'executionStatus', 'user', 'lastModifiedDate'],
    pageSize: 10,
    service:{
        getData: async () => {
            loading.value = true
            try {
                const response = await proccessServices.getProcesses()
                if(response){
                    processesHistory.value = response.data
                    console.log('Procesos Cargados:', processesHistory.value);
                }
                return { data: response.data };
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
})
// Lifecycle
onMounted(() => {
    loadProcessHistory()
})
</script>