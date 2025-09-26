// composables/useParameterFilters.ts
import type { ParameterListItem } from '~/features/parameters/types'

export function useParameterFilters(parameters: Ref<ParameterListItem[]>) {
    const searchTermParameter = ref('')
    const selectedChannel = ref({ value: 'Todos' })

    const filteredParameters = computed(() => {
        if (!parameters.value.length) return [];
        
        let filtered = parameters.value;
        
        // Filtrar por canal
        if (selectedChannel.value?.value !== 'Todos') {
            filtered = filtered.filter(param => param.systemAcronym === selectedChannel.value.value);
        }
        
        // Filtrar por término de búsqueda
        if (searchTermParameter.value.trim()) {
            const search = searchTermParameter.value.toLowerCase().trim();
            filtered = filtered.filter(param => 
                param.code?.toLowerCase().includes(search) ||
                param.value?.toLowerCase().includes(search) ||
                param.description?.toLowerCase().includes(search) ||
                param.dataType?.toLowerCase().includes(search) ||
                param.systemAcronym?.toLowerCase().includes(search)
            );
        }
        
        return filtered;
    })

    return {
        searchTermParameter,
        selectedChannel,
        filteredParameters
    }
}