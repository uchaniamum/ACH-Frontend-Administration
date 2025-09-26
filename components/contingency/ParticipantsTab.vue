<template>
    <div class="flex flex-col gap-12">
        <div class="flex justify-end gap-8">
            <span class="text-gray-700">Definiciones:  </span>
            <div class="flex items-center gap-4">
                <span class="relative inline-flex">
                    <span class="relative inline-flex h-8 w-8 p-[1.33px] items-center justify-center rounded-full border border-green-500 bg-white shadow-[0.667px_0.667px_2.667px_0_#9CDB7D]">
                        <span class="h-4 w-4 p-[2.67px] rounded-full bg-green-500 ring-2 ring-white"></span>
                    </span>
                </span>
                <span class="text-gray-700">Operativo </span>
            </div> 
            <div class="flex items-center gap-4">
                <span class="relative inline-flex">
                    <span class="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-500 bg-white shadow-[0.667px_0.667px_2.667px_0_#F1594E]">
                        <span class="h-4 w-4 rounded-full bg-red-500 ring-2 ring-white"></span>
                    </span>
                </span>
                <span class="text-gray-700">En contingencia </span>
            </div> 
        </div>

        <div class="flex flex-row justify-between">
            <div class="self-center">
                <XIconField>
                    <InputText 
                        v-model="searchTerm"
                        placeholder="Buscar" 
                        class="!w-[250px]"
                    />
                    <XInputIcon icon="search" @click="handleSearch" />
                </XIconField>
            </div>
            <div class="self-center flex gap-8">
                <XButton 
                    label="Cambiar de canal" 
                    :disabled="selectedBanks.length === 0"
                    variant="outlined"
                    class="!w-[150px]"
                    @click="$emit('channelChange', 'channel')"
                />
                <XButton 
                    label="Configurar operabilidad" 
                    :disabled="selectedBanks.length === 0"
                    class="!w-[200px]"
                    @click="$emit('channelChange', 'contingency')"
                />
            </div>
        </div>

        <DataTable 
            :value="paginatedData" 
            :loading="loading"
            dataKey="participantCode"
            @page="onPageChange"
        >
            <!-- Columna de Checkbox --> 
            <Column :showFilterMenu="false" class="min-w-[75px] items-start" >
                <template #header>
                    <XCheckBox 
                        :modelValue="isAllSelected"
                        @update:modelValue="toggleSelectAll"
                        :indeterminate="isIndeterminate"
                        :binary="true"
                    />
                </template>
                <template #body="{ data }">
                    <XCheckBox 
                        :modelValue="selectedBanks.includes(data.participantCode)"
                        @update:modelValue="toggleBankSelection(data.participantCode)"
                        :binary="true"
                    />
                </template>
            </Column>
        
            <!-- Columna de Entidad bancaria -->
            <Column field="participantName" header="Entidad bancaria" sortable :showFilterMenu="false" class="min-w-[209px]" >
                <template #body="{ data }">
                    {{ data.participantName }}
                </template>
                <template #filter="{ filterModel, filterCallback }">
                    <IconField>
                        <InputText 
                            v-model="filterModel.value"  
                            type="text" 
                            @input="filterCallback()" 
                            class="!w-47" 
                            placeholder="Buscar"
                        />
                        <XInputIcon icon="search" />
                    </IconField>
                </template>
            </Column>

            <!-- Envío de Transferencias Interbancarias Regular -->
            <Column field="transaccPaymentGateway" header="Envío de Transferencias Interbancarias Regular" :showFilterMenu="false" class="min-w-[209px] text-left">
                <template #body="{ data }">
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center gap-4">
                            <span class="relative inline-flex">
                                <span :class="getStatusClasses(data.recepcionRegular.statusType).containerClass">
                                    <span :class="getStatusClasses(data.recepcionRegular.statusType).dotClass"></span>
                                </span>
                            </span>
                            <div v-if="data.recepcionRegular.showSecondary">
                                <div class="flex flex-row gap-3">
                                    <span class="text-sm font-medium text-gray-400">{{ data.recepcionRegular.primaryGateway }}</span>
                                    <Icon name="x:thik-nav-arrow-right" class="text-[8px] font-semibold mt-2"></Icon> 
                                    <span class="text-sm font-semibold text-gray-700">{{ data.recepcionRegular.secondaryGateway }}</span>
                                </div>
                                    <span :class="getStatusClasses(data.recepcionRegular.statusType).textClass">
                                    {{ data.recepcionRegular.statusLabel }}
                                </span>
                            </div>
                            <div v-else class="flex flex-col">
                                <span class="text-sm font-semibold">{{ data.recepcionRegular.activeGateway }} </span>
                                <span :class="getStatusClasses(data.recepcionRegular.statusType).textClass">
                                    {{ data.recepcionRegular.statusLabel }}
                                </span>
                            </div>
                        </div>
                    </div>
                </template>
            </Column>
        
            <!-- Envío de Transferencias QR -->
            <Column field="qrPaymentGateway"  header="Envío de Transferencias QR" :showFilterMenu="false" class="min-w-[209px] text-left">
                <template #body="{ data }">
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center gap-4">
                            <span class="relative inline-flex">
                                <span :class="getStatusClasses(data.recepcionQR.statusType).containerClass">
                                    <span :class="getStatusClasses(data.recepcionQR.statusType).dotClass"></span>
                                </span>
                            </span>
                            <div v-if="data.recepcionQR.showSecondary">
                                <div class="flex flex-row gap-3">
                                    <span class="text-sm font-medium text-gray-400">{{ data.recepcionQR.primaryGateway }}</span>
                                    <Icon name="x:thik-nav-arrow-right" class="text-[8px] font-semibold mt-2"></Icon> 
                                    <span class="text-sm font-semibold text-gray-700">{{ data.recepcionQR.secondaryGateway }}</span>
                                </div>
                                    <span :class="getStatusClasses(data.recepcionQR.statusType).textClass">
                                    {{ data.recepcionQR.statusLabel }}
                                </span>
                                    <br>
                            </div>
                            <div v-else class="flex flex-col">
                                <span class="text-sm font-medium">{{ data.recepcionQR.activeGateway }} </span>
                                <span :class="getStatusClasses(data.recepcionQR.statusType).textClass">
                                    {{ data.recepcionQR.statusLabel }}
                                </span>
                            </div>
                        </div>
                    </div>
                </template>
            </Column>
        
            <!-- Recepción Transferencia Interbancaria Regular -->
            <Column  field="retransacPaymentGateway" header="Recepción Transferencia Interbancaria Regular" :showFilterMenu="false" class="min-w-[209px] text-left">
                <template #body="{ data }">
                    <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3">
                <span class="relative inline-flex">
                    <span :class="getStatusClasses(data.envioRegular.statusType).containerClass">
                        <span :class="getStatusClasses(data.envioRegular.statusType).dotClass"></span>
                    </span>
                </span>
                <div v-if="data.envioRegular.showSecondary">
                    <div class="flex flex-row gap-4 ">
                        <span class="text-sm font-medium mt-2 text-gray-400">{{ data.envioRegular.primaryGateway }}</span>
                        <Icon name="x:arrow-right" class="text-sm mt-2"></Icon> 
                        <Tag severity="warn" class="text-sm font-medium">{{ data.envioRegular.secondaryGateway }}</Tag>
                    </div>
                        <span :class="getStatusClasses(data.envioRegular.statusType).textClass">
                        {{ data.envioRegular.statusLabel }}
                    </span>
                        <br>
                </div>
                <div v-else class="flex flex-col">
                    <span class="text-sm font-medium">{{ data.envioRegular.activeGateway }} </span>
                    <span :class="getStatusClasses(data.envioRegular.statusType).textClass">
                        {{ data.envioRegular.statusLabel }}
                    </span>
                </div>
            </div>
                    </div>
                </template>
            </Column>
        
            <!-- Recepción de Transferencias QR -->
            <Column field="reqrPaymentGateway" header="Recepción de Transferencias QR" :showFilterMenu="false" class="min-w-[209px] text-left">
                <template #body="{ data }">
                    <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3">
                <span class="relative inline-flex">
                    <span :class="getStatusClasses(data.envioQR.statusType).containerClass">
                        <span :class="getStatusClasses(data.envioQR.statusType).dotClass"></span>
                    </span>
                </span>
                <div v-if="data.envioQR.showSecondary">
                    <div class="flex flex-row gap-4 ">
                        <span class="text-sm font-medium mt-2 text-gray-400">{{ data.envioQR.primaryGateway }}</span>
                        <Icon name="x:arrow-right" class="text-sm mt-2"></Icon> 
                        <Tag severity="warn" class="text-sm font-medium">{{ data.envioQR.secondaryGateway }}</Tag>
                    </div>
                        <span :class="getStatusClasses(data.envioQR.statusType).textClass">
                        {{ data.envioQR.statusLabel }}
                    </span>
                        <br>
                </div>
                <div v-else class="flex flex-col">
                    <span class="text-sm font-medium">{{ data.envioQR.activeGateway }} </span>
                    <span :class="getStatusClasses(data.envioQR.statusType).textClass">
                        {{ data.envioQR.statusLabel }}
                    </span>
                </div>
            </div>
                    </div>
                </template>
            </Column>
            
        </DataTable>
        <div class="flex justify-center">
            <Paginator 
                v-if="filteredData.length > 0"
                v-model:first="paginationFirst"
                v-model:rows="paginationRows"
                :totalRecords="filteredData.length"
                :rowsPerPageOptions="[10, 25, 50, 100]"
                template="RowsPerPageDropdown  FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            >
                <template #start="slotProps">
                    Página: {{ slotProps.state.page + 1 }}, Filas: 
                </template>
            </Paginator>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { DataTablePageEvent } from 'primevue';
import type { ContingencyTableRow, EnhancedTransactionStatus, Participant, PaymentGateway, Transaction } from '~/features/contingency/type';
import type { ServiceError } from '~/features/users/types';
import { contingencyService } from '~/services/contingencySevice';

// Props
interface Props {
    loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false
});

// Emits
const emit = defineEmits<{
    channelChange: [type: 'channel' | 'contingency'];
}>();

// Composables 
const toast = useToast();

// State
const contingencyData = ref<Participant[]>([]);
const selectedBanks = ref<string[]>([]);
const searchTerm = ref('');
const paginationFirst = ref(0);
const paginationRows = ref(10);

// Método para obtener las clases CSS según el tipo de estado
const getStatusClasses = (statusType: string) => {
    switch (statusType) {
        case 'operational':
            return {
                containerClass: 'relative inline-flex h-6 w-6 items-center justify-center rounded-full border border-green-500 bg-white shadow-[0.667px_0.667px_2.667px_0_#9CDB7D]',
                dotClass: 'h-4 w-4 rounded-full ring-1 ring-white bg-green-500',
                textClass: 'text-xs text-gray-600'
            };
        case 'contingency':
            return {
                containerClass: 'relative inline-flex h-6 w-6 items-center justify-center rounded-full border border-red-500 bg-white shadow-[0.667px_0.667px_2.667px_0_#FCD34D]',
                dotClass: 'h-4 w-4 rounded-full ring-1 ring-white bg-red-500',
                textClass: 'text-xs text-gray-600'
            };
        case 'offline-primary':
            return {
                containerClass: 'relative inline-flex h-6 w-6 items-center justify-center rounded-full border border-green-500 bg-white shadow-[0.667px_0.667px_2.667px_0_#9CDB7D]',
                dotClass: 'h-4 w-4 rounded-full ring-1 ring-white bg-green-500',
                textClass: 'text-xs text-gray-600'
            };
        default:
            return {
                containerClass: 'relative inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-400 bg-white shadow-[0.667px_0.667px_2.667px_0_#9CA3AF]',
                dotClass: 'h-4 w-4 rounded-full ring-1 ring-white bg-gray-400',
                textClass: 'text-xs text-gray-600'
            };
    }
};

const loadData = async (): Promise<void> => {
    try {
        const response = await contingencyService.getBanks();
        contingencyData.value = response.participants;
    } catch (error) {
        console.error('Error loading contingency:', error);
        const serviceError = error as ServiceError;

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: serviceError.message || 'Error al cargar los bancos',
            life: 5000
        });
    }
};

const getEnhancedTransactionStatus = (transaction: Transaction | undefined): EnhancedTransactionStatus => {
    if (!transaction) {
        return {
            mainGateway: 'N/A',
            activeGateway: 'N/A',
            primaryGateway: 'N/A',
            secondaryGateway: 'N/A',
            contingencyEnabled: false,
            canChangeChannel: false,
            isOperational: false,
            statusType: 'unavailable',
            statusLabel: 'No disponible',
            showSecondary: false
        }
    }

    const canChangeChannel = !transaction.IsInbound;
    let activeGateway: PaymentGateway | undefined;
    let primaryGateway: PaymentGateway | undefined;
    let secondaryGateway: PaymentGateway | undefined;
    let statusType: 'operational' | 'contingency' | 'offline-primary' | 'unavailable' = 'unavailable';
    let statusLabel = '';
    let showSecondary = false;

    if (transaction.paymentGateways && transaction.paymentGateways.length > 0) {
        // Identificar gateway primario y secundario
        primaryGateway = transaction.paymentGateways.find(gw => gw.isPrimary);
        secondaryGateway = transaction.paymentGateways.find(gw => !gw.isPrimary);
        
        // Determinar qué gateway está activo actualmente
        if (transaction.isPaymentGatewayChanged && secondaryGateway && secondaryGateway.isOperational) {
            // Si hay cambio de gateway y el secundario está operativo
            activeGateway = secondaryGateway;
            statusType = transaction.isInContigency ? 'contingency' : 'operational';
            statusLabel = 'Canal alterno en uso';
            showSecondary = true;
        } else if (primaryGateway) {
            statusType = transaction.isInContigency ? 'contingency' : 'operational';
            statusLabel = transaction.isInContigency ? 'Canal principal' : 'Canal principal';
            activeGateway = primaryGateway;
        }
    }

    return {
        mainGateway: activeGateway?.paymentGatewayAcronym || 'N/A',
        activeGateway: activeGateway?.paymentGatewayAcronym || 'N/A',
        primaryGateway: primaryGateway?.paymentGatewayAcronym || 'N/A',
        secondaryGateway: secondaryGateway?.paymentGatewayAcronym,
        contingencyEnabled: transaction.isInContigency || false,
        canChangeChannel,
        isOperational: activeGateway?.isOperational || false,
        statusType,
        statusLabel,
        showSecondary
    };
}

const transformChannelContingencyData = (participants: Participant[]): ContingencyTableRow[] => {
    return participants.map(participant => {
        const transactionMap = new Map<string, Transaction>();
        
        if (participant.transactions) {
            participant.transactions.forEach(transaction => {
                transactionMap.set(transaction.transactionCode, transaction);
            });
        }

        // Obtener el estado mejorado de cada tipo de transacción
        const envioRegular = getEnhancedTransactionStatus(transactionMap.get('IASYNC'));
        const envioQR = getEnhancedTransactionStatus(transactionMap.get('IQR'));
        const recepcionRegular = getEnhancedTransactionStatus(transactionMap.get('OASYNC'));
        const recepcionQR = getEnhancedTransactionStatus(transactionMap.get('OQR'));

        return {
            participantCode: participant.participantCode,
            participantName: participant.participantName,
            canChangePaymentGateway: participant.canChangePaymentGateway || false,
            canManageContingency: participant.canManageContingency || false,
            envioRegular,
            envioQR,
            recepcionRegular,
            recepcionQR
        };
    });
}

const transformedData = computed(() => {
    return transformChannelContingencyData(contingencyData.value);
});

const filteredData = computed(() => {
    if (!transformedData.value.length) return [];
    
    let filtered = transformedData.value;

    // Filtrar por término de búsqueda
    if (searchTerm.value.trim()) {
        const search = searchTerm.value.toLowerCase().trim();
        filtered = filtered.filter(bank => 
            bank.participantName.toLowerCase().includes(search) 
        );
    }
    
    return filtered;
});

// Computed para paginación
const paginatedData = computed(() => {
    const start = paginationFirst.value;
    const end = start + paginationRows.value;
    return filteredData.value.slice(start, end);
});

// Manejo de paginación
const onPageChange = (event: DataTablePageEvent) => {
    paginationFirst.value = event.first;
    paginationRows.value = event.rows;
}

// Computed para manejar selección de checkboxes
const isAllSelected = computed(() => {
    if (paginatedData.value.length === 0) return false;
    return paginatedData.value.every(bank => selectedBanks.value.includes(bank.participantCode));
});

const isIndeterminate = computed(() => {
    const selectedFromCurrentPage = paginatedData.value.filter(bank => 
        selectedBanks.value.includes(bank.participantCode)
    ).length;
    return selectedFromCurrentPage > 0 && selectedFromCurrentPage < paginatedData.value.length;
});

// Methods para manejar selección
const toggleBankSelection = (participantCode: string) => {
    const index = selectedBanks.value.indexOf(participantCode);
    if (index > -1) {
        selectedBanks.value.splice(index, 1);
    } else {
        const participantToAdd = paginatedData.value.find(p => p.participantCode === participantCode)
        
        if(participantToAdd && !participantToAdd.canChangePaymentGateway){
            console.log('ADVERTENCIA: ', participantToAdd.participantName, 
                        ' no permite cambio de canal de pago - No se agregará a la selección');
        }

        selectedBanks.value.push(participantCode);
    }
};

const toggleSelectAll = (value: boolean) => {
    if (value) {
        // Seleccionar todos los de la página actual
        paginatedData.value.forEach(bank => {
            if (!selectedBanks.value.includes(bank.participantCode)) {
                selectedBanks.value.push(bank.participantCode);
            }
        });
    } else {
        // Deseleccionar todos los de la página actual
        paginatedData.value.forEach(bank => {
            const index = selectedBanks.value.indexOf(bank.participantCode);
            if (index > -1) {
                selectedBanks.value.splice(index, 1);
            }
        });
    }
};

const handleSearch = () => {
    paginationFirst.value = 0;
}

// Watch para resetear paginación cuando se busca
watch([searchTerm], () => {
    paginationFirst.value = 0;
});

// Exponer datos y métodos necesarios para el componente padre
defineExpose({
    selectedBanks,
    transformedData,
    loadData
});

// Cargar datos al montar el componente
onMounted(() => {
    loadData();
});
</script>