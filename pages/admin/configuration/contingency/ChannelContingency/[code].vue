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
                <!-- Botón Ver Participantes - Solo mostrar cuando hay múltiples bancos -->
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
                        <!-- Sección Canal - Solo para "Cambiar canal" -->
                        <div v-if="isChannelChange" class="flex flex-col justify-center gap-8">
                            <Divider align="left" type="solid">
                                <b>Canal</b>
                            </Divider>
                            <span class="text-normal font-normal text-gray-700">
                        Selecciona el canal al que deseas cambiar las transacciones del participante.
                            </span>
                            <template v-if="isChannelChange">
                              <DataTable :value="transactionData" class="w-full">
                                <!-- Columna fija de Transacción -->
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
                                        @change="onGatewayChange(data, gateway.value, $event)"
                                      />
                                    </div>
                                  </template>
                                </Column>
                              </DataTable>
                            </template>
                            <template v-else>
                                hola
                                <div class="flex items-center border rounded-[16px]">
                                    <Checkbox 
                                        v-model="transInterbancaria" 
                                        inputId="trans-inter" 
                                        :binary="true"
                                        class="mr-2"
                                    />
                                    <label for="trans-inter" class="text-gray-1200 cursor-pointer">
                                        Envío de transferencias interbancarias
                                    </label>
                                    <Icon name="x:info-empty" class="text-sky-500 w-[14.666px] h-[14.666px]">
                                    </Icon>
                                </div>
                                <div class="flex items-center gap-4">
                            <Checkbox 
                                v-model="qrInterbancaria" 
                                inputId="qr-inter" 
                                :binary="true"
                                class="mr-2"
                            />
                            <label for="qr-inter" class="text-gray-1200 cursor-pointer">
                                Envío de transferencias QR
                            </label>
                            <Icon name="x:info-empty" class="text-sky-500 w-[14.666px] h-[14.666px]">
                            </Icon>
                                </div>
                                <div class="flex items-center gap-4">
                            <Checkbox 
                                v-model="transRecepcion" 
                                inputId="trans-recep" 
                                :binary="true"
                                class="mr-2"
                            />
                            <label for="trans-recep" class="text-gray-1200 cursor-pointer">
                                Recepción transferencia interbancaria
                            </label>
                            <Icon name="x:info-empty" class="text-sky-500 w-[14.666px] h-[14.666px]">
                            </Icon>
                                </div>
                                <div class="flex items-center gap-4">
                            <Checkbox 
                                v-model="qrRecepcion" 
                                inputId="qr-recep" 
                                :binary="true"
                                class="mr-2"
                            />
                            <label for="qr-recep" class="text-gray-1200 cursor-pointer">
                                Recepción transferencia QR
                            </label>
                            <Icon name="x:info-empty" class="text-sky-500 w-[14.666px] h-[14.666px]">
                            </Icon>
                                </div>
                            </template>
                        </div>
                        <div class="flex flex-col justify-center gap-8">
                            <div v-if="!isChannelChange" class="flex flex-col justify-center gap-8">
                                <Divider align="left" type="solid">
                                    <b>Transacciones</b>
                                </Divider>
                                <span class="text-normal font-normal text-gray-700">
                                    Ajusta la configuración de las transacciones involucradas.                            
                                </span>
                                <XCard class="border border-gray-200 ">
                                    <template #content>
                                        <div class="flex flex-row justify-between">
                                            <div class="self-center">
                                                <div class="flex gap-4">
                                                    <span>Envío de transferencias interbancarias</span>
                                                    <span v-tooltip="'Salida de transferencias regulares.'">
                                                        <Icon name="x:info-empty" class="text-sky-500 w-[14.666px] h-[14.666px]"/>
                                                    </span>
                                                </div>
                                                <XTag severity="success" value="Sin contingencia"></XTag>
                                            </div>
                                            <div class="self-center">
                                                <XToggleSwitch v-model="checkedContingency"/>
                                            </div>
                                        </div>
                                    </template>
                                </XCard> 
                                 <XCard class="border border-gray-200 ">
                                    <template #content>
                                        <div class="flex flex-row justify-between">
                                            <div class="self-center">
                                                <div class="flex gap-4">
                                                    <span>Envío de transferencias QR</span>
                                                    <span v-tooltip="'Procesamiento de transacciones de pago por QR.'">
                                                        <Icon name="x:info-empty" class="text-sky-500 w-[14.666px] h-[14.666px]"/>
                                                    </span>
                                                </div>
                                                <XTag severity="danger" value="Con Contingencia"></XTag>
                                            </div>
                                            <div class="self-center">
                                                <XToggleSwitch v-model="checkedContingency"/>
                                            </div>
                                        </div>
                                    </template>
                                </XCard>
                                 <XCard class="border border-gray-200 ">
                                    <template #content>
                                        <div class="flex flex-row justify-between">
                                            <div class="self-center">
                                                <div class="flex gap-4">
                                                    <span>Recepción transferencia interbancaria</span>
                                                    <span v-tooltip="'Salida de transferencias regulares.'">
                                                        <Icon name="x:info-empty" class="text-sky-500 w-[14.666px] h-[14.666px]"/>
                                                    </span>
                                                </div>
                                                <XTag severity="success" value="Sin contingencia"></XTag>
                                            </div>
                                            <div class="self-center">
                                                <XToggleSwitch v-model="checkedContingency"/>
                                            </div>
                                        </div>
                                    </template>
                                </XCard>
                                 <XCard class="border border-gray-200 ">
                                    <template #content>
                                        <div class="flex flex-row justify-between">
                                            <div class="self-center">
                                                <div class="flex gap-4">
                                                    <span>Recepción transferencia QR</span>
                                                    <span v-tooltip="'Procesamiento de transacciones de cobro por QR.'">
                                                        <Icon name="x:info-empty" class="text-sky-500 w-[14.666px] h-[14.666px]"/>
                                                    </span>
                                                </div>
                                                <XTag severity="danger" value="Con Contingencia"></XTag>
                                            </div>
                                            <div class="self-center">
                                                <XToggleSwitch v-model="checkedContingency"/>
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
        </div> 
        
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
                    :disabled="!isFormValid"
                    :loading="saving"
                />
            </div>
        </div>

        <!-- Modal para Ver Participantes - Opción 1: XDialog con visible -->
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
            <span class="text-gray-900">
                {{ bankName.trim() }}
            </span>
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

        <!-- Modal para Cambiar Canal -->
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
                        <span class="font-semibold">{{ getSelectedChannelLabel }}?</span>
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

        <!-- Modal para Establecer Contingencia -->
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
                    <!-- Mostrar lista de bancos cuando son múltiples -->
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
const checkedContingency = ref(false);
const transInterbancaria = ref(false);
const qrInterbancaria = ref(false);
const transRecepcion = ref(false);
const qrRecepcion = ref(false);

// Estados de archivos
const fileStates = reactive(new Map());
const selectedFile = ref<File | null>(null);
const fileBase64 = ref<string>('');
const isVerifying = ref(false);
const isVerified = ref(false);

// Datos de transacciones - CAMBIA 'name' por 'transaction' para que coincida con tu template
const transactionData = ref([
    {
        id: 1,
        transaction: 'Envío de transferencias interbancarias IASYNC',
        transactioCode: 'IASYNC',
        tooltip: 'Información sobre transferencias interbancarias',
        gateways: {}
    },
    {
        id: 2,
        transaction: 'Envío de transferencias QR IQR',
        transactioCode: 'IQR',
        tooltip: 'Información sobre transferencias QR',
        gateways: {}
    }
])

const onGatewayChange = (transactionRow, gatewayValue, event) => {
  console.log('Cambio en gateway:', {
    transaction: transactionRow.transaction,
    transactionCode: transactionRow.transactionCode,
    gateway: gatewayValue,
    checked: event.checked
  });

  // Si se selecciona un checkbox, deseleccionar los demás en la misma fila
  if (event.checked) {
    paymentGatewayOptions.value.forEach(gateway => {
      if (gateway.value !== gatewayValue) {
        transactionRow.gateways[gateway.value] = false;
      }
    });
  }
  // Si se deselecciona, no hacer nada (permitir que todos estén deseleccionados)
};



// MAPEO DE CÓDIGOS DE CANAL
const channelCodeMap = {
    'ACL': '1426',
    'MLD': '1000', 
};

// Configuración de canales
const channelOptions = ref([
    { value: 'ACL', label: 'ACL' }, 
    { value: 'MLD', label: 'MLD' },
]);

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
    console.log('Route debug:', {
        path: route.path,
        params: route.params,
        query: route.query
    });

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
            console.log(`Un solo código desde params.${paramName}:`, paramValue);
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

// TÍTULOS Y DESCRIPCIONES DINÁMICOS - MEJORADOS
const pageTitle = computed(() => {
    const action = isChannelChange.value ? 'Cambiar canal' : 'Establecer contingencia';

    if (isMultipleBanks.value) {
        return `${action}`;
    }
    
    return `${action} - ${getBankNames.value}`;
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

// COMPUTED PARA ETIQUETA DEL CANAL SELECCIONADO
const getSelectedChannelLabel = computed(() => {
    const option = channelOptions.value.find(opt => opt.value === selectedChannelValue.value);
    return option ? option.label : '';
});

// VALIDACIÓN DEL FORMULARIO
const isFormValid = computed(() => {
    const hasJustification = justification.value.trim().length > 0;
    const hasChannel = isChannelChange.value ? selectedChannelValue.value.length > 0 : true;
    
    // Para contingencias, si no se selecciona ninguna transacción específica, se aplicará a todas
    const hasTransactions = isContingency.value ? true : 
                           (transInterbancaria.value || qrInterbancaria.value || 
                           transRecepcion.value || qrRecepcion.value);
    
    return hasJustification && hasChannel && hasTransactions;
});

// FUNCIÓN PARA MANEJAR CLICK EN GUARDAR/CAMBIAR
const handleSaveClick = () => {
    if (isChannelChange.value) {
        visibleChangeCanal.value = true;
    } else {
        visibleContingency.value = true;
    }
};

// FUNCIÓN PARA CONSTRUIR DATOS DEL SERVICIO - CORREGIDA
const buildServicePayload = () => {
    if (!contingencyData.value?.length) {
        console.error('No hay datos de contingencia disponibles');
        return { participants: [] };
    }

    const participants = [];
    
    // Para cada participante (banco)
    contingencyData.value.forEach(bankData => {
        const selectedTransactions = [];
        
        if (isChannelChange.value) {
            // CAMBIO DE CANAL: Solo transacciones seleccionadas por checkboxes
            if (transInterbancaria.value) {
                selectedTransactions.push({
                    paymentGatewayCode: "1426", // Hardcodeado ACL inicial
                    transactionCode: "TRX022", // Sin prefijo TRX
                    operationalClearingHouseModified: true,
                    operationalPaymentGatewayCode: channelCodeMap[selectedChannelValue.value],
                    operationalPaymentGatewayCodeDescription: justification.value, // Justificación aquí
                    contingencyEnabled: false,
                    contingencyDescription: ""
                });
            }

            if (qrInterbancaria.value) {
                selectedTransactions.push({
                    paymentGatewayCode: "1426", // Hardcodeado ACL inicial
                    transactionCode: "TRX062", // Sin prefijo TRX
                    operationalClearingHouseModified: true,
                    operationalPaymentGatewayCode: channelCodeMap[selectedChannelValue.value],
                    operationalPaymentGatewayCodeDescription: justification.value, // Justificación aquí
                    contingencyEnabled: false,
                    contingencyDescription: ""
                });
            }
            
        } else if (isContingency.value) {
            // CONTINGENCIA: Verificar si hay checkboxes seleccionados
            const hasSelectedTransactions = transInterbancaria.value || qrInterbancaria.value || 
                                            transRecepcion.value || qrRecepcion.value;

            if (hasSelectedTransactions) {
                // Si hay transacciones seleccionadas, usar solo esas
                if (transInterbancaria.value) {
                    selectedTransactions.push({
                        paymentGatewayCode: "1426", // Hardcodeado ACL inicial
                        transactionCode: "TRX022",
                        operationalClearingHouseModified: false,
                        operationalPaymentGatewayCode: "",
                        operationalPaymentGatewayCodeDescription: "",
                        contingencyEnabled: true,
                        contingencyDescription: justification.value
                    });
                }

                if (qrInterbancaria.value) {
                    selectedTransactions.push({
                        paymentGatewayCode: "1426", // Hardcodeado ACL inicial
                        transactionCode: "TRX062",
                        operationalClearingHouseModified: false,
                        operationalPaymentGatewayCode: "",
                        operationalPaymentGatewayCodeDescription: "",
                        contingencyEnabled: true,
                        contingencyDescription: justification.value
                    });
                }

                if (transRecepcion.value) {
                    selectedTransactions.push({
                        paymentGatewayCode: "1426", // Hardcodeado ACL inicial
                        transactionCode:"TRX620",
                        operationalClearingHouseModified: false,
                        operationalPaymentGatewayCode: "",
                        operationalPaymentGatewayCodeDescription: "",
                        contingencyEnabled: true,
                        contingencyDescription: justification.value
                    });
                }

                if (qrRecepcion.value) {
                    selectedTransactions.push({
                        paymentGatewayCode: "1426", // Hardcodeado ACL inicial
                        transactionCode: "TRX220",
                        operationalClearingHouseModified: false,
                        operationalPaymentGatewayCode: "",
                        operationalPaymentGatewayCodeDescription: "",
                        contingencyEnabled: true,
                        contingencyDescription: justification.value
                    });
                }
            } else {
                // Si no hay transacciones seleccionadas, incluir todas las 4 transacciones
                const allContingencyTransactions = [
                    { code: "TRX022" },
                    { code: "TRX062" },
                    { code: "TRX220" },
                    { code: "TRX620" }
                ];
                
                allContingencyTransactions.forEach(({ code }) => {
                    selectedTransactions.push({
                        paymentGatewayCode: "1426", // Hardcodeado ACL inicial
                        transactionCode: code,
                        operationalClearingHouseModified: false,
                        operationalPaymentGatewayCode: "",
                        operationalPaymentGatewayCodeDescription: "",
                        contingencyEnabled: true,
                        contingencyDescription: justification.value
                    });
                });
            }
        }

        if (selectedTransactions.length > 0) {
            participants.push({
                participantCode: bankData.participantCode,
                transactions: selectedTransactions
            });
        }
    });

    return { participants };
};

// FUNCIÓN PARA CONFIRMAR Y GUARDAR
const saveConfirm = async () => {
    try {
        saving.value = true;
        
        const payload = buildServicePayload();
        
        console.log('Enviando al servicio:', payload);
        
        // Llamar al servicio correspondiente
        if (isChannelChange.value) {
            const response = await contingencyService.updateBankConfiguration(payload);
            console.log('response', response);
        }// else {
        //     await contingencyService.updateBankConfiguration(payload);
        // }
        
        // Cerrar modales
        visibleChangeCanal.value = false;
        visibleContingency.value = false;
        
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: isChannelChange.value ? 'Canal cambiado correctamente' : 'Contingencia establecida correctamente',
            life: 5000
        });
        
        router.back();
        
    } catch (err: any) {
        console.error('Error guardando:', err);
        
        // Cerrar modales en caso de error
        visibleChangeCanal.value = false;
        visibleContingency.value = false;
        
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message || 'Error al guardar los cambios',
            life: 5000
        });
    } finally {
        saving.value = false;
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

// CARGAR DATOS
const loadPaymentGatewayData = async () => {
    try {
        loading.value = true;
        error.value = null;
        
        console.log('Cargando datos para participantes:', participantCodes.value);
        
        if (!participantCodes.value.length) {
            throw new Error('No se encontraron códigos de participantes');
        }
        
        if (participantCodes.value.length === 1) {
            // Un solo participante
            console.log('Cargando banco con código:', participantCodes.value[0]);
            const response = await contingencyService.getBankByCode(participantCodes.value[0]);
            console.log('Respuesta del servicio:', response.participants);
            const responseArray = response.participants;
            // Si la respuesta es un array, buscar el banco específico
            if (Array.isArray(responseArray)) {
                const specificBank = responseArray.find(bank => bank.participantCode === participantCodes.value[0]);
                console.log('Banco especifico: ',specificBank);
                if (specificBank) {
                    contingencyData.value = [specificBank];
                } else {
                    throw new Error(`No se encontró el banco con código ${participantCodes.value[0]}`);
                }
            } else {
                // Si la respuesta es un objeto único
                contingencyData.value = [response];
            }
        } else {
            // Múltiples participantes
            const responses = await Promise.all(
                participantCodes.value.map(code => contingencyService.getBankByCode(code))
            );
            
            // Si las respuestas son arrays, extraer los bancos específicos
            const specificBanks = [];
            responses.forEach((response, index) => {
                const code = participantCodes.value[index];
                if (Array.isArray(response)) {
                    const specificBank = response.find(bank => bank.participantCode === code);
                    if (specificBank) {
                        specificBanks.push(specificBank);
                    }
                } else {
                    specificBanks.push(response);
                }
            });
            
            contingencyData.value = specificBanks;
        }
        
        console.log('Datos cargados y procesados:', contingencyData.value);
        
        // Inicializar valores por defecto después de cargar los datos
        initializeDefaultValues();
        
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

// NAVEGACIÓN
const goBack = () => {
    router.back();
};

const requiredRule = (value:unknown):ValidationRuleResult => {
    console.log('Validating:', value);
    return value !== null && value !== undefined && value !== '' 
        ? true 
        : 'El campo es requerido'
}

// Función auxiliar para inicializar checkboxes correctamente
const initializeCheckboxes = () => {
    if (!contingencyData.value?.length || !paymentGatewayOptions.value?.length) {
        console.log('No se pueden inicializar checkboxes - datos no disponibles');
        return;
    }
    
    console.log('Inicializando checkboxes con datos del banco:', contingencyData.value[0]);
    
    // Obtener los datos del banco (ya es un objeto de banco individual)
    const bankData = contingencyData.value[0];
    console.log('Bank data completo:', bankData);

    
    transactionData.value.forEach(transactionRow => {
        console.log(`\nProcesando transacción: ${transactionRow.transactionCode}`);
        // Inicializar todos los gateways como false
        paymentGatewayOptions.value.forEach(gateway => {
            transactionRow.gateways[gateway.value] = false;
        });

        // Buscar la transacción correspondiente en los datos del banco
        const originalTransaction = bankData.transactions?.find(
            t => t.transactionCode === transactionRow.transactionCode
        );
        

        console.log('Tradicional: ',originalTransaction);
    })



console.log('Dato que no se muestra',transactionData.value);

    // Log final del estado de checkboxes
    console.log('\n=== ESTADO FINAL DE CHECKBOXES ===');
    transactionData.value.forEach(row => {
        const checkedGateways = Object.entries(row.gateways)
            .filter(([key, value]) => value === true)
            .map(([key]) => key);
        console.log(`  Objeto completo:`, row.gateways);
    });
};

const shouldSelectGateway = (paymentGateway) => {
    console.log('Evaluando shouldSelectGateway con:', {
        acronym: paymentGateway.paymentGatewayAcronym,
        isPrimary: paymentGateway.isPrimary,
        isOperational: paymentGateway.isOperational,
        isTemporarilyActive: paymentGateway.isTemporarilyActive,
        isChannelChange: isChannelChange.value
    });
    
    // Para cambio de canal: seleccionar el gateway que está actualmente en uso
    if (isChannelChange.value) {
        // Gateway operacional (funcionando normalmente)
        if (paymentGateway.isOperational) {
            console.log('Seleccionado por ser operacional');
            return true;
        }
        // Gateway no operacional pero temporalmente activo (en contingencia)
        if (!paymentGateway.isOperational && paymentGateway.isTemporarilyActive) {
            console.log('Seleccionado por estar temporalmente activo');
            return true;
        }
    }
    
    // Para contingencia: seleccionar gateways operacionales primarios
    if (isContingency.value) {
        if (paymentGateway.isPrimary && paymentGateway.isOperational) {
            console.log('Seleccionado para contingencia (primario y operacional)');
            return true;
        }
    }
    
    console.log('NO seleccionado');
    return false;
};


onMounted(async () => {
  console.log('Component mounted');
  
  // Cargar las opciones primero
  try {
    await loadAllOptions();
    console.log('Opciones cargadas:', optionsFromComposable.value);
  } catch (err) {
    console.error('Error loading options:', err);
    error.value = 'Error al cargar las opciones';
  }
  
  // Luego cargar los datos de participantes
  if (participantCodes.value.length > 0) {
    await loadPaymentGatewayData();
    
    // Después de cargar los datos, inicializar los checkboxes
    initializeCheckboxes();
  } else {
    error.value = 'No se encontraron códigos de participantes';
    loading.value = false;
    initializeDefaultValues();
  }
});


// WATCHERS PARA DEBUG
watch(selectedChannelValue, (newValue) => {
    console.log('Canal seleccionado cambió a:', newValue, 'Código:', channelCodeMap[newValue]);
});

watch([transInterbancaria, qrInterbancaria, transRecepcion, qrRecepcion], (newValues) => {
    console.log('Checkboxes cambiaron:', {
        transInterbancaria: newValues[0],
        qrInterbancaria: newValues[1],
        transRecepcion: newValues[2],
        qrRecepcion: newValues[3]
    });
});

// WATCHER PARA VALIDAR PAYLOAD EN TIEMPO REAL (DEBUG)
watch([justification, selectedChannelValue, transInterbancaria, qrInterbancaria, transRecepcion, qrRecepcion], () => {
    if (isFormValid.value && contingencyData.value) {
        const payload = buildServicePayload();
        console.log('Payload preview:', JSON.stringify(payload, null, 2));
        
        // Debug: mostrar qué transacciones están siendo mapeadas
        payload.participants.forEach(participant => {
            console.log(`Participante: ${participant.participantCode}`);
            participant.transactions.forEach(transaction => {
                const originalTx = contingencyData.value
                    ?.find(bank => bank.participantCode === participant.participantCode)
                    ?.Transactions?.find(t => t.transactionCode === transaction.transactionCode);
                    
                console.log(`  - ${transaction.transactionCode} (${originalTx?.transactionDescription}): ${transaction.operationalClearingHouseModified ? 'Cambio Canal' : ''} ${transaction.contingencyEnabled ? 'Contingencia' : ''}`);
            });
        });
    }
}, { deep: true });


// COMPUTED para convertir getBankNames en array
const getBankNamesArray = computed(() => {
    const names = getBankNames.value;
    if (typeof names === 'string' && names.includes(',')) {
        return names.split(',').map(name => name.trim()).filter(name => name.length > 0);
    }
    return [names];
});

</script>
