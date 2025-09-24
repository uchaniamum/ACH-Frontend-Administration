import type { ToastMessageOptions } from "primevue";
import type { UserRoleFeatures } from "~/features/roles/type";
import type { ServiceError } from "~/features/users/types";
import { rolesService } from "~/services/rolesServices";

export function useRolesService(){
    //State 
    const roles = ref<UserRoleFeatures[]>([]);

    const loading = ref(false);
    const error = ref<string | null>(null);

    const toast = useToast()

    const showToast = (message: ToastMessageOptions) => {
        toast.add(message)
    }

    const loadRolesFeatures = async () : Promise<void> =>{
        loading.value = true
        error.value = null
        try {
            const response = await rolesService.getRolesAcces()
            roles.value = response.userRoleFeatures
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

    return {
        // State
        roles,
        loading,
        error,
        // Methods
        loadRolesFeatures,
        //Toast
        showToast
    }
}