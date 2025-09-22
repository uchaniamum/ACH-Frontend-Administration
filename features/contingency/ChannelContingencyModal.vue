<template>
    <XDialog 
        v-model:visible="modalChannelContingency" 
        modal
        :closable="false"
        :header="`Configurar operabilidad - ${props.paymentGatewayData?.paymentGatewayAcronym}`"
        :style="{ width: '700px !important' }" 
    >
        <div class="flex flex-col gap-16">
            <XForm @submit="handleSubmitPaymentGateway" class="flex flex-col gap-10">
                <div v-if="props.paymentGatewayData?.paymentGatewayIsOperational" class="flex flex-col gap-8">
                    <Divider align="left" type="solid">
                        <b>Mensaje de respuesta</b>
                    </Divider>
                    <span class="text-normal font-normal text-gray-700">
                        Define un mensaje de rechazo que se mostrará a los usuarios cuando intenten realizar transacciones hacia este participante.                               
                    </span>
                    <XInputText 
                        v-model="titleChannels"
                        name="tituloContingencia"
                        label="Titulo" 
                        label-required
                        placeholder="Ingresa el título del mensaje"
                        :rules="requiredRule"
                    />
                    <XTextarea 
                        v-model="messageChannels"
                        name="messageChannels" 
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
                        Detalla el motivo del cambio. 
                    </span>
                    <div class="flex flex-col gap-[0.357rem]">
                        <XTextarea 
                            v-model="justificationChannles"
                            name="justificationChannles" 
                            rows="5" 
                            class="w-full" 
                            placeholder="Describe el motivo del cambio de canal" 
                            label-required 
                            label="Justificación"
                            :rules="requiredRule"
                        />
                        <span class="text-gray-600 text-sm">Por razones de seguridad, este campo es requerido.</span>
                    </div>
                </div>
                <div class="flex flex-col gap-16">
                    <XDivider/>
                    <div class="w-full flex flex-row justify-end gap-6">
                        <XButton 
                            variant="outlined" 
                            label="Cancelar" 
                            class="w-75"
                            @click="handleClose"
                        />
                        <XButton 
                            label="Guardar"
                            class="w-75"
                            type="submit"
                            :disabled="!isFormContingencyValid"
                        />
                    </div>
                </div>
            </XForm>
        </div>
    </XDialog>
    <ConfirmDialogWrapper
        v-model="confirmDialogGatewayContingency.visible"
        :options="confirmDialogGatewayContingency.options"
    />
</template>

<script setup lang="ts">
import { contingencyService } from '~/services/contingencySevice'
import type { ValidationRuleResult } from '../users/options.types'
import ConfirmDialogWrapper from '~/components/overlay/ConfirmDialogWrapper.vue'

interface PaymentGatewayData {
    paymentGatewayCodes: string,
    paymentGatewayIsOperational?: string,
    paymentGatewayAcronym?: string
}

interface Props {
    modelValue: boolean
    paymentGatewayData?: PaymentGatewayData
}

interface Emits {
    (event: 'update:modelValue', value: boolean): void
    (event: 'cancel'): void
    (event: 'save', paymentGatewayData: any): void
    (event: 'successToast', message: { summary?: string, detail?: string }): void
    (event: 'errorToast', message: { summary?: string, detail?: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// State
const modalChannelContingency = defineModel<boolean>({ default: false })
// Campos del formulario
const justificationChannles = ref('');
const titleChannels = ref('');
const messageChannels = ref('');


const isFormContingencyValid = computed(() => {   
    return justificationChannles.value?.trim() && 
            titleChannels.value?.trim() && 
            messageChannels.value?.trim();
})

const confirmDialogGatewayContingency = ref({
    visible: false,
    options: {
        title: '',
        message: '',
        onConfirm: () => {}
    }
})


const requiredRule = (value:unknown):ValidationRuleResult => {
    return value !== null && value !== undefined && value !== '' 
        ? true 
        : 'El campo es requerido'
}

const handleClose = () => {
    modalChannelContingency.value = false
    justificationChannles.value = '';
    titleChannels.value = '';
    messageChannels.value = '';
    emit('update:modelValue', false)
}

const handleSubmitPaymentGateway = async () => {
    modalChannelContingency.value = false
    if (isFormContingencyValid.value) {
            confirmDialogGatewayContingency.value = {
            visible: true,
            options: {
                title: 'Configurar contingencia',
                icon: 'x:warning-circle',
                iconColor: 'text-yellow-500',
                confirmLabel: 'Guardar',
                cancelLabel: 'Cancelar',
                message: `¿Estás seguro de guardar la configuración para el canal <span class="font-semibold"> ${props.paymentGatewayData?.paymentGatewayAcronym}</span>? 
                            <p>Esta modificación es delicada y afectará a todos los participantes que utilicen el canal.</p>`,
                onConfirm: async () => {
                    await confirmSaveGateway();
                }
            }
        };
    }
}

const confirmSaveGateway = async (): Promise<void> => {
    try{
        const gatewayCodes = props.paymentGatewayData?.paymentGatewayCodes;
        console.log('Códigos de canales a actualizar:', gatewayCodes);
        const gatewayContingencyData = {
            isOperational: props.paymentGatewayData?.paymentGatewayIsOperational ? false : true,
            contingencyTitle: titleChannels.value,
            contingencyDetail: messageChannels.value,
            changeReason: justificationChannles.value
        };
        const response = await contingencyService.updatePaymentGateway(gatewayContingencyData, gatewayCodes);
        console.log('Datos de contingencia a guardar:', response);
        if(response){
            const successMessage = {
                summary: 'Contingencia establ ecida exitosamenteConfiguración guardada',
            }
            emit('successToast', successMessage)
        }
        emit('save', response);
        justificationChannles.value = '';
        titleChannels.value = '';
        messageChannels.value = '';
        modalChannelContingency.value = false
        //handleClose();
    }catch(error){
        const errorMessage = {
            summary: 'Error',
            detail: `Error al guardar la configuración de contingencia: ${error instanceof Error ? error.message : 'Error desconocido'}`
        }
        emit('errorToast', errorMessage)
    };
}


</script>