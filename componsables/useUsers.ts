import type { LoadingState, User } from "~/features/users/types"
import { userService } from "~/services/userService"

export const useUsers = () =>{
     const users = ref<User[]>([])
  const loadingState = ref<LoadingState>('idle')
  const error = ref<string | null>(null)
  const searchTerm = ref('')

    // Estados computados
  const isLoading = computed(() => loadingState.value === 'loading')
  const hasError = computed(() => loadingState.value === 'error')
  const hasUsers = computed(() => users.value.length > 0)

  // Filtros y transformaciones para el DataTable
  const transformedUsers = computed(() => {
        return users.value.map(user => ({
            email: user.email,
            fullname: user.fullname,
            rol: user.roleDescription,
            isActive: user.isActive,
            statusDescription: user.isActive ? 'Activo' : 'Inactivo',
            codigo: user.code,
        }))
  });

    // Funciones de utilidad
    const setLoading = (state: LoadingState) => {
        loadingState.value = state
    }

    const setError = (errorMessage: string) => {
        error.value = errorMessage
        loadingState.value = 'error'
    }

    const clearError = () => {
        error.value = null
    }

  // Funciones principales
    const fetchUsers = async (params?: { 
        search?: string 
        silent?: boolean
    }) => {
        try {
            setLoading('loading')
            clearError()
            
            const response = await userService.getUsers(params);
            console.log('Respuesta del servicio:', response.users);
            users.value = Array.isArray(response.users) ? response.users : []
            setLoading('success')
        } catch (err) {
            console.error('Error fetching users:', err)
            setError(err instanceof Error ? err.message : 'Error al cargar usuarios')
        }
    }

    onMounted(() => {
        fetchUsers();
    });

    return {
        // Estado
        allUsers: transformedUsers,
        rawUsers: users,
        loadingState,
        error,
        searchTerm,
        // Computed
        isLoading,
        hasError,
        hasUsers,

        // Funciones
        fetchUsers,
    }
}