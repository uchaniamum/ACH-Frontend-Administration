<template>
    <div class="flex flex-col gap-16">
        <XHeader title="Gestión de contingencia" :breadcrumb-items="itemsBreadContingency" :show-breadcrumb="true">
            <template #description>
                <p>Administra los canales para garantizar la continuidad de las operaciones y establecer contingencias específicas para cada participante.</p>
            </template>
        </XHeader>
        <div class="flex flex-col gap-12">
            <div class="flex justify-end gap-4">
                Defniciones:  
                    <div class="flex items-center gap-6">
                        <span class="relative inline-flex">
                            <span class="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-green-500 bg-white shadow-[0.667px_0.667px_2.667px_0_#9CDB7D]">
                                <span class="h-5 w-5 rounded-full bg-green-500 ring-2 ring-white"></span>
                            </span>
                        </span>
                        <span class="text-gray-700">Sin contingencia </span>
                    </div> 

                    <div class="flex items-center gap-6">
                        <span class="relative inline-flex">
                            <span class="relative inline-flex h-8 w-8 items-center justify-center rounded-full border border-red-500 bg-white shadow-[0.667px_0.667px_2.667px_0_#F1594E]">
                                <span class="h-5 w-5 rounded-full bg-red-500 ring-2 ring-white"></span>
                            </span>
                        </span>
                        <span class="text-gray-700">Con contingencia </span>
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
                        label="Establecer contingencia" 
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
                <!-- Columna de Checkbox --> 
                <Column :showFilterMenu="false" class="w-[75px]" >
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
                <Column field="participantName" header="Entidad bancaria" sortable :showFilterMenu="false" class="w-[209px]" >
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
                <Column field="transaccPaymentGateway" header="Envío de Transferencias Interbancarias Regular" :showFilterMenu="false" class="w-[209px]">
                    <template #body="{ data }">
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-2">
                                <span class="relative inline-flex">
                                    <span :class="[
                                        'relative inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white',
                                        data.envioRegular.contingencyEnabled 
                                            ? 'border-red-500 shadow-[0.667px_0.667px_2.667px_0_#F1594E]' 
                                            : 'border-green-500 shadow-[0.667px_0.667px_2.667px_0_#9CDB7D]'
                                    ]">
                                        <span :class="[
                                            'h-5 w-5 rounded-full ring-1 ring-white',
                                            data.envioRegular.contingencyEnabled ? 'bg-red-500' : 'bg-green-500'
                                        ]"></span>
                                    </span>
                                </span>
                                <span class="text-sm">{{ data.envioRegular.mainGateway }}</span>
                            </div>
                            <div v-if="data.envioRegular.contingencyEnabled" class="text-xs text-gray-500 ml-8">
                                Canal extraordinario: {{ data.envioRegular.secondaryGateway }}
                            </div>
                        </div>
                    </template>
                </Column>

                <!-- Envío de Transferencias QR -->
                <Column field="qrPaymentGateway"  header="Envío de Transferencias QR" :showFilterMenu="false" class="w-[209px]">
                    <template #body="{ data }">
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-2">
                                <span class="relative inline-flex">
                                    <span :class="[
                                        'relative inline-flex h-6 w-6 items-center justify-center rounded-full border bg-white',
                                        data.envioQR.contingencyEnabled 
                                            ? 'border-red-500 shadow-[0.667px_0.667px_2.667px_0_#F1594E]' 
                                            : 'border-green-500 shadow-[0.667px_0.667px_2.667px_0_#9CDB7D]'
                                    ]">
                                        <span :class="[
                                            'h-4 w-4 rounded-full ring-1 ring-white',
                                            data.envioQR.contingencyEnabled ? 'bg-red-500' : 'bg-green-500'
                                        ]"></span>
                                    </span>
                                </span>
                                <span class="text-sm">{{ data.envioQR.mainGateway }}</span>
                            </div>
                            <div v-if="data.envioQR.contingencyEnabled" class="text-xs text-gray-500 ml-8">
                                Canal extraordinario: {{ data.envioQR.secondaryGateway }}
                            </div>
                        </div>
                    </template>
                </Column>

                <!-- Recepción Transferencia Interbancaria Regular -->
                <Column  field="retransacPaymentGateway" header="Recepción Transferencia Interbancaria Regular" :showFilterMenu="false" class="w-[209px]">
                    <template #body="{ data }">
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-2">
                                <span class="relative inline-flex">
                                    <span :class="[
                                        'relative inline-flex h-6 w-6 items-center justify-center rounded-full border bg-white',
                                        data.recepcionRegular.contingencyEnabled 
                                            ? 'border-red-500 shadow-[0.667px_0.667px_2.667px_0_#F1594E]' 
                                            : 'border-green-500 shadow-[0.667px_0.667px_2.667px_0_#9CDB7D]'
                                    ]">
                                        <span :class="[
                                            'h-4 w-4 rounded-full ring-1 ring-white',
                                            data.recepcionRegular.contingencyEnabled ? 'bg-red-500' : 'bg-green-500'
                                        ]"></span>
                                    </span>
                                </span>
                                <span class="text-sm">{{ data.recepcionRegular.mainGateway }}</span>
                            </div>
                            <div v-if="data.recepcionRegular.contingencyEnabled" class="text-xs text-gray-500 ml-8">
                                Canal extraordinario: {{ data.recepcionRegular.secondaryGateway }}
                            </div>
                        </div>
                    </template>
                </Column>

                <!-- Recepción de Transferencias QR -->
                <Column field="reqrPaymentGateway" header="Recepción de Transferencias QR" :showFilterMenu="false" class="w-[209px]">
                    <template #body="{ data }">
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-2">
                                <span class="relative inline-flex">
                                    <span :class="[
                                        'relative inline-flex h-6 w-6 items-center justify-center rounded-full border bg-white',
                                        data.recepcionQR.contingencyEnabled 
                                            ? 'border-red-500 shadow-[0.667px_0.667px_2.667px_0_#F1594E]' 
                                            : 'border-green-500 shadow-[0.667px_0.667px_2.667px_0_#9CDB7D]'
                                    ]">
                                        <span :class="[
                                            'h-4 w-4 rounded-full ring-1 ring-white',
                                            data.recepcionQR.contingencyEnabled ? 'bg-red-500' : 'bg-green-500'
                                        ]"></span>
                                    </span>
                                </span>
                                <span class="text-sm">{{ data.recepcionQR.mainGateway }}</span>
                            </div>
                            <div v-if="data.recepcionQR.contingencyEnabled" class="text-xs text-gray-500 ml-8">
                                Canal extraordinario: {{ data.recepcionQR.secondaryGateway }}
                            </div>
                        </div>
                    </template>
                </Column>
            </DataTable>

            <Paginator 
                v-if="filteredContingency.length > 0"
                v-model:first="paginationContingencyFirst"
                v-model:rows="paginationContingencyRows"
                :totalRecords="filteredContingency.length"
                :rowsPerPageOptions="[2, 10, 25, 50, 100]"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { ContingencyTableRow, PaymentGatewayBankList } from '~/features/contingency/type';
import { contingencyService } from '~/services/contingencySevice';

// Composables 
const toast = useToast()
const router = useRouter();

// State
const contingencyData = ref<PaymentGatewayBankList>([]);
const selectedBanks = ref<string[]>([]);
const loading = ref(false);
const searchTermContingency = ref('');
const paginationContingencyFirst = ref(0);
const paginationContingencyRows = ref(10);

const itemsBreadContingency = ref([
    { label: 'Inicio' },
    { label: 'Configuración' },
    { label: 'Participantes' },
]);

const transformContingencyData = (banks: PaymentGatewayBankList): ContingencyTableRow[] => {
    return banks.map(bank => {
        const findTransactionByCode = (targetCode: string) => {
            return bank.Transactions.find(transaction => {
                // Extraer solo los números del transactionCode
                const codeMatch = transaction.transactionCode.match(/(\d+)/);
                if (!codeMatch) return false;
                
                const numericCode = codeMatch[1];
                return numericCode === targetCode;
            });
        };

        // Buscar cada tipo de transacción por su código numérico
        const envioRegular = findTransactionByCode('22');
        const envioQR = findTransactionByCode('62');  
        const recepcionRegular = findTransactionByCode('220');
        const recepcionQR = findTransactionByCode('620');

        // Función para calcular contingencia
        const calculateContingency = (transaction: any) => {
            if (!transaction) return false;
            // Una contingencia está activa si el canal principal está deshabilitado O el secundario está habilitado
            return !transaction.mainPaymentGatewayEnabled || transaction.secondaryPaymentGatewayEnabled;
        };

        return {
            participantCode: bank.participantCode,
            participantName: bank.participantName,
            envioRegular: {
                mainGateway: envioRegular?.mainPaymentGatewayCodeDescription || 'N/A',
                secondaryGateway: envioRegular?.secondaryPaymentGatewayDescription || 'N/A',
                contingencyEnabled: calculateContingency(envioRegular),
                mainEnabled: envioRegular?.mainPaymentGatewayEnabled,
                secondaryEnabled: envioRegular?.secondaryPaymentGatewayEnabled,
            },
            envioQR: {
                mainGateway: envioQR?.mainPaymentGatewayCodeDescription || 'N/A',
                secondaryGateway: envioQR?.secondaryPaymentGatewayDescription || 'N/A',
                contingencyEnabled: calculateContingency(envioQR),
                mainEnabled: envioQR?.mainPaymentGatewayEnabled,
                secondaryEnabled: envioQR?.secondaryPaymentGatewayEnabled,
            },
            recepcionRegular: {
                mainGateway: recepcionRegular?.mainPaymentGatewayCodeDescription || 'N/A',
                secondaryGateway: recepcionRegular?.secondaryPaymentGatewayDescription || 'N/A',
                contingencyEnabled: calculateContingency(recepcionRegular),
                mainEnabled: recepcionRegular?.mainPaymentGatewayEnabled,
                secondaryEnabled: recepcionRegular?.secondaryPaymentGatewayEnabled,
            },
            recepcionQR: {
                mainGateway: recepcionQR?.mainPaymentGatewayCodeDescription || 'N/A',
                secondaryGateway: recepcionQR?.secondaryPaymentGatewayDescription || 'N/A',
                contingencyEnabled: calculateContingency(recepcionQR),
                mainEnabled: recepcionQR?.mainPaymentGatewayEnabled,
                secondaryEnabled: recepcionQR?.secondaryPaymentGatewayEnabled,
            }
        };
    });
};

// Computed para datos transformados
const transformedContingency = computed(() => {
    return transformContingencyData(contingencyData.value);
});

// Computed para filtrar por término de búsqueda
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

// Resetear paginación cuando cambien los filtros
watch([searchTermContingency], () => {
    paginationContingencyFirst.value = 0;
});

// Manejo de paginación
const onPageChange = (event: any) => {
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

// Methods para manejar selección
const toggleBankSelection = (participantCode: string) => {
    const index = selectedBanks.value.indexOf(participantCode);
    if (index > -1) {
        selectedBanks.value.splice(index, 1);
    } else {
        selectedBanks.value.push(participantCode);
    }
    console.log('Bancos seleccionados:', selectedBanks.value);
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
    console.log('Bancos seleccionados:', selectedBanks.value);
};

// Methods
const loadContingency = async (): Promise<void> => {
    loading.value = true;
    try {
        const response = await contingencyService.getBanks();
        contingencyData.value = response.data; // Directamente la respuesta, no response.banks
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

const handleSearch = () => {
    // La búsqueda se hace automáticamente con el computed filteredContingency
    paginationContingencyFirst.value = 0;
}

const handleChannelChange = (type: 'channel' | 'contingency') => {
    if (selectedBanks.value.length === 1) {
        // Un solo banco
        const selectedBank = transformedContingency.value.find(
            bank => bank.participantCode === selectedBanks.value[0]
        );
        if (selectedBank) {
            console.log('Navegando con:', selectedBank.participantName);
            router.push({
                path: `/admin/configuration/contingency/ChannelContingency/${selectedBank.participantCode}`,
                query: { 
                    type,
                    bankName: selectedBank.participantName,
                    participantCode: selectedBank.participantCode
                }
            });
        }
    } else if (selectedBanks.value.length > 1) {
        // Múltiples bancos
        const selectedBankNames = transformedContingency.value
            .filter(bank => selectedBanks.value.includes(bank.participantCode))
            .map(bank => bank.participantName.trim());
            console.log(selectedBankNames);
        console.log('Múltiples bancos seleccionados:', selectedBanks.value);
        router.push({
            path: '/admin/configuration/contingency/ChannelContingency/multiple',
            query: { 
                type,
                codes: selectedBanks.value.join(','),
                bankNames: selectedBankNames.join(', ') 
            }
        });
    }
};

// Cargar datos al montar el componente
onMounted(() => {
    loadContingency();
});

</script>