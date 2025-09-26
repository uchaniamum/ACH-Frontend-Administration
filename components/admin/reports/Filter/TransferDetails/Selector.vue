<template>
  <div class="flex flex-wrap gap-3 justify-between">
    <XButton
      v-for="option in props.options"
      :key="option.code"
      :label="option.displayName"
      class="bg-[#F0F5FF] text-[#5F6A7B] border-none hover:bg-[#6F8CCE] hover:text-[#FFFFFF]"
      :class="{'!bg-[#6F8CCE] !text-[#FFFFFF]': selected == option.code}"
      @click="selected = option.code"
    />

    <XButton
      label="Todos"
      class="bg-[#F0F5FF] text-[#5F6A7B] border-none hover:bg-[#6F8CCE] hover:text-[#FFFFFF]"
      :class="{'!bg-[#6F8CCE] !text-[#FFFFFF]': selected == 'ALL'}"
      @click="selected = 'ALL'"
    />
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    options: {
      code: string;
      displayName: string;
    }[];
  }>();

  const selected = defineModel<string>({ default: "" });
</script>
