<template>
    <div class="flex flex-col gap-20">
        <XHeader title="Procesos " :breadcrumb-items="itemsBreadProcesses" :show-breadcrumb="true">
            <template #description>
                <p>Identifica y aborda los procesos que no fueron atendidos.</p>
            </template>
        </XHeader>
        <div class="flex flex-col gap-12">
            <div class="flex justify-between gap-4">
                <div class="self-center">
                    <XIconField>
                        <XInputText name="searchProcesses" placeholder="Buscar" v-model="searchTermProcesses"/>
                        <XInputIcon icon="search"/>
                    </XIconField>
                </div>
            </div>

            <DataTable
                :value="filteredProccess"
                :loading="loading"
            >
                <Column field="paymentGateway" header="Canal" style="min-width: 104px;" class="text-left">
                    <template #body="{ data }">
                        {{ data.paymentGatewayAcronym }}
                    </template>
                </Column>
                <Column field="processes" header="Proceso"  style="min-width: 130px;" class="text-left">
                    <template #body="{ data }">
                        {{ data.paymentGatewayBackgroundCode }}
                    </template>
                </Column>
                <Column field="description" header="Descripción"  style="min-width: 242px;" class="text-left">
                    <template #body="{ data }">
                        {{ data.description }}
                    </template>
                </Column>
                <Column field="lastExecution" header="Última ejecución"  style="min-width: 160px;" class="text-left">
                    <template #body="{ data }">
                        {{ formatDateTimeDirect(data.lastExecutionAt) }}
                    </template>
                </Column>
                <Column field="nextExecution" header="Próxima ejecución" style="min-width: 160px;" class="text-left">
                    <template #body="{ data }">
                        {{ formatDateTimeDirect(data.nextExecutionAt) }}
                    </template>
                </Column>
                <Column field="executionStatus" header="Ejecución" style="min-width: 160px;" class="text-left">
                    <template #body="{ data }">
                        <XButton 
                            :label="data.isRunning ? 'En ejecución' : 'En pausa'"
                            class="w-56"
                            size="small"
                            :class="data.isRunning ? 'bg-secondary-700 border-secondary-700':'bg-primary-50 border-primary-50 text-gray-700'"
                            :icon="data.isRunning ? 'pause' : 'play'"
                            @click="openDialogExecution(data)"
                        />
                    </template>
                </Column>  
                <!-- <Column field="action" header="Acción" style="min-width: 162px;" class="text-left">
                    <template #body="{ data }">
                        <XButton 
                            label="Ver historial"
                            @click="navigateToHistoryProcess(data)"
                        />
                    </template>
                </Column>  -->
            </DataTable>
        </div>
        <XConfirmDialog
            v-model="confirmDialogReasonProcesses.visible"
            icon="x:warning-circle"
            icon-color="text-yellow-500"
            :title="confirmDialogReasonProcesses.options.title">
            <template #message>
                <div class="space-y-2">
                    <p>
                        <span class=" text-gray-700">{{ confirmDialogReasonProcesses.options.message }}</span>
                    </p>
                </div>
                <div class="!w-[452px] flex flex-col !items-start !justify-start !text-left pt-16">
                    <XTextarea 
                        v-model="justificationProcesses"
                        name="messageContingency" 
                        rows="2" 
                        class="!w-full !text-left !justify-start !items-start" 
                        placeholder="Ingresa el motivo" 
                        label-required 
                        label="Justificación"
                        :rules="requiredRule"
                    />
                </div>
            </template>
            <template #buttons>
                    <div class="flex gap-3">
                        <XButton label="Cancelar" variant="outlined" @click="handleClose" class="w-65"/>
                        <XButton label="Asignar" @click="handleSendProcess" class="w-65"/>
                    </div>
            </template>  
        </XConfirmDialog>

        <!-- <ConfirmDialogWrapper
            v-model="confirmDialogProcesses.visible"
            :options="confirmDialogProcesses.options"
        /> -->
        <Toast />
    </div>
</template>

<script setup lang="ts">
import { XConfirmDialog } from '#components';
import { useDates } from '~/componsables/useDates';
import type { Processes } from '~/features/processes/type';
import type { ValidationRuleResult } from '~/features/users/options.types';
import type { ServiceError } from '~/features/users/types';
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';
import { proccessServices } from '~/services/processServices';

// Composables
const toast = useToast();
//const router = useRouter();
const { formatDateTimeDirect } = useDates();
// State
const itemsBreadProcesses = getBreadcrumbItems('processes', 'list');

const searchTermProcesses = ref('');
const processes = ref<Processes[]>([]);
const loading = ref(false);
const currentProcessData = ref<Processes | null>(null); 

const requiredRule = (value:unknown):ValidationRuleResult => {
    return value !== null && value !== undefined && value !== '' 
        ? true 
        : 'El campo es requerido'
}

// States form
const justificationProcesses = ref('');

const confirmDialogReasonProcesses = ref({
    visible: false,
    options: {
        title: '',
        message: '',
    }
})

// Cargar procesos
const loadProcess = async (): Promise<void> => {
    loading.value = true
    try {
        const response = await proccessServices.getProcesses()
        if(response){
            processes.value = response.paymentGatewayBackgrounds
            console.log('Procesos Cargados:', processes.value);
        }
        
        
    } catch (error) {
        console.error('Error loading channels:', error)
        const serviceError = error as ServiceError
        console.log('Service Error:', serviceError);
    } finally {
        loading.value = false
    }
}

const filteredProccess = computed(() => {
    if (!processes.value?.length) return [];

    let filtered = processes.value;

    // Filtrar por término de búsqueda global
    if (searchTermProcesses.value.trim()) {
        const search = searchTermProcesses.value.toLowerCase().trim();
        filtered = filtered.filter(process =>
            process.paymentGatewayAcronym?.toLowerCase().includes(search) ||
            process.paymentGatewayBackgroundCode?.toLowerCase().includes(search) ||
            process.lastExecution?.toLowerCase().includes(search) ||
            process.nextExecution?.toLowerCase().includes(search)
        );
    }
    return filtered;
});

//Dialog Change Execution Status
const openDialogExecution = (data: any) => {
    console.log('Data del proceso:', data);
    currentProcessData.value = data;
    const action = data.isRunning ? 'pausar' : 'ejecutar';
    const processName = data.process||'Proceso no encontrado'

    confirmDialogReasonProcesses.value = {
            visible: true, 
            options: {
                title: data.isRunning  ? 'Pausar proceso' : 'Ejecutar proceso',
                message: `¿Estás seguro de ${action} el proceso "${processName}"?`
            }
        };
};

const handleClose = () => { 
    confirmDialogReasonProcesses.value.visible = false;
    justificationProcesses.value = '';
    currentProcessData.value = null;
}

const handleSendProcess = async () => {
    if (!currentProcessData.value) {
        console.error('No hay datos del proceso actual');
        return;
    }
    try {
        loading.value = true;
        
        const codePaymentGatewayBackground = currentProcessData.value.paymentGatewayBackgroundCode;
        
        const processData = {
            changeReason: justificationProcesses.value.trim(),
            isRunning: !currentProcessData.value.isRunning
        };

        console.log('Datos de procesos a enviar:', processData);
        const response = await proccessServices.updateProcess(processData, codePaymentGatewayBackground);
        console.log('Datos de procesos a guardar:', response);

        if (response) {
            toast.add({
                severity: 'success',
                summary: 'Proceso actualizado',
                detail: `El proceso "${currentProcessData.value.paymentGatewayBackgroundCode}" ha sido ${processData.isRunning ? 'ejecutado' : 'pausado'} correctamente`,
                life: 5000
            });
            handleClose();
        }

    } catch (error) {
        console.error('Error al actualizar el proceso:', error);
        const serviceError = error as ServiceError;
        
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: serviceError.message || 'Error al actualizar el estado del proceso',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
}

// const navigateToHistoryProcess = (proccess: Processes) => {
//     router.push(`/admin/monitoring/processes/HistoryProcess/${proccess.paymentGatewayBackgroundCode}`);
// }

// Lifecycle
onMounted(() => {
    loadProcess()
})
</script>