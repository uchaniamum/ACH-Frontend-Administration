<template>
  <XDialog 
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    header="Participantes seleccionados"
    :style="{ width: '500px' }"
    :closable="true"
    :modal="true"
  >
    <div class="space-y-4">
      <div>
        <ul class="space-y-2">
          <li 
            v-for="(bankName, index) in bankNames" 
            :key="index"
            class="flex items-start"
          >
            <span>•</span>
            <span class="text-gray-900 ml-2">
              {{ bankName }}
            </span>
          </li>
        </ul>
      </div>
      
      <div class="mt-6 pt-4 border-t border-gray-200">
        <p class="text-sm font-medium text-gray-700">
          Total de participantes: {{ participantCount }}
        </p>
      </div>
    </div>
  </XDialog>
</template>

<script setup lang="ts">
defineProps({
  visible: Boolean,
  bankNames: Array,
  participantCount: Number
});

defineEmits(['update:visible']);
</script>