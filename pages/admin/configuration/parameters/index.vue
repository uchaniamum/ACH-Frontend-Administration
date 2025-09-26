<template>
    <div class="flex flex-col gap-20">
        <XHeader title="Parámetros" :breadcrumb-items="itemsBreadParameters" :show-breadcrumb="true" :show-back="true">
            <template #description>
                <p class="text-gray-800">Verifica todos los parámetros configurados en el sistema y realiza las modificaciones necesarias. Asegúrate de tener un control adecuado.</p>
            </template>
        </XHeader>

        <div class="flex flex-col gap-12">
                <p class="text-gray-800">Selecciona los canales que deseas ver en la tabla.</p>

                <div class="flex flex-row justify-between">
                    <div class="self-center">
                        <XIconField>
                            <InputText 
                                v-model="searchTermParameter"
                                placeholder="Buscar" 
                                class="!w-[250px]"
                            />
                            <XInputIcon icon="search"/>
                        </XIconField>
                    </div>
                    <div class="self-center">
                        <SelectButton 
                            v-model="selectedChannel" 
                            :options="channelOptions" 
                            optionLabel="value" 
                            dataKey="value" 
                            aria-labelledby="custom"
                            :pt="{
                                root: { class: 'bg-white gap-6' },
                            }"
                        >
                            <template #option="slotProps">
                                <div class="flex items-center justify-center max-w-70 w-50">
                                    <span class="font-medium">{{ slotProps.option.value }}</span>
                                </div>
                            </template>
                        </SelectButton>
                    </div>
                </div>

                <div class="flex flex-col">
                    <div class="flex flex-col gap-12">
                        <DataTable
                            :value="paginatedItems" 
                            :loading="loading"
                            dataKey="id"
                            :globalFilterFields="['code', 'value', 'description', 'dataType', 'systemAcronym']"
                        >
                            <template #empty> 
                                <span class="flex justify-center">
                                    {{ filteredParameters.length === 0 && searchTermParameter.trim() ? 
                                        'No se encontraron parámetros que coincidan con la búsqueda.' : 
                                        'No se encontraron parámetros para el canal seleccionado.' }}
                                </span> 
                            </template>

<<<<<<< HEAD
                            <Column field="systemAcronym" header="Canal" sortable style="min-width: 100px;">
=======
                            <Column field="systemAcronym" header="Canal" style="min-width: 100px;" class="text-left">
>>>>>>> 6abac5dfde0a97019fd77fecbcfe51fbf9bd7058
                                <template #body="{ data }">
                                    {{ data.systemAcronym }}
                                </template>
                            </Column>

<<<<<<< HEAD
                            <Column field="code" header="Código" sortable headerStyle="width: 100px;" bodyStyle="width: 100px;">
=======
                            <Column field="code" header="Código" headerStyle="width: 100px;" bodyStyle="width: 100px;" class="text-left">
>>>>>>> 6abac5dfde0a97019fd77fecbcfe51fbf9bd7058
                                <template #body="{ data }">
                                    {{ data.code }}
                                </template>
                            </Column>
                        
<<<<<<< HEAD
                            <Column field="value" header="Valor" sortable style="min-width: 160px;">
=======
                            <Column field="value" header="Valor" style="min-width: 160px;" class="text-left">
>>>>>>> 6abac5dfde0a97019fd77fecbcfe51fbf9bd7058
                                <template #body="{ data }">
                                    {{ data.value }}
                                </template>
                            </Column>

<<<<<<< HEAD
                            <Column field="dataType" header="Tipo de Dato" sortable style="min-width: 100px;">
=======
                            <Column field="dataType" header="Tipo de Dato" style="min-width: 100px;" class="text-left">
>>>>>>> 6abac5dfde0a97019fd77fecbcfe51fbf9bd7058
                                <template #body="{ data }">
                                    {{ data.dataType }}
                                </template>
                            </Column> 

<<<<<<< HEAD
                            <Column field="description" header="Descripción" sortable class="min-w-[275px]">
=======
                            <Column field="description" header="Descripción" class="min-w-[275px] text-left" >
>>>>>>> 6abac5dfde0a97019fd77fecbcfe51fbf9bd7058
                                <template #body="{ data }">
                                    {{ data.description }}
                                </template>
                            </Column>

<<<<<<< HEAD
                            <Column header="Acciones" class="min-w-[210px]">
=======
                            <Column header="Acción" class="min-w-[210px] text-left">
>>>>>>> 6abac5dfde0a97019fd77fecbcfe51fbf9bd7058
                                <template #body="{ data }">
                                    <div class="flex gap-4">
                                        <XButton 
                                            variant="outlined" 
                                            icon="edit-pencil"
                                            class="p-2"
                                            v-tooltip="{ value: 'Editar parámetro', hideDelay: 300 }"
                                            @click="openEditModal(data)"
                                        />
                                        <!-- <XButton 
                                            label="Ver historial"
                                            @click="openHistoModal(data)"
                                        /> -->
                                    </div>
                                </template>
                            </Column>
                        </DataTable>

                        <div class="flex justify-center">
                            <Paginator 
                                v-if="filteredParameters.length > 0"
                                v-model:first="firstPagination"
                                v-model:rows="rowsPagination"
                                :totalRecords="totalRecords"
                                :rowsPerPageOptions="[10, 25, 50, 100]"
                                @page="onPage"
                                template="RowsPerPageDropdown  FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            >
                                <template #start="slotProps">
                                    Página: {{ slotProps.state.page + 1 }}, Filas: 
                                </template>
                            </Paginator>
                        </div>
                    </div>
                </div>
        </div>

        <ParameterModal 
            v-model="modalStateParameter.modalParameter" 
            :parameterData="modalStateParameter.parameterData"
            @save="handleParameterSaved"
        />

        <ParameterHistorialModal 
            v-model="modalStateHistoParameter.modalParameterHistorial" 
            :parameterHistoData="modalStateHistoParameter.parameterHistoData"
        />
        <Toast />
    </div>
</template>

<script setup lang="ts">
import { useOptions } from '~/componsables/useOptions';
import { useParameterService } from '~/componsables/parameters/useParameters';
import ParameterHistorialModal from '~/features/parameters/ParameterHistorialModal.vue';
import ParameterModal from '~/features/parameters/ParameterModal.vue';
import type { ParameterListItem, ParameterModalData } from '~/features/parameters/types';
<<<<<<< HEAD
import type { ServiceError } from '~/features/users/types';
import { parametersService } from '~/services/parametersService';
=======
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';
import { useParameterFilters } from '~/componsables/parameters/useParameterFilters';
import { usePagination } from '~/componsables/usePagination';
>>>>>>> 6abac5dfde0a97019fd77fecbcfe51fbf9bd7058

// Composables
const { parameters, loading, loadParameters, showToast} = useParameterService()
const { paymentGatewayFilterOptions, loadAllOptions } = useOptions()
const { searchTermParameter, selectedChannel, filteredParameters } = useParameterFilters(parameters)
const { firstPagination, rowsPagination, paginatedItems, totalRecords, onPage, resetPagination } = usePagination(filteredParameters);

// State
<<<<<<< HEAD
const parameters = ref<ParameterListItem[]>([]);
const loading = ref(false);
const searchTermParameter = ref('')
const first = ref(0)
const rows = ref(10)

const itemsBreadParameters = ref([
    { label: 'Inicio'},
    { label: 'Configuracion'},
    { label: 'Parámetros'}
])
=======
const itemsBreadParameters = getBreadcrumbItems('parameters', 'list');
>>>>>>> 6abac5dfde0a97019fd77fecbcfe51fbf9bd7058

const channelOptions = computed(() => {
    return [
        { value: 'Todos' },
        ...paymentGatewayFilterOptions.value.map(opt => ({ value: opt.label })).sort((a, b) => a.value.localeCompare(b.value))
    ]
})

// Resetear paginación cuando cambien los filtros
watch([selectedChannel, searchTermParameter], () => {
    resetPagination();
});

// Modal state
const modalStateParameter = ref<{
    modalParameter: boolean,
    parameterData?: ParameterModalData,
}>({
    modalParameter: false,
    parameterData: undefined
})

const modalStateHistoParameter = ref<{
    modalParameterHistorial: boolean,
    parameterHistoData?: ParameterModalData,
}>({
    modalParameterHistorial: false,
    parameterHistoData: undefined
})

const openEditModal = (parameterData: ParameterListItem) => {
    modalStateParameter.value = {
        modalParameter: true,
        parameterData: {
            code: parameterData.code || '',
            value: parameterData.value,
            description: parameterData.description,
            dataType: parameterData.dataType,
        }
    }
}

// const openHistoModal = (parameterData: ParameterListItem) => {
    
//     modalStateHistoParameter.value = {
//         modalParameterHistorial: true,
//         parameterHistoData: {
//             code: parameterData.code || '',
//             value: parameterData.value,
//             description: parameterData.description, 
//             dataType: parameterData.dataType,     
//             systemAcronym: parameterData.systemAcronym
//         }
//     }
// }

const handleParameterSaved = (): void => {
    loadParameters()
}


// Lifecycle
onMounted(async () => {
    try {
        await Promise.all([
            loadParameters(),
            loadAllOptions()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error al cargar los datos';
        
        showToast({
            severity: 'error',
            summary: 'Error de carga',
            detail: errorMessage,
            life: 5000
        });
    } 
})
</script>