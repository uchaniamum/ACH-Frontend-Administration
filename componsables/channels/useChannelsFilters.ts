// composables/channels/useChannelFilters.ts
import { ref, computed, type Ref } from 'vue'
import { FilterMatchMode } from '@primevue/core'
import { useDates } from '../useDates'
import type { ChannelsListItem } from '~/features/channels/type'


export function useChannelFilters(channels: Ref<ChannelsListItem[]>) {
    const { formatDate } = useDates()
    
    // State de filtros
    const searchTermChannels = ref('')
    
    // Filters de PrimeVue
    const filters = ref({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        code: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        acronym: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        aliases: { value: null, matchMode: FilterMatchMode.CONTAINS },
        updatedAt: { value: null, matchMode: FilterMatchMode.CONTAINS }
    })

    // Helper function para safe string conversion (tu función actual)
    const safeLowerCase = (str: string | null | undefined): string => {
        return str?.toLowerCase() || ''
    }

    // Computed para añadir el campo aliases a cada canal (tu lógica actual)
    const channelsWithAliases = computed(() => {
        return channels.value.map(channel => ({
            ...channel,
            aliases: channel.routes?.map(route => route.alias).join(' ')
        }));
    });

    // Filtrado actualizado (tu lógica exacta)
    const filteredChannels = computed(() => {
        if (!channelsWithAliases.value.length) return [];

        //const searchTerm = searchTermChannels.value.toLowerCase().trim();
        const searchTerm = (searchTermChannels.value || '').toLowerCase().trim();
        const codeFilter = filters.value.code.value;
        const nameFilter = filters.value.name.value;
        const acronymFilter = filters.value.acronym.value;
        const aliasFilter = filters.value.aliases.value;
        const updatedAtFilter = filters.value.updatedAt.value;
        
        return channelsWithAliases.value.filter(channel => {
            // Filtro de código
            const matchesCode = !codeFilter || 
                safeLowerCase(channel.code || '').includes(safeLowerCase(codeFilter))
            
            // Filtro de nombre
            const matchesName = !nameFilter || 
                channel.name === nameFilter;
                
            // Filtro de acronym
            const matchesAcronym = !acronymFilter || 
                channel.acronym === acronymFilter;
            
            // Filtro de alias
            const matchesAlias = !aliasFilter || 
                channel.routes?.some(route => 
                    safeLowerCase(route.alias).includes(safeLowerCase(aliasFilter))
                ) || false;

            // Filtro de fecha
            const matchesUpdatedAt = !updatedAtFilter || 
                safeLowerCase(formatDate(channel.updatedAt || '')).includes(safeLowerCase(updatedAtFilter));
            
            // Filtro de búsqueda global
            const matchesGlobalSearch = searchTerm === '' || 
                channel.code.toLowerCase().includes(searchTerm) ||
                channel.name.toLowerCase().includes(searchTerm) ||
                channel.acronym.toLowerCase().includes(searchTerm) ||
                channel.aliases.toLowerCase().includes(searchTerm);

            return matchesCode && matchesName && matchesAcronym && 
                    matchesAlias && matchesUpdatedAt && matchesGlobalSearch;
        });
    });

    return {
        searchTermChannels,
        filters,
        channelsWithAliases,
        filteredChannels,
        safeLowerCase  // Por si lo necesitas en el componente
    }
}