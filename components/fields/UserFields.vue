<!-- <template>
  <div class="col-span-2 border border-gray-400 rounded-[6px] p-6 flex justify-between">
    <div class="flex flex-col gap-2">
      <p class="font-medium">{{ props.label }}</p>
      <p>{{ props.description }}</p>
    </div>
    <div class="flex flex-row gap-4 justify-end items-center">
      <label>{{ props.activeLabel }}</label>
      <XToggleSwitch 
        :checked="props.modelValue" 
        @change="emits('update:modelValue', $event)" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: Boolean,
  label: { type: String, default: 'Situación' },
  description: { type: String, default: 'Activa o desactiva el switch para definir la situación.' },
  activeLabel: { type: String, default: 'Activo' }
})

const emits = defineEmits(['update:modelValue'])
</script> -->

<template>
  <div class="col-span-2 border border-gray-400 rounded-[6px] p-6 flex justify-between">
    <div class="flex flex-col gap-2">
      <p class="font-medium">{{ label }}</p>
      <p>{{ description }}</p>
    </div>
    <div class="flex flex-row gap-4 justify-end items-center">
      <label>{{ activeLabel }}</label>
      <XToggleSwitch 
        :modelValue="modelValue" 
        @update:modelValue="$emit('update:modelValue', $event)" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: Boolean,
  label: { type: String, default: 'Situación' },
  description: { type: String, default: 'Activa o desactiva el switch para definir la situación.' },
  activeLabel: { type: String, default: 'Activo' }
})

defineEmits(['update:modelValue'])
</script>