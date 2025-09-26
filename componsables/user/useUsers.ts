import type { ToastMessageOptions } from "primevue";
import type { ServiceError, UserDetailResponse, UserListItem, UserRequest } from "~/features/users/types";
import { userService } from "~/services/userService";


export function useUserService() {
    const users = ref<UserListItem[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const toast = useToast()

    const showToast = (message: ToastMessageOptions) => {
        toast.add(message)
    }

    const loadUsers = async (): Promise<void> => {
        loading.value = true
        error.value = null
        try {
            const response = await userService.getUsers()
            users.value = response.users
        } catch (err) {
            const serviceError = err as ServiceError

            error.value = serviceError.message || 'Error loading parameters'

            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || 'Error al cargar los parámetros',
                life: 5000
            })

            throw err
        } finally {
            loading.value = false
        }
    }
    const loadUserDetails = async (code: string): Promise<UserDetailResponse | null> => {
        try {
            const response = await userService.getUserByCode(code)
            return response

        } catch (error) {
            console.error('Error loading user details:', error)
            const serviceError = error as ServiceError
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || 'No se logro cargar los detalles del usuario',
                life: 5000
            })
            return null
        }
    }
    const saveUser = async (userData: UserRequest, isEdit: boolean): Promise<boolean> => {
        try {
            const apiPayload = {
                code: userData.code,
                email: userData.email,
                alias: userData.alias,
                fullname: userData.fullname,
                phone: {
                    countryCode: userData.phone?.countryCode,
                    number: userData.phone?.number,
                    isMobile: userData.phone?.isMobile,
                    verificationHash: ""
                },
                roleCode: userData.roleCode
            }

            const apiPayloadEdit = {
                code: userData.code,
                email: userData.email,
                alias: userData.alias,
                fullname: userData.fullname,
                phone: {
                    countryCode: userData.phone?.countryCode,
                    number: userData.phone?.number,
                    isMobile: userData.phone?.isMobile,
                    verificationHash: ""
                },
                roleCode: userData.roleCode,
                isActive: userData.isActive
            }
            if (isEdit) {
                const response = await userService.updateUser(apiPayloadEdit)
                // Verificar si la operación fue exitosa según la estructura de tu respuesta
                if (response) {
                    showToast({
                        severity: 'success',
                        summary: 'Cambios guardados',
                        detail: '',
                        life: 4000
                    })
                    return true
                } else {
                    showToast({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se logro actualizar el usuario',
                        life: 8000
                    })
                    return false
                }
            } else {
                const response = await userService.createUser(apiPayload)
                console.log('holasss', response);
                // Verificar si la operación fue exitosa según la estructura de tu respuesta
                if (response) {
                    showToast({
                        severity: 'success',
                        summary: 'Nuevo usuario',
                        detail: 'Se creo el usuario exitosamente.',
                        life: 8000
                    })
                    return true
                } else {
                    showToast({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudo crear el usuario',
                        life: 5000
                    })
                    return false
                }
            }
        } catch (error) {
            console.error('Error saving user:', error)
            const serviceError = error as ServiceError
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || `Error al ${isEdit ? 'actualizar' : 'crear'} el usuario`,
                life: 5000
            })
            return false
        }
    }

    const saveResetPassword = async (code: string): Promise<boolean> => {
        try {
            const response = await userService.resetPasswordUser(code)
            console.log('Respomse reset: ', response);
            if (response) {
                showToast({
                    severity: 'success',
                    summary: 'Reseteo exitoso',
                    detail: 'Se envió la nueva contraseña al correo electrónico del usuario.',
                    life: 4000
                })
                return true
            } else {
                showToast({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se logro resetear la contraseña',
                    life: 8000
                })
                return false
            }
        } catch (error) {
            console.error('Error reseteando contraseña:', error)
            const serviceError = error as ServiceError
            showToast({
                severity: 'error',
                summary: 'Error',
                detail: serviceError.message || 'Error al resetear la contraseña',
                life: 8000
            })
            return false
        }
    }
    return {
        // State
        users,
        loading,
        error,

        loadUsers,
        loadUserDetails,
        saveUser,
        saveResetPassword,

        showToast
    }
}