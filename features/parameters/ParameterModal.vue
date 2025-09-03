

<template>
    <div>
    <XDialog 
        v-model:visible="modalParameter" 
        modal
        :closable="false"
        header="Editar parámetro"
        :style="{ width: '740px !important' }" 
    >
    <div class="flex flex-col gap-8">
        <XCard class="border border-gray-400 flex gap-2 text-gray-900">
            <template #header>
                <div class="font-bold">{{ parameterDetails?.code }}</div>
            </template>
            <template #content>
                <div class="flex flex-col">
                    <div class="flex gap-4"><span class="font-semibold text-gray-700">Tipo de dato:</span>{{ props.parameterData?.dataType }}</div>
                    <div class="flex gap-4"><span class="font-semibold text-gray-700">Descripción:</span>{{ props.parameterData?.description }}</div>
                </div>
            </template>
        </XCard>
        <XForm @submit="handleSubmit" class="flex flex-col gap-10">
            
            <XInputText 
                v-model="formData.value"
                name="parameterValue"
                label="Valor" 
                label-required
                placeholder="Ingrese un valor"
                :disabled="loading || loadingDetails"
                :rules="requiredRule"
            />

            <div class="flex flex-col gap-4 col-span-2">
            <XDivider />
            <div class="flex justify-end gap-4">
                <XButton 
                    label="Cancelar" 
                    variant="outlined" 
                    class="!w-[130px]" 
                    @click="handleCancel" 
                    :disabled="loading"
                />
                <XButton 
                    label="Guardar" 
                    class="!w-[130px]" 
                    type="submit"
                    :loading="loading"
                    :disabled="!isFormValid || !hasValueChanged"
                />
            </div>
        </div>
        </XForm>
    </div>
    </XDialog>
    </div>
</template>

<script setup lang="ts">
import { parametersService } from '~/services/parametersService'
import type { ParameterDetailResponse, ParameterModalData, ParameterRequest } from './types'
import { useParameterService } from '~/componsables/useParameters'
import type { ValidationRuleResult } from '../users/options.types'

// Composables
const toast = useToast()

interface Props {
    modelValue: boolean
    parameterData?: ParameterModalData
}

interface Emits {
    (event: 'update:modelValue', value: boolean): void
    (event: 'save', parameterData: ParameterModalData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// State
const modalParameter = defineModel<boolean>({ default: false })
const loading = ref(false)
const loadingDetails = ref(false)

const parameterDetails = ref<ParameterDetailResponse | null>(null)
const originalValue = ref<string>('')

const formData = ref<ParameterRequest>({
    code: '',
    value: ''
})

const { loadParameterDetails } = useParameterService()

// Computed para validar si el formulario es válido
const isFormValid = computed(() => {
    return formData.value.value.trim() !== ''
})

// Computed para verificar si el valor ha cambiado
const hasValueChanged = computed(() => {
    return formData.value.value !== originalValue.value
})


const requiredRule = (value:unknown):ValidationRuleResult => {
    console.log('Validating:', value);
    return value !== null && value !== undefined && value !== '' 
        ? true 
        : 'El campo es requerido'
}


watch(() => props.modelValue, async (newValue) => {
    if (newValue) {
        modalParameter.value = true
        
        if (props.parameterData?.code) {
            await loadFullParameterDetails(props.parameterData.code)
        } else if (props.parameterData) {
            // No asignar a parameterDetails, solo usar para formData
            formData.value = {
                code: props.parameterData.code || '',
                value: props.parameterData.value || ''
            }
            originalValue.value = props.parameterData.value || ''
        }
    } else {
        closeModal()
    }
})

// Watch para emitir cambios del modal al padre
watch(modalParameter, (newValue) => {
    // emit('update:modelValue', newValue)
    if (typeof newValue === 'boolean') {
        emit('update:modelValue', newValue)
    }
})

const loadFullParameterDetails = async (code: string): Promise<void> => {
    loadingDetails.value = true
    
    try {
        const parameterDetail = await loadParameterDetails(code);

        if (parameterDetail) {
            formData.value = {
                code: parameterDetail.code,
                value: parameterDetail.value
            }
            originalValue.value = parameterDetail.value
        }

    } catch (error) {
        console.error('Error loading parameter details:', error)
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los detalles del parámetro',
            life: 5000
        })
    } finally {
        loadingDetails.value = false
    }
}

const handleSubmit = async (): Promise<void> => {
    loading.value = true
    try {
        const response = await parametersService.updateParameter(formData.value)
        if (response.wasSaved) {
            console.log('hola');
            toast.add({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Parámetro actualizado correctamente',
                life: 5000
            })
            emit('save', formData.value)
            handleCancel()
        } 
    } catch (error) {
        console.error('Error saving parameter:', error)
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar el parámetro',
            life: 5000
        })
    } finally {
        loading.value = false
    }
}

const handleCancel = (): void => {
    closeModal()
}

const closeModal = (): void => {
    modalParameter.value = false
    // Reset form data
    formData.value = {
        code: '',
        value: ''
    }
    parameterDetails.value = null
    originalValue.value = ''
}

</script>