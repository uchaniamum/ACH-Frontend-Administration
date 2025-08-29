import type { ChannelsListItem } from "~/features/channels/type"
import type {  ServiceError } from "~/features/users/types"
import { parametersService } from "~/services/parametersService"

export function useChannels() {
    const toast = useToast()

    const showToast = (message: any) => {
        toast.add(message)
    }


}