// composables/useConfirmDialog.ts
import { ref } from 'vue'

export interface ConfirmDialogOptions {
    title: string
    icon?: string
    iconColor?: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    onConfirm: () => Promise<void> | void
    onCancel?: () => void
}

export const useConfirmDialog = () => {
    const visible = ref(false)
    const options = ref<ConfirmDialogOptions>({
        title: '',
        message: '',
        confirmLabel: 'Aceptar',
        cancelLabel: 'Cancelar',
        onConfirm: () => {},
        onCancel: () => {}
    })

    const openDialog = (dialogOptions: ConfirmDialogOptions) => {
        options.value = { ...options.value, ...dialogOptions }
        visible.value = true
    }

    const closeDialog = () => {
        visible.value = false
    }

    return {
        visible,
        options,
        openDialog,
        closeDialog
    }
}