<template>
    <div>
        <XHeader  title="Historial de Certificados"/>
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
                    <Column field="nroserie" header="Nro. de Serie" style="width: 269px"></Column>
                    <Column field="validodesde" header="Valido desde" style="width: 150px "></Column>
                    <Column field="validohasta" header="Valido hasta" style="width: 150px "></Column>
                    <Column field="usuario" header="Usuario" style="width: 150px "></Column>
                    <Column field="habilitado" header="Habilitado" style="width: 200px ">
                            <template #body="{ data }">
                                <XCheckBox 
                                    v-model="data.habilitado" 
                                    :binary="true"
                                    @change="handleHabilitadoChange(data)"
                                />
                            </template>
                    </Column>
                    <Column field="ultimaModificacion" header="Ultima modificación" style="width: 200px "></Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">


const histoparticipantes = ref([
    {
        nroserie: 'f230fh0g3',
        validodesde: 'Product Description 1',
        validohasta:'ACCL',
        usuario:'LPZ/SCZ',
        habilitado: true,
        ultimaModificacion:'03/05/2024',
    },
    {
        nroserie: 'f230fh0g3',
        validodesde: 'Product Description 1',
        validohasta:'ACCL',
        usuario:'LPZ/SCZ',
        habilitado: true,
        ultimaModificacion:'03/05/2024',
    },
    {
        nroserie: 'f230fh0g3',
        validodesde: 'Product Description 1',
        validohasta:'ACCL',
        usuario:'LPZ/SCZ',
        habilitado: true,
        ultimaModificacion:'03/05/2024',
    },
    {
        nroserie: 'rrqrqer',
        validodesde: 'Bamboo Watch 12',
        validohasta:'INSTOCK',
        usuario:'LPZ/SCZ',
        habilitado: true,
        ultimaModificacion:'03/05/2024',
    },
    {
        nroserie: 'f230fh0g3',
        validodesde: 'Product Description 1',
        validohasta:'ACCL',
        usuario:'LPZ/SCZ',
        habilitado: false,
        ultimaModificacion:'03/05/2024',
    },
    {
        nroserie: 'rrqrqer',
        validodesde: 'Bamboo Watch 12',
        validohasta:'INSTOCK',
        usuario:'LPZ/SCZ',
        habilitado: true,
        ultimaModificacion:'03/05/2024',
    },
    {
        nroserie: 'rrqrqer',
        validodesde: 'Bamboo Watch 12',
        validohasta:'INSTOCK',
        usuario:'LPZ/SCZ',
        habilitado: false,
        ultimaModificacion:'03/05/2024',
    },
]);


const handleHabilitadoChange = (item: any) => {
   console.log('Estado cambiado:', item.nroserie, 'habilitado:', item.habilitado)
}

</script>

<style scoped>

</style>