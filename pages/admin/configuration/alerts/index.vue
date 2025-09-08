<template>
    <div class="flex flex-col gap-16">
        <XHeader title="Configuración de alertas" :breadcrumb-items="itemsBreadContingency" :show-breadcrumb="true">
            <template #description>
                <p>Configura los destinatarios de los mensajes de alerta, definiendo los medios y contactos que recibirán las notificaciones correspondientes.</p>
            </template>
        </XHeader>
        <div class="flex flex-col gap-12">
            <div class="flex justify-end gap-4">
                Defniciones:  
                    <div class="flex items-center gap-6">
                        <span class="relative inline-flex">
                            <span class="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-green-500 bg-white shadow-[0.667px_0.667px_2.667px_0_#9CDB7D]">
                                <span class="h-5 w-5 rounded-full bg-green-500 ring-2 ring-white"></span>
                            </span>
                        </span>
                        <span class="text-gray-700">Sin contingencia </span>
                    </div> 

                    <div class="flex items-center gap-6">
                        <span class="relative inline-flex">
                            <span class="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-500 bg-white shadow-[0.667px_0.667px_2.667px_0_#F1594E]">
                                <span class="h-5 w-5 rounded-full bg-red-500 ring-2 ring-white"></span>
                            </span>
                        </span>
                        <span class="text-gray-700">Con contingencia </span>
                    </div> 
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const itemsBreadContingency = ref([
    { label: 'Inicio' },
    { label: 'Configuración' },
    { label: 'Participantes' },
]);
</script>