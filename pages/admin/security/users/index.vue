

<template>
    <div class="flex flex-col gap-16">
        <XHeader title="Usuarios">
            <template #description>
                <p>Crea usuarios y asigna los roles correspondientes, procura garantizar que cada usuario cuente con los permisos adecuados para sus funciones.</p>
            </template>
        </XHeader>
        
        <div v-if="isLoading" class="text-center py-8">
            <ProgressSpinner />
            <p class="mt-4">Cargando usuarios...</p>
        </div>
        
        <div v-else-if="hasError" class="text-center py-8 text-red-500">
            <p>Error: {{ error }}</p>
            <Button @click="fetchUsers" label="Reintentar" class="mt-4" />
        </div>

        <div v-else class="flex flex-col gap-16">
            <div class="flex justify-between gap-4">
                <div class="self-center">
                    <XIconField>
                        <InputText 
                            v-model="searchTerm"
                            placeholder="Buscar" 
                            class="!w-[250px]"
                            @keyup.enter="handleSearch"/>
                        <XInputIcon icon="search" @click="handleSearch" /> <!-- AÑADIR CLICK -->
                    </XIconField>
                </div>
                <div class="self-center">
                    <XButton 
                        label="Nuevo usuario" 
                        icon="think-plus" 
                        @click="openNewUser" 
                        class="!w-[150px]"/>
                </div>
            </div>

            <!-- DataTable -->
            <DataTable 
                :value="allUsers" 
                paginator
                :rows="10"
                :rowsPerPageOptions="[10, 25, 50, 100]"
                :loading="isLoading"
            >
                <Column field="email" header="Correo Electrónico" sortable class="w-[225px]">
                    <template #body="{ data }">
                        {{ data.email }}
                    </template>
                </Column>
                
                <Column field="fullname" header="Nombre" sortable class="w-[280px]">
                    <template #body="{ data }">
                        {{ data.fullname }}
                    </template>
                </Column>
                
                <Column field="rol" header="Rol" sortable class="w-[158px]">
                    <template #body="{ data }">
                        <Tag 
                            :value="data.rol" 
                            severity="neutral"
                            class="text-xs"
                        />
                    </template>
                </Column>
                <Column field="codigo" header="Código" sortable class="w-[158px]">
                    <template #body="{ data }">
                        {{ data.codigo }}
                    </template>
                </Column>
                
                <Column field="isActive" header="Estado" sortable class="w-[158px]">
                    <template #body="{ data }">
                        <Tag 
                            :value="data.statusDescription" 
                            :severity="data.isActive ? 'success' : 'danger'"
                            class="text-xs"
                        />
                    </template>
                </Column>
                 
                <Column header="Acciones"  class="w-[141px] flex gap-4">
                    <template #body="{ data }">
                        <XButton variant="outlined" icon="edit-pencil" @click="editUser(data)" size="small"/>
                        <XButton label="Editar" size="small"/>
                    </template>
                </Column>
            </DataTable>
        </div>

        <UserModal 
            v-model="modalUser" 
            :userData="selectedUser"
            @save="handleSave"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUsers } from '~/componsables/useUsers';
import UserModal from '~/features/users/UserModal.vue';

const {
    allUsers, 
    isLoading, 
    hasError, 
    error, 
    searchTerm,
    fetchUsers 
} = useUsers();

const modalUser = ref(false);
const selectedUser = ref<any>(null);

// AÑADIR FUNCIÓN HANDLE SEARCH QUE FALTABA
const handleSearch = () => {
    fetchUsers({ search: searchTerm.value });
};

const openNewUser = () => {
    selectedUser.value = {
        code: '',           
        name: '',
        email: '',          
        rol: '',
        estado: 'Activo',
        codigo: '',         
        telefono: '',
        situacion: true
    };
    modalUser.value = true;
};

const editUser = (row: any) => {
    selectedUser.value = {
        code: row.codigo,                 
        name: row.fullname, // ← Usar fullname en lugar de name
        email: row.email,
        rol: row.rol,
        telefono: row.telefono || '',
        situacion: row.isActive // ← Usar isActive directamente
    };
    modalUser.value = true;
};

const handleSave = (data: any) => {
    console.log('Guardar usuario', data);
    modalUser.value = false;
    // Recargar usuarios después de guardar
    fetchUsers();
};

// AÑADIR onMounted PARA CARGAR USUARIOS AL INICIAR
onMounted(() => {
    fetchUsers();
});
</script>