<template>
    <XConfirmDialog
        v-model="visible"
        :icon="options?.icon"
        :icon-color="options?.iconColor"
        :title="options?.title"
        
        :confirm-button="{ 
            label: options?.confirmLabel, 
            action: handleConfirm 
        }"
        :cancel-button="showCancelButton ? { 
            label: options?.cancelLabel, 
            action: handleCancel 
        } : undefined"
    >
        <template #message>
            <div v-html="options?.message"></div>
        </template>
    </XConfirmDialog>
</template>

<script setup lang="ts">
import type { ConfirmDialogOptions as DialogOptions } from '~/componsables/useConfirmDialog';


interface Props {
    modelValue: boolean
    options?: DialogOptions
}

const visible = defineModel<boolean>('modelValue', { default: false })
const props = defineProps<Props>()

const showCancelButton = computed(() => {
    return !!(props.options?.onCancel || props.options?.cancelLabel)
})

const handleConfirm = async (): Promise<void> => {
    await props.options?.onConfirm()
    visible.value = false
}

const handleCancel = (): void => {
    props.options?.onCancel?.()
    visible.value = false
}
</script>