<template>
    <div class="historical-search">
        <XIconField>
            <XInputText 
                :name="props.name" 
                :placeholder="props.placeholder" 
                v-model="searchTerm"/>
            <XInputIcon icon="search"/>
        </XIconField>
    </div>
</template>

<script setup lang="ts">
interface Props{
    name?: string;
    placeholder?: string;
    modelValue: string;
}

interface Emits{
    (e: 'update:modelValue', value: string): void;
    //(e: 'clear'): void; 
}

const props = withDefaults(defineProps<Props>(), {
    name: 'search',
    placeholder: 'Buscar'
});
const emit = defineEmits<Emits>();

const searchTerm = computed({
    get: () => props.modelValue,
    set: (value: string) => emit('update:modelValue', value)
});

</script>