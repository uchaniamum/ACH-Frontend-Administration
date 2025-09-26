<script setup lang="ts">
import { useRouter, onMounted } from '#imports'  

const router = useRouter()

onMounted(() => {
  router.replace('admin/dashboard')  // redirige automáticamente
})
</script>

<template>
  <!-- vacío, redirección automática -->
</template>
