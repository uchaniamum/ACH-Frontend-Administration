<template>
    <div class="flex flex-col gap-16">
        <XHeader title="Gestión de usuarios" :breadcrumb-items="itemsBreadUsers" :show-breadcrumb="true" :show-back="true">
            <template #description>
                <p class="text-gray-800">Crea usuarios y asigna los roles correspondientes, procura garantizar que cada usuario cuente con los permisos adecuados para sus funciones.</p>
            </template>
        </XHeader>
        <div class="flex flex-col gap-16">
            <div v-if="!hasUsers && !loading" class="flex flex-col items-center justify-center pt-[100px] text-center">
                <div class="mb-6">
                    <div class="flex items-center justify-center">
                        <Icon name="x:user-pro" class="text-[115px]"></Icon>
                    </div>
                </div>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Aún no existen usuarios</h3>
                <p class="text-gray-500 mb-6">Comienza creando el primer usuario del sistema.</p>
                <XButton 
                    label="Nuevo usuario" 
                    icon="think-plus" 
                    @click="openCreateModal" 
                    class="!w-[150px]"/>
            </div>

            <div v-if="hasUsers" class="flex flex-col gap-12">
                <div class="flex flex-row justify-between">
                    <div class="self-center">
                        <XIconField>
                            <InputText 
                                v-model="searchTermUser"
                                placeholder="Buscar" 
                                class="!w-[250px]"
                            />
                            <XInputIcon icon="search" />
                        </XIconField>
                    </div>
                    <div class="self-center">
                        <XButton 
                            label="Nuevo usuario" 
                            icon="think-plus" 
                            @click="openCreateModal" 
                            class="!w-[150px]"/>
                    </div>
                </div>
                <div class="flex flex-col gap-12">
                    <DataTable 
                        v-if="hasUsers"
                        :value="paginatedItems" 
                        v-model:filters="filters"
                        :rowsPerPageOptions="[10, 25, 50, 100]"
                        :loading="loading || optionsLoading"
                        dataKey="id"
                        :globalFilterFields="['email', 'fullname', 'roleDescription', 'code', 'statusDescription']"
                    >
                        <template #empty> 
                            <span class="flex justify-center">
                                {{ filteredUsers.length === 0 && searchTermUser.trim() ? 
                                    'No se encontraron usuarios que coincidan con la búsqueda.' : 
                                    'No se encontraron usuarios para el canal seleccionado.' }}
                            </span> 
                        </template>

                        <Column field="codigo" header="Código de usuario" class=" text-left" :showFilterMenu="false">
                            <template #body="{ data }">
                                {{ data.code }}
                            </template>
                            <!-- <template #filter="{ filterModel, filterCallback }">
                                <IconField>
                                    <InputText 
                                        v-model="filterModel.value" 
                                        type="text" 
                                        @input="filterCallback()" 
                                        class="!w-56" 
                                        placeholder="Buscar"
                                    />
                                    <XInputIcon icon="search" />
                                </IconField>
                            </template> -->
                        </Column>
                    
                        <Column field="fullname" header="Nombre" sortable class=" text-left" :showFilterMenu="false">
                            <template #body="{ data }">
                                {{ data.fullname }}
                            </template>
                            <!-- <template #filter="{ filterModel, filterCallback }">
                                <IconField>
                                    <InputText 
                                        v-model="filterModel.value" 
                                        type="text" 
                                        @input="filterCallback()" 
                                        class="!w-[234px]" 
                                        placeholder="Buscar"
                                    />
                                    <XInputIcon icon="search" />
                                </IconField>
                            </template> -->
                        </Column>
                    
                        <Column field="email" header="Correo Electrónico" sortable class="text-left" :showFilterMenu="false">
                            <template #body="{ data }">
                                {{ data.email }}
                            </template>
                            <!-- <template #filter="{ filterModel , filterCallback}">
                                <IconField>
                                    <InputText 
                                        v-model="filterModel.value" 
                                        type="text" 
                                        @input="filterCallback()" 
                                        class="!w-88" 
                                        placeholder="Buscar"
                                    />
                                    <XInputIcon icon="search" />
                                </IconField>
                            </template> -->
                        </Column>
                    
                        <Column field="roleDescription" header="Rol" sortable :showFilterMenu="false">
                            <template #body="{ data }">
                                <Tag 
                                    :value="data.roleDescription" 
                                    severity="neutral"
                                />
                            </template>
                            <!-- <template #filter="{ filterModel, filterCallback }">
                                <XSelect 
                                    name="filterRole"
                                    v-model="filterModel.value" 
                                    @change="filterCallback()" 
                                    :options="roleFilterOptions" 
                                    optionLabel="label" 
                                    optionValue="value"
                                    placeholder="Seleccionar" 
                                    class="!w-56" 
                                    :showClear="true"
                                />
                            </template> -->
                        </Column>
                    
                        <Column field="statusDescription" header="Estado" sortable class="text-left" :showFilterMenu="false">
                            <template #body="{ data }">
                                <Tag 
                                    :value="data.statusDescription" 
                                    :severity="data.isActive ? 'success' : 'danger'"
                                />
                            </template>
                            <!-- <template #filter="{ filterModel, filterCallback }">
                                <XSelect 
                                    name="filterIsActive"
                                    v-model="filterModel.value" 
                                    @change="filterCallback()" 
                                    :options="statusFilterOptions" 
                                    optionLabel="label" 
                                    optionValue="value"
                                    placeholder="Seleccionar" 
                                    class="!w-56" 
                                    :showClear="true"
                                />
                            </template> -->
                        </Column>
                        <Column header="Acciones" class="w-[133px]">
                            <template #body="{ data }">
                                <div class="flex gap-2">
                                    <XButton 
                                        variant="outlined" 
                                        icon="lock"  
                                        size="small" 
                                        @click="openRevertPassModal(data)" 
                                        v-tooltip="{ value: 'Reseteo de contraseña', hideDelay: 300 }"
                                    />
                                    <XButton 
                                        label="Editar" 
                                        size="small" 
                                        @click="openEditModal(data)"
                                    />
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                    <div class="flex justify-center">
                        <Paginator 
                            v-if="hasUsers"
                            :rows="rowsPagination"
                            :totalRecords="totalRecords"
                            :first="firstPagination"
                            :rowsPerPageOptions="[10, 25, 50, 100]"
                            @page="onPage"
                            template="RowsPerPageDropdown  FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        >
                            <template #start="slotProps">
                                Página: {{ slotProps.state.page + 1 }}, Filas: 
                            </template>
                        </Paginator>
                    </div>
                    
                </div>
            </div>
        </div>

        <UserModal 
            v-model="modalStateUser.modalUser" 
            :mode="modalStateUser.mode"
            :userData="modalStateUser.userData"
            @save="handleUserSaved"
        />

        <UserModalReset
            v-model="modalStateRevert.showModal"
            :userData="modalStateRevert.userData"
            @save="handlePasswordReset"
        />

        <ConfirmDialogWrapper
            v-model="confirmDialog.visible"
            :options="confirmDialog.options"
        />
    </div>
</template>

<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core';
import ConfirmDialogWrapper from '~/components/overlay/ConfirmDialogWrapper.vue';
import { useOptions } from '~/componsables/useOptions';
import { useUserService } from '~/componsables/user/useUsers';
import type { ModalMode, UserModalData } from '~/features/users/types';
import UserModal from '~/features/users/UserModal.vue';
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';
import { useUserFilters } from '../../../../componsables/user/useUserFilters';
import { usePagination } from '~/componsables/usePagination';

// Composables 
const { users, loading, loadUsers, showToast } = useUserService()
const { searchTermUser, filteredUsers, selectedRole, selectedStatus } = useUserFilters(users)
const { firstPagination, rowsPagination, paginatedItems, totalRecords, onPage, resetPagination } = usePagination(filteredUsers);

const {  
    roleFilterOptions, 
    statusFilterOptions,
    loading: optionsLoading,
    loadAllOptions 
} = useOptions()

const { saveResetPassword } = useUserService()
// State
const itemsBreadUsers = getBreadcrumbItems('users', 'list');

// Filters
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    fullname: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    roleDescription: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    codigo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    statusDescription: { value: null, matchMode: FilterMatchMode.EQUALS  }
});

// Resetear paginación cuando cambien los filtros
watch([searchTermUser, selectedRole, selectedStatus], () => {
    resetPagination();
});

// State para el modal principal
const modalStateUser = ref<{
    modalUser: boolean,
    mode: ModalMode,
    userData?: UserModalData,
}>({
    modalUser: false,
    mode: 'create',
    userData: undefined
})

// State para el modal de reseteo de contraseña
const modalStateRevert = ref<{
    showModal: boolean,
    userData?: UserModalData,
}>({
    showModal: false,
    userData: undefined
})

// State para el modal de confirmación de reseteo de contraseña
const confirmDialog = ref({
    visible: false,
    options: {
        title: '',
        message: '',
        onConfirm: () => {},
        onCancel: () => {}
    }
})

const openRevertPassModal = (userData: UserModalData): void => {
    confirmDialog.value = {
        visible: true,
        options: {
            title: 'Reseteo de contraseña',
            icon: 'x:warning-circle',
            confirmLabel: 'Resetear',
            cancelLabel: 'Cancelar',
            iconColor: 'text-yellow-500',
            message: `¿Estás seguro de resetear la contraseña de ${userData.fullname}? 
                        Se enviará la nueva contraseña al correo electrónico 
                        <span class="font-semibold">${userData.email}</span>`,
            onConfirm: async () => {
                await saveResetPassword(userData.code)
            },
            onCancel: () => {
                // Lógica adicional si es necesaria al cancelar
            }
        }
    }
}

// Computed para verificar si hay usuarios
const hasUsers = computed(() => {
    return users.value && users.value.length > 0
})


const openCreateModal = (): void => {
    modalStateUser.value = {
        modalUser: true,
        mode: 'create',
        userData: undefined
    }
}

const openEditModal = (userData: UserModalData): void => {
    modalStateUser.value = {
        modalUser: true,
        mode: 'edit',
        userData:{
            code: userData.code,
            fullname: userData.fullname,
            email: userData.email,
            alias: userData.alias,
            roleCode: userData.roleCode,
            isActive: userData.isActive
        }
    }
}

const handleUserSaved = (): void => {
    loadUsers()
}

const handlePasswordReset = (userData?: UserModalData): void => {
    console.log('Contraseña reseteada para:', userData)
}

// Lifecycle
onMounted(async () => {
    try {
        await Promise.all([
            loadUsers(),
            loadAllOptions()
        ]);
    } catch (error) {
        console.error('Error loading data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Error al cargar los datos';
        showToast({
            severity: 'error',
            summary: 'Error de carga',
            detail: errorMessage,
            life: 5000
        });
    } 
})
</script>