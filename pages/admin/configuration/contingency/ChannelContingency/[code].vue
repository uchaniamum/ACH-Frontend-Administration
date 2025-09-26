<template>
    <div class="flex flex-col gap-68">
        <div class="flex flex-col gap-8">
            <XHeader 
                :title="isMultipleBanks ? `${pageTitle} - Participantes (${contingencyData.length})` : pageTitle" 
                @back-click="goBack"
                :breadcrumb-items="itemsBreadContingencyEdit" 
                :show-breadcrumb="true"
                :show-back="true"
            />
            <span class="text-normal font-normal">
                {{ pageDescription }}
            </span>
            <div class="flex flex-col items-center">
                <div class="flex flex-col w-[738px] gap-8">
                    <div v-if="isMultipleBanks" class="flex flex-col items-start gap-4">
                        <div class="flex flex-row">
                            <span class="flex flex-row gap-3 items-center text-gray-700"><Icon name="x:bank"/>Ver {{contingencyData.length}} Participantes </span>
                            <XButton 
                                variant="text" 
                                :icon="participantsVisibles ? 'thik-nav-arrow-up' : 'thik-nav-arrow-down'"
                                @click="participantsVisibles = !participantsVisibles"
                                class="!bg-transparent text-gray-700 border-none hover:!text-primary-800 hover:!bg-transparent focus:text-primary-600"
                            />
                        </div>
                        <div v-if="participantsVisibles">
                            <ul class="space-y-2">
                                <li 
                                    v-for="(bankName, index) in getBankNamesArray" 
                                    :key="index"
                                    class="flex items-start"
                                >
                                    <span class="ml-3">• </span>
                                    <span class="text-gray-800">{{ bankName.trim() }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="flex flex-col gap-16">
                        <!-- SECCIÓN CAMBIO DE CANAL -->
                        <div v-if="isChannelChange" class="flex flex-col justify-center gap-8">
                            <div v-if="hasInconsistentConfigurations && isChannelChange" class="mb-4">
                                <XSnackBar variant="warn">
                                    <h5 class="font-semibold">Configuraciones diferentes detectadas</h5>
                                    <p>Los participantes seleccionados tienen distintas configuraciones de gateway. 
                                        Los cambios se aplicarán uniformemente a todos los participantes.</p>
                                </XSnackBar>
                            </div>
                            <Divider align="left" type="solid">
                                <b>Canal</b>
                            </Divider>
                            <span class="text-normal font-normal text-gray-700">
                                Selecciona el canal al que deseas cambiar las transacciones del participante.
                            </span>
                            <DataTable :value="transactionData" class="w-full">
                                <Column header="Transacción" sortable class="min-w-80">
                                    <template #body="{ data }">
                                        <div class="flex items-center gap-2">
                                            <span>{{ data.transaction }}</span>
                                            <span v-tooltip="data.tooltip">
                                                <Icon name="x:info-empty" class="text-sky-500 w-[14.666px] h-[14.666px]"></Icon>
                                            </span>
                                        </div>
                                    </template>
                                </Column>
                                <Column 
                                    v-for="gateway in paymentGatewayOptions" 
                                    :key="gateway.value" 
                                    :header="gateway.label"
                                    class="text-center min-w-24"
                                >
                                    <template #body="{ data }">
                                        <div class="flex justify-center">
                                            <XRadioButton 
                                                v-model="data.gateways[gateway.value]"
                                                :binary="true"
                                                @update:modelValue="onGatewayChange(data, gateway.value, { checked: $event })"
                                            />
                                        </div>
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                        
                        <!-- SECCIÓN CONTINGENCIA -->
                        <div v-if="!isChannelChange" class="flex flex-col justify-center gap-8">
                            <XSnackBar v-if="hasContingencyInconsistencies" variant="warn">
                                <h5 class="font-semibold">Configuración de participantes</h5>
                                <p>Los participantes cuentan con distintas configuraciones. La nueva configuración que apliques se reflejará de manera uniforme en todos los participantes seleccionados.</p>
                            </XSnackBar>
                            <Divider align="left" type="solid">
                                <b>Transacciones</b>
                            </Divider>
                            <span class="text-normal font-normal text-gray-700">
                                Ajusta la configuración de las transacciones involucradas.                            
                            </span>
                            
                            <!-- Cards de transacciones -->
                            <div class="flex flex-col gap-16">
                                <div class="flex flex-col gap-8">
                                    <XCard class="border border-gray-200">
                                <template #content>
                                    <div class="flex flex-row justify-between">
                                        <div class="self-center">
                                            <div class="flex flex-col gap-4">
                                                <div class="flex gap-4">
                                                    <span>Envío de transferencias interbancarias IASYNC</span>
                                                    <span v-tooltip="'Salida de transferencias regulares.'">
                                                        <Icon name="x:info-empty" class="text-sky-500 w-[14.666px] h-[14.666px]"/>
                                                    </span>
                                                </div>
                                                <div>
                                                    <XTag :severity="iasyncContingency ? 'danger' : 'success'" 
                                                    :value="iasyncContingency ? 'En contingencia' : 'Operacional'"/>
                                                </div>
                                                
                                            </div>
                                        </div>
                                        <div class="self-center">
                                            <XToggleSwitch v-model="iasyncContingency"/>
                                        </div>
                                    </div>
                                </template>
                                    </XCard>

                                    <XCard class="border border-gray-200">
                                        <template #content>
                                            <div class="flex flex-row justify-between">
                                                <div class="self-center">
                                                    <div class="flex flex-col gap-4">
                                                        <div class="flex gap-4">
                                                            <span>Envío de transferencias QR IQR</span>
                                                            <span v-tooltip="'Procesamiento de transacciones de pago por QR.'">
                                                                <Icon name="x:info-empty" class="text-sky-500 w-[14.666px] h-[14.666px]"/>
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <XTag :severity="iqrContingency ? 'danger' : 'success'" 
                                                            :value="iqrContingency ? 'En contingencia' : 'Operacional'"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="self-center">
                                                    <XToggleSwitch v-model="iqrContingency"/>
                                                </div>
                                            </div>
                                        </template>
                                    </XCard>

                                    <XCard class="border border-gray-200">
                                        <template #content>
                                            <div class="flex flex-row justify-between">
                                                <div class="self-center">
                                                    <div class="flex flex-col gap-4">
                                                        <div class="flex gap-4">
                                                            <span>Recepción transferencia interbancaria OASYNC</span>
                                                            <span v-tooltip="'Salida de transferencias regulares.'">
                                                                <Icon name="x:info-empty" class="text-sky-500 w-[14.666px] h-[14.666px]"/>
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <XTag :severity="oasyncContingency ? 'danger' : 'success'" 
                                                            :value="oasyncContingency ? 'En contingencia' : 'Operacional'"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="self-center">
                                                    <XToggleSwitch v-model="oasyncContingency"/>
                                                </div>
                                            </div>
                                        </template>
                                    </XCard>

                                    <XCard class="border border-gray-200">
                                        <template #content>
                                            <div class="flex flex-row justify-between">
                                                <div class="self-center">
                                                    <div class="flex flex-col gap-4">
                                                        <div class="flex gap-4">
                                                            <span>Recepción transferencia QR OQR</span>
                                                            <span v-tooltip="'Procesamiento de transacciones de cobro por QR.'">
                                                                <Icon name="x:info-empty" class="text-sky-500 w-[14.666px] h-[14.666px]"/>
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <XTag :severity="oqrContingency ? 'danger' : 'success'" 
                                                            :value="oqrContingency ? 'En contingencia' : 'Operacional'" class="!text-medium"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="self-center">
                                                    <XToggleSwitch v-model="oqrContingency"/>
                                                </div>
                                            </div>
                                        </template>
                                    </XCard>
                                </div>
                                <div v-if="shouldShowContingencyFields" class="flex flex-col gap-8">
                                    <Divider align="left" type="solid">
                                        <b>Mensaje de respuesta</b>
                                    </Divider>
                                    <span class="text-normal font-normal text-gray-700">
                                        Define un mensaje de rechazo que se mostrará a los usuarios cuando intenten realizar transacciones hacia este participante.                               
                                    </span>
                                    <XInputText 
                                        v-model="titleContingency"
                                        name="tituloContingencia"
                                        label="Titulo" 
                                        label-required
                                        placeholder="Ingresa el título del mensaje"
                                        :rules="requiredRule"
                                    />
                                    <XTextarea 
                                        v-model="messageContingency"
                                        name="messageContingency" 
                                        rows="5" 
                                        class="w-full" 
                                        placeholder="Ingresa el contenido del mensaje" 
                                        label-required 
                                        label="Mensaje"
                                        :rules="requiredRule"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <!-- JUSTIFICACIÓN -->
                        <div class="flex flex-col justify-center gap-8">
                            <Divider align="left" type="solid">
                                <b>Aclaraciones</b>
                            </Divider>
                            <span class="text-normal font-normal text-gray-700">
                                Detalla el motivo del cambio. 
                            </span>
                            <div class="flex flex-col gap-[0.357rem]">
                                <XTextarea 
                                    v-model="justification"
                                    name="justification" 
                                    rows="5" 
                                    class="w-full" 
                                    :placeholder="isChannelChange ? 'Describe el motivo del cambio de canal' : 'Describe el motivo de la contingencia'" 
                                    label-required 
                                    label="Justificación"
                                    :rules="requiredRule"
                                />
                                <span class="text-gray-600 text-sm">Por razones de seguridad, este campo es requerido.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
        
        <!-- BOTONES DE ACCIÓN -->
        <div class="flex flex-col gap-12">
            <XDivider/>
            <div class="w-full flex flex-row justify-end gap-6">
                <XButton 
                    variant="outlined" 
                    label="Cancelar" 
                    class="w-75"
                    @click="goBack"
                />
                <XButton 
                    :label="isChannelChange ? 'Cambiar' : 'Guardar'"
                    @click="handleSaveClick"
                    class="w-75"
                    :loading="saving"
                    :disabled="!isFormContingencyValid"
                />
            </div>
        </div>

        <ConfirmDialogWrapper
            v-model="confirmDialog.visible"
            :options="confirmDialog.options"
        />
    </div>
</template>

<script setup lang="ts">
import ConfirmDialogWrapper from '~/components/overlay/ConfirmDialogWrapper.vue';
import { useOptions } from '~/componsables/useOptions';
import type { GatewayAnalysis, Participant, ParticipantDetailResponse, PaymentGateway, Transaction, TransactionRowData } from '~/features/contingency/type';
import type { ValidationRuleResult } from '~/features/users/options.types';
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';
import { contingencyService } from '~/services/contingencySevice';

// Composables
const route = useRoute();
const router = useRouter();
const toast = useToast();

// Estados principales
const loading = ref(true);
const saving = ref(false);
const error = ref<string | null>(null);
const contingencyData = ref<ParticipantDetailResponse[]>([]);

// Estados de modales
const visibleChangeCanal = ref(false);
const visibleContingency = ref(false);

const confirmDialog = ref({
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

// Estados del formulario
const justification = ref('');
const titleContingency = ref('');
const messageContingency = ref('');

const iasyncContingency = ref(false);
const iqrContingency = ref(false);
const oasyncContingency = ref(false);
const oqrContingency = ref(false);

const hasContingencyInconsistencies = ref(false);

//Para los participantes desplegados
const participantsVisibles = ref(false);

const itemsBreadContingencyEdit = getBreadcrumbItems('contingency', 'edit');


const transactionData = ref([]);

const isFormContingencyValid = computed(() => {
    const baseValidation = justification.value?.trim();
    
    if (!shouldShowContingencyFields.value) {
        return baseValidation;
    }
    
    return baseValidation && 
            titleContingency.value?.trim() && 
            messageContingency.value?.trim();
})

// DETECTAR QUÉ TIPO DE OPERACIÓN ES
const isChannelChange = computed(() => {
    return route.query.type === 'channel' || route.path.includes('channel');
});

const isContingency = computed(() => {
    return route.query.type === 'contingency' || route.path.includes('contingency');
});

// DETECTAR SI SON MÚLTIPLES BANCOS
const isMultipleBanks = computed(() => {
    return participantCodes.value.length > 1;
});

// TÍTULOS Y DESCRIPCIONES DINÁMICOS
const pageTitle = computed(() => {
    const action = isChannelChange.value ? 'Cambiar canal' : 'Configurar operabilidad ';
    return isMultipleBanks.value ? action : `${action} - ${getBankNames.value}`;
});

const pageDescription = computed(() => {
    return isChannelChange.value 
        ? 'Realiza el cambio de canal asignado al participante para garantizar una correcta continuidad operativa.'
        : 'Establece contingencias específicas para garantizar la continuidad de las operaciones.';
});

// COMPUTED PARA NOMBRES DE BANCOS
const getBankNames = computed(() => {
        // Primero intentar obtener desde query parameters (desde navegación)
    if (route.query.bankName && typeof route.query.bankName === 'string') {
        return route.query.bankName;
    }
    
    if (route.query.bankNames && typeof route.query.bankNames === 'string') {
        return route.query.bankNames; // Ya viene separado por comas
    }
    
    // Fallback: obtener desde datos cargados (comportamiento original)
    if (!contingencyData.value?.length) return 'Cargando...';
    
    return contingencyData.value
        .map(bank => bank.participantName)
        .join(',');
});

const getBankNamesArray = computed(() => {
    const names = getBankNames.value;
    if (typeof names === 'string' && names.includes(',')) {
        return names.split(',').map(name => name.trim()).filter(name => name.length > 0);
    }
    return [names];
});


// Usar el composable y cargar opciones
const { 
    paymentGatewayOptions: optionsFromComposable, 
    loadAllOptions 
} = useOptions();


// Procesar las opciones para tu tabla
const paymentGatewayOptions = computed(() => {
    return optionsFromComposable.value.map(gateway => ({
        value: gateway.value,
        label: gateway.label
    }));
});

const selectedChannelValue = ref('');


// OBTENER CÓDIGOS DE PARTICIPANTES - VERSIÓN CORREGIDA
const participantCodes = computed(() => {
    // Caso 1: Múltiples códigos desde query parameters (desde la tabla)
    if (route.query.codes) {
        const codes = (route.query.codes as string).split(',').filter(Boolean);
        console.log('Múltiples códigos desde query:', codes);
        return codes;
    }
    
    // Caso 2: Un solo código desde route parameters
    // Verificar diferentes posibles nombres de parámetros
    const possibleParamNames = ['participantCode', 'id', 'code'];
    
    for (const paramName of possibleParamNames) {
        const paramValue = route.params[paramName] as string;
        if (paramValue && 
            paramValue !== 'multiple' && 
            paramValue !== 'ChannelContingency' &&
            paramValue !== 'contingency' &&
            paramValue !== 'channel') {
            return [paramValue];
        }
    }
    
    // Caso 3: Verificar si hay algún parámetro que parezca un código de participante
    const allParams = Object.values(route.params).flat();
    const validCode = allParams.find(param => 
        param && 
        typeof param === 'string' && 
        param !== 'multiple' && 
        param !== 'ChannelContingency' &&
        param !== 'contingency' &&
        param !== 'channel' &&
        param.length > 0
    );
    
    if (validCode) {
        console.log('Código encontrado en parámetros generales:', validCode);
        return [validCode];
    }
    
    // Caso 4: Navegación directa sin parámetros
    console.log('Sin códigos encontrados - Params completos:', route.params);
    return [];
});

// Detectar si los bancos tienen configuraciones inconsistentes
const hasInconsistentConfigurations = computed(() => {
    if (!isMultipleBanks.value || contingencyData.value.length < 2) return false;

    const firstBank = contingencyData.value[0];

    return contingencyData.value.some((bank: Participant, index) => {
        if (index === 0) return false;

        // Comparar transacciones
        if (bank.transactions?.length !== firstBank.transactions?.length) return true;

        // Comparar gateways por transacción
        return bank.transactions?.some((transaction, transIndex) => {
            const firstBankTransaction = firstBank.transactions?.[transIndex];
            if (!firstBankTransaction) return true;

            return transaction.paymentGateways?.length !== firstBankTransaction.paymentGateways?.length ||
                    transaction.paymentGateways?.some(gw =>
                        !firstBankTransaction.paymentGateways?.some(fgw =>
                            fgw.paymentGatewayCode === gw.paymentGatewayCode
                        )
                    );
        });
    });
});

const shouldShowContingencyFields = computed(() => {
    if (!contingencyData.value || contingencyData.value.length === 0) {
        return false;
    }
    

    // Verificar si algún banco tiene al menos una transacción en contingencia
    return contingencyData.value.some(bank => {
        return bank.transactions?.some(transaction => 
            transaction.isInContigency === true ||
            iasyncContingency.value || 
            iqrContingency.value || 
            oasyncContingency.value || 
            oqrContingency.value
        );
    });
});

const generateTransactionDataFromServer = (): void => {
    console.log('=== GENERANDO transactionData DINÁMICAMENTE ===');
    
    if (!contingencyData.value || contingencyData.value.length === 0) {
        console.log('Sin datos de contingencia para procesar');
        return;
    }

    // Usar el primer banco como referencia para obtener las transacciones disponibles
    const referenceBank = contingencyData.value[0];
    
    if (!referenceBank.transactions || referenceBank.transactions.length === 0) {
        console.log('Sin transacciones en el banco de referencia');
        return;
    }

    // Filtrar solo las transacciones outbound (IsInbound: false)
    const outboundTransactions = referenceBank.transactions.filter(transaction => 
        transaction.IsInbound === false
    );

    console.log('Transacciones outbound encontradas:', 
        outboundTransactions.map(t => t.transactionCode).join(', ')
    );

    // Generar el transactionData dinámicamente
    transactionData.value = outboundTransactions.map((transaction: Transaction, index: number) => ({
        id: index + 1,
        transaction: generateTransactionLabel(transaction.transactionCode),
        transactionCode: transaction.transactionCode,
        tooltip: generateTransactionTooltip(transaction.transactionCode),
        gateways: {}
    }));
};

const generateTransactionLabel = (transactionCode: string): string => {
    // Mapeo para códigos conocidos
    const knownTransactions: Record<string, string> = {
        'OASYNC': 'Envío de transferencias interbancarias OASYNC',
        'OQR': 'Envío de transferencias QR OQR',
        'IASYNC': 'Recepción de transferencias interbancarias IASYNC',
        'IQR': 'Recepción de transferencias QR IQR'
    };

    // Si existe en el mapeo, usar la descripción conocida
    if (knownTransactions[transactionCode]) {
        return knownTransactions[transactionCode];
    }

    return `Transacción ${transactionCode}`;
};

const generateTransactionTooltip = (transactionCode: string) => {
    // Mapeo para tooltips conocidos
    const knownTooltips: Record<string, string> = {
        'OASYNC': 'Salida de transferencias regulares.',
        'OQR': 'Procesamiento de transacciones de cobro por QR.',
        'IASYNC': 'Entrada de transferencias regulares.',
        'IQR': 'Procesamiento de transacciones de pago por QR.'
    };

    // Si existe en el mapeo, usar el tooltip conocido
    if (knownTooltips[transactionCode]) {
        return knownTooltips[transactionCode];
    }

    // Para códigos nuevos, generar un tooltip genérico
    return `Información sobre transacción ${transactionCode}`;
};


const requiredRule = (value:unknown):ValidationRuleResult => {
    return value !== null && value !== undefined && value !== '' 
        ? true 
        : 'El campo es requerido'
}

const onGatewayChange = (
    transactionRow: TransactionRowData, 
    gatewayValue: string, 
    event: { checked?: boolean; target?: { checked?: boolean } }
): void => {
    // FIX: PrimeVue Checkbox a veces no envía event.checked correctamente
    const isChecked = event?.checked ?? event?.target?.checked ?? !transactionRow.gateways[gatewayValue];
    
    console.log(' Cambio en gateway CORREGIDO:', {
        transaction: transactionRow.transaction,
        transactionCode: transactionRow.transactionCode,
        gateway: gatewayValue,
        gatewayLabel: paymentGatewayOptions.value.find(opt => opt.value === gatewayValue)?.label,
        checked: isChecked,
        eventType: typeof event,
        eventKeys: event ? Object.keys(event) : 'no event'
    });

    // Actualizar el valor
    transactionRow.gateways[gatewayValue] = isChecked;
    
    // Si se selecciona un checkbox, deseleccionar los demás en la misma fila
    if (isChecked) {
        paymentGatewayOptions.value.forEach(gateway => {
            if (gateway.value !== gatewayValue) {
                transactionRow.gateways[gateway.value] = false;
                console.log(`    Deseleccionando ${gateway.label}`);
            }
        });
        console.log(`    Seleccionando ${paymentGatewayOptions.value.find(opt => opt.value === gatewayValue)?.label}`);
    }
    
    // Debug: Mostrar estado final de la fila
    console.log('   Estado final de la fila:', transactionRow.gateways);
};


const openChannelChangeModal = (): void => {
    const entityText = contingencyData.value.length > 1 
        ? `${contingencyData.value.length} entidades` 
        : `${contingencyData.value.length} `

    confirmDialog.value = {
        visible: true,
        options: {
            title: 'Cambiar de canal',
            icon: 'x:warning-circle',
            iconColor: 'text-yellow-500',
            confirmLabel: 'Guardar',
            cancelLabel: 'Cancelar',
            message: `¿Estás seguro de cambiar de canal de  <span class="font-semibold">${entityText}</span>? Esta modificación podrá ser ajustada en el futuro.`,
            onConfirm: async () => {
                await saveConfirm()
            },
            onCancel: () => {
                // Lógica adicional si es necesaria al cancelar
            }
        }
    }
}

// Método para abrir modal de contingencia
const openContingencyModal = (): void => {
    const entityText = contingencyData.value.length > 1 
        ? `${contingencyData.value.length} entidades` 
        : `${contingencyData.value.length} `
    confirmDialog.value = {
        visible: true,
        options: {  
            title: 'Configurar operabilidad',
            icon: 'x:warning-circle',
            iconColor: 'text-yellow-500',
            confirmLabel: 'Guardar',
            cancelLabel: 'Cancelar',
            message: `¿Estás seguro de guardar la configuración para <span class="font-semibold">${entityText}</span>? Esta modificación podrá ser ajustada en el futuro.`,
            onConfirm: async () => {
                await saveConfirm()
            },
            onCancel: () => {
                // Lógica adicional si es necesaria al cancelar
            }
        }
    }
}

// FUNCIÓN PARA MANEJAR CLICK EN GUARDAR/CAMBIAR
const handleSaveClick = () => {
    if (isChannelChange.value) {
        openChannelChangeModal()
    } else {
        openContingencyModal()
    }
};

// FUNCIÓN PARA INICIALIZAR VALORES POR DEFECTO
const initializeDefaultValues = () => {
    // Establecer ACL como valor por defecto solo para cambio de canal
    if (isChannelChange.value) {
        selectedChannelValue.value = 'ACL';
        console.log('Canal por defecto establecido:', selectedChannelValue.value);
    }
};

// FUNCIONES DE VALIDACIÓN - Agregar antes de marcarCheckboxesAutomaticamente
const validateGatewayState = (gateway) => {
    const { isPrimary, isOperational, isTemporarilyActive } = gateway;
  
    // Convert to booleans for safety
    const isPrimary_ = Boolean(isPrimary);
    const isOperational_ = Boolean(isOperational);
    const isTemporarilyActive_ = Boolean(isTemporarilyActive);
    
    // 1. Canal primario y activo
    if (isPrimary_ && isOperational_ && !isTemporarilyActive_) {
        return { estado: 'primario_activo', isContingency: false, descripcion: 'Canal primario y activo',canBeSelected: true };
    }

    // // 2. Primario operativo pero en contingencia temporal
    // if (isPrimary_ && isOperational_ && isTemporarilyActive_) {
    //     return {  estado: 'primario_contingencia_activa',  isContingency: true, descripcion: 'Primario operativo en contingencia', canBeSelected: false };
    // }

    // // 3. Primario fuera de servicio
    // if (isPrimary_ && !isOperational_ && !isTemporarilyActive_) {
    //     return { 
    //         estado: 'primario_fuera_servicio', 
    //         isContingency: true, 
    //         descripcion: 'Primario fuera de servicio',
    //         canBeSelected: false 
    //     };
    // }

    // // 5. Canal secundario activo temporalmente (por contingencia)
    // if (!isPrimary_ && isOperational_ && isTemporarilyActive_) {
    //     return { 
    //         estado: 'secundario_contingencia', 
    //         isContingency: true, 
    //         descripcion: 'Canal secundario por contingencia',
    //         canBeSelected: false // Ya está en uso por contingencia
    //     };
    // }

    // Por defecto
    return { 
        estado: 'desconocido', 
        isContingency: false, 
        descripcion: 'Estado desconocido',
        canBeSelected: false 
    };
};

//FUNCIÓN PARA FILTRAR SOLO TRANSACCIONES OUTBOUND
const isOutboundTransaction = (transactionCode: string): boolean => {
    // // Solo las transacciones de SALIDA pueden cambiar de canal
    // const outboundTransactions = ['OASYNC', 'OQR']; // Envío interbancarias y QR
    // return outboundTransactions.includes(transactionCode);
    if (!contingencyData.value || contingencyData.value.length === 0) {
        return false;
    }

    // Buscar la transacción en cualquier banco para verificar si es outbound
    for (const bank of contingencyData.value) {
        const transaction = bank.transactions?.find(t => t.transactionCode === transactionCode);
        if (transaction) {
            return transaction.IsInbound === false;
        }
    }

    return false;
};

const getAllOutboundTransactionCodes = () => {
    if (!contingencyData.value || contingencyData.value.length === 0) {
        return [];
    }

    const outboundCodes = new Set();
    
    contingencyData.value.forEach(bank => {
        bank.transactions?.forEach(transaction => {
            if (transaction.IsInbound === false) {
                outboundCodes.add(transaction.transactionCode);
            }
        });
    });

    return Array.from(outboundCodes);
};

//MARCAR CHECKS DE CANAL - VERSIÓN MEJORADA CON VALIDACIÓN
const marcarCheckboxesAutomaticamente = (): void => {
    console.log(' === INICIANDO MARCADO AUTOMÁTICO ===');
    
    // // Primero, limpiar y mostrar opciones disponibles
    // console.log('Opciones de gateway disponibles:', 
    //     paymentGatewayOptions.value.map(opt => `${opt.label} (${opt.value})`).join(', ')
    // );

    // Obtener códigos outbound dinámicamente
    const outboundCodes = getAllOutboundTransactionCodes();
    console.log('Códigos outbound dinámicos:', outboundCodes);
    
    transactionData.value.forEach((filaTabla: TransactionRowData) => {
        console.log(` Procesando ${filaTabla.transactionCode}:`);
        
        if (!isOutboundTransaction(filaTabla.transactionCode)) {
            filaTabla.gateways = {};
            paymentGatewayOptions.value.forEach(opcion => {
                filaTabla.gateways[opcion.value] = false;
            });
            return;
        }
        
        // Inicializar todos los checkboxes como false
        filaTabla.gateways = {};
        paymentGatewayOptions.value.forEach(opcion => {
            filaTabla.gateways[opcion.value] = false;
        });
        
        // Analizar cada banco para esta transacción
        console.log(`Analizando ${contingencyData.value.length} bancos:`);
        
        const analisisPorGateway: Record<string, GatewayAnalysis> = {};
        let primaryGateway: PaymentGateway | undefined;

        contingencyData.value.forEach((banco, index) => {
    console.log(`  Banco ${index + 1}: ${banco.participantName}`);
    
    const transaccionEncontrada = banco.transactions?.find(
        t => t.transactionCode === filaTabla.transactionCode
    );
    
    console.log('Transaccion encontrada: ', transaccionEncontrada);
    
    // CORRECCIÓN: Verificar si transaccionEncontrada existe y tiene paymentGateways
    if (transaccionEncontrada && transaccionEncontrada.paymentGateways && transaccionEncontrada.paymentGateways.length > 0) {
        console.log('trabsaccion payment: ', transaccionEncontrada.paymentGateways);
        
        // Buscar SOLAMENTE el PRIMER gateway con isPrimary: true
        // Usamos find() que devuelve el primer elemento que cumple la condición
        primaryGateway = transaccionEncontrada.paymentGateways.find(gw => gw.isPrimary === true);
        console.log('Gateway primario encontrado: ', primaryGateway);
        
        if (primaryGateway) {
            console.log('Gateway primario: ', primaryGateway.paymentGatewayAcronym);
            
            // Aquí puedes procesar el gateway primario según necesites
            const gatewayCode = primaryGateway.paymentGatewayCode;
            const gatewayLabel = paymentGatewayOptions.value.find(
                opt => opt.value === gatewayCode
            )?.label || gatewayCode;
            
            // Inicializar el análisis para este gateway si no existe
            if (!analisisPorGateway[gatewayCode]) {
                analisisPorGateway[gatewayCode] = {
                    label: gatewayLabel,
                    estados: [],
                    puedeSeleccionarse: [],
                    countDisponible: 0,
                    countPrimarioActivo: 0
                };
            }
            
            // Actualizar el análisis
            const analysis = analisisPorGateway[gatewayCode];
            analysis.countDisponible++;
            
            // Verificar si es primario y está operativo
            if (primaryGateway.isPrimary) {
                analysis.countPrimarioActivo++;
                analysis.estados.push('primario_activo');
                analysis.puedeSeleccionarse.push(true);
            } else {
                analysis.estados.push('primario_inactivo');
                analysis.puedeSeleccionarse.push(false);
            }
        } else {
            console.log('No se encontró ningún gateway con isPrimary: true');
        }
    } else {
        console.log(`Sin transacción o sin paymentGateways en el banco`);
    }
        });

        const totalBancos = contingencyData.value.length;
        
        Object.keys(analisisPorGateway).forEach(gatewayCode => {
            const analysis = analisisPorGateway[gatewayCode];
            // REGLA: Solo marcar si es primario activo en TODOS los bancos
            if (analysis.countPrimarioActivo === totalBancos) {
                filaTabla.gateways[gatewayCode] = true;
                console.log(`    MARCADO - Canal actual activo`);
            } else if (analysis.countDisponible === totalBancos) {
                console.log(`Disponible pero no marcado - Canal alternativo`);
            } else {
                console.log(`No disponible completamente`);
            }
        });
        
        console.log(` Estado final:`, filaTabla.gateways);
    });
    
};


// CONTINGENCIA
const verificarInconsistenciasContingencia = () =>{
    if(!isMultipleBanks.value || contingencyData.value.length < 2){
        hasContingencyInconsistencies.value = false;
        return;
    }

    const transactionCode = ['IASYNC', 'IQR', 'OASYNC', 'OQR'];
    let hasInconsistencies = false;

    transactionCode.forEach(code =>{
        const stateContingency = contingencyData.value.map(bank =>{
            const transaction = bank.transactions?.find(t => t.transactionCode === code);
            return transaction?.isContingency || false;
        });

        // Si no todos tienen el mismo estado, hay inconsistencia
        const firtState = stateContingency[0];
        const allEqual = stateContingency.every(estado => estado === firtState);

        if(!allEqual){
            console.log(`Inconsistencia detectada en ${code}:`, stateContingency);
            hasInconsistencies = true;
        }
    });
    hasContingencyInconsistencies.value = hasInconsistencies;
    console.log('Tiene inconsistencias de contingencia:', hasInconsistencies);
}

const inicializarMensajesContingencia = () => {
    console.log('Inicializando mensajes de contingencia desde el servidor...');
    
    // Buscar el primer mensaje de contingencia disponible en cualquier transacción
    let tituloEncontrado = '';
    let mensajeEncontrado = '';
    
    contingencyData.value.forEach(bank => {
        bank.transactions?.forEach(transaction => {
            // Solo buscar en transacciones que están en contingencia
            if (transaction.isInContigency) {
                transaction.paymentGateways?.forEach(gateway => {
                    // Si encontramos título y mensaje, los usamos
                    if (gateway.contingencyTitle && !tituloEncontrado) {
                        tituloEncontrado = gateway.contingencyTitle;
                    }
                    if (gateway.contingencyDetail && !mensajeEncontrado) {
                        mensajeEncontrado = gateway.contingencyDetail;
                    }
                });
            }
        });
    });
};


const aplicarEstadosContingencia = () => {
    console.log('Apicando estados de contingencia desde la respuesta del servidor...');

    // Inicializar todos como false
    iasyncContingency.value = false;
    iqrContingency.value = false;
    oasyncContingency.value = false;
    oqrContingency.value = false;

    let hasIASYNCContingency = false;
    let hasIQRContingency = false;
    let hasOASYNCContingency = false;
    let hasOQRContingency = false;

  // Recorrer todos los bancos y sus transacciones
    contingencyData.value.forEach(bank => {
        console.log(`Analizando ${bank.participantName}:`);

    bank.transactions?.forEach(transaction => {
        console.log(`  ${transaction.transactionCode}: isInContigency = ${transaction.isInContigency}`);

        switch(transaction.transactionCode){
            case 'IASYNC':
                if(transaction.isInContigency){
                    hasIASYNCContingency = true;
                }
                break;
            case 'IQR':
                if(transaction.isInContigency){
                    hasIQRContingency = true;
                }
                break;
            case 'OASYNC':
                if(transaction.isInContigency){
                    hasOASYNCContingency = true;
                }
                break;
            case 'OQR':
                if(transaction.isInContigency){
                    hasOQRContingency = true;
                }
                break;
            }
        });
    });

    // Asignar los valores finales a los switches
    iasyncContingency.value = hasIASYNCContingency;
    iqrContingency.value = hasIQRContingency;
    oasyncContingency.value = hasOASYNCContingency;
    oqrContingency.value = hasOQRContingency;

    console.log(' RESULTADO FINAL DE SWITCHES:', {
        IASYNC: iasyncContingency.value,
        IQR: iqrContingency.value,
        OASYNC: oasyncContingency.value,
        OQR: oqrContingency.value
    });

     // También verificar si hay inconsistencias entre participantes
    verificarInconsistenciasContingencia();
    
    // Inicializar mensajes de contingencia si existen
    inicializarMensajesContingencia();
};

const loadPaymentGatewayData = async (): Promise<void> => {
    try {
        loading.value = true;
        error.value = null;
        
        if (!participantCodes.value.length) {
            throw new Error('No se encontraron códigos de participantes');
        }

        const response = await contingencyService.getParticipantsByCode(participantCodes.value);

        contingencyData.value = response.participants || response;
        console.log('RESPUESTA DEL SERVIDOR: parseada', contingencyData.value)
        
        generateTransactionDataFromServer();
        
        if(isChannelChange.value){
            marcarCheckboxesAutomaticamente();

            console.log('Vamos a revisar las transacciones de cada banco:');
            
            contingencyData.value.forEach(bank => {
                console.log(` Banco: ${bank.participantName}`);
                if (bank.transactions && bank.transactions.length > 0) {
                    bank.transactions.forEach(transaction => {
                    console.log(`Transacción encontrada: ${transaction.transactionCode}`);
                    
                    if (transaction.paymentGateways && transaction.paymentGateways.length > 0 && transaction.paymentGateways.isPrimary) {
                        
                        transaction.paymentGateways.forEach(gateway => {
                            console.log(`Gateway: ${gateway.paymentGatewayAcronym} (código: ${gateway.paymentGatewayCode})`);
                        });
                        
                    } else {
                        console.log(`No hay gateways para esta transacción`);
                    }
                    });
                } else {
                    console.log(`No hay transacciones para este banco`);
                }
            });
        } else if(isContingency.value){
            console.log('Procesando contingencia');
            aplicarEstadosContingencia();
            contingencyData.value.forEach(bank => {
                bank.transactions?.forEach(transaction => {
                    transaction.paymentGateways?.forEach(gateway => {
                        const result = validateGatewayState(gateway);
                        console.log(`${bank.participantName} - ${transaction.transactionCode} - ${gateway.paymentGatewayAcronym}:`, result);
                    });
                });
            });
        }
    } catch (err) {
        console.error('Error loading data:', err);
        error.value = err.message || 'Error al cargar la información';
        
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.value,
            life: 5000
        });
    } finally {
        loading.value = false;
    }
};

const generateOrderedPayload = () => {
    console.log('\n=== GENERANDO PAYLOAD SOLO CON CAMBIOS ===');
    
    const payload = {
        participants: [],
        changeReason: justification.value
    };

    contingencyData.value.forEach((bank, bankIndex) => {
        console.log(`\n--- PROCESANDO BANCO ${bankIndex + 1}: ${bank.participantName} ---`);
        
        const participant = {
            participantCode: bank.participantCode || bank.participantName,
            transactions: []
        };

        transactionData.value.forEach((transactionRow) => {
            
            if (!isOutboundTransaction(transactionRow.transactionCode)) {
                console.log(`   Omitiendo ${transactionRow.transactionCode} - es inbound`);
                return;
            }
            
            // Identificar gateway seleccionado
            const selectedGatewayCode = Object.keys(transactionRow.gateways)
                .find(gatewayCode => transactionRow.gateways[gatewayCode] === true);
            
            if (!selectedGatewayCode) {
                console.log(`   Sin selección para ${transactionRow.transactionCode}`);
                return;
            }

            const selectedGatewayLabel = paymentGatewayOptions.value
                .find(opt => opt.value === selectedGatewayCode)?.label;

            // Buscar transacción en el servidor
            const currentBankTransaction = bank.transactions?.find(
                t => t.transactionCode === transactionRow.transactionCode
            );
            
            if (!currentBankTransaction) {
                console.log(`   Transacción no encontrada en servidor`);
                return;
            }

            const currentPrimaryGateway = currentBankTransaction.paymentGateways?.find(
                gw => gw.isPrimary === true
            );
            
            if (currentPrimaryGateway && currentPrimaryGateway.paymentGatewayCode === selectedGatewayCode) {
                console.log(`   SIN CAMBIO: El gateway seleccionado (${selectedGatewayLabel}) ya es el primario actual`);
                return;
            }

            const transaction = {
                transactionCode: transactionRow.transactionCode,
                paymentGatewayCode: selectedGatewayCode
            };

            participant.transactions.push(transaction);
        });

        if (participant.transactions.length > 0) {
            payload.participants.push(participant);
        } else {
            console.log(`   Participante ${bank.participantName} no tiene cambios`);
        }
    });

    console.log('\nPAYLOAD FINAL (solo cambios):');
    console.log(JSON.stringify(payload, null, 2));

    return payload;
};

const establishContingency = async () =>{
// Mapeo de switches a códigos de transacción
    const transactionSwitches = {
        'IASYNC': iasyncContingency.value,
        'IQR': iqrContingency.value,
        'OASYNC': oasyncContingency.value,
        'OQR': oqrContingency.value
    };

    console.log('Estableciendo contingencia: ',transactionSwitches) 


    const payload = {
        contingencyTitle: titleContingency.value,
        contingencyDetail: messageContingency.value,
        changeReason: justification.value,
        
        participants: []
    };
    // Para cada banco/participante
    contingencyData.value.forEach((bank, bankIndex) => {
        console.log(`\n--- PROCESANDO BANCO ${bankIndex + 1}: ${bank.participantName} ---`);

        const participant = {
            participantCode: bank.participantCode,
            transactions: []
        };

        // Procesar solo las transacciones donde el switch está activado
        Object.entries(transactionSwitches).forEach(([transactionCode, switchValue]) => {
            console.log(`\nAnalizando ${transactionCode}:`);
            console.log(`   Switch actual: ${switchValue ? 'ON' : 'OFF'}`);
            
            // Buscar la transacción en los datos del banco
            const bankTransaction = bank.transactions?.find(t => t.transactionCode === transactionCode);
            
            if (!bankTransaction) {
                console.log(`  Transacción ${transactionCode} no encontrada en banco`);
                return;
            }

            // VERIFICAR ESTADO ACTUAL DE CONTINGENCIA EN EL SERVIDOR
            const currentContingencyState = bankTransaction.isInContigency || false;
            console.log(`   Estado contingencia servidor: ${currentContingencyState ? 'ON' : 'OFF'}`);


            if (currentContingencyState === switchValue) {
                console.log(`  SIN CAMBIO: Switch ${transactionCode} ya está ${switchValue ? 'activado' : 'desactivado'}`);
                return;
            }

            console.log(`   HAY CAMBIO: ${currentContingencyState ? 'ON' : 'OFF'} → ${switchValue ? 'ON' : 'OFF'}`);

            const primaryGateway = bankTransaction.paymentGateways?.find(gw => gw.isPrimary === true);
            console.log(`   Gateway primario: ${primaryGateway?.paymentGatewayCode}`);

            if (switchValue) {
                if (primaryGateway) {
                    console.log('Llega aqui');

                    const transaction = {
                        transactionCode: transactionCode,
                        paymentGatewayCode: primaryGateway.paymentGatewayCode,
                        isInContigency: true,
                    };
                    participant.transactions.push(transaction);
                }
            } else {
                console.log('Aqui Llega aqui');
                // Switch desactivado: enviar para quitar contingencia
                const transaction = {
                    transactionCode: transactionCode,
                    paymentGatewayCode: primaryGateway.paymentGatewayCode,
                    isInContigency: true,
                };
                participant.transactions.push(transaction);
                
            }
        });

        // Solo agregar participante si tiene transacciones con cambios
        if (participant.transactions.length > 0) {
            payload.participants.push(participant);
            console.log(` Participante agregado con ${participant.transactions.length} cambios`);
        } else {
            console.log(`Participante omitido: sin cambios`);
        }
    });

    console.log(' RESUMEN DE CAMBIOS:');
    console.log(`   Participantes afectados: ${payload.participants.length}`);
    console.log(`   Total transacciones: ${payload.participants.reduce((total, p) => total + p.transactions.length, 0)}`);

    if (payload.participants.length === 0) {
        console.log('No hay cambios que enviar');
        toast.add({
            severity: 'info',
            summary: 'Sin Cambios',
            detail: 'No se detectaron modificaciones en el estado de contingencia',
            life: 3000
        });
        return;
    }

    console.log('\n PAYLOAD FINAL (solo cambios reales):');
    console.log(JSON.stringify(payload, null, 2));

    try {
        const responseContingency = await contingencyService.updateContingency(payload);
        
        if (responseContingency) {
            toast.add({
                severity: 'success',
                summary: responseContingency.summary,
                // detail: `Cambios aplicados a ${payload.participants.length} participantes`,
                detail: responseContingency.description,
                life: 5000
            });
        }
    } catch (error) {
        console.error('Error al establecer contingencia:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo establecer la contingencia',
            life: 5000
        });
    }
}

const saveConfirm = async () => {
    try {
        saving.value = true;

        if (isChannelChange.value) {
            
            console.log('\n=== INICIANDO CAMBIO DE CANAL CON ORDEN CORRECTO ===');

            // Generar payload con orden correcto
            const payload = generateOrderedPayload();
            
            console.log('\nPAYLOAD FINAL CON ORDEN CORRECTO:');
            console.log(JSON.stringify(payload, null, 2));

            const responseChannel = await contingencyService.updateChangeChannel(payload);
            console.log('Respuesta canal: ',responseChannel);
            if(responseChannel){
                toast.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Canal cambiado exitosamente',
                    life: 5000
                });
            }
            
        }else {
            establishContingency();
        }
        visibleChangeCanal.value = false;
        visibleContingency.value = false; 
        // Redirigir después de un breve delay
        setTimeout(() => {
            router.push('/admin/configuration/contingency');
        }, 1500);
        
    } catch (err) {
        console.error('Error saving changes:', err);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.response?.data?.message || err.message || 'Error al guardar los cambios',
            life: 5000
        });
    } finally {
        saving.value = false;
    }
};

// NAVEGACIÓN
const goBack = () => {
    router.back();
};



onMounted(async () => {
    // Cargar las opciones primero
    try {
        await loadAllOptions();
        console.log('Opciones cargadas:', optionsFromComposable.value);
    } catch (err) {
        console.error('Error loading options:', err);
        error.value = 'Error al cargar las opciones';
    }
    //Luego cargar los datos de participantes
        if (participantCodes.value.length > 0) {
            await loadPaymentGatewayData();
        } else {
        error.value = 'No se encontraron códigos de participantes';
        loading.value = false;
        initializeDefaultValues();
    }
});

</script>