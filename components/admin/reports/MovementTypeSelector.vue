<template>
  <div class="flex gap-3 rounded-xl bg-[#F0F5FF] px-7 py-6">

    <button
      v-tooltip.bottom="{ value: 'Transferencias enviadas a otras cuentas', pt: { text: 'text-center bg-gray-700 px-5 py-2', root: 'max-w-full' } }"
      class="px-5 py-4 rounded-md text-[#5F6A7B] text-sm transition-colors flex items-center hover:bg-[#6F8CCE] hover:text-white"
      :class="[action == 'SENT' && 'bg-[#6F8CCE] text-white']"
      @click="action = 'SENT'"
    >
      <Icon name="x:arrow-tr-circle" class="w-7 h-7" />
      <span class="ml-3 leading-none">Enviados</span>
    </button>

    <button
      v-tooltip.bottom="{ value: 'Transferencias recibidas de otras cuentas', pt: { text: 'text-center bg-gray-700 px-5 py-2', root: 'max-w-full' } }"
      class="px-5 py-4 rounded-md text-[#5F6A7B] text-sm transition-colors flex items-center hover:bg-[#6F8CCE] hover:text-white"
      :class="[action == 'RECEIVED' && 'bg-[#6F8CCE] text-white']"
      @click="action = 'RECEIVED'"
    >
      <Icon name="x:arrow-br-circle" class="w-7 h-7" />
      <span class="ml-3 leading-none">Recibidos</span>
    </button>

    <button
      v-tooltip.bottom="{ value: 'Transferencias enviadas y recibidas', pt: { text: 'text-center bg-gray-700 px-5 py-2', root: 'max-w-full' } }"
      class="px-5 py-4 rounded-md text-[#5F6A7B] text-sm transition-colors flex items-center hover:bg-[#6F8CCE] hover:text-white"
      :class="[action == 'BOTH' && 'bg-[#6F8CCE] text-white']"
      @click="action = 'BOTH'"
    >
      <Icon name="x:transfer" class="w-7 h-7" />
      <span class="ml-3 leading-none">Ambos</span>
    </button>

  </div>
</template>

<script lang="ts" setup>
  const action = defineModel<string>();
</script>
