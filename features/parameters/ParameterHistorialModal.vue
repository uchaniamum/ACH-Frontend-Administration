<template>
    <div>
        <XDialog 
            v-model:visible="modalParameter" 
            modal
            header="Ver historial"
            :style="{ width: '840px' }" 
        >
            <div class="flex flex-col gap-6">
                <!-- Información del parámetro -->
                <XCard class="border border-gray-200">
                    <template #header>
                        <div class="font-bold text-lg text-gray-800">{{ parameterHistoData?.code }}</div>
                    </template>
                    <template #content>
                        <div class="flex flex-col">
                            <div class="flex gap-4"><span class="font-semibold text-gray-700">Tipo de dato:</span>{{ parameterHistoData?.dataType || 'N/A' }}</div>
                            <div class="flex gap-4"><span class="font-semibold text-gray-700">Descripción:</span>{{ parameterHistoData?.description || 'N/A' }}</div>
                        </div>
                    </template>
                </XCard>

                <!-- Historial de cambios -->
                <div class="flex flex-col gap-4">                    
                    <div v-if="loadingDetails" class="text-center py-8">
                        <ProgressSpinner />
                        <p class="text-gray-600 mt-2">Cargando historial...</p>
                    </div>

                    <div v-else-if="parameterHistorials && parameterHistorials.parameters && parameterHistorials.parameters.length > 0">
                        <DataTable 
                            :value="parameterHistorials.parameters" 
                            :rowHover="true"
                        >
                            <Column field="updatedAt" header="Fecha de modificación" sortable style="min-width: 180px;">
                                <template #body="{ data }">
                                    {{ formatDateTime(data.updatedAt) }}
                                </template>
                            </Column>

                            <Column field="updatedByUser" header="Usuario" sortable style="min-width: 200px;">
                                <template #body="{ data }">
                                    {{ data.updatedByUser || 'N/A' }}
                                </template>
                            </Column>

                            <Column field="value" header="Valor" style="min-width: 120px;">
                                <template #body="{ data }">
                                    {{ data.value || 'N/A' }}
                                </template>
                            </Column>
                        </DataTable>
                    </div>

                    <div v-else class="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                        <p class="text-gray-500">No hay historial de cambios para este parámetro</p>
                    </div>
                </div>
            </div>
        </XDialog>
    </div>
</template>

<script setup lang="ts">
import { parametersService } from '~/services/parametersService';
import type { ParameterDetailHisto } from './types';

// Composables
const toast = useToast()

interface Props {
    modelValue: boolean
    parameterHistoData?: {
        code: string
        dataType?: string
        description?: string
    }
}

interface Emits {
    (event: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// State
const modalParameter = defineModel<boolean>({ default: false })
const loadingDetails = ref(false)
const selectedChange = ref<ParameterDetailHisto | null>(null)

// Tipo para la respuesta del historial
interface ParameterHistoricalData {
    code: string
    dataType: string
    description: string
    parameters: ParameterDetailHisto[]
}

const parameterHistorials = ref<ParameterHistoricalData | null>(null)

watch(() => props.modelValue, async (newValue) => {
    if (newValue) {
        modalParameter.value = true
        console.log('Datos recibidos en modal:', props.parameterHistoData)
        console.log('Código del parámetro:', props.parameterHistoData?.code)
        
        if (props.parameterHistoData?.code) {
            await loadFullParameterHistorical(props.parameterHistoData.code)
        }
    } else {
        closeModal()
    }
})

const loadFullParameterHistorical = async (code: string): Promise<void> => {
    loadingDetails.value = true
    selectedChange.value = null
    
    try {
        const parameterDetail = await parametersService.getParameterHistorical(code)
        console.log('Datos del historial:', parameterDetail)
        
        // Asigna los datos del historial
        parameterHistorials.value = parameterDetail
        
        console.log('Historial cargado:', parameterDetail)
    } catch (error) {
        console.error('Error loading parameter details:', error)
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los detalles del historial',
            life: 5000
        })
    } finally {
        loadingDetails.value = false
    }
}

const formatDateTime = (dateString: string): string => {
    if (!dateString) return 'N/A'
    
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
    } catch (error) {
        return dateString
    }
}

const closeModal = (): void => {
    modalParameter.value = false
    parameterHistorials.value = null
    selectedChange.value = null
    emit('update:modelValue', false)
}
</script>