<template>
    <div class="history-module flex flex-col gap-12">
        <div class="search-section">
            <div class="flex justify-between gap-4">
                <div class="self-center">
                    <slot 
                        name="search" 
                        :search-term="searchTerm" 
                        :clear-search="clearSearch"
                    >
                        <HistorySearch
                            v-model="searchTerm"
                            :placeholder="searchPlaceholder"
                            @clear="clearSearch"
                        />
                    </slot>
                </div>
                <slot name="controls" />
            </div>
        </div>

        <slot name="filters" />

        <div class="table-section">
            <HistoryTable
                :data="paginatedData"
                :columns="config.columns"
                :loading="loading"
            />
        </div>

        <div class="pagination-section pt-4">
            <div class="flex justify-center">
                <Paginator 
                    v-if="filteredData.length > 0"
                    v-model:first="paginationFirst"
                    v-model:rows="paginationRows"
                    :totalRecords="filteredData.length"
                    :rowsPerPageOptions="[10, 25, 50, 100]"
                    template="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                >
                    <template #start="slotProps">
                        Página: {{ slotProps.state.page + 1 }}, Filas: 
                    </template>
                </Paginator>
            </div>
        </div>

        <div v-if="!loading && filteredData.length === 0" class="text-center py-8 text-gray-500">
            <span v-if="searchTerm">
                No se encontraron resultados para "{{ searchTerm }}"
            </span>
            <span v-else>
                No hay datos disponibles
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { HistoryConfig } from '~/componsables/historical/type';
import HistorySearch from './HistorySearch.vue';
import HistoryTable from './HistoryTable.vue';
import { useHistoryTable } from '~/componsables/historical/useHistoryTable';

interface Props{
    config: HistoryConfig;
    searchPlaceholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
    searchPlaceholder: 'Buscar'
});

const {
    loading,
    searchTerm,
    paginationFirst,
    paginationRows,
    filteredData,
    paginatedData,
    loadData,
    clearSearch
} = useHistoryTable(props.config);

onMounted(() => {
    console.log('HistoryModule montado, cargando datos:');
    loadData();
});

defineExpose({
    loadData,
    clearSearch
});
</script>