<template>
    <Toast position="top-right" />
    <XDialog v-model:visible="visible" modal header="Actualizar certificado público" class="w-[calc((704/14)*1rem)]"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">

        <FileUploadCertificate @verificationComplete="channelMain = $event" @registered="registered = $event"/>
    </XDialog>
    <XDialog v-model:visible="visibleSecondChannel" modal header="Actualizar certificado público" class="w-[calc((704/14)*1rem)]"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <FileUploadCertificate @verificationComplete="channelSecondary = $event" @registered="registered = $event"/>
    </XDialog>
    <div class="flex flex-col mb-10">
        <XHeader title="Banco de Crédito de Bolivia" class="mb-6" />
        <p>Canales...</p>
    </div>
    <div class="flex flex-col">
        <XAccordion>
            <XAccordionPanel value="1">
                <XAccordionHeader>
                    <div class="flex flex-row gap-8">
                        <XToggleSwitch v-model="CheckedMainChannel" />
                        <p class="flex flex-row gap-2 justify-center items-center">
                            <span>Canal {{ mainChannel.paymentSystemCode }}</span>
                        </p>
                    </div>
                </XAccordionHeader>
                <XAccordionContent>
                    <div class="flex flex-col gap-12">
                        <div class="flex flex-col">
                            <h5 class="font-semibold">Código ACCL</h5>
                            <span class="text-gray-700"> {{ lastpublicCertificate.serialNumber }}</span>
                        </div>
                        <h5 class="font-semibold">Último certificado</h5>
                        <div class="grid grid-cols-5 gap-32">
                            <div class="flex flex-col">
                                <p class="text-[12px]">Certificado activo</p>
                                <span class="text-gray-700">{{ lastpublicCertificate.serialNumber }}</span>
                            </div>
                            <div class="flex flex-col">
                                <p class="text-[12px]">Válido desde</p>
                                <span class="text-gray-700">{{ lastpublicCertificate.validFrom}}</span>
                            </div>
                            <div class="flex flex-col">
                                <p class="text-[12px]">Válido hasta</p>
                                <span class="text-gray-700">{{ lastpublicCertificate.validTo}}</span>
                            </div>
                            <div class="flex flex-col">
                                <p class="text-[12px]">Último cambio</p>
                                <span class="text-gray-700">{{ lastpublicCertificate.createdAt}}</span>
                            </div>
                            <div class="flex flex-col">
                                <p class="text-[12px]">Estado</p>
                                <XTag severity="success" value="Activo" />
                            </div>
                        </div>
                        <div class="flex flex-row justify-end">
                            <XButton label="Actualizar" class="w-[10.714rem]" @click="visible=true" />
                        </div>
                    </div>
                </XAccordionContent>
            </XAccordionPanel>
        </XAccordion>
        <XDivider class="my-12" />
        <h4>Canales secundarios</h4>
        <XAccordion>
            <XAccordionPanel v-for="(participant, index) in secondaryChannels" :key="index" value="1">
                <XAccordionHeader>
                    <div class="flex flex-row gap-8">
                        <XToggleSwitch v-model="datatest123" />
                        <p class="flex flex-row gap-2 justify-center items-center">
                            <span>Canal {{ participant.paymentSystemCode }}</span>
                        </p>
                    </div>
                </XAccordionHeader>
                <XAccordionContent>
                    <div class="flex flex-col gap-12">
                        <div class="flex flex-col">
                            <h5 class="font-semibold">Código ACCL</h5>
                            <span class="text-gray-700"> {{ participant.publicCertificates[participant.publicCertificates.length - 1].serialNumber }}</span>
                        </div>
                        <h5 class="font-semibold">Último certificado</h5>
                        <div class="grid grid-cols-5 gap-32">
                            <div class="flex flex-col">
                                <p class="text-[12px]">Certificado activo</p>
                                <span class="text-gray-700">{{ participant.publicCertificates[participant.publicCertificates.length - 1].serialNumber }}</span>
                            </div>
                            <div class="flex flex-col">
                                <p class="text-[12px]">Válido desde</p>
                                <span class="text-gray-700">{{ participant.publicCertificates[participant.publicCertificates.length - 1].validFrom }}</span>
                            </div>
                            <div class="flex flex-col">
                                <p class="text-[12px]">Válido hasta</p>
                                <span class="text-gray-700">{{ participant.publicCertificates[participant.publicCertificates.length - 1].validTo }}</span>
                            </div>
                            <div class="flex flex-col">
                                <p class="text-[12px]">Último cambio</p>
                                <span class="text-gray-700">{{ participant.publicCertificates[participant.publicCertificates.length - 1].createdAt }}</span>
                            </div>
                            <div class="flex flex-col">
                                <p class="text-[12px]">Estado</p>
                                <XTag severity="success" value="Activo" />
                            </div>
                        </div>
                        <div class="flex flex-row justify-end">
                            <XButton label="Actualizar" class="w-[10.714rem]" @click="participantUpdate(participant)" />
                        </div>
                    </div>
                </XAccordionContent>
            </XAccordionPanel>
        </XAccordion>
    </div>
</template>
<script lang="ts" setup>
import { usePartipantsService } from '~/componsables/useParticipants'
import { participantsService } from '~/services/participantsService'
import { useToast } from 'primevue/usetoast'

const visible = ref(false)
const visibleSecondChannel = ref(false)
const toast = useToast()
const { loadParticipant } = usePartipantsService()
const route = useRoute()
const registered = ref(false)
const channelMain = ref()
const channelSecondary = ref()
const secondaryParticipant = ref()
const code = computed(() => route.params?.code || null)
const mainChannel = ref({})
const secondaryChannels = ref([])
const lastpublicCertificate = ref({})
const CheckedMainChannel = ref(false)
const lastPulbicSecondaryCertificate = ref({})


async function participantUpdate(participant:any){
  visibleSecondChannel.value = true;
  secondaryParticipant.value = participant
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-BO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

watch(channelSecondary, async (newVal) => {
    console.log("Canal modificado: secondary", newVal)
    const updateResponse = await updateCertificate(secondaryParticipant.value.participantCode, secondaryParticipant.value.paymentGatewayCode, channelSecondary.value.justification,channelSecondary.value.publicCertificate)
    console.log('response', updateResponse)
    if(!updateResponse.wasSaved){
        visibleSecondChannel.value = false
        toast.add({
        severity: 'error',
        summary: 'Certificado no actualizado',
        detail: 'Hubo un problema al registrar el certificado',
        life: 5000
        })
    }else{
        visibleSecondChannel.value = false
          toast.add({
          severity: 'success',
          summary: 'Certificado actualizado',
          detail: 'Actualización certificado',
          life: 5000
        })
    }
})

watch(channelMain, async (newVal) => {
    console.log("Canal modificado:", newVal)
    const updateResponse = await updateCertificate(mainChannel.value.participantCode, mainChannel.value.paymentGatewayCode, mainChannel.value.justification, channelMain.value.publicCertificate)
    console.log('response', updateResponse)
    if(!updateResponse.wasSaved){
        visible.value = false
        toast.add({
        severity: 'error',
        summary: 'Certificado no actualizado',
        detail: 'Hubo un problema al registrar el certificado',
        life: 5000
        })
    }else{
        visible.value = false
          toast.add({
          severity: 'success',
          summary: 'Certificado actualizado',
          detail: 'Actualización certificado',
          life: 5000
        })
    }
})

const updateCertificate = async(participantCode: string, paymentGatewayCode:any, reason:string , base64Content:any) => {
    const update = await participantsService.updateCertificatePublicParticipant({
          participantCode: participantCode,
          paymentGatewayCode: paymentGatewayCode,
          reason: reason,
          publicCertificate: {
              ...base64Content
          }
    });
    return update
}

onMounted(async () => {
    if (code.value) {
        console.log("Código recibido:", code.value)
        const { participants } = await loadParticipant(code.value)
        mainChannel.value = participants.find(channel => channel.isMain)
        secondaryChannels.value = participants.filter(channel => !channel.isMain)
        secondaryChannels.value.forEach(element => {
            element.publicCertificates[element.publicCertificates.length - 1].validFrom = formatDate(element.publicCertificates[element.publicCertificates.length - 1].validFrom);
            element.publicCertificates[element.publicCertificates.length - 1].validTo = formatDate(element.publicCertificates[element.publicCertificates.length - 1].validTo);
            element.publicCertificates[element.publicCertificates.length - 1].createdAt = formatDate(element.publicCertificates[element.publicCertificates.length - 1].createdAt);
        });
        // console.log("Canales", secondaryChannels.value)
        // lastPulbicSecondaryCertificate.value
        lastpublicCertificate.value = {
            "serialNumber": mainChannel.value.publicCertificates[0].serialNumber,
            "validFrom": formatDate(mainChannel.value.publicCertificates[0].validFrom),
            "validTo": formatDate(mainChannel.value.publicCertificates[0].validTo),
            "createdAt": formatDate(mainChannel.value.publicCertificates[0].createdAt),
        }
        console.log("Último certificado:", mainChannel.value)
        CheckedMainChannel.value = mainChannel.value.isActive
        // console.log("Canal principal cargado:", mainChannel.value.publicCertificates[0])
        // console.log("Datos del canal principal cargados:", mainChannel.value)
        // console.log("Datos del participante cargados:", secondaryChannels.value)
    } else {
        console.warn("No se encontró el parámetro 'code'")
    }
})
</script>