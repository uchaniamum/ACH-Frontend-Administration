import type { HistoryConfig } from "./type";

export function useHistoryTable<T>(config: HistoryConfig<T>) {
    if (!config) {
        console.error('useHistoryTable: config es requerido');
        throw new Error('useHistoryTable requiere una configuración válida');
    }

    if (!config.columns || !Array.isArray(config.columns)) {
        console.error('useHistoryTable: config.columns debe ser un array');
        throw new Error('config.columns es requerido y debe ser un array');
    }

    if (!config.service || typeof config.service.getData !== 'function') {
        console.error('useHistoryTable: config.service.getData debe ser una función');
        throw new Error('config.service.getData es requerido y debe ser una función');
    }


    const defaultSearchFields = config.columns.map(col => col.field);
    const searchFields = config.searchFields && Array.isArray(config.searchFields) && config.searchFields.length > 0
        ? config.searchFields
        : defaultSearchFields;
        
    const data = ref<T[]>([]);
    const loading = ref(false);
    const searchTerm = ref('');

    const paginationFirst = ref(0);
    const paginationRows = ref(config.pageSize || 10);

    const filteredData = computed(() => {

        if (!data.value?.length) return [];

        let filtered = data.value;

        if (searchTerm.value.trim()) {
            const search = searchTerm.value.toLowerCase().trim();

            try {
                filtered = filtered.filter(item => {
                    if (!searchFields || !Array.isArray(searchFields) || searchFields.length === 0) {
                        console.warn('useHistoryTable: No hay campos de búsqueda definidos.');
                        return true;
                    }

                    return searchFields.some(field => {
                        // try {
                        //     const value = getNestedValue(item, field);
                        //     const stringValue = value?.toString().toLowerCase() || '';
                        //     const matches = stringValue.includes(search);

                        //     return matches;
                        // } catch (fieldError) {
                        //     console.warn(`Error accediendo al campo "${field}":`, fieldError);
                        //     return false;
                        // }
                        try {
                            const rawValue = getNestedValue(item, field);
                            const column = config.columns.find(col => col.field === field);

                            let searchValue: string;

                            if (column?.searchFormatter) {
                                // Usar searchFormatter personalizado
                                searchValue = column.searchFormatter(rawValue);
                            } else if (column?.formatter) {
                                // Usar formatter regular como fallback
                                searchValue = column.formatter(rawValue);
                            } else {
                                // Usar valor original
                                searchValue = rawValue?.toString() || '';
                            }

                            const matches = searchValue.toLowerCase().includes(search);

                            if (matches) {
                                console.log(`✅ Encontrado "${search}" en ${field}:`, searchValue);
                            }
                            return matches;
                        } catch (fieldError) {
                            console.warn(`Error accediendo al campo "${field}":`, fieldError);
                            return false;
                        }
                                })
                            })
                        } catch (fieldError) {
                            console.error('Error during filtering:', fieldError);
                            return false;
                        }
        }
        return filtered;
    })

    const paginatedData = computed(() => {
        const start = paginationFirst.value;
        const end = start + paginationRows.value;
        const result = filteredData.value.slice(start, end);
        return result;
    });

    const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    }

    const loadData = async () => {
        loading.value = true;
        try {
            const response = await config.service.getData();
            data.value = response.data;
        } catch (error) {
            console.error('Error loading data:', error);
            data.value = [];
        } finally {
            loading.value = false;
        }
    }

    const clearSearch = () => {
        searchTerm.value = '';
    }

    watch(filteredData, () => {
        if (paginationFirst.value >= filteredData.value.length) {
            paginationFirst.value = 0;
        }
    });

    return {
        data: data,
        loading: readonly(loading),
        searchTerm,

        paginationFirst,
        paginationRows,

        filteredData: readonly(filteredData),
        paginatedData: paginatedData,

        loadData,
        clearSearch,
        getNestedValue
    }
}