<template>
    <div class="flex flex-col gap-20">
        <XHeader title="Gestión de horarios">
            <template #description>
                    <span>Gestiona horarios regulares y extraordinarios, asegúrate de configurarlos adecuadamente para garantizar la correcta continuidad operativa.</span>
            </template>
        </XHeader>
        <div class="flex flex-col gap-12">
            <div class="flex justify-between gap-4">
                <div class="self-center">
                    <XIconField>
                        <XInputText name="codigo" placeholder="Buscar" v-model="searchChannels"/>
                        <XInputIcon icon="search"/>
                    </XIconField>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>