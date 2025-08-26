<template>
    <div>
        <XHeader title="Gestión de Participantes">
            <template #description>
                <p>Texto descriptivo del flujo.</p>
            </template>
        </XHeader>
        <div class="pt-12 flex flex-col gap-12">
            <h5 class="text-lg text-gray-700">Selecciona el tipo de persona que realizará la solicitud.</h5>

            <div class="flex justify-between gap-4">
                <SelectButton v-model="value" :options="options" optionLabel="value" dataKey="value" aria-labelledby="custom" size="small">
                    <template #option="slotProps">
                        <p>{{ slotProps.option.value }}</p>
                    </template>
                </SelectButton>
                <div class="self-center">
                    <XButton 
                        label="Nuevo Participante" 
                        icon="think-plus" size="large"
                        @click="navigateToNewParticipant"/>
                </div>
            </div>

            <div class="flex flex-col gap-12">
                <h5 class="text-lg text-gray-700">Filtrar por:</h5>
                <div class="grid grid-cols-5 gap-10">
                    <XSelect name="canal" label="Canal" placeholder="Seleccionar un canal" v-model="canal"/>
                    <XInputText name="codigo" label="Codigo" placeholder="Ingresar código" v-model="codigo"/>
                    <XSelect name="entidad" label="Entidad Financiera" placeholder="Selecciona o ingresa entidad/siglas" class="col-span-2" v-model="entidad" /> 
                    <XButton 
                        class="self-end" 
                        label="Buscar" 
                        icon="search" 
                        variant="outlined" 
                        size="large"
                       
                    />
                </div>
            </div>

            <!-- DataTables -->
            <DataTable :value="participantes" paginator :rows="5">
                <Column field="canal" header="Canal" style="width: 140px"></Column>
                <Column field="codigo" header="Codigo" style="width: 160px"></Column>
                <Column field="entidad" header="Entidad Financiera" style="width: 380px"></Column>
                <Column field="siglas" header="Siglas" style="width: 140px "></Column>
                <Column field="estado" header="Estado" style="width: 140px ">
                    <template #body="{ data }">
                        <Tag :value="data.estado" :severity="getEstado(data.estado)" />
                    </template>
                </Column>
                <Column field="accion" header="Acción" style="width: 160px">
                    <template #body="{ data }" >
                        <div class="flex gap-4">
                            <XButton variant="outlined" icon="edit-pencil"/>
                            <SplitButton label="Ver" :model="items"/>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div> 
    </div>
</template>

<script setup lang="ts">
// ⭐ IMPORTACIONES NECESARIAS
import { ref } from 'vue';
const router = useRouter();

const options = ref([
    { value: 'Propios' },
    { value: 'Destinatarios' },
]);

const value = ref();
const codigo = ref("");
const entidad = ref("");
const canal = ref("");

const participantes = ref([
    { canal: 'Canal 1', codigo: 'COD001', entidad:'Financiera 1', siglas:'FF1', estado:'Activo' },
    { canal: 'Canal 2', codigo: 'COD002', entidad:'Financiera 2', siglas:'FF2', estado:'Inactivo' },
    { canal: 'Canal 3', codigo: 'COD003', entidad:'Financiera 3', siglas:'FF3', estado:'Activo' },
    { canal: 'Canal 4', codigo: 'COD004', entidad:'Financiera 4', siglas:'FF4', estado:'Inactivo' },
    { canal: 'Canal 5', codigo: 'COD005', entidad:'Financiera 5', siglas:'FF5', estado:'Activo' },
]);

const getEstado = (status) => {
    switch (status) {
        case 'Activo':
            return 'success';

        case 'Inactivo':
            return 'neutral';
    } 
}

const items = [
    {
        label: 'Historial',
    },
    {
        separator: true
    },
    {
        label: 'Historial certificados'
    },
]

const navigateToNewParticipant = () => {
    router.push('/admin/configuration/participantes/NewParticipant');
};

</script>