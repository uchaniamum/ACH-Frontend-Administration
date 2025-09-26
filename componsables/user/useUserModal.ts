import type { ModalMode, UserFormData, UserModalData } from "~/features/users/types";

export function useUserModal() {
    // State
    const modalUser = ref(false);
    const mode = ref<ModalMode>('create')
    const loading = ref(false);

    const userDetails = ref<UserFormData>({
        code: '',
        fullname: '',
        email: '',
        alias: '',
        rol: '',
        numberPhone: '',
        countryCode: '+591',
        isActive: true
    });

    // Computed
    const isEditMode = computed(() => mode.value === 'edit')
    const modalTitle = computed(() =>
        isEditMode.value ? 'Editar Usuario' : 'Crear nuevo usuario'
    )

    // Methods
    const openModal = (modalMode: ModalMode, userData?: UserModalData) => {
        mode.value = modalMode
        modalUser.value = true

        if (modalMode === 'edit' && userData) {
            loadUserData(userData)
        } else {
            resetForm()
        }
    }

    const closeModal = () => {
        modalUser.value = false
        mode.value = 'create'
        resetForm()
    }

    const loadUserData = (userData: UserModalData) => {
        userDetails.value = {
            code: userData.code || '',
            fullname: userData.fullname || '',
            email: userData.email || '',
            alias: userData.alias || '',
            rol: userData.roleCode || '',
            numberPhone: userData.phoneNumber?.number || '',
            countryCode: userData.phoneNumber?.countryCode || '+591',
            isActive: userData.isActive ?? true
        }
    }

    const resetForm = () => {
        userDetails.value = {
            code: '',
            fullname: '',
            email: '',
            alias: '',
            rol: '',
            numberPhone: '',
            countryCode: '+591',
            isActive: true
        }
    }

    return {
        // State
        modalUser,
        mode,
        loading,
        userDetails,

        // Computed
        isEditMode,
        modalTitle,

        // Methods
        openModal,
        closeModal,
        loadUserData,
        resetForm
    }
}