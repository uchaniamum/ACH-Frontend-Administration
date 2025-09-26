<template>
  <XTag v-if="props.code == 'PENDING'" severity="warn" :value="props.description" />
  <XTag v-else-if="props.code == 'ACCEPTED'" severity="success" :value="props.description" />
  <XTag v-else-if="props.code == 'REJECTED'" severity="danger" :value="props.description" />
  <XTag v-else-if="props.code == 'FAILED'" severity="danger" :value="props.description" />
  <XTag v-else-if="props.code == 'CANCELED'" severity="orange" :value="props.description" />
  <XTag v-else severity="info" :value="props.description" />
</template>

<script setup lang="ts">
  const props = defineProps<{
    code: string;
    description: string;
  }>();
</script>
