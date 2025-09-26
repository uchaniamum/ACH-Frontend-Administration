<template>
  <tr>
    <div class="px-8 flex flex-col">
      <td 
        :class="[
          'py-6 text-center',
          { 'border-b': !isLast }
        ]"
      >
        <AccessIcon :granted="hasAccess" />
      </td>
    </div>
  </tr>
</template>

<script setup lang="ts">
import AccessIcon from './AccessIcon.vue';

interface Props {
  hasAccess: boolean
  isLast?: boolean
}

defineProps<Props>();
</script>