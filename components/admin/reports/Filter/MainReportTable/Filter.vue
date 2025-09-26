<template>
  <div class="relative -m-7 p-7" :class="[filtered && 'bg-white bg-opacity-20']">
    <div>
      <span class="break-word">{{ props.label }}</span>
      <Icon name="x:thik-nav-arrow-down" class="ml-3 transition-all" />
    </div>

    <MultiSelect
      v-model="selected"
      :options="optionsList"
      option-label="code"
      option-value="code"
      :filter="false"
      :show-toggle-all="false"
      class="opacity-0 absolute top-0 left-0 w-full h-full"
    >
      <template #footer>
        <div class="mt-3 pt-3 border-t flex justify-between">
          <XButton variant="text" @click="clear">
            <Icon name="x:clean" />
          </XButton>
          <XButton variant="text" @click="filter">
            <span class="ml-3 font-medium">Buscar</span>
          </XButton>
        </div>
      </template>
    </MultiSelect>
  </div>
</template>

<script setup lang="ts">
  import type { Transfers } from "~/types/admin/reports";

  const props = defineProps<{
    label: string;
    options: Transfers[];
    optionKey: string;
  }>();

  const emit = defineEmits<{
    (e: "filter", selected: string[]): void;
  }>();

  const selected = ref([]);
  const filtered = ref(false);

  const optionsList = computed(() => {
    let optionsValues: string[] = props.options.map(opt => (opt[props.optionKey] as string));
    optionsValues = [...new Set(optionsValues)].sort();
    
    return optionsValues.map(opts => ({ code: opts }));
  })


  // Button events
  function filter() {
    filtered.value = selected.value.length > 0;
    emit("filter", selected.value);
  }

  function clear() {
    selected.value = [];
    filter();
  }
</script>
