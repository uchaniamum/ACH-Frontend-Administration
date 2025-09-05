<template>
    <div>
        <div class="flex flex-col gap-8">
            <!-- <XHeader :title="pageTitle" @back-click="goBack"/> -->
            <XHeader 
                :title="isMultipleBanks ? `${pageTitle} - Participantes (${contingencyData.length})` : pageTitle" 
                @back-click="goBack"
            />
            <span class="text-normal font-normal">
                {{ pageDescription }}
            </span>
            
            <!-- Botón Ver Participantes - Solo mostrar cuando hay múltiples bancos -->
            <div v-if="isMultipleBanks" class="flex">
                <XButton 
                    variant="text" 
                    :label="`Ver ${contingencyData.length} Participantes `"
                    icon="bank"
                    @click="showParticipantsModal = true"
                />
            </div>
            
            <div class="flex flex-col gap-20">
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
                            
                            <!-- Columnas dinámicas basadas en los payment gateways -->
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
                        <div class="flex items-center gap-4">
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
                
                <!-- <div class="flex flex-col justify-center gap-8">
                    <Divider align="left" type="solid">
                        <b>Transacciones</b>
                    </Divider>
                    <span class="text-normal font-normal text-gray-700">
                        Selecciona las transacciones que estarán involucradas.
                    </span>
                    
                    <template v-if="isChannelChange">
                        <DataTable :value="transactionData" class="w-full">
                          <Column header="Transacción" sortable class="min-w-80">
                            <template #body="{ data }">
                              <div class="flex items-center gap-2">
                                <i class="pi pi-info-circle text-blue-500"></i>
                                <span>{{ data.transaction }}</span>
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
                        <div class="flex items-center gap-4">
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
                </div> -->

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
                    />
                    <span class="text-normal font-normal text-gray-600">
                        Por razones de seguridad, este campo es requerido.
                    </span>
                </div>
                
                <div class="flex flex-col justify-center">
                    <XFileUpload
                        ref="fileupload"
                        name="certificateFiles"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        :maxFileSize="1000000" 
                        @select="onFileSelect"
                        :showUploadButton="false"
                        :showCancelButton="false"
                        chooseLabel="Elegir archivo"
                        :auto="false"
                    >   
                        <template #empty>
                            <div class="mb-6 mt-4 px-[1.714rem]">
                                <span class="text-normal font-normal text-gray-700">
                                    Arrastra y suelta archivos aquí para subirlos.
                                </span>
                            </div>
                        </template> 
          
                        <template #content="{ files, removeFileCallback }">
                            <div class="p-fileupload-file-list">
                                <div 
                                    v-for="(file, index) in files" 
                                    :key="index" 
                                    class="p-fileupload-file"
                                >
                                    <div class="p-fileupload-file-thumbnail custom-thumbnail">
                                        <Icon name="x:page" class="text-[48px] text-gray-200"/>
                                    </div>
                                    <div class="p-fileupload-file-info">
                                        <div class="p-fileupload-file-name">{{ file.name }}</div>
                                        <span class="p-fileupload-file-size">{{ formatFileSize(file.size) }}</span>
                                    </div>
                                    <span 
                                        v-if="getFileStatus(file).isLoaded" 
                                        class="p-badge p-component p-badge-success p-fileupload-file-badge px-4"
                                    >
                                        Carga Completa
                                    </span>
                                    <span 
                                        v-else 
                                        class="p-badge p-component p-badge-warn p-fileupload-file-badge px-4"
                                    >
                                        Cargando archivo
                                    </span>
                                    <div class="p-fileupload-file-actions">
                                        <button 
                                            class="p-button p-component p-button-icon-only p-button-danger p-button-rounded p-button-text p-fileupload-file-remove-button" 
                                            @click="removeFileCallback(index)"
                                            type="button"
                                        >
                                            <span class="p-button-icon p-c">
                                                <Icon name="x:cancel"></Icon>
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </XFileUpload>
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
                <p class="text-sm text-gray-600 mb-4">
                    Se aplicarán los cambios a los siguientes bancos:
                </p>
                
                <div class="max-h-96 overflow-y-auto">
                    <div class="grid grid-cols-1 gap-2">
                        <div 
                            v-for="(bank, index) in contingencyData" 
                            :key="bank.participantCode"
                            class="flex items-center p-3"
                        >
                            <div class="flex items-center gap-3 w-full">
                                <div class="flex-1">
                                    <ul class="font-medium text-gray-900">
                                        {{ bank.participantName || bank.name }}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="mt-6 pt-4 border-t border-gray-200">
                    <p class="text-sm font-medium text-gray-700">
                        Total de participantes: {{ contingencyData.length }}
                    </p>
                </div>
            </div>
            
            <!-- <template #footer>
                <div class="flex justify-end">
                    <XButton 
                        label="Cerrar" 
                        outlined 
                        @click="showParticipantsModal = false"
                    />
                </div>
            </template> -->
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
                    <p class="text-sm text-gray-600">
                        Esta modificación podrá ser ajustada en el futuro.
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
const showParticipantsModal = ref(false); // NUEVO: Estado para el modal de participantes

// Estados del formulario
const justification = ref('');
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
        transaction: 'Envío de transferencias interbancarias',
        tooltip: 'Información sobre transferencias interbancarias',
        gateways: {}
    },
    {
        id: 2,
        transaction: 'Envío de transferencias QR',
        tooltip: 'Información sobre transferencias QR',
        gateways: {}
    }
])

// Usar el composable de opciones - RENOMBRA loading para evitar conflicto
const { paymentGatewayOptions, loading: optionsLoading } = useOptions()

// Función para cargar las opciones de payment gateways
const onGatewayChange = (data, gateway, event) => {
  console.log('Cambio en:', data.transaction, 'Gateway:', gateway, 'Valor:', event)
}

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
    
    return `${action}`;
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
            await contingencyService.updateBankConfiguration(payload);
        } else {
            await contingencyService.updateBankConfiguration(payload);
        }
        
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
            const response = await contingencyService.getBankByCode(participantCodes.value[0]);
            contingencyData.value = [response]; // Convertir a array para consistencia
        } else {
            // Múltiples participantes - necesitarías un método para cargar varios
            const responses = await Promise.all(
                participantCodes.value.map(code => contingencyService.getBankByCode(code))
            );
            contingencyData.value = responses;
        }
        
        console.log('Datos cargados:', contingencyData.value);
        
        // Inicializar valores por defecto después de cargar los datos
        initializeDefaultValues();
        
    } catch (err: any) {
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

// FUNCIONES DE ARCHIVOS
const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileKey = (file: File) => {
    return `${file.name}-${file.size}-${file.lastModified}`;
};

const getFileStatus = (file: File) => {
    const fileKey = getFileKey(file);
    return fileStates.get(fileKey) || { 
        isLoaded: false, 
        progress: 0 
    };
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.includes('base64,') 
                ? result.split('base64,')[1] 
                : result;
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
};

const simulateFileLoading = (fileKey: string) => {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        
        if (fileStates.has(fileKey)) {
            const currentState = fileStates.get(fileKey);
            fileStates.set(fileKey, {
                ...currentState,
                progress: progress
            });
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            if (fileStates.has(fileKey)) {
                const currentState = fileStates.get(fileKey);
                fileStates.set(fileKey, {
                    ...currentState,
                    isLoaded: true,
                    progress: 100
                });
            }
        }
    }, 200);
};

const onFileSelect = async (event: any) => {
    isVerifying.value = false;
    isVerified.value = false;
    selectedFile.value = null;
    fileBase64.value = '';
  
    if (event.files.length === 0) return;
  
    const file = event.files[0];
    selectedFile.value = file;
  
    const fileKey = getFileKey(file);
    if (!fileStates.has(fileKey)) {
        fileStates.set(fileKey, {
            isLoaded: false,
            progress: 0,
            file: file
        });
        
        // Iniciar simulación de carga
        simulateFileLoading(fileKey);
    
        try {
            fileBase64.value = await fileToBase64(file);
            console.log('Archivo convertido a Base64');
            
        } catch (error) {
            console.error('Error procesando archivo:', error);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo procesar el archivo',
                life: 5000
            });
        }
    }
};

// NAVEGACIÓN
const goBack = () => {
    router.back();
};

// LIFECYCLE
onMounted(() => {
    console.log('Component mounted');
    console.log('Route info:', {
        path: route.path,
        params: route.params,
        query: route.query,
        isChannelChange: isChannelChange.value,
        participantCodes: participantCodes.value
    });
    
    if (participantCodes.value.length > 0) {
        loadPaymentGatewayData();
    } else {
        error.value = 'No se encontraron códigos de participantes';
        loading.value = false;
        // Aún así inicializar valores por defecto
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
</script>