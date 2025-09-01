import type { ServiceError, UserRole, UserStatus } from "~/features/users/types"
import { optionsService } from "~/services/optionsService"

export function useOptions() {
    // State
    // const roleOptions = ref([])
    // const statusOptions = ref([])
    // const roleFilterOptions = ref([])
    // const statusFilterOptions = ref([])
    const roleOptions = ref<{ label: string; value: string }[]>([])
    const roleFilterOptions = ref<{ label: string; value: string }[]>([])

    const statusOptions = ref<{ label: string; value: string }[]>([])
    const statusFilterOptions = ref<{ label: string; value: string }[]>([])

    const loading = ref(false)
    const error = ref<string | null>(null)

    // Methods
    const loadRoleOptions = async () => {
        try {
            loading.value = true
            error.value = null

            const roles = await optionsService.getUserRoles()
            roleOptions.value = optionsService.mapRolesToSelectOptions(roles)

        } catch (err) {
            const serviceError = err as ServiceError
            error.value = serviceError.message || 'Error al cargar los roles'
            console.error('Error loading role options:', err)

            // Fallback en caso de error
            roleOptions.value = [
                { label: 'Administrador', value: 'Admin' }
            ]
        } finally {
            loading.value = false
        }
    }

    const loadStatusOptions = async () => {
        try {
            loading.value = true
            error.value = null

            const statuses = await optionsService.getUserStatuses()
            statusOptions.value = optionsService.mapStatusesToSelectOptions(statuses)

        } catch (err) {
            const serviceError = err as ServiceError
            error.value = serviceError.message || 'Error al cargar los estados'
            console.error('Error loading status options:', err)

            // Fallback en caso de error
            statusOptions.value = [
                { label: 'Active', value: 'Active' },
                { label: 'Pending', value: 'Pending' }
            ]
        } finally {
            loading.value = false
        }
    }

    const loadAllOptions = async () => {
        try {
            loading.value = true
            error.value = null

            const response = await optionsService.getOptions()

            if (response.success && response.data?.users) {
                const { userRoles, UserStatuses } = response.data.users

                if (userRoles) {
                    const activeRoles = userRoles.filter((role: UserRole) => role.isActive)
                    roleOptions.value = optionsService.mapRolesToSelectOptions(activeRoles)
                    roleFilterOptions.value = optionsService.mapRolesToFilterOptions(activeRoles)
                }

                if (UserStatuses) {
                    const activeStatuses = UserStatuses.filter((status: UserStatus) => status.isActive)
                    statusOptions.value = optionsService.mapStatusesToSelectOptions(activeStatuses)
                    statusFilterOptions.value = optionsService.mapStatusesToFilterOptions(activeStatuses)
                }
            }

        } catch (err) {
            const serviceError = err as ServiceError
            error.value = serviceError.message || 'Error al cargar las opciones'
            console.error('Error loading options:', err)

            // Fallback options
            roleOptions.value = [{ label: 'Administrador', value: 'ADMIN' }]
            statusOptions.value = [{ label: 'Activo', value: 'ACTIVE' }]
        } finally {
            loading.value = false
        }
    }

    const resetOptions = () => {
        roleOptions.value = []
        statusOptions.value = []
        roleFilterOptions.value = []
        statusFilterOptions.value = []
        error.value = null
    }

    return {
        // State
        roleOptions: readonly(roleOptions),
        statusOptions: readonly(statusOptions),
        roleFilterOptions: readonly(roleFilterOptions),
        statusFilterOptions: readonly(statusFilterOptions),
        loading: readonly(loading),
        error: readonly(error),

        // Methods
        loadRoleOptions,
        loadStatusOptions,
        loadAllOptions,
        resetOptions
    }
}
