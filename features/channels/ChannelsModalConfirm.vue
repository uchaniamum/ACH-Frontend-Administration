<template>
  <XConfirmDialog
    v-model="visible"
    icon="x:info-empty"
    icon-color="text-blue-600"
    title="Confirmar cambio de CPD"
  >
    <template #message>
      <div class="space-y-2">
        <p>
          <span class="font-medium text-gray-700">¿Estás seguro de cambiar del {{ previousSelection?.alias }} a </span>
          <span class="font-semibold"> {{ currentSelection?.alias }} con ruta {{ currentSelection?.urls.join(', ') }}</span>
          <span class="font-medium text-gray-700">?</span>
        </p>
      </div>
    </template>
    <template #buttons>
      <div class="flex gap-3">
        <XButton label="Cancelar" severity="secondary" outlined @click="handleCancel"/>
        <XButton label="Confirmar" @click="handleConfirm" />
      </div>
    </template>  
  </XConfirmDialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface RouteSelection {
  alias: string
  isActive: boolean
  urls: string[]
}

const props = defineProps<{
  modelValue: boolean
  currentSelection?: RouteSelection
  previousSelection?: RouteSelection
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'cancel': []
  'confirm': []
}>()

const visible = ref(props.modelValue)

const handleCancel = () => {
  visible.value = false

  emit('cancel')
}

const handleConfirm = () => {
  visible.value = false
  emit('confirm')
}

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
})

watch(visible, (newVal) => {
  emit('update:modelValue', newVal)
})
</script>