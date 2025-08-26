<template>
    <div>
        <XHeader  title="Historial de Participantes"/>
        <div class="pt-12 flex flex-col gap-20">
            <div class="flex flex-col gap-12">
                <h5 class="text-lg text-gray-700">Filtrar por:</h5>
                <div class="grid grid-cols-4 gap-10">
                    <XSelect name="codigo" label="Código" placeholder="Seleccionar codigo" v-model="codigo"/>
                    <XSelect name="usuario" label="Usuario" placeholder="Selecciona usuario"  v-model="entidad" /> 
                    <XDatePicker name="fecha" label="Fecha" placeholder="Seleccionar fecha" v-model="fecha" showIcon iconDisplay="input" icon="calendar-1"/>
                    <XButton class="self-end" label="Buscar" icon="search" variant="outlined" size="large"/>
                </div>

                <DataTable :value="histoparticipantes" :rows="10"  tableStyle="min-width: 50rem">
                    <Column field="codigo" header="Codigo" style="width: 122px"></Column>
                    <Column field="nombres" header="Nombre" style="width: 453px "></Column>
                    <Column field="siglas" header="Siglas" style="width: 172.5px "></Column>
                    <Column field="alias" header="Alias CPD" style="width: 172.5px "></Column>
                    <Column field="ultimaModificacion" header="Ultima modificación" style="width: 200px "></Column>
                </DataTable>
 
                <div class="flex justify-end  gap-4">
                    <XButton label="Descargar" icon="download"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">


const histoparticipantes = ref([
    {
        codigo: 'f230fh0g3',
        nombres: 'Product Description 1',
        siglas:'ACCL',
        alias:'LPZ/SCZ',
        ultimaModificacion:'03/05/2024',
    },
    {
        codigo: 'f230fh0g3',
        nombres: 'Product Description 1',
        siglas:'INSTOCK',
        alias:'LPZ/SCZ',
        ultimaModificacion:'03/05/2024',
    },
    {
        canal: '2',
        codigo: 'f230fh0g3',
        nombres: 'Product Description 1',
        siglas:'INSTOCK',
        alias:'LPZ/SCZ',
        ultimaModificacion:'03/05/2024',
    },
    {
        canal: '1',
        codigo: 'rrqrqer',
        nombres: 'Bamboo Watch 12',
        siglas:'INSTOCK',
        alias:'LPZ/SCZ',
        ultimaModificacion:'03/05/2024',
    },
    {
        canal: '2',
        codigo: 'rrqrqer',
        nombres: 'Bamboo Watch 12',
        siglas:'INSTOCK',
        alias:'LPZ/SCZ',
        ultimaModificacion:'03/05/2024',
    },
]);

</script>

<style scoped>

</style>