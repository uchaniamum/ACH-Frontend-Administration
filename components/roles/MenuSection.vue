<template>
  <template v-if="section.children?.length > 1">
    <tr>
      <td 
        :rowspan="section.children.length" 
        class="border-b py-12 pl-16 pr-28 text-[1.143rem] font-semibold"
      >
        {{ section.name }}
      </td>
      <td class="border-b py-6 px-8 text-gray-700">
        {{ section.children[0].name }}
      </td>
    </tr>
    <tr v-for="child in section.children.slice(1)" :key="child.name" class="py-6">
      <td class="border-b py-6 pl-8 text-gray-700">{{ child.name }}</td>
    </tr>
  </template>
  
  <template v-else>
    <!-- Single child - no rowspan needed -->
    <tr>
      <td class="border-b py-6 pl-16 pr-28 text-[1.143rem] font-semibold">
        {{ section.name }}
      </td>
      <td class="border-b py-6 pl-8 text-gray-700">
        {{ section.children?.[0]?.name }}
      </td>
    </tr>
  </template>
</template>

<script setup lang="ts">
import type { MenuSecctionRoles } from '~/componsables/roles/type';


interface Props {
    section: MenuSecctionRoles
}

defineProps<Props>();
</script>