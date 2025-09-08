<template>
    <div>
        <div class="flex flex-col gap-8">
            <XHeader 
                :title="isMultipleBanks ? `${pageTitle} - Participantes (${contingencyData.length})` : pageTitle" 
                @back-click="goBack"
            />
            <span class="text-normal font-normal">
                {{ pageDescription }}
            </span>
            <div class="flex flex-col">
                <div v-if="isMultipleBanks" class="flex justify-start">
                    <XButton 
                        variant="text" 
                        :label="`Ver ${contingencyData.length} Participantes `"
                        icon="bank"
                        @click="showParticipantsModal = true"
                    />
                </div>

                <div class="flex flex-col items-center ">
                    <div class="flex flex-col gap-20 w-[738px]">
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
                                            <Checkbox 
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
                            <XCard class="border border-gray-200">
                                <template #content>
                                    <div class="flex flex-row justify-between">
                                        <div class="self-center">
                                            <div class="flex gap-4">
                                                <span>Envío de transferencias interbancarias IASYNC</span>
                                                <span v-tooltip="'Salida de transferencias regulares.'">
                                                    <Icon name="x:info-empty" class="text-sky-500 w-[14.666px] h-[14.666px]"/>
                                                </span>
                                            </div>
                                            <XTag :severity="iasyncContingency ? 'danger' : 'success'" 
                                                :value="iasyncContingency ? 'Con contingencia' : 'Sin contingencia'"/>
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
                                            <div class="flex gap-4">
                                                <span>Envío de transferencias QR IQR</span>
                                                <span v-tooltip="'Procesamiento de transacciones de pago por QR.'">
                                                    <Icon name="x:info-empty" class="text-sky-500 w-[14.666px] h-[14.666px]"/>
                                                </span>
                                            </div>
                                            <XTag :severity="iqrContingency ? 'danger' : 'success'" 
                                                :value="iqrContingency ? 'Con contingencia' : 'Sin contingencia'"/>
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
                                            <div class="flex gap-4">
                                                <span>Recepción transferencia interbancaria OASYNC</span>
                                                <span v-tooltip="'Salida de transferencias regulares.'">
                                                    <Icon name="x:info-empty" class="text-sky-500 w-[14.666px] h-[14.666px]"/>
                                                </span>
                                            </div>
                                            <XTag :severity="oasyncContingency ? 'danger' : 'success'" 
                                                :value="oasyncContingency ? 'Con contingencia' : 'Sin contingencia'"/>
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
                                            <div class="flex gap-4">
                                                <span>Recepción transferencia QR OQR</span>
                                                <span v-tooltip="'Procesamiento de transacciones de cobro por QR.'">
                                                    <Icon name="x:info-empty" class="text-sky-500 w-[14.666px] h-[14.666px]"/>
                                                </span>
                                            </div>
                                            <XTag :severity="oqrContingency ? 'danger' : 'success'" 
                                                :value="oqrContingency ? 'Con contingencia' : 'Sin contingencia'"/>
                                        </div>
                                        <div class="self-center">
                                            <XToggleSwitch v-model="oqrContingency"/>
                                        </div>
                                    </div>
                                </template>
                            </XCard>
                        
                            <Divider align="left" type="solid">
                                <b>Mensaje de respuesta</b>
                            </Divider>
                            <span class="text-normal font-normal text-gray-700">
                                Comunica a los externos sobre el cambio de canal.                                
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
                                name="clarifications" 
                                rows="5" 
                                class="w-full" 
                                placeholder="Ingresa el contenido del mensaje" 
                                label-required 
                                label="Mensaje"
                                :rules="requiredRule"
                            />
                        </div>
                        
                        <!-- JUSTIFICACIÓN -->
                        <div class="flex flex-col justify-center gap-8">
                            <Divider align="left" type="solid">
                                <b>Aclaraciones</b>
                            </Divider>
                            <span class="text-normal font-normal text-gray-700">
                                Detalla el motivo del cambio y adjunta el respaldo correspondiente.
                            </span>
                            <XTextarea 
                                v-model="justification"
                                name="clarifications" 
                                rows="5" 
                                class="w-full" 
                                :placeholder="isChannelChange ? 'Describe el motivo del cambio de canal' : 'Describe el motivo de la contingencia'" 
                                label-required 
                                label="Justificación"
                                :rules="requiredRule"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div> 
        
        <!-- BOTONES DE ACCIÓN -->
        <div class="flex flex-col pt-20">
            <XDivider class="mb-6"/>
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
                />
            </div>
        </div>

        <!-- MODALES -->
        <XDialog 
            :visible="showParticipantsModal"
            @update:visible="showParticipantsModal = $event"
            header="Participantes seleccionados"
            :style="{ width: '500px' }"
            :closable="true"
            :modal="true"
        >
            <div class="space-y-4">
                <div>
                    <ul class="space-y-2">
                        <li 
                            v-for="(bankName, index) in getBankNamesArray" 
                            :key="index"
                            class="flex items-start"
                        >
                            <span>•</span>
                            <span class="text-gray-900">{{ bankName.trim() }}</span>
                        </li>
                    </ul>
                </div>
                <div class="mt-6 pt-4 border-t border-gray-200">
                    <p class="text-sm font-medium text-gray-700">
                        Total de participantes: {{ contingencyData.length }}
                    </p>
                </div>
            </div>
        </XDialog>

        <XConfirmDialog
            v-model="visibleChangeCanal"
            icon="x:warning-circle"
            icon-color="text-yellow-500"
            :closable="false"
            title="Cambiar de canal">
            <template #message>
                <div class="space-y-2">
                    <p>
                        <span class="font-medium text-gray-700">¿Estás seguro de que deseas cambiar el canal del </span>
                        <span class="font-semibold">{{ getBankNames }}</span>
                        <span class="font-medium text-gray-700"> a </span>
                        <span class="font-semibold">{{ getSelectedChannelFromTable }}?</span>
                    </p>
                </div>
            </template>
            <template #buttons>
                <div class="flex gap-3">
                    <XButton label="Cancelar" outlined @click="visibleChangeCanal = false"/>
                    <XButton label="Cambiar" @click="saveConfirm" :loading="saving" />
                </div>
            </template>  
        </XConfirmDialog>

        <XConfirmDialog
            v-model="visibleContingency"
            icon="x:warning-circle"
            icon-color="text-yellow-500"
            :closable="false"
            title="Establecer contingencia">
            <template #message>
                <div class="space-y-2">
                    <p>
                        <span class="font-medium text-gray-700">¿Estás seguro de establecer modo contingencia para </span>
                        <span v-if="isMultipleBanks" class="font-semibold">los bancos seleccionados</span>
                        <span v-else class="font-semibold">{{ getBankNames }}</span>
                        <span class="font-medium text-gray-700">?</span>
                    </p>
                    <div v-if="isMultipleBanks" class="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p class="text-sm font-medium text-gray-700 mb-2">Bancos afectados:</p>
                        <ul class="text-sm text-gray-600">
                            <li v-for="bank in contingencyData" :key="bank.participantCode">
                                • {{ bank.participantName || bank.name }}
                            </li>
                        </ul>
                    </div>
                </div>
            </template>
            <template #buttons>
                <div class="flex gap-3">
                    <XButton label="Cancelar" outlined @click="visibleContingency = false"/>
                    <XButton label="Establecer" @click="saveConfirm" :loading="saving" />
                </div>
            </template>  
        </XConfirmDialog>
    </div>
</template>

<script setup lang="ts">
import { useOptions } from '~/componsables/useOptions';
import type { PaymentGatewayBankDetail } from '~/features/contingency/type';
import type { ValidationRuleResult } from '~/features/users/options.types';
import { contingencyService } from '~/services/contingencySevice';

// Composables
const route = useRoute();
const router = useRouter();
const toast = useToast();

// Estados principales
const loading = ref(true);
const saving = ref(false);
const error = ref<string | null>(null);
const contingencyData = ref<PaymentGatewayBankDetail[]>([]);

// Estados de modales
const visibleChangeCanal = ref(false);
const visibleContingency = ref(false);
const showParticipantsModal = ref(false);

// Estados del formulario
const justification = ref('');
const titleContingency = ref('');
const messageContingency = ref('');

const iasyncContingency = ref(false);
const iqrContingency = ref(false);
const oasyncContingency = ref(false);
const oqrContingency = ref(false);

const hasContingencyInconsistencies = ref(false);
const contingencyStats = ref({});

// Datos de transacciones - CAMBIA 'name' por 'transaction' para que coincida con tu template
const transactionData = ref([
    {
        id: 1,
        transaction: 'Envío de transferencias interbancarias IASYNC',
        transactionCode: 'IASYNC',
        tooltip: 'Información sobre transferencias interbancarias',
        gateways: {}
    },
    {
        id: 2,
        transaction: 'Envío de transferencias QR IQR',
        transactionCode: 'IQR',
        tooltip: 'Información sobre transferencias QR',
        gateways: {}
    }
])

// Usar el composable y cargar opciones
const { 
    paymentGatewayOptions: optionsFromComposable, 
    loading: optionsLoading, 
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

// DETECTAR QUÉ TIPO DE OPERACIÓN ES
const isChannelChange = computed(() => {
    return route.query.type === 'channel' || route.path.includes('channel');
});

const isContingency = computed(() => {
    return route.query.type === 'contingency' || route.path.includes('contingency');
});

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

// DETECTAR SI SON MÚLTIPLES BANCOS
const isMultipleBanks = computed(() => {
    return participantCodes.value.length > 1;
});

// TÍTULOS Y DESCRIPCIONES DINÁMICOS
const pageTitle = computed(() => {
    const action = isChannelChange.value ? 'Cambiar canal' : 'Establecer contingencia';
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
    console.log('bancos ruta', router.query.bankNames);
    
    // Fallback: obtener desde datos cargados (comportamiento original)
    if (!contingencyData.value?.length) return 'Cargando...';
    
    return contingencyData.value
        .map(bank => bank.participantName || bank.name)
        .join(',');
});

const getBankNamesArray = computed(() => {
    const names = getBankNames.value;
    if (typeof names === 'string' && names.includes(',')) {
        return names.split(',').map(name => name.trim()).filter(name => name.length > 0);
    }
    return [names];
});

// Detectar si los bancos tienen configuraciones inconsistentes
const hasInconsistentConfigurations = computed(() => {
    if (!isMultipleBanks.value || contingencyData.value.length < 2) return false;

    const firstBank = contingencyData.value[0];

    return contingencyData.value.some((bank, index) => {
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

const getSelectedChannelFromTable = computed(() => {
    // Para cambio de canal, buscar qué canal está seleccionado en la tabla
    if (!isChannelChange.value) return '';
    
    // Buscar en la primera transacción qué gateway está seleccionado
    const firstTransaction = transactionData.value[0];
    if (!firstTransaction) return '';
    
    // Encontrar el gateway que está marcado como true
    const selectedGateway = paymentGatewayOptions.value.find(gateway => 
        firstTransaction.gateways[gateway.value] === true
    );
    
    return selectedGateway ? selectedGateway.label : '';
});


const onGatewayChange = (transactionRow, gatewayValue, event) => {
    // FIX: PrimeVue Checkbox a veces no envía event.checked correctamente
    const isChecked = event?.checked ?? event?.target?.checked ?? !transactionRow.gateways[gatewayValue];
    
    console.log('🔄 Cambio en gateway CORREGIDO:', {
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
                console.log(`   ⬜ Deseleccionando ${gateway.label}`);
            }
        });
        console.log(`   ✅ Seleccionando ${paymentGatewayOptions.value.find(opt => opt.value === gatewayValue)?.label}`);
    }
    
    // Debug: Mostrar estado final de la fila
    console.log('   Estado final de la fila:', transactionRow.gateways);
};


// FUNCIÓN PARA MANEJAR CLICK EN GUARDAR/CAMBIAR
const handleSaveClick = () => {
    if (isChannelChange.value) {
        visibleChangeCanal.value = true;
    } else {
        visibleContingency.value = true;
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

    // 2. Primario operativo pero en contingencia temporal
    if (isPrimary_ && isOperational_ && isTemporarilyActive_) {
        return {  estado: 'primario_contingencia_activa',  isContingency: true, descripcion: 'Primario operativo en contingencia', canBeSelected: false };
    }

    // 3. Primario fuera de servicio
    if (isPrimary_ && !isOperational_ && !isTemporarilyActive_) {
        return { 
            estado: 'primario_fuera_servicio', 
            isContingency: true, 
            descripcion: 'Primario fuera de servicio',
            canBeSelected: false 
        };
    }

    // 4. Primario en contingencia (no operativo pero marcado temporal) - CORREGIDA
    if (isPrimary_ && !isOperational_ && isTemporarilyActive_) {
        return { 
            estado: 'primario_contingencia', 
            isContingency: true, 
            descripcion: 'Primario en contingencia',
            canBeSelected: false 
        };
    }

    // 5. Canal secundario activo temporalmente (por contingencia)
    if (!isPrimary_ && isOperational_ && isTemporarilyActive_) {
        return { 
            estado: 'secundario_contingencia', 
            isContingency: true, 
            descripcion: 'Canal secundario por contingencia',
            canBeSelected: false // Ya está en uso por contingencia
        };
    }

    // 6. Canal activo pero no temporal (posible promoción a primario)
    if (!isPrimary_ && isOperational_ && !isTemporarilyActive_) {
        return { 
            estado: 'secundario_disponible', 
            isContingency: false, 
            descripcion: 'Canal secundario disponible',
            canBeSelected: true // ESTE ES EL CLAVE - puede ser seleccionado
        };
    }

    // 7. Estado inconsistente (no debería pasar)
    if (!isPrimary_ && !isOperational_ && isTemporarilyActive_) {
        return { 
            estado: 'inconsistente', 
            isContingency: true, 
            descripcion: 'Estado inconsistente - inactivo pero temporal',
            canBeSelected: false 
        };
    }

    // 8. Canal disponible pero no en uso
    if (!isPrimary_ && !isOperational_ && !isTemporarilyActive_) {
        return { 
            estado: 'disponible_sin_uso', 
            isContingency: false, 
            descripcion: 'Canal disponible sin uso',
            canBeSelected: true 
        };
    }

    // Por defecto
    return { 
        estado: 'desconocido', 
        isContingency: false, 
        descripcion: 'Estado desconocido',
        canBeSelected: false 
    };
};

//FUNCIÓN PARA FILTRAR SOLO TRANSACCIONES OUTBOUND
const isOutboundTransaction = (transactionCode) => {
    // Solo las transacciones de SALIDA pueden cambiar de canal
    const outboundTransactions = ['IASYNC', 'IQR']; // Envío interbancarias y QR
    return outboundTransactions.includes(transactionCode);
};

//MARCAR CHECKS DE CANAL - VERSIÓN MEJORADA CON VALIDACIÓN
const marcarCheckboxesAutomaticamente = () => {
    console.log('🪄 === INICIANDO MARCADO AUTOMÁTICO ===');
    
    // Primero, limpiar y mostrar opciones disponibles
    console.log('Opciones de gateway disponibles:', 
        paymentGatewayOptions.value.map(opt => `${opt.label} (${opt.value})`).join(', ')
    );
    
    transactionData.value.forEach(filaTabla => {
        console.log(`\n📋 Procesando ${filaTabla.transactionCode}:`);
        
        // FILTRAR: Solo procesar transacciones outbound
        if (!isOutboundTransaction(filaTabla.transactionCode)) {
            console.log(`   ⏭️ Omitiendo ${filaTabla.transactionCode} - es transacción inbound`);
            // Inicializar como vacío para transacciones inbound
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
        console.log(`   🔍 Analizando ${contingencyData.value.length} bancos:`);
        
        const analisisPorGateway = {};
        
        contingencyData.value.forEach((banco, index) => {
            console.log(`      🏦 Banco ${index + 1}: ${banco.participantName}`);
            
            const transaccionEncontrada = banco.transactions?.find(
                t => t.transactionCode === filaTabla.transactionCode
            );
            
            if (transaccionEncontrada) {
                transaccionEncontrada.paymentGateways?.forEach(gatewayServer => {
                    const estadoGateway = validateGatewayState(gatewayServer);
                    const gatewayLabel = paymentGatewayOptions.value.find(
                        opt => opt.value === gatewayServer.paymentGatewayCode
                    )?.label || gatewayServer.paymentGatewayCode;
                    
                    if (!analisisPorGateway[gatewayServer.paymentGatewayCode]) {
                        analisisPorGateway[gatewayServer.paymentGatewayCode] = {
                            label: gatewayLabel,
                            estados: [],
                            puedeSeleccionarse: [],
                            countDisponible: 0,
                            countPrimarioActivo: 0
                        };
                    }
                    
                    const analysis = analisisPorGateway[gatewayServer.paymentGatewayCode];
                    analysis.estados.push(estadoGateway.estado);
                    analysis.puedeSeleccionarse.push(estadoGateway.canBeSelected);
                    
                    if (estadoGateway.canBeSelected) {
                        analysis.countDisponible++;
                    }
                    
                    if (estadoGateway.estado === 'primario_activo') {
                        analysis.countPrimarioActivo++;
                    }
                    
                    console.log(`         ${gatewayLabel}: ${estadoGateway.descripcion} (Seleccionable: ${estadoGateway.canBeSelected})`);
                });
            } else {
                console.log(`         ❌ Sin esta transacción en el banco`);
            }
        });
        
        // Decidir qué marcar basado en el análisis
        console.log(`   📊 Resumen de análisis:`);
        const totalBancos = contingencyData.value.length;
        
        Object.keys(analisisPorGateway).forEach(gatewayCode => {
            const analysis = analisisPorGateway[gatewayCode];
            
            console.log(`      ${analysis.label}:`);
            console.log(`         - Disponible en ${analysis.countDisponible}/${totalBancos} bancos`);
            console.log(`         - Primario activo en ${analysis.countPrimarioActivo}/${totalBancos} bancos`);
            
            // REGLA: Solo marcar si es primario activo en TODOS los bancos
            if (analysis.countPrimarioActivo === totalBancos) {
                filaTabla.gateways[gatewayCode] = true;
                console.log(`         ✅ MARCADO - Canal actual activo`);
            } else if (analysis.countDisponible === totalBancos) {
                console.log(`         🔵 Disponible pero no marcado - Canal alternativo`);
            } else {
                console.log(`         ❌ No disponible completamente`);
            }
        });
        
        console.log(`   🎯 Estado final:`, filaTabla.gateways);
    });
    
    console.log('\n✅ === MARCADO AUTOMÁTICO COMPLETADO ===');
};


const aplicarEstadosContingencia = () => {
  console.log('🔄 Aplicando estados de contingencia a los switches...');
  
  // Mapeo de códigos de transacción a sus switches correspondientes
  const mapeoSwitches = {
    'IASYNC': 'iasyncContingency', // Envío interbancarias
    'IQR': 'iqrContingency',    // Envío QR
    'OASYNC': 'oasyncContingency', // Recepción interbancarias  
    'OQR': 'oqrContingency'     // Recepción QR
  };
  
  // Inicializar todos como false
  iasyncContingency.value = false;
  iqrContingency.value = false;
  oasyncContingency.value = false;
  oqrContingency.value = false;
  
  // Recorrer todos los bancos y sus transacciones
  contingencyData.value.forEach(bank => {
    console.log(`🏦 Analizando ${bank.participantName}:`);
    
    bank.transactions?.forEach(transaction => {
      const switchVariable = mapeoSwitches[transaction.transactionCode];
      
      if (switchVariable) {
        let hayContingencia = false;
        
        transaction.paymentGateways?.forEach(gateway => {
          const estado = validateGatewayState(gateway);
          console.log(`  📋 ${transaction.transactionCode}: ${estado.descripcion} - Contingencia: ${estado.isContingency}`);
          
          if (estado.isContingency) {
            hayContingencia = true;
          }
        });
        
        // Marcar el switch correspondiente
        switch(switchVariable) {
          case 'iasyncContingency':
            iasyncContingency.value = hayContingencia;
            break;
          case 'iqrContingency':
            iqrContingency.value = hayContingencia;
            break;
          case 'oasyncContingency':
            oasyncContingency.value = hayContingencia;
            break;
          case 'oqrContingency':
            oqrContingency.value = hayContingencia;
            break;
        }
        
        console.log(`  ✅ Switch ${switchVariable} = ${hayContingencia}`);
      }
    });
  });
  
  console.log('🎯 RESULTADO FINAL DE SWITCHES:', {
    IASYNC: iasyncContingency.value,
    IQR: iqrContingency.value,
    OASYNC: oasyncContingency.value,
    OQR: oqrContingency.value
  });
};

// FUNCIÓN PARA ESTADÍSTICAS BASADA EN SWITCHES (MANTIENE TU PAYLOAD ORIGINAL)
const aplicarEstadisticasBasadasEnSwitches = () => {
    console.log('Calculando estadísticas basadas en switches activados...');
    
    const stats = {
        'IASYNC': { enContingencia: 0, total: 0 },
        'IQR': { enContingencia: 0, total: 0 },
        'OASYNC': { enContingencia: 0, total: 0 },
        'OQR': { enContingencia: 0, total: 0 }
    };

    // Contar totales por cada transacción en todos los bancos
    contingencyData.value.forEach(bank => {
        bank.transactions?.forEach(transaction => {
            if (stats[transaction.transactionCode]) {
                stats[transaction.transactionCode].total++;
            }
        });
    });

    // Aplicar contingencia basada en los switches activados
    // Si un switch está activado, TODAS las instancias de esa transacción entran en contingencia
    if (iasyncContingency.value) {
        stats['IASYNC'].enContingencia = stats['IASYNC'].total;
    }
    if (iqrContingency.value) {
        stats['IQR'].enContingencia = stats['IQR'].total;
    }
    if (oasyncContingency.value) {
        stats['OASYNC'].enContingencia = stats['OASYNC'].total;
    }
    if (oqrContingency.value) {
        stats['OQR'].enContingencia = stats['OQR'].total;
    }

    // Actualizar variables reactivas
    contingencyStats.value = stats;
    
    // No hay inconsistencias cuando usamos switches (todos se comportan igual)
    hasContingencyInconsistencies.value = false;

    console.log('Estadísticas finales basadas en switches:', stats);
    console.log('Switches activados:', {
        IASYNC: iasyncContingency.value,
        IQR: iqrContingency.value, 
        OASYNC: oasyncContingency.value,
        OQR: oqrContingency.value
    });
};

// CARGAR DATOS
const loadPaymentGatewayData = async () => {
    try {
        loading.value = true;
        error.value = null;
        
        console.log('CÓDIGOS A BUSCAR:', participantCodes.value);        
        if (!participantCodes.value.length) {
            throw new Error('No se encontraron códigos de participantes');
        }

        const response = await contingencyService.getParticipantsByCode(participantCodes.value);

        contingencyData.value = response.participants || response;
        console.log('RESPUESTA DEL SERVIDOR: parseada', contingencyData.value)
        if(isChannelChange.value){
            marcarCheckboxesAutomaticamente();

            console.log('Vamos a revisar las transacciones de cada banco:');
            
            contingencyData.value.forEach(bank => {
                console.log(`🏦 Banco: ${bank.participantName}`);
                if (bank.transactions && bank.transactions.length > 0) {
                    bank.transactions.forEach(transaction => {
                    console.log(`Transacción encontrada: ${transaction.transactionCode}`);
                    
                    if (transaction.paymentGateways && transaction.paymentGateways.length > 0) {
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
            console.log('Camino contingencia');
            contingencyData.value.forEach(bank => {
                bank.transactions?.forEach(transaction => {
                    transaction.paymentGateways?.forEach(gateway => {
                        const result = validateGatewayState(gateway);
                        console.log(`${bank.participantName} - ${transaction.transactionCode} - ${gateway.paymentGatewayAcronym}:`, result);
                    });
                });
            });
            // AGREGAR - Inicializar switches basándose en estado actual del servidor
    aplicarEstadosContingencia();
    
    // DESPUÉS calcular estadísticas basándose en los switches
    aplicarEstadisticasBasadasEnSwitches();
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

// VERSIÓN CON ORDEN CORRECTO PARA EL BACKEND
const generateOrderedPayload = () => {
    console.log('\n=== GENERANDO PAYLOAD CON ORDEN CORRECTO ===');
    
    const payload = {
        participants: []
    };

    contingencyData.value.forEach((bank, bankIndex) => {
        console.log(`\n--- PROCESANDO BANCO ${bankIndex + 1}: ${bank.participantName} ---`);
        
        const participant = {
            participantCode: bank.participantCode || bank.code,
            transactions: []
        };

        transactionData.value.forEach((transactionRow) => {
            console.log(`\nProcesando transacción ${transactionRow.transactionCode}`);
            
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
            
            console.log(`   Usuario seleccionó: ${selectedGatewayLabel} (${selectedGatewayCode})`);

            // Buscar transacción en el servidor
            const currentBankTransaction = bank.transactions?.find(
                t => t.transactionCode === transactionRow.transactionCode
            );
            
            if (!currentBankTransaction) {
                console.log(`   Transacción no encontrada en servidor`);
                return;
            }

            const transaction = {
                transactionCode: transactionRow.transactionCode,
                paymentGateways: []
            };

            // PASO 1: PRIMERO - Agregar el gateway que ERA PRIMARIO ANTES (degradado)
            console.log(`\n   PASO 1: Buscando gateway primario anterior`);
            
            const currentPrimaryGateway = currentBankTransaction.paymentGateways?.find(gw => {
                const state = validateGatewayState(gw);
                return state.estado === 'primario_activo';
            });

            if (currentPrimaryGateway && currentPrimaryGateway.paymentGatewayCode !== selectedGatewayCode) {
                const oldPrimaryLabel = paymentGatewayOptions.value
                    .find(opt => opt.value === currentPrimaryGateway.paymentGatewayCode)?.label;
                
                console.log(`      Primario anterior: ${oldPrimaryLabel} (${currentPrimaryGateway.paymentGatewayCode})`);
                console.log(`      🔄 AGREGANDO PRIMERO - Degradando a secundario`);
                
                // PRIMERO: El gateway original degradado
                transaction.paymentGateways.push({
                    paymentGatewayCode: currentPrimaryGateway.paymentGatewayCode,
                    isPrimary: false,  // Ahora es secundario
                    isOperational: true,
                    isTemporarilyActive: false,
                    changeReason: `Canal degradado de primario a secundario: ${justification.value}`
                });
                
            } else if (currentPrimaryGateway && currentPrimaryGateway.paymentGatewayCode === selectedGatewayCode) {
                console.log(`      El canal seleccionado ya era el primario - sin cambio`);
            } else {
                console.log(`      No se encontró primario anterior`);
            }

            // PASO 2: SEGUNDO - Agregar el gateway SELECCIONADO (nuevo primario)
            console.log(`\n   PASO 2: Agregando nuevo primario`);
            console.log(`      Nuevo primario: ${selectedGatewayLabel} (${selectedGatewayCode})`);
            console.log(`      🆕 AGREGANDO SEGUNDO - Promoviendo a primario`);
            
            // SEGUNDO: El gateway seleccionado como nuevo primario
            transaction.paymentGateways.push({
                paymentGatewayCode: selectedGatewayCode,
                isPrimary: true,   // Nuevo primario
                isOperational: true,
                isTemporarilyActive: false,
                changeReason: `Canal promovido a primario: ${justification.value}`
            });

            // PASO 3: TERCERO - Mantener otros gateways existentes (si los hay)
            console.log(`\n   PASO 3: Verificando otros gateways existentes`);
            
            let otherGatewaysAdded = 0;
            currentBankTransaction.paymentGateways?.forEach(existingGateway => {
                const alreadyIncluded = transaction.paymentGateways.some(
                    pg => pg.paymentGatewayCode === existingGateway.paymentGatewayCode
                );

                if (!alreadyIncluded) {
                    const label = paymentGatewayOptions.value
                        .find(opt => opt.value === existingGateway.paymentGatewayCode)?.label;
                    
                    console.log(`      Manteniendo: ${label} con estado actual`);
                    
                    transaction.paymentGateways.push({
                        paymentGatewayCode: existingGateway.paymentGatewayCode,
                        isPrimary: existingGateway.isPrimary,
                        isOperational: existingGateway.isOperational,
                        isTemporarilyActive: existingGateway.isTemporarilyActive,
                        changeReason: `Estado mantenido: ${justification.value}`
                    });
                    
                    otherGatewaysAdded++;
                }
            });
            
            if (otherGatewaysAdded === 0) {
                console.log(`      No hay otros gateways para mantener`);
            }

            // MOSTRAR ORDEN FINAL
            console.log(`\n   📋 ORDEN FINAL DE GATEWAYS PARA ${transactionRow.transactionCode}:`);
            transaction.paymentGateways.forEach((pg, index) => {
                const label = paymentGatewayOptions.value.find(opt => opt.value === pg.paymentGatewayCode)?.label;
                const role = pg.isPrimary ? 'PRIMARIO' : 'SECUNDARIO';
                console.log(`      ${index + 1}. ${label} (${pg.paymentGatewayCode}): ${role}`);
            });

            participant.transactions.push(transaction);
        });

        if (participant.transactions.length > 0) {
            payload.participants.push(participant);
        }
    });

    return payload;
};


const validateSelectionBeforePayload = () => {
    console.log('\n🔍 === VALIDANDO SELECCIONES ANTES DEL PAYLOAD ===');
    
    let isValid = true;
    let validationDetails = [];
    
    transactionData.value.forEach(row => {
        if (!isOutboundTransaction(row.transactionCode)) {
            return; // Skip inbound transactions
        }
        
        const selectedGateways = Object.keys(row.gateways)
            .filter(key => row.gateways[key] === true);
            
        const detail = {
            transactionCode: row.transactionCode,
            selectedCount: selectedGateways.length,
            selectedGateways: selectedGateways.map(code => {
                const label = paymentGatewayOptions.value.find(opt => opt.value === code)?.label;
                return `${label} (${code})`;
            }),
            isValid: selectedGateways.length === 1
        };
        
        validationDetails.push(detail);
        
        if (!detail.isValid) {
            isValid = false;
        }
        
        console.log(`${row.transactionCode}:`);
        console.log(`   Seleccionados: ${detail.selectedCount}`);
        console.log(`   Detalles: ${detail.selectedGateways.join(', ') || 'Ninguno'}`);
        console.log(`   Estado: ${detail.isValid ? '✅ Válido' : '❌ Inválido'}`);
    });
    
    console.log(`\nRESULTADO GENERAL: ${isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
    
    return { isValid, details: validationDetails };
};

const verifyPayloadOrder = (payload) => {
    console.log('\n🔍 === VERIFICANDO ORDEN DEL PAYLOAD ===');
    
    payload.participants.forEach(participant => {
        console.log(`\nParticipante: ${participant.participantCode}`);
        
        participant.transactions.forEach(transaction => {
            console.log(`\n  Transacción: ${transaction.transactionCode}`);
            console.log(`  Cantidad de gateways: ${transaction.paymentGateways.length}`);
            
            transaction.paymentGateways.forEach((pg, index) => {
                const label = paymentGatewayOptions.value.find(opt => opt.value === pg.paymentGatewayCode)?.label;
                const role = pg.isPrimary ? 'PRIMARIO' : 'SECUNDARIO';
                const order = index === 0 ? 'PRIMERO' : index === 1 ? 'SEGUNDO' : `POSICIÓN ${index + 1}`;
                
                console.log(`    ${order}: ${label} - ${role}`);
                
                // Validar orden correcto según el backend
                if (index === 0 && pg.isPrimary === true) {
                    console.log(`      ⚠️  ATENCIÓN: El primer gateway es primario - puede causar problemas`);
                }
                if (index === 1 && pg.isPrimary === true) {
                    console.log(`      ✅ CORRECTO: El segundo gateway es el nuevo primario`);
                }
            });
        });
    });
};

const saveConfirm = async () => {
    try {
        saving.value = true;

        if (isChannelChange.value) {
            
             console.log('\n🚀 === INICIANDO CAMBIO DE CANAL CON ORDEN CORRECTO ===');
            
            // Validar selecciones
            const validation = validateSelectionBeforePayload();
            if (!validation.isValid) {
                toast.add({
                    severity: 'error',
                    summary: 'Error de validación',
                    detail: 'Debe seleccionar exactamente un canal para cada transacción',
                    life: 5000
                });
                return;
            }

            // Generar payload con orden correcto
            const payload = generateOrderedPayload();
            
            // Verificar orden antes de enviar
            verifyPayloadOrder(payload);
            
            console.log('\n📋 PAYLOAD FINAL CON ORDEN CORRECTO:');
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
            // // LÓGICA PARA ESTABLECER CONTINGENCIA
            // const payload = {
            //     contingencyTitle: titleContingency.value,
            //     contingencyDetail: messageContingency.value,
            //     isOperational: false, // Según tu JSON debe ser true
            //     participants: []
            // };

            // // Mapeo de switches a códigos de transacción
            // const transactionSwitches = {
            //     'IASYNC': iasyncContingency.value,
            //     'IQR': iqrContingency.value,
            //     'OASYNC': oasyncContingency.value,
            //     'OQR': oqrContingency.value
            // };

            // // Para cada banco/participante
            // contingencyData.value.forEach(bank => {
            //     const participant = {
            //         participantCode: bank.participantCode || bank.code,
            //         transactions: []
            //     };

            //     // Procesar solo las transacciones donde el switch está activado
            //     Object.entries(transactionSwitches).forEach(([transactionCode, switchValue]) => {
            //         if (switchValue) {
            //             // Buscar la transacción en los datos del banco
            //             const bankTransaction = bank.transactions?.find(t => t.transactionCode === transactionCode);
                        
            //             if (bankTransaction) {
            //                 const transaction = {
            //                     transactionCode: transactionCode,
            //                     paymentGateways: []
            //                 };

            //                 // Para cada gateway de esta transacción
            //                 bankTransaction.paymentGateways?.forEach(gateway => {
            //                     transaction.paymentGateways.push({
            //                         paymentGatewayCode: gateway.paymentGatewayCode,
            //                         changeReason: `Contingencia establecida para ${gateway.paymentGatewayAcronym}: ${justification.value}`
            //                     });
            //                 });

            //                 if (transaction.paymentGateways.length > 0) {
            //                     participant.transactions.push(transaction);
            //                 }
            //             }
            //         }
            //     });

            //     // Solo agregar participante si tiene transacciones con cambios
            //     if (participant.transactions.length > 0) {
            //         payload.participants.push(participant);
            //     }
            // });

            // // Validar que hay al menos un switch activado
            // const hasActiveSwitch = Object.values(transactionSwitches).some(value => value === true);
            // if (!hasActiveSwitch) {
            //     throw new Error('Debe activar al menos una transacción para establecer la contingencia');
            // }

            // //console.log('Payload contingencia:', JSON.stringify(payload, null, 2));

            // console.log('Payload contingencia:',payload);

            // const responseContingency = await contingencyService.updateContingency(payload);
            // console.log('Response contingency: ', responseContingency)

            // if(responseContingency){
            //     toast.add({
            //         severity: 'success',
            //         summary: 'Éxito',
            //         detail: `Contingencia establecida exitosamente para ${payload.participants.length} participantes`,
            //         life: 5000
            //     });
            // }
                    // Mapeo de switches a códigos de transacción
        const transactionSwitches = {
            'IASYNC': iasyncContingency.value,
            'IQR': iqrContingency.value,
            'OASYNC': oasyncContingency.value,
            'OQR': oqrContingency.value
        };

        // Validar que hay al menos un switch activado
        const hasActiveSwitch = Object.values(transactionSwitches).some(value => value === true);
        
        if (!hasActiveSwitch) {
            // Si no hay switches activados, significa que queremos QUITAR la contingencia
            console.log('🟢 Quitando contingencia - todos los switches están desactivados');
            
            const payload = {
                contingencyTitle: "Fin de contingencia",
                contingencyDetail: "Normalización de servicios - fin de contingencia",
                isOperational: true, // TRUE para indicar que volvemos a operación normal
                participants: []
            };

            // Incluir TODOS los participantes para normalizar
            contingencyData.value.forEach(bank => {
                const participant = {
                    participantCode: bank.participantCode || bank.code,
                    transactions: []
                };

                // Incluir TODAS las transacciones para normalizar
                bank.transactions?.forEach(bankTransaction => {
                    const transaction = {
                        transactionCode: bankTransaction.transactionCode,
                        paymentGateways: []
                    };

                    bankTransaction.paymentGateways?.forEach(gateway => {
                        transaction.paymentGateways.push({
                            paymentGatewayCode: gateway.paymentGatewayCode,
                            changeReason: `Normalización de servicios - fin de contingencia`
                        });
                    });

                    if (transaction.paymentGateways.length > 0) {
                        participant.transactions.push(transaction);
                    }
                });

                if (participant.transactions.length > 0) {
                    payload.participants.push(participant);
                }
            });

            console.log('🔄 Payload para QUITAR contingencia:', payload);
            
            const responseContingency = await contingencyService.updateContingency(payload);
            
            if(responseContingency) {
                toast.add({
                    severity: 'success',
                    summary: 'Contingencia Finalizada',
                    detail: `Servicios normalizados exitosamente para ${payload.participants.length} participantes`,
                    life: 5000
                });
            }
            
        } else {
            // Si hay switches activados, establecer contingencia
            console.log('🔴 Estableciendo contingencia - switches activados:', 
                Object.entries(transactionSwitches).filter(([key, value]) => value));
            
            const payload = {
                contingencyTitle: titleContingency.value,
                contingencyDetail: messageContingency.value,
                isOperational: false, // FALSE para indicar contingencia activa
                participants: []
            };

            // Para cada banco/participante
            contingencyData.value.forEach(bank => {
                const participant = {
                    participantCode: bank.participantCode || bank.code,
                    transactions: []
                };

                // Procesar solo las transacciones donde el switch está activado
                Object.entries(transactionSwitches).forEach(([transactionCode, switchValue]) => {
                    if (switchValue) {
                        // Buscar la transacción en los datos del banco
                        const bankTransaction = bank.transactions?.find(t => t.transactionCode === transactionCode);
                        
                        if (bankTransaction) {
                            const transaction = {
                                transactionCode: transactionCode,
                                paymentGateways: []
                            };

                            // Para cada gateway de esta transacción
                            bankTransaction.paymentGateways?.forEach(gateway => {
                                transaction.paymentGateways.push({
                                    paymentGatewayCode: gateway.paymentGatewayCode,
                                    changeReason: `Contingencia establecida para ${gateway.paymentGatewayAcronym}: ${justification.value}`
                                });
                            });

                            if (transaction.paymentGateways.length > 0) {
                                participant.transactions.push(transaction);
                            }
                        }
                    }
                });

                // Solo agregar participante si tiene transacciones con cambios
                if (participant.transactions.length > 0) {
                    payload.participants.push(participant);
                }
            });

            console.log('🔄 Payload para ESTABLECER contingencia:', payload);

            const responseContingency = await contingencyService.updateContingency(payload);
            
            if(responseContingency) {
                toast.add({
                    severity: 'warn',
                    summary: 'Contingencia Establecida',
                    detail: `Contingencia establecida exitosamente para ${payload.participants.length} participantes`,
                    life: 5000
                });
            }
        }
            
        }
        // Cerrar modales
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

const requiredRule = (value:unknown):ValidationRuleResult => {
    return value !== null && value !== undefined && value !== '' 
        ? true 
        : 'El campo es requerido'
}

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

// Agregar esto después de tus variables reactivas
watch([iasyncContingency, iqrContingency, oasyncContingency, oqrContingency], () => {
    // Recalcular estadísticas cada vez que cambia un switch
    if (isContingency.value && contingencyData.value.length > 0) {
        aplicarEstadisticasBasadasEnSwitches();
    }
}, { deep: true });

</script>

