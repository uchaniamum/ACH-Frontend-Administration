<template>
    <div>
        <XHeader title="Administracion de Canales" :breadcrumb-items="itemsBreadParameters" :show-breadcrumb="true">
            <template #description>
                <p>Gestiona los canales modificando el centro de procesamiento, las rutas asociadas, los certificados correspondientes y realiza un seguimiento a través del historial de cambios.</p>
            </template>
        </XHeader>
        <div class="pt-12 flex flex-col gap-20">
            <div class="flex justify-between gap-4">
                <div class="self-center">
                    <XIconField>
                        <XInputText name="codigo" placeholder="Buscar" v-model="searchChannels"/>
                        <XInputIcon icon="search"/>
                    </XIconField>
                </div>
            </div>

            <div class="flex flex-col gap-12 items-center">
                <DataTable 
                    :value="paginatedChannels" 
                    :loading="loading"
                    dataKey="code"
                    :rows="paginationChannelRows"
                    :first="paginationChannelFirst"
                    @page="onPageChange">
                <Column field="code" header="Codigo" sortable>
                    <template #body="{ data }">
                        {{ data.code }}
                    </template>
                </Column>
                <Column field="name" header="Nombre">
                    <template #body="{ data }">
                        {{ data.name }}
                    </template>
                </Column>
                <Column field="acronym" header="Sigla">
                    <template #body="{ data }">
                        {{ data.acronym }}
                    </template>
                </Column>
                <Column field="alias" header="Alias CPD">
                    <template #body="{ data }">
                        <!-- Mostrar todos los alias separados por coma -->
                        {{ data.routes.map(route => route.alias).join(', ') }}
                    </template>
                </Column>
                <Column field="updatedAt" header="Última modificación">
                    <template #body="{ data }">
                        {{ formatDate(data.updatedAt) }}
                    </template>
                </Column>
                <Column field="accion" header="Acción">
                    <template #body="{ data }">
                        <div class="flex gap-4">
                            <XButton variant="outlined" icon="edit-pencil" @click="navigateToEditChannel(data)" />
                            <XButton variant="outlined" icon="user" @click="navigateToHistory(data)" />
                            <XButton variant="outlined" icon="privacy-policy" @click="navigateToCertificates(data)" />
                        </div> 
                    </template>
                </Column>
            </DataTable>
            
                <!-- Paginación -->
                <Paginator 
                    :rows="paginationChannelRows" 
                    :totalRecords="filteredParameters.length"
                    :first="paginationChannelFirst"
                    :rowsPerPageOptions="[2, 10, 25, 50, 100]"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ChannelsListItem } from '~/features/channels/type';
import type { ServiceError } from '~/features/users/types';
import { channelsService } from '~/services/channelsService';

// Composables 
const toast = useToast()
const router = useRouter();

// State
const channels = ref<ChannelsListItem[]>([]);
const loading = ref(false);
const searchChannels = ref('')
const paginationChannelFirst = ref(0)
const paginationChannelRows = ref(10)

const itemsBreadParameters = ref([
    { label: 'Inicio', to: '/' },
    { label: 'Configuracion', to: '/admin/configuration' },
    { label: 'Canales' }
])

// Computed para filtrar canales
const filteredParameters = computed(() => {
    if (!channels.value.length) return [];

    const searchTerm = searchChannels.value.toLowerCase().trim();
    
    return channels.value.filter(channel =>
        channel.code.toLowerCase().includes(searchTerm) ||
        channel.name.toLowerCase().includes(searchTerm) ||
        channel.acronym.toLowerCase().includes(searchTerm) ||
        channel.routes.some(route => route.alias.toLowerCase().includes(searchTerm))
    );
});

// Computed para paginación
const paginatedChannels = computed(() => {
    const start = paginationChannelFirst.value;
    const end = start + paginationChannelRows.value;
    return filteredParameters.value.slice(start, end);
});

// Función para formatear fecha
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-BO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

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
        channels.value = response.paymentSystems
        console.log('Channels loaded:', channels.value);
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
    router.push(`/admin/configuration/canales/EditChannels/${channel.code}`);
}

const navigateToHistory = (channel: ChannelsListItem) => {
    router.push(`/admin/configuration/canales/HistorialParticipantes/${channel.code}`);
}

const navigateToCertificates = (channel: ChannelsListItem) => {
    router.push(`/admin/configuration/canales/HistorialCertificados/${channel.code}`);
}
</script>