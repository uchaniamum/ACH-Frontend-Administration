<template>
  <div class="min-h-[60.143rem] flex items-end">
    <div class="bg-gray-50 pl-12 pr-8 rounded-[1.143rem] mt-[120px]">
      <table>
        <MenuSection
          v-for="section in menuItems"
          :key="section.name"
          :section="section"
        />
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MenuItemRoles as MenuSectionType } from '~/componsables/roles/type';

interface Props {
    menuItems: MenuSectionType[]
}

defineProps<Props>();
</script>