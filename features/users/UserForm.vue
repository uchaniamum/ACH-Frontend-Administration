<template>
    <XForm @submit="onSubmit" class="flex flex-col gap-10">
        <UserFields
            v-if="isEdit"
            v-model="formData.isActive"
        />

        <XInputText 
            v-model="formData.code" 
            name="codigo"
            label="Código de usuario" 
            label-required
            placeholder="Ingresa un código de usuario"
            :disabled="isEdit"
            :rules="requiredRule" 
        />

        <XInputText 
            v-model="formData.name" 
            name="nombre"
            label="Nombre completo" 
            label-required
            placeholder="Ingresa los nombres y apellidos"
            :rules="requiredRule" 
        />

        <XInputText 
            v-model="formData.email" 
            name="correo"
            label="Correo electrónico" 
            label-required
            placeholder="Ingresa el correo"
            :rules="[
                requiredRule,
                emailRule
            ]"
        />

        <XInputText 
            v-model="formData.alias" 
            name="alias"
            label="Alias" 
            label-required
            placeholder="Ingresa un alias"
            :rules="requiredRule" 
        />

        <XSelect 
            v-model="formData.rol" 
            label="Rol" 
            label-required
            :options="roleOptions" 
            option-label="label" 
            option-value="value"
            placeholder="Selecciona el rol"
            name="rol"
            :rules="requiredRule"
            :loading="optionsLoading"
            
        />

        <XPhoneInput 
            v-model="formData.numberPhone"
            name="telefono"
            label="Número de celular" 
            label-required
            placeholder="Ingresa el número"
            is-validate
            @update:countryCode="formData.countryCode = $event"
            :rules="requiredRule"
        />

        <div class="flex flex-col gap-4 col-span-2">
            <XDivider />
            <div class="flex justify-end gap-4">
                <XButton 
                    label="Cancelar" 
                    variant="outlined" 
                    class="!w-[130px]" 
                    @click="$emit('cancel')" 
                    :disabled="loading"
                />
                <XButton 
                    :label="isEdit ? 'Guardar' : 'Crear'" 
                    class="!w-[130px]" 
                    type="submit"
                    :loading="loading"
                />
            </div>
        </div>
    </XForm> 
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserFields from '~/components/fields/UserFields.vue'
import { useOptions } from '~/componsables/useOptions'
import { optionsService } from '~/services/optionsService'

const props = defineProps({
    userData: { type: Object, default: () => ({}) },
    isEdit: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
})

const emits = defineEmits(['submit', 'cancel'])

// Usar el composable de opciones
const { 
    roleOptions, 
    loading: optionsLoading, 
    error: optionsError,
    loadRoleOptions 
} = useOptions()

const requiredRule = (value: any) => {
    return value !== null && value !== undefined && value !== '' 
        ? true 
        : 'El campo es requerido'
}

const emailRule = (value: any) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/  // regex básico para correos
  return regex.test(value)
    ? true
    : 'Debe ingresar un correo electrónico válido'
}


const formData = ref({
    code: '',
    name: '',
    email: '',
    alias: '',
    rol: '',
    numberPhone: '',
    countryCode: '',
    isActive: true
})

// Determinar si es un número móvil basado en el código de país y el primer dígito
const determineIsMobile = (countryCode: string, phoneNumber: string): boolean => {
    // Si el código de país es +591 (Bolivia)
    if (countryCode === '+591') {
        // Obtener el primer dígito del número de teléfono
        const firstDigit = phoneNumber.charAt(0)
        // Si comienza con 6 o 7, es móvil
        return firstDigit === '6' || firstDigit === '7'
    }

    return true
}

// Watcher para los datos del usuario
watch(() => props.userData, (newData) => {
    if (newData && Object.keys(newData).length > 0) {
        formData.value = {
            code: newData.code || '',
            name: newData.name || '',
            email: newData.email || '',
            alias: newData.alias || '',
            numberPhone: newData.numberPhone || '',
            countryCode: newData.countryCode || '+591',
            rol: newData.rol || newData.roleCode || '',
            isActive: newData.isActive ?? true
        }
    } else {
        formData.value = {
            code: '',
            name: '',
            email: '',
            alias: '',
            rol: '',
            numberPhone: '',
            countryCode: '+591',
            isActive: true,
        }
    }
    console.log('Role:', roleOptions);
}, { immediate: true, deep: true })

const onSubmit = () => {
    const isMobile = determineIsMobile(formData.value.countryCode, formData.value.numberPhone)

    const apiPayload = {
        code: formData.value.code,
        email: formData.value.email,
        alias: formData.value.alias,
        fullname: formData.value.name,
        phone: {
            countryCode: formData.value.countryCode,
            number: formData.value.numberPhone,
            isMobile: isMobile,
            verificationHash: ""
        },
        roleCode: optionsService.convertToBackendFormat(formData.value.rol),
        isActive: formData.value.isActive
    }
    //console.log('datos',apiPayload);
    emits('submit', apiPayload)
}

// Cargar opciones al montar el componente
onMounted(async () => {
    await loadRoleOptions()
    
    // Manejo de errores
    if (optionsError.value) {
        console.warn('No se pudieron cargar las opciones de roles:', optionsError.value)
    }
})
</script>

