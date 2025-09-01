<template>
    <div class="flex flex-col">
        <div class="flex flex-col gap-8">
            <XHeader title="Nuevo participante destinatario" @click="router.push('/admin/configuration/participants')"
                :breadcrumb-items="items" :show-breadcrumb="true" />
            <span class="text-normal font-normal">Complete los datos requeridos para registrar un nuevo participante
                destinatario y cargue los certificados correspondientes. </span>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'

const router = useRouter()
    const items = ref([
    { label: 'Inicio'},
    { label: 'Configuración' },
    { label: 'Participantes' }
    ])
</script>