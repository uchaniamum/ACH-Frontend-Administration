<template>
  <div class="min-w-[15.536rem] min-h-[60.143rem] flex flex-col gap-8">
    <XSelect 
      name="rol"
      label="Comparar con" 
      label-required
      :model-value="role" 
      :options="roleOptions" 
      optionLabel="label" 
      optionValue="value"
      placeholder="Selecciona el rol" 
      :loading="loading"
      :dropdown="true"
      appendTo="body"
      class="flex items-top"
      @update:model-value="$emit('roleChanged', $event)"
    />

    <div class="min-h-[54.143rem]">
      <table class="min-w-[15.536rem]">
        <thead>
          <th class="min-h-[3.857rem] text-[1.143rem] p-8 text-primary font-semibold bg-secondary-200 rounded-t-[1.143rem]">
            <Icon name="x:tools" /> {{ role || 'Técnico' }}
          </th>
        </thead>
        <tbody class="flex flex-col shadow-[6px_6px_12px_0_rgba(12,85,248,0.12)] rounded-b-[1.143rem]">
          <PermissionRow
            v-for="(permission, index) in permissions"
            :key="index"
            :granted="permission"
            :is-last="index === permissions.length - 1"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import PermissionRow from './PermissionRow.vue';

interface Props {
  role?: string
  roleOptions: Array<{ label: string; value: string }>
  permissions: boolean[]
  loading: boolean
}

defineProps<Props>();
defineEmits<{
  roleChanged: [value: string]
}>();
</script>