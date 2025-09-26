<template>
  <div class="flex flex-col gap-16">
    <XSnackBar variant="warn" v-if="!modelValue" >
        <h5 class="font-semibold text-gray-1000">Usuario inactivo</h5>
        <span>El usuario no podrá ejecutar ninguna acción en el sistema.</span>
    </XSnackBar>

    <!-- Campo del switch -->
    <div class="col-span-2 border border-gray-400 rounded-[6px] p-6 flex flex-row gap-12">
      <div class="flex flex-col gap-2">
        <p class="font-medium text-gray-1000">{{ props.label }}</p>
        <p>{{ props.description }}</p>
      </div>
      <div class="flex flex-row gap-4 justify-end items-center">
        <label>{{ modelValue ? props.activeLabel : props.inactiveLabel }}</label>
        <XToggleSwitch 
          :modelValue="modelValue" 
          @update:modelValue="handleSwitchChange" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  label: { type: String, default: 'Situación' },
  description: { type: String, default: 'Activa o desactiva el switch para definir la situación.' },
  activeLabel: { type: String, default: 'Activo' },
  inactiveLabel: { type: String, default: 'Inactivo' }
})

const emit = defineEmits(['update:modelValue'])

const showSnackbar = ref(false)

const handleSwitchChange = (newValue: boolean) => {
  emit('update:modelValue', newValue)
  showSnackbar.value = true
  
  // Ocultar el snackbar después de 3 segundos
  setTimeout(() => {
    showSnackbar.value = false
  }, 3000)
}
</script>