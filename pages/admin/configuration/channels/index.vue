<template>
    <div>
        <XHeader title="Administracion de Canales" :breadcrumb-items="itemsBreadChannels" :show-breadcrumb="true">
            <template #description>
                <p>Gestiona los canales modificando el centro de procesamiento, las rutas asociadas, los certificados correspondientes y realiza un seguimiento a través del historial de cambios.</p>
            </template>
        </XHeader>
        <div class="flex flex-col gap-12">
            <div class="pt-20 flex justify-between gap-4">
                <div class="self-center">
                    <XIconField>
                        <XInputText name="codigo" placeholder="Buscar" v-model="searchChannels"/>
                        <XInputIcon icon="search"/>
                    </XIconField>
                </div>
            </div>

            <DataTable 
                    :value="paginatedChannels" 
                    :loading="loading"
                    dataKey="id"
                    filterDisplay="row"
                    :rows="paginationChannelRows"
                    :first="paginationChannelFirst"
                    @page="onPageChange"
                    v-model:filters="filters"
                    :globalFilterFields="['code', 'name', 'acronym', 'aliases']"
                >
                <Column field="code" header="Codigo" sortable :showFilterMenu="false" class="min-w-[143px]">
                    <template #body="{ data }">
                        {{ data.code }}
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
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
                    </template>
                </Column>
                <Column field="name" header="Nombre" sortable :showFilterMenu="false" class="min-w-[328px]">
                    <template #body="{ data }">
                        {{ data.name }}
                    </template>
                    <template #filter="{ filterModel, filterCallback }" >
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
                    </template>
                </Column>
                <Column field="acronym" header="Sigla" sortable :showFilterMenu="false" class="w-[145px]">
                    <template #body="{ data }">
                        {{ data.acronym }}
                    </template>
                    <template #filter="{ filterModel, filterCallback }" >
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
                    </template>
                </Column>
                <Column field="aliases" header="Alias CPD" sortable :showFilterMenu="false" style="width:145px">
                    <template #body="{ data }">
                        <div v-for="(route, index) in data.routes" :key="index">
                            {{ route.alias }}
                        </div>
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
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
                    </template>
                </Column>
                <Column field="updatedAt" header="Última modificación" sortable :showFilterMenu="false" class="!min-w-[189px]">
                    <template #body="{ data }">
                        {{ formatDate(data.updatedAt) }}
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
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
                    </template>
                </Column>
                <Column field="accion" header="Acción" class="!w-[122px]">
                    <template #body="{ data }">
                        <div class="flex gap-4">
                            <XButton v-tooltip.bottom="{ value: 'Editar', hideDelay: 300 }" variant="outlined" icon="edit-pencil" @click="navigateToEditChannel(data)" />
                            <XButton v-tooltip.bottom="{ value: 'Ver Historial Participantes', hideDelay: 300 }" variant="outlined" icon="user" @click="navigateToHistory(data)" />
                            <XButton v-tooltip.bottom="{ value: 'Ver Historial Certificados', hideDelay: 300 }" variant="outlined" icon="privacy-policy" @click="navigateToCertificates(data)" />
                        </div> 
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core';
import { useDates } from '~/componsables/useDates';
import { useRouteAliases } from '~/componsables/useRouteAliases';
import { useUniqueValues } from '~/componsables/useUniqueValues';
import type { ChannelsListItem } from '~/features/channels/type';
import type { ServiceError } from '~/features/users/types';
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';
import { channelsService } from '~/services/channelsService';

// Composables 
const toast = useToast()
const router = useRouter();
const { formatDate } = useDates();
// State
const channels = ref<ChannelsListItem[]>([]);
const loading = ref(false);
const searchChannels = ref('')
const paginationChannelFirst = ref(0)
const paginationChannelRows = ref(10)

const nameOptions = useUniqueValues(channels, 'name')
const acronymOptions = useUniqueValues(channels, 'acronym')
const aliasOptions = useRouteAliases(channels)

// Computed para añadir el campo aliases a cada canal
const channelsWithAliases = computed(() => {
    return channels.value.map(channel => ({
        ...channel,
        aliases: channel.routes?.map(route => route.alias).join(' ')
    }));
});

const itemsBreadChannels = getBreadcrumbItems('channels', 'list');

// Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    code: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    acronym: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    aliases: { value: null, matchMode: FilterMatchMode.CONTAINS }, // Cambié de 'alias' a 'aliases'
    updatedAt: { value: null, matchMode: FilterMatchMode.CONTAINS }
});


// Helper function para safe string conversion
const safeLowerCase = (str: string | null | undefined): string => {
    return str?.toLowerCase() || ''
}

// Filtrado actualizado
const filteredChannel = computed(() => {
    if (!channelsWithAliases.value.length) return [];

    const searchTerm = searchChannels.value.toLowerCase().trim();
    const codeFilter = filters.value.code.value;
    const nameFilter = filters.value.name.value;
    const acronymFilter = filters.value.acronym.value;
    const aliasFilter = filters.value.aliases.value;
    const updatedAtFilter = filters.value.updatedAt.value;
    
    return channelsWithAliases.value.filter(channel => {
        // Filtro de código
        const matchesCode = !codeFilter || 
            // channel.code?.toLowerCase().startsWith(codeFilter.toLowerCase());
            safeLowerCase(channel.code || '').includes(safeLowerCase(codeFilter))
        
        // Filtro de nombre
        const matchesName = !nameFilter || 
            channel.name === nameFilter;
            
        // Filtro de acronym
        const matchesAcronym = !acronymFilter || 
            channel.acronym === acronymFilter;
        
        // Filtro de alias - Versión más limpia
        const matchesAlias = !aliasFilter || 
            channel.routes?.some(route => 
                safeLowerCase(route.alias).includes(safeLowerCase(aliasFilter))
            ) || false;

        // Filtro de fecha - Versión más limpia
        const matchesUpdatedAt = !updatedAtFilter || 
            safeLowerCase(formatDate(channel.updatedAt || '')).includes(safeLowerCase(updatedAtFilter));
        
        // Filtro de búsqueda global - INCLUYE aliases
        const matchesGlobalSearch = searchTerm === '' || 
            channel.code.toLowerCase().includes(searchTerm) ||
            channel.name.toLowerCase().includes(searchTerm) ||
            channel.acronym.toLowerCase().includes(searchTerm) ||
            channel.aliases.toLowerCase().includes(searchTerm); // Usar el campo aliases concatenado

        return matchesCode && matchesName && matchesAcronym && 
                matchesAlias && matchesUpdatedAt && matchesGlobalSearch;
    });
});

// Computed para paginación
const paginatedChannels = computed(() => {
    const start = paginationChannelFirst.value;
    const end = start + paginationChannelRows.value;
    return filteredChannel.value.slice(start, end);
});


// Manejo de paginación
const onPageChange = (event: any) => {
    paginationChannelFirst.value = event.first;
    paginationChannelRows.value = event.rows;
}

// Cargar canales
const loadChannels = async (): Promise<void> => {
    loading.value = true
    try {
        const response = await channelsService.getChannels()
        if(response){
            channels.value = response.paymentSystems
            console.log('Canales cargados:', channels.value);
            
            // Debug detallado de rutas y aliases
            channels.value.forEach((channel, index) => {
                console.log(`Canal ${index} (${channel.code}):`, {
                    routes: channel.routes,
                    aliases: channel.routes.map(r => r.alias)
                });
            });
        }
        
        
    } catch (error) {
        console.error('Error loading channels:', error)
        const serviceError = error as ServiceError
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: serviceError.message || 'Error al cargar los canales',
            life: 5000
        })
    } finally {
        loading.value = false
    }
}

// Lifecycle
onMounted(() => {
    loadChannels()
})

// Navegación
const navigateToEditChannel = (channel: ChannelsListItem) => {
    router.push(`/admin/configuration/channels/EditChannels/${channel.code}`);
}

const navigateToHistory = (channel: ChannelsListItem) => {
    router.push(`/admin/configuration/channels/HistorialParticipantes/${channel.code}`);
}

const navigateToCertificates = (channel: ChannelsListItem) => {
    router.push(`/admin/configuration/channels/HistorialCertificados/${channel.code}`);
}

// Debug para verificar las opciones de alias
watch(aliasOptions, (newVal) => {
    console.log('Opciones de alias:', newVal);
}, { immediate: true });

// Debug para verificar el filtrado
watch(() => filters.value.aliases.value, (newVal) => {
    console.log('Filtro de alias aplicado:', newVal);
});
</script>