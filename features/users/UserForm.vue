<template>
    <XForm @submit="onSubmit" class="flex flex-col gap-10">

    <XInputText 
      v-model="formData.name" 
      name="name"
      label="Nombre completo" 
      label-required
      placeholder="Ingresa los nombres y apellidos"
    />

    <XInputText 
      v-model="formData.email" 
      name="correo"
      label="Correo electrónico" 
      label-required
      placeholder="Ingresa el correo" 
    />

    <XInputText 
      v-model="formData.alias" 
      name="alias"
      label="Alias" 
      label-required
      placeholder="Ingresa un alias" 
    />

    <XInputText 
      v-model="formData.codigo" 
      name="codigo"
      label="Código de empleado" 
      label-required
      placeholder="Ingresa un código de empleado" 
    />

    <XSelect 
      v-model="formData.rol" 
      label="Rol" 
      label-required
      :options="roles" 
      option-label="label" 
      option-value="value"
      placeholder="Selecciona el rol"
      name="rol"
      :rules="requiredRule" 
    />

    <XPhoneInput 
        v-model="formData.telefono" 
        label="Número de celular" 
        label-required
        placeholder="Ingresa el número"
        name="telefono"
        :rules="requiredRule" 
    />

    <div class="flex flex-col gap-4 col-span-2">
      <XDivider />
      <div class="flex justify-end gap-4">
        <XButton label="Cancelar" variant="text" class="!w-[130px]" @click="$emit('cancel')" />
        <XButton :label="isEdit ? 'Guardar' : 'Agregar'" class="!w-[130px]" type="submit" />
      </div>
    </div>
  </XForm> 
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    userData: { type: Object, default: () => ({}) },
    isEdit: { type: Boolean, default: false }
})

const emits = defineEmits(['submit', 'cancel'])

const requiredRule = (value) => {
    return value !== null && value !== undefined && value !== '' 
    ? true 
    : 'El campo es requerido'
}

const formData = ref({
    name: props.userData?.name || '',
    email: props.userData?.email || '',
    rol: props.userData?.rol || '',
    codigo: props.userData?.codigo || '',
    telefono: props.userData?.telefono || '',
    situacion: props.userData?.situacion !== undefined ? props.userData.situacion : true
})

const roles = [
    { label: 'Sistema', value: 'sistema' },
    { label: 'Administrador', value: 'admin' },
    { label: 'Ejecutivo', value: 'ejecutivo' },
    { label: 'Técnico', value: 'tecnico' },
    { label: 'Supervisor', value: 'supervisor' },
    { label: 'Monitoreo', value: 'monitoreo' }
]

const onSubmit = () => {
    emits('submit', formData.value)
}
</script>