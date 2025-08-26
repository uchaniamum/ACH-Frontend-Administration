<template>
    <div class="flex-col gap-20">
        <div class="flex flex-col gap-8">
            <XHeader title="Nuevo participante destinatario" 
                :breadcrumb-items="items"
                :show-breadcrumb="true"
            />
            <span class="text-normal font-normal">Complete los datos requeridos para registrar un nuevo participante destinatario y cargue los certificados correspondientes. </span>
        </div>
        <div class="flex flex-col gap-12">
            <div class="grid grid-cols-4 gap-10">
                    <XSelect name="canal" label="Canal" placeholder="Seleccionar un canal" v-model="canal"/>
                    <XInputText name="codigo" label="Codigo" placeholder="Ingresar código" v-model="codigo"/>
                    <XSelect name="entidad" label="Entidad Financiera" placeholder="Selecciona o ingresa entidad/siglas" class="col-span-2" v-model="entidad" /> 
                </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const items = ref([
    { label: 'Inicio'},
    { label: 'Configuración' },
    { label: 'Participantes' }
])

</script>

<style scoped>

</style>