<template>
    <div class="history-table">
        <DataTable
            :value="data"
            :loading="props.loading"
            class="w-full"
        >
        <!-- Generar columnas dinámicamente -->
        <Column
            v-for="column in columns"
            :key="column.field"
            :field="column.field"
            :header="column.header"
            :style="column.style"
            :class="column.class"
            :sortable="column.sortable"
        >
            <template #body="{ data: rowData }">
                <Tag 
                    v-if="column.template && typeof column.template === 'function'"
                    :severity="getTemplateSeverity(column.template, getNestedValue(rowData, column.field), rowData)"
                    :value="getTemplateValue(column.template, getNestedValue(rowData, column.field), rowData)"
                    class="font-medium"
                />
                <span v-else-if="column.formatter">
                    {{ column.formatter(getNestedValue(rowData, column.field), rowData) }}
                </span>
                <span v-else>
                    {{ getNestedValue(rowData, column.field) }}
                </span>
            </template>
        </Column>
    </DataTable>

    </div>
</template>

<script setup lang="ts">
import type { ColumnConfigHistory } from '~/componsables/historical/type';

interface Props{
    data: any[];
    columns: ColumnConfigHistory[];
    loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false
});

const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
};

const getTemplateSeverity = (templateFn: any, value: any, rowData: any): string => {
    const result = templateFn(value, rowData);
    return result?.severity || 'secondary';
};

const getTemplateValue = (templateFn: any, value: any, rowData: any): string => {
    const result = templateFn(value, rowData);
    return result?.value || '';
};
</script>