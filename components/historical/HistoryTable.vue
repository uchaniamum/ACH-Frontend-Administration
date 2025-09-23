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
                <!-- <Tag 
                    v-if="column.template && typeof column.template === 'function'"
                    :severity="getTemplateSeverity(column.template, getNestedValue(rowData, column.field), rowData)"
                    :value="getTemplateValue(column.template, getNestedValue(rowData, column.field), rowData)"
                    class="font-medium"
                /> -->
                <div v-if="column.iconConfig" class="flex items-center gap-4">
                    <Icon 
                        v-if="column.iconConfig.icon"
                        :name="column.iconConfig.icon"
                        :class="getIconClass(column.iconConfig, rowData)"
                    />
                    
                    <Icon 
                        v-if="column.iconConfig.conditionalIcon"
                        :name="getConditionalIcon(column.iconConfig.conditionalIcon, rowData)"
                        :class="getConditionalIconClass(column.iconConfig.conditionalIcon, rowData)"
                    />
                    
                    <span :class="column.iconConfig.textClass">
                        {{ getNestedValue(rowData, column.field) || column.iconConfig.defaultText || 'Sin datos' }}
                    </span>
                    
                    <!-- Texto adicional/secundario -->
                    <span 
                        v-if="column.iconConfig.additionalText"
                        :class="column.iconConfig.additionalTextClass || 'text-xs text-gray-500 ml-1'"
                    >
                        {{ getAdditionalText(column.iconConfig.additionalText, rowData) }}
                    </span>
                </div>
                <!-- Templates normales con v-html -->
                <div 
                    v-else-if="column.template" 
                    v-html="column.template(getNestedValue(rowData, column.field), rowData)"
                ></div>
                
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
import type { ColumnConfigHistory, IconConfig } from '~/componsables/historical/type';

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

// const getTemplateSeverity = (templateFn: any, value: any, rowData: any): string => {
//     const result = templateFn(value, rowData);
//     return result?.severity || 'secondary';
// };

// const getTemplateValue = (templateFn: any, value: any, rowData: any): string => {
//     const result = templateFn(value, rowData);
//     return result?.value || '';
// };

const getIconClass = (iconConfig: IconConfig, rowData: any): string => {
    if (typeof iconConfig.iconClass === 'function') {
        return iconConfig.iconClass(rowData);
    }
    return iconConfig.iconClass || 'text-gray-500 w-4 h-4';
};

const getConditionalIcon = (conditionalIcon: IconConfig['conditionalIcon'], rowData: any): string => {
    if (!conditionalIcon) return '';
    
    if (typeof conditionalIcon.condition === 'function') {
        return conditionalIcon.condition(rowData) ? conditionalIcon.trueIcon : conditionalIcon.falseIcon;
    }
    
    // Si es un string, evaluamos ese campo del rowData
    if (typeof conditionalIcon.condition === 'string') {
        const fieldValue = getNestedValue(rowData, conditionalIcon.condition);
        return fieldValue ? conditionalIcon.trueIcon : conditionalIcon.falseIcon;
    }
    
    return conditionalIcon.falseIcon;
};

const getConditionalIconClass = (conditionalIcon: IconConfig['conditionalIcon'], rowData: any): string => {
    if (!conditionalIcon) return '';
    
    let isTrue = false;
    
    if (typeof conditionalIcon.condition === 'function') {
        isTrue = conditionalIcon.condition(rowData);
    } else if (typeof conditionalIcon.condition === 'string') {
        isTrue = !!getNestedValue(rowData, conditionalIcon.condition);
    }
    
    if (typeof conditionalIcon.iconClass === 'function') {
        return conditionalIcon.iconClass(rowData);
    }
    
    return isTrue ? conditionalIcon.trueIconClass : conditionalIcon.falseIconClass;
};

const getAdditionalText = (additionalText: IconConfig['additionalText'], rowData: any): string => {
    if (typeof additionalText === 'function') {
        return additionalText(rowData);
    }
    
    if (typeof additionalText === 'string') {
        return getNestedValue(rowData, additionalText) || '';
    }
    
    return '';
};
</script>