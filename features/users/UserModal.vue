<template>
    <XDialog 
        v-model:visible="modalUser" 
        modal
        :closable="false"
        :header="isEdit ? 'Editar Usuario' : 'Agregar nuevo usuario'"
        :style="{ width: '500px !important' }" 
    > 
        <UserForm
            :userData="props.userData"
            :isEdit="isEdit"
            @submit="handleSubmit"
            @cancel="close"
        />
    </XDialog>
</template>
<script setup lang="ts">
import UserForm from './UserForm.vue'


const props = defineProps({
    modelValue: { type: Boolean, required: true },
    userData: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['update:modelValue', 'save'])

const modalUser = ref(props.modelValue)
watch(() => props.modelValue, v => (modalUser.value = v))
watch(modalUser, v => emit('update:modelValue', v))

// Tu API usa "code" como clave
const isEdit = computed(() => !!props.userData?.code)

const handleSubmit = (payload: any) => {
    emit('save', payload)
    close()
}
const close = () => {
    modalUser.value = false
}
</script>