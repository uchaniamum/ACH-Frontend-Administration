import type { ModalMode, ServiceError } from "~/features/users/types"
import { parametersService } from "~/services/parametersService"

export function useChannels() {
    const toast = useToast()

    const showToast = (message: any) => {
        toast.add(message)
    }


}