<template>
    <div>
        <XHeader title="Administración de canales" :breadcrumb-items="itemsBreadChannels" :show-breadcrumb="true">
            <template #description>
                <p>Gestiona los canales modificando el centro de procesamiento, las rutas asociadas, los certificados correspondientes y realiza un seguimiento a través del historial de cambios.</p>
            </template>
        </XHeader>
        <div class="flex flex-col gap-12">
            <div class="pt-20 flex justify-between gap-4">
                <div class="self-center">
                    <XIconField>
                        <XInputText name="codigo" placeholder="Buscar" v-model="searchTermChannels"/>
                        <XInputIcon icon="search"/>
                    </XIconField>
                </div>
            </div>

            <DataTable 
                    :value="paginatedItems" 
                    :loading="loading"
                    dataKey="id"
                    
                    :rows="rowsPagination"
                    :first="firstPagination"
                    @page="onPage"
                    v-model:filters="filters"
                    :globalFilterFields="['code', 'name', 'acronym', 'aliases']"
                >
                <template #empty> 
                    <span class="flex justify-center">
                        {{ filteredChannels.length === 0 && searchTermChannels.trim() ? 
                            'No se encontraron usuarios que coincidan con la búsqueda.' : 
                            'No se encontraron usuarios para el canal seleccionado.' }}
                    </span> 
                </template>

                <Column field="code" header="Codigo" :showFilterMenu="false" class="min-w-[143px]">
                    <template #body="{ data }">
                        {{ data.code }}
                    </template>
                    <!-- <template #filter="{ filterModel, filterCallback }">
                        <IconField>
                            <InputText 
                                v-model="filterModel.value"  
                                type="text" 
                                @input="filterCallback()" 
                                class="!min-w-47" 
                                placeholder="Buscar"
                            />
                            <XInputIcon icon="search" />
                        </IconField>
                    </template> -->
                </Column>
                <Column field="name" header="Nombre" :showFilterMenu="false" class="min-w-[328px]">
                    <template #body="{ data }">
                        {{ data.name }}
                    </template>
                    <!-- <template #filter="{ filterModel, filterCallback }" >
                        <XSelect 
                            name="filterRole"
                            v-model="filterModel.value" 
                            @change="filterCallback()" 
                            :options="nameOptions" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Buscar" 
                            class="min-w-[21.429rem]" 
                            :showClear="true"
                        />
                    </template> -->
                </Column>
                <Column field="acronym" header="Sigla" :showFilterMenu="false" class="w-[145px]">
                    <template #body="{ data }">
                        {{ data.acronym }}
                    </template>
                    <!-- <template #filter="{ filterModel, filterCallback }" >
                        <XSelect 
                            name="filterRole"
                            v-model="filterModel.value" 
                            @change="filterCallback()" 
                            :options="acronymOptions" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Buscar" 
                            class="!min-w-48" 
                            :showClear="true"
                        />
                    </template> -->
                </Column>
                <Column field="aliases" header="Alias CPD" :showFilterMenu="false" style="width:145px">
                    <template #body="{ data }">
                        <div v-for="(route, index) in data.routes" :key="index">
                            {{ route.alias }}
                        </div>
                    </template>
                    <!-- <template #filter="{ filterModel, filterCallback }">
                        <XSelect 
                            name="filterAlias"
                            v-model="filterModel.value" 
                            @change="filterCallback()" 
                            :options="aliasOptions" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Buscar" 
                            class="!min-w-47" 
                            :showClear="true"
                        />
                    </template> -->
                </Column>
                <Column field="updatedAt" header="Última modificación" :showFilterMenu="false" class="!min-w-[189px]">
                    <template #body="{ data }">
                        {{ formatDate(data.updatedAt) }}
                    </template>
                    <!-- <template #filter="{ filterModel, filterCallback }">
                        <IconField>
                            <InputText 
                                v-model="filterModel.value" 
                                type="text" 
                                @input="filterCallback()" 
                                class="!min-w-70" 
                                placeholder="Buscar"
                            />
                            <XInputIcon icon="search" />
                        </IconField>
                    </template> -->
                </Column>
                <Column field="accion" header="Acción" class="!w-[122px]">
                    <template #body="{ data }">
                        <div class="flex gap-4">
                            <XButton v-tooltip.bottom="{ value: 'Editar', hideDelay: 300 }" variant="outlined" icon="edit-pencil" @click="navigateToEditChannel(data)" />
                            <!-- <XButton v-tooltip.bottom="{ value: 'Ver Historial Participantes', hideDelay: 300 }" variant="outlined" icon="user" @click="navigateToHistory(data)" />
                            <XButton v-tooltip.bottom="{ value: 'Ver Historial Certificados', hideDelay: 300 }" variant="outlined" icon="privacy-policy" @click="navigateToCertificates(data)" /> -->
                        </div> 
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useChannelService } from '~/componsables/channels/useChannels';
import { useChannelFilters } from '~/componsables/channels/useChannelsFilters';
import { useDates } from '~/componsables/useDates';
import { usePagination } from '~/componsables/usePagination';
import { useRouteAliases } from '~/componsables/useRouteAliases';
import { useUniqueValues } from '~/componsables/useUniqueValues';
import type { ChannelsListItem } from '~/features/channels/type';
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';


// Composables 
const { channels, loading, loadChannels, showToast } = useChannelService()
const { searchTermChannels, filters, channelsWithAliases, filteredChannels } = useChannelFilters(channels)
const {  firstPagination, rowsPagination, paginatedItems, onPage } = usePagination(filteredChannels);


const router = useRouter();
const { formatDate } = useDates();

const nameOptions = useUniqueValues(channelsWithAliases, 'name')
const acronymOptions = useUniqueValues(channelsWithAliases, 'acronym')
const aliasOptions = useRouteAliases(channelsWithAliases)


const itemsBreadChannels = getBreadcrumbItems('channels', 'list');

// Lifecycle
onMounted(async () => {
    try {
        await Promise.all([
            loadChannels()
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

// Navegación
const navigateToEditChannel = (channel: ChannelsListItem) => {
    router.push(`/admin/configuration/channels/EditChannels/${channel.code}`);
}

// const navigateToHistory = (channel: ChannelsListItem) => {
//     router.push(`/admin/configuration/channels/HistorialParticipantes/${channel.code}`);
// }

// const navigateToCertificates = (channel: ChannelsListItem) => {
//     router.push(`/admin/configuration/channels/HistorialCertificados/${channel.code}`);
// }

// Debug para verificar las opciones de alias
watch(aliasOptions, (newVal) => {
    console.log('Opciones de alias:', newVal);
}, { immediate: true });

// Debug para verificar el filtrado
watch(() => filters.value.aliases.value, (newVal) => {
    console.log('Filtro de alias aplicado:', newVal);
});
</script>