import type { PaymentGatewayOp, UserRoleOp, UserStatusOp } from "~/features/users/options.types";
import type { ServiceError } from "~/features/users/types"
import { optionsService } from "~/services/optionsService"

export function useOptions() {
    // State
    const roleOptions = ref<{ label: string; value: string }[]>([])
    const roleFilterOptions = ref<{ label: string; value: string }[]>([])
    const roleAccessOptions = ref<{ label: string; value: string }[]>([])

    const statusOptions = ref<{ label: string; value: string }[]>([])
    const statusFilterOptions = ref<{ label: string; value: string }[]>([])

    const paymentGatewayOptions = ref<{ label: string; value: string }[]>([])
    const paymentGatewayFilterOptions = ref<{ label: string; value: string }[]>([])
    const paymentGatewaySelectButtonOptions = ref<{ value: string }[]>([])

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

    const loadPaymentGatewayOptions = async () => {
        try {
            loading.value = true
            error.value = null
            const gateways = await optionsService.getPaymentGateways()

            // Para Select normal
            paymentGatewayOptions.value = optionsService.mapPaymentGatewaysToSelectButtonOptions(gateways)

            // Para SelectButton específicamente
            paymentGatewaySelectButtonOptions.value = optionsService.mapPaymentGatewaysToSelectButtonOptions(gateways)

        } catch (err) {
            const serviceError = err as ServiceError
            error.value = serviceError.message || 'Error al cargar las pasarelas de pago'
            console.error('Error loading payment gateway options:', err)
        } finally {
            loading.value = false
        }
    }


    const loadAllOptions = async () => {
        try {
            loading.value = true
            error.value = null

            const response = await optionsService.getOptions()

            if (response.users) {
                const { userRoles, UserStatuses } = response.users

                if (userRoles) {
                    const activeRoles = userRoles.filter((role: UserRoleOp) => role.isActive)
                    console.log('tive: ', activeRoles);
                    roleOptions.value = optionsService.mapRolesToSelectOptions(activeRoles)
                    roleFilterOptions.value = optionsService.mapRolesToFilterOptions(activeRoles)
                    roleAccessOptions.value = optionsService.mapRolesAccessOptions(activeRoles)
                    console.log('hola: ', roleAccessOptions);
                }

                if (UserStatuses) {
                    const activeStatuses = UserStatuses.filter((status: UserStatusOp) => status.isActive)
                    statusOptions.value = optionsService.mapStatusesToSelectOptions(activeStatuses)
                    statusFilterOptions.value = optionsService.mapStatusesToFilterOptions(activeStatuses)
                }
            }

            if (response.paymentGateways?.paymentGatewaysActive) {
                const activeGateways = response.paymentGateways.paymentGatewaysActive.filter(
                    (gateway: PaymentGatewayOp) => gateway.isActive
                )

                // Para SelectButton - usar el método correcto
                paymentGatewayFilterOptions.value = optionsService.mapPaymentGatewaysToSelectButtonOptions(activeGateways)
            }

        } catch (err) {
            const serviceError = err as ServiceError
            error.value = serviceError.message || 'Error al cargar las opciones'
            console.error('Error loading options:', err)

        } finally {
            loading.value = false
        }
    }

    const resetOptions = () => {
        roleOptions.value = []
        statusOptions.value = []
        roleFilterOptions.value = []
        roleAccessOptions.value = []
        statusFilterOptions.value = []
        paymentGatewayOptions.value = []
        paymentGatewayFilterOptions.value = []
        error.value = null
    }

    return {
        // State
        roleOptions: readonly(roleOptions),
        statusOptions: readonly(statusOptions),
        roleFilterOptions: readonly(roleFilterOptions),
        roleAccessOptions: readonly(roleAccessOptions),
        statusFilterOptions: readonly(statusFilterOptions),
        paymentGatewayOptions: readonly(paymentGatewayOptions),
        paymentGatewayFilterOptions: readonly(paymentGatewayFilterOptions),
        loading: readonly(loading),
        error: readonly(error),

        // Methods
        loadRoleOptions,
        loadStatusOptions,
        loadPaymentGatewayOptions,
        paymentGatewaySelectButtonOptions,
        loadAllOptions,
        resetOptions
    }
}
