<template>
    <div class="flex flex-col gap-16">
        <XHeader title="Enrutamiento y operabilidad" :breadcrumb-items="itemsBreadContingency" :show-breadcrumb="true">
            <template #description>
                <p>Gestiona el enrutamiento de los canales para garantizar la continuidad operativa y defina contingencias específicas por cada canal o participante.</p>
            </template>
        </XHeader>
        <div class="flex flex-col gap-12">
            <XTabs value="0" class="flex gap-16">
                <XTabList :pt="{
                    root: { class: '!border-b-0 p-tab-extended-line' },
                    tabList: {
                        root: ({ context }) => ({
                            class: [
                                'relative z-10',
                                context.active 
                                    ? 'border-b-[4px] border-primary text-primary' 
                                    : 'border-b-0 text-gray-900'
                            ]
                        }),
                        action: { class: 'pb-4' }
                    }
                }">
                    <XTab value="0">
                        <div class="flex gap-4 items-center">
                            <Icon name="x:bank"/>
                            <span class="font-bold whitespace-nowrap">Participantes</span>
                        </div>
                    </XTab>
                    <XTab value="1">
                        <div class="flex gap-4 items-center">
                            <Icon name="x:transfer"/>
                            <span class="font-bold whitespace-nowrap">Canales</span>
                        </div>
                    </XTab>
                </XTabList>
                <XTabPanels class="!p-0">
                    <XTabPanel value="0">
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
                                        v-model="searchTermContingency"
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
                                    @click="handleChannelChange('channel')"
                                />
                                <XButton 
                                    label="Configurar operabilidad" 
                                    :disabled="selectedBanks.length === 0"
                                    class="!w-[200px]"
                                    @click="handleChannelChange('contingency')"
                                />
                            </div>
                        </div>

                        <DataTable 
                            :value="paginatedContingency" 
                            :loading="loading"
                            dataKey="participantCode"
                            @page="onPageChange"
                        >
                            <Column :showFilterMenu="false" class="items-start" >
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
                        
                            <Column field="participantName" header="Entidad bancaria" sortable :showFilterMenu="false">
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

                            <Column field="transaccPaymentGateway" header="Envío de Transferencias Interbancarias Regular" :showFilterMenu="false" class="text-left">
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
                        
                            <Column field="qrPaymentGateway"  header="Envío de Transferencias QR" :showFilterMenu="false" class="text-left">
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
                        
                            <Column  field="retransacPaymentGateway" header="Recepción Transferencia Interbancaria Regular" :showFilterMenu="false" class="text-left">
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
                        
                            <Column field="reqrPaymentGateway" header="Recepción de Transferencias QR" :showFilterMenu="false" class="text-left">
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
                                v-if="filteredContingency.length > 0"
                                v-model:first="paginationContingencyFirst"
                                v-model:rows="paginationContingencyRows"
                                :totalRecords="filteredContingency.length"
                                :rowsPerPageOptions="[10, 25, 50, 100]"
                                template="RowsPerPageDropdown  FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                            >
                                <template #start="slotProps">
                                    Página: {{ slotProps.state.page + 1 }}, Filas: 
                                </template>
                            </Paginator>
                        </div>
                        </div>
                        
                    </XTabPanel>
                    <XTabPanel value="1">
                        <div class="flex flex-col gap-12"> 
                            <div class="flex flex-row justify-between">
                                <div class="self-center">
                                    <XIconField>
                                        <InputText 
                                            v-model="searchTermGatewayContingency"
                                            placeholder="Buscar" 
                                            class="!w-[250px]"
                                        />
                                        <XInputIcon icon="search" @click="handleSearch" />
                                    </XIconField>
                                </div>
                                <div class="self-center flex gap-8">
                                    <XButton 
                                        label="Configurar contingencia" 
                                        @click="openModalChannel()"
                                        :disabled="selectedPaymentsGateway.length === 0"
                                    />
                                </div>
                            </div>

                            <DataTable 
                                :value="filteredContingencyGateway" 
                                :loading="loading"
                                dataKey="chachannelAcronymnnelCode"
                            >
                            <Column class="min-w-[75px] items-start" >
                                <template #body="{ data }">
                                    <XRadioButton 
                                        :modelValue="selectedPaymentsGateway.includes(data.code)"
                                        @update:modelValue="togglePaymentGatewaySelection(data.code)"
                                        :binary="true"
                                    />
                                </template>
                            </Column> 

                            <Column field="channelAcronym" header="Canal" :showFilterMenu="false" class="min-w-[209px]" >
                                <template #body="{ data }">
                                    {{ data.acronym }}
                                </template>
                            </Column>
                            <Column field="channelName" header="Descripción Canal" :showFilterMenu="false" class="min-w-[209px]" >
                                <template #body="{ data }">
                                    {{ data.name }}
                                </template>
                            </Column>
                            <Column field="channelOperation" header="Operacional" class="min-w-[209px]" >
                                <template #body="{ data }">
                                    <Tag 
                                        :value="data.isOperational ? 'Operativo' : 'En Contingencia'" 
                                        :severity="data.isOperational ? 'success' : 'danger'"
                                    />
                                </template>
                            </Column>
                            </DataTable>
                        </div>
                    </XTabPanel>
                </XTabPanels>
            </XTabs>
        </div>
        <ConfirmDialogWrapper
            v-model="confirmDialogChange.visible"
            :options="confirmDialogChange.options"
        />

        <ConfirmDialogWrapper
            v-model="confirmDialogChangeModify.visible"
            :options="confirmDialogChangeModify.options"
        />

        <ChannelContingencyModal
            v-model="modalChannelContingency.modalChannelContingency" 
            :paymentGatewayData="modalChannelContingency.paymentGatewayData"
            @successToast="handleToastSuccess"
            @errorToast="handleToastError"
        />

        <Toast position="top-right">
            <template #message="{ message }">
                <Icon 
                    :name="message.severity === 'success' ? 'x:check-circle' : 'x:alert-circle'" 
                    class="p-toast-message-icon"
                />
                <div class="p-toast-message-text">
                    <span class="p-toast-summary">{{ message.summary }}</span>
                    <span class="p-toast-detail">{{ message.detail }}</span>
                </div>
            </template>
        </Toast>
    </div>
</template>

<script setup lang="ts">
import type { DataTablePageEvent } from 'primevue';
import ConfirmDialogWrapper from '~/components/overlay/ConfirmDialogWrapper.vue';
import ChannelContingencyModal from '~/features/contingency/ChannelContingencyModal.vue';
import type { ContingencyTableRow, EnhancedTransactionStatus, Participant, PaymentGateway, Transaction } from '~/features/contingency/type';
import type { ServiceError } from '~/features/users/types';
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';
import { contingencyService } from '~/services/contingencySevice';

///PARA CONTINGENCIA DE PARTICIPANTES
// Composables 
const toast = useToast()
const router = useRouter();

// State
const contingencyData = ref<Participant[]>([]);
const selectedBanks = ref<string[]>([]);
const loading = ref(false);
const searchTermContingency = ref('');
const paginationContingencyFirst = ref(0);
const paginationContingencyRows = ref(10);

const itemsBreadContingency = getBreadcrumbItems('contingency', 'list');

const confirmDialogChange = ref({
    visible: false,
    options: {
        title: '',
        message: '',
        icon: 'x:warning-circle',
        iconColor: 'text-yellow-500',
        confirmLabel: 'Guardar',
        cancelLabel: 'Cancelar',
        onConfirm: async () => {},
        onCancel: () => {}
    }
})

const confirmDialogChangeModify = ref({
    visible: false,
    options: {
        title: '',
        message: '',
        icon: 'x:warning-circle',
        iconColor: 'text-yellow-500',
        confirmLabel: 'Aceptar',
        onConfirm: () => {}
    }
})

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

const loadContingency = async (): Promise<void> => {
    loading.value = true;
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
    } finally {
        loading.value = false;
    }
}

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

const transformedContingency = computed(() => {
    return transformChannelContingencyData(contingencyData.value);
});

const filteredContingency = computed(() => {
    if (!transformedContingency.value.length) return [];
    
    let filtered = transformedContingency.value;

    // Filtrar por término de búsqueda
    if (searchTermContingency.value.trim()) {
        const search = searchTermContingency.value.toLowerCase().trim();
        filtered = filtered.filter(bank => 
            bank.participantName.toLowerCase().includes(search) 
        );
    }
    
    return filtered;
});
// Computed para paginación
const paginatedContingency = computed(() => {
    const start = paginationContingencyFirst.value;
    const end = start + paginationContingencyRows.value;
    return filteredContingency.value.slice(start, end);
});

// Manejo de paginación
const onPageChange = (event: DataTablePageEvent) => {
    paginationContingencyFirst.value = event.first;
    paginationContingencyRows.value = event.rows;
}

// Computed para manejar selección de checkboxes
const isAllSelected = computed(() => {
    if (paginatedContingency.value.length === 0) return false;
    return paginatedContingency.value.every(bank => selectedBanks.value.includes(bank.participantCode));
});

const isIndeterminate = computed(() => {
    const selectedFromCurrentPage = paginatedContingency.value.filter(bank => 
        selectedBanks.value.includes(bank.participantCode)
    ).length;
    return selectedFromCurrentPage > 0 && selectedFromCurrentPage < paginatedContingency.value.length;
});

const canChangePaymentGatewayForAllSelected = () => {
    return selectedBanks.value.every(participantCode => {
        const participant = paginatedContingency.value.find(p => p.participantCode === participantCode);
        console.log('Participante:', participant?.participantName, ' - Puede cambiar:', participant?.canChangePaymentGateway);
        return participant?.canChangePaymentGateway;
    });
};

// Methods para manejar selección
const toggleBankSelection = (participantCode: string) => {
    const index = selectedBanks.value.indexOf(participantCode);
    if (index > -1) {
        selectedBanks.value.splice(index, 1);
        console.log('Banco deseleccionado:', participantCode);
    } else {
        

        const participantToAdd = paginatedContingency.value.find(p => p.participantCode === participantCode)
        
        if(participantToAdd && !participantToAdd.canChangePaymentGateway){
            console.log('ADVERTENCIA: ', participantToAdd.participantName, 
                        ' no permite cambio de canal de pago - No se agregará a la selección');
        }

        selectedBanks.value.push(participantCode);
        console.log('Banco seleccionado:', participantCode);
    }
    if(selectedBanks.value.length > 0){
        const allCanChange = canChangePaymentGatewayForAllSelected();
        if(allCanChange){
            console.log('Todos los seleccionados permiten cambio:', selectedBanks.value);
        }
    }
};

const toggleSelectAll = (value: boolean) => {
    if (value) {
        // Seleccionar todos los de la página actual
        paginatedContingency.value.forEach(bank => {
            if (!selectedBanks.value.includes(bank.participantCode)) {
                selectedBanks.value.push(bank.participantCode);
            }
        });
    } else {
        // Deseleccionar todos los de la página actual
        paginatedContingency.value.forEach(bank => {
            const index = selectedBanks.value.indexOf(bank.participantCode);
            if (index > -1) {
                selectedBanks.value.splice(index, 1);
            }
        });
    }
    console.log('Bancos seleccionados Todos:', selectedBanks.value);
};


// Methods
const handleSearch = () => {
    paginationContingencyFirst.value = 0;
}

const handleChannelChange = (type: 'channel' | 'contingency') => {
    console.log('Iniciando handleChannelChange');
    
    // 1. Filtrar SOLO los bancos que permiten cambio
    const validSelectedBanks = transformedContingency.value
        .filter(bank => 
            selectedBanks.value.includes(bank.participantCode) && 
            bank.canChangePaymentGateway
        )
        .map(bank => ({ code: bank.participantCode, name: bank.participantName }));

    // 2. Identificar bancos que NO permiten cambio (solo para mostrar en el mensaje)
    const invalidBanks = transformedContingency.value
        .filter(bank => 
            selectedBanks.value.includes(bank.participantCode) && 
            !bank.canChangePaymentGateway
        )
        .map(bank => bank.participantName);

    console.log('Bancos válidos seleccionados: ', validSelectedBanks);
    console.log('Bancos no válidos (excluidos): ', invalidBanks);

    const navigateWithValidBanks = () => {
        if (validSelectedBanks.length === 1) {
            // Un solo banco válido
            router.push({
                path: `/admin/configuration/contingency/ChannelContingency/${validSelectedBanks[0].code}`,
                query: { 
                    type,
                    bankName: validSelectedBanks[0].name,
                    participantCode: validSelectedBanks[0].code
                }
            });
        } else {
            // Múltiples bancos válidos
            router.push({
                path: '/admin/configuration/contingency/ChannelContingency/multiple',
                query: { 
                    type,
                    codes: validSelectedBanks.map(b => b.code).join(','),
                    bankNames: validSelectedBanks.map(b => b.name.trim()).join(', '),
                    excludedBanks: invalidBanks.join(', ') // Solo para información
                }
            });
        }
    };

    if (validSelectedBanks.length === 0 && invalidBanks.length > 0) {
        console.log('Escenario 1: Solo bancos inválidos');
        const actionType = type === 'channel' ? 'realizará el cambio' : 'aplicará la configuración';
        
        confirmDialogChange.value = {
            visible: true,
            options: {
                title: type === 'channel' ? 'Cambiar de canal' : 'Configurar contingencia',
                icon: 'x:warning-circle',
                iconColor: 'text-yellow-500',
                severity: 'warning',
                message: invalidBanks.length === 1 
                    ? `No se ${actionType} al participante <span class="font-semibold">${invalidBanks[0]}</span>, ya que no dispone de un canal alterno.`
                    : `No se ${actionType} a los siguientes participantes, ya que no disponen de un canal alterno:<br>
                        <ul class="list-disc pl-5 mt-2">
                            ${invalidBanks.map(bank => `<li class="font-semibold">${bank}</li>`).join('')}
                        </ul>`,
                confirmLabel: 'Aceptar',
                showCancelButton: false, // Solo un botón
                onConfirm: () => {
                    console.log('Usuario cerró el diálogo informativo');
                }
            }
        };
    }
    else if (validSelectedBanks.length > 0 && invalidBanks.length > 0) {
        console.log('Escenario 2: Bancos válidos e inválidos mezclados');
        const actionType = type === 'channel' ? 'realizará el cambio de' : 'aplicará la configuración a';
        
        confirmDialogChange.value = {
            visible: true,
            options: {
                title: type === 'channel' ? 'Cambiar de canal' : 'Establecer contingencia',
                icon: 'x:warning-circle',
                iconColor: 'text-yellow-500',
                severity: 'warning',
                confirmLabel: 'Continuar',
                cancelLabel: 'Cancelar',
                showCancelButton: true, // Dos botones para confirmación
                message: `No se ${actionType} los siguientes participantes, ya que no disponen de un canal alterno:<br>
                            <ul class="mt-2 list-disc list-inside">
                                ${invalidBanks.map(bank => `<li class="font-semibold"> ${bank}</li>`).join('')}
                            </ul>
                            <p class="mt-3">¿Estás seguro de continuar?</p>`,
                onConfirm: () => {
                    navigateWithValidBanks();
                },
                onCancel: () => {
                    console.log('Usuario canceló la acción');
                }
            }
        };
    }
    else if (validSelectedBanks.length > 0 && invalidBanks.length === 0) {
        console.log('Escenario 3: Solo bancos válidos, navegando directamente');
        navigateWithValidBanks();
    }
    // ESCENARIO 4: No hay bancos seleccionados (no debería pasar, pero por seguridad)
    else {
        console.log('Escenario 4: Sin bancos seleccionados');
        // Opcional: mostrar mensaje de error o no hacer nada
    }
};

///PARA CONTINGENCIA DE CANALES
const contingencyChannelData = ref<any[]>([]);
const selectedPaymentsGateway = ref('' as string);
const searchTermGatewayContingency = ref('');

const modalChannelContingency = ref<{
    modalChannelContingency: boolean,
    paymentGatewayData?: any,
}>({
    modalChannelContingency: false,
    paymentGatewayData: undefined
})

const filteredContingencyGateway = computed(() => {
    if (!contingencyChannelData.value?.length) return [];

    let filtered = contingencyChannelData.value;

    // Filtrar por término de búsqueda global
    if (searchTermGatewayContingency.value.trim()) {
        const search = searchTermGatewayContingency.value.toLowerCase().trim();
        filtered = filtered.filter(channel =>
            channel.acronym?.toLowerCase().includes(search) ||
            channel.name?.toLowerCase().includes(search) ||
            (channel.isOperational ? 'sin contingencia' : 'con contingencia')
                .toLowerCase()
                .includes(search)
        );
    }

    return filtered;
});

const loadChannels = async (): Promise<void> => {
    loading.value = true;
    try {
        const response = await contingencyService.getPaymentGatewayRoutes();
        contingencyChannelData.value = response.paymentGatewayOperationalRouteMaps;
    } catch (error) {
        console.error('Error loading contingency:', error);
        const serviceError = error as ServiceError;

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: serviceError.message || 'Error al cargar los bancos',
            life: 5000
        });
    } finally {
        loading.value = false;
    }
}

const togglePaymentGatewaySelection = (paymentGatewayCode: string) => {
    if(selectedPaymentsGateway.value === paymentGatewayCode){
        selectedPaymentsGateway.value = null;
        console.log('Canal deseleccionado:', paymentGatewayCode);
    }else{
        selectedPaymentsGateway.value = paymentGatewayCode;
        console.log('Canal seleccionado:', paymentGatewayCode);
    }
};

const openModalChannel = ()=>{
    const validSelected = contingencyChannelData.value
        .filter(channel => 
            selectedPaymentsGateway.value.includes(channel.code)
        )
        .map(channel => ({ code: channel.code, isOper: channel.isOperational, acronym: channel.acronym }));

    console.log('Canal(es) seleccionado(s) para contingencia:', validSelected);
    modalChannelContingency.value = {
        modalChannelContingency: true,
        paymentGatewayData:{
            paymentGatewayCodes: validSelected[0].code,
            paymentGatewayIsOperational: validSelected[0].isOper,
            paymentGatewayAcronym: validSelected[0].acronym
        }
    }
}

// Funciones para manejar los toasts
const handleToastSuccess = (message: { summary: string, detail: string }) => {
    toast.add({
        severity: 'success',
        summary: message.summary,
        detail: message.detail,
        life: 5000
    })
    // Recargar los datos después de una operación exitosa
    loadChannels()
}

const handleToastError = (message: { summary: string, detail: string }) => {
    toast.add({
        severity: 'error',
        summary: message.summary,
        detail: message.detail,
        life: 5000
    })
}

watch([searchTermContingency], () => {
    paginationContingencyFirst.value = 0;
});

// Cargar datos al montar el componente
onMounted(() => {
    loadContingency();
    loadChannels();
});

</script>

<!-- <template>
    <div class="flex flex-col gap-16">
        <XHeader title="Enrutamiento y operabilidad" :breadcrumb-items="itemsBreadContingency" :show-breadcrumb="true" :show-back="true">
            <template #description>
                <p>Gestiona el enrutamiento de los canales para garantizar la continuidad operativa y defina contingencias específicas por cada canal o participante.</p>
            </template>
        </XHeader>
        <div class="flex flex-col gap-12">
            <XTabs value="0" class="flex gap-16">
                <XTabList :pt="{
                    root: { class: '!border-b-0 p-tab-extended-line' },
                    tabList: {
                        root: ({ context }) => ({
                            class: [
                                'relative z-10',
                                context.active 
                                    ? 'border-b-[4px] border-primary text-primary' 
                                    : 'border-b-0 text-gray-900'
                            ]
                        }),
                        action: { class: 'pb-4' }
                    }
                }">
                    <XTab value="0">
                        <div class="flex gap-4 items-center">
                            <Icon name="x:bank"/>
                            <span class="font-bold whitespace-nowrap">Participantes</span>
                        </div>
                    </XTab>
                    <XTab value="1">
                        <div class="flex gap-4 items-center">
                            <Icon name="x:transfer"/>
                            <span class="font-bold whitespace-nowrap">Canales</span>
                        </div>
                    </XTab>
                </XTabList>
                <XTabPanels class="!p-0">
                    <XTabPanel value="0">
                        <ParticipantsTab />
                    </XTabPanel>
                    <XTabPanel value="1">
                        <ChannelsTab />
                    </XTabPanel>
                </XTabPanels>
            </XTabs>
        </div>

        <Toast position="top-right">
            <template #message="{ message }">
                <Icon 
                    :name="message.severity === 'success' ? 'x:check-circle' : 'x:alert-circle'" 
                    class="p-toast-message-icon"
                />
                <div class="p-toast-message-text">
                    <span class="p-toast-summary">{{ message.summary }}</span>
                    <span class="p-toast-detail">{{ message.detail }}</span>
                </div>
            </template>
        </Toast>
    </div>
</template>

<script setup lang="ts">
import ChannelsTab from '~/components/contingency/ChannelsTab.vue';
import ParticipantsTab from '~/components/contingency/ParticipantsTab.vue';
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';

const itemsBreadContingency = getBreadcrumbItems('contingency', 'list');
</script> -->