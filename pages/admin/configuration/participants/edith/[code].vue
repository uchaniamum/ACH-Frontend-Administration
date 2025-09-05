<template>
        <Toast position="top-right" />
    <!-- <div class="flex flex-col">
       <h1>edith page {{ code }}</h1>
    </div> -->
    <XDialog v-model:visible="visible" modal header="Actualizar certificado público" class="w-[calc((704/14)*1rem)]"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <FileUploadCertificate @registered="registered = $event" documents-accepted=".txt,.cer"/>
        <div class="flex flex-row justify-end mt-5 gap-10">
            <XButton variant="outlined" label="Cancelar" @click="visible = false" />
            <XButton label="Aceptar" @click="updateCertificade()" :disabled="flagRegistered"/>
        </div>
    </XDialog>
    <div class="flex flex-col mb-10 cursor-pointer" @click="router.push('/admin/configuration/participants/')">
        <XHeader title="Banco de Crédito de Bolivia" class="mb-6" />
        <p>Canales...</p>
    </div>
    <div class="flex flex-col">
      <div class="flex flex-col gap-12 px-[calc((200/14)*1rem)]">
          <div class="grid grid-cols-2 gap-10">
              <XInputText label-required label="Código" class="col-span-1" name="codigo"
                  v-model="dataParticipant.participantCode" :rules="[(v: any) => !!v || 'El campo es requerido']" disabled/>
              <XInputText label-required label="Siglas" class="col-span-1" name="siglas"
                  v-model="dataParticipant.acronym" :rules="[(v: any) => !!v || 'El campo es requerido']" />
          </div>
          <div class="grid grid-cols-2 gap-10">
              <XInputText label-required abel-required label="Entidad" class="col-span-q" name="entidad"
                  v-model="dataParticipant.name" :rules="[(v: any) => !!v || 'El campo es requerido']" />
                  <!-- {{ newListUpdate }} -->
              <XSelect placeholder="Selecione un canal principal" :options="newListUpdate" option-label="paymentSystemCode"
                  name="mainChannel" option-value="paymentGatewayCode" label="Canal Principal"
                  v-model="dataParticipant.paymentGatewayCode"
                  :rules="[(v: any) => !!v || 'El campo es requerido',
                  // (v: any) => {
                  //     return listCertificates.find(element => element.paymentGatewayCode === v)?.registered
                  //         ? true
                  //         : 'Seleccione un canal principal valido'
                  // }
                  ]" />
          </div>
      </div>
    </div>
    <h4>Canales </h4>
    <div class="flex flex-col px-[calc((200/14)*1rem)]">
        <XAccordion multiple>
            <XAccordionPanel v-for="(channels, index) in newListUpdate" :key="index" :value="index">
                <XAccordionHeader>
                    <div class="flex flex-row gap-8">
                        <XToggleSwitch v-model="channels.isActive" />
                        <p class="flex flex-row gap-2 justify-center items-center">
                            <span>Canal {{ channels.paymentSystemCode }}</span>
                        </p>
                    </div>
                </XAccordionHeader>
                <XAccordionContent>
                    <div class="flex flex-col " v-if="channels.publicCertificates.length < 1">
                        <div class="w-full">
                            <XInputText label="Código del canal" :name='`codigoCanal-${index}`' v-model="channels.codeChannel"
                                label-required class="w-full" />
                        </div>
                        <div class="w-full flex flex-col mt-12">
                            <FileUploadCertificate documents-accepted=".txt"
                                @registered="channels.publicCertificate = $event" />
                        </div>
                        <div class="flex flex-row justify-end gap-10">
                            <XButton variant="outlined" label="Limpiar" class="w-[10.714rem]" @click="clear(channels)" />
                            <XButton label="Registrar" class="w-[10.714rem]" @click="registrarCertificate(channels)" />
                        </div>
                    </div>
                    <div class="flex flex-col gap-12" v-else>
                        <div class="flex flex-col">
                            <h5 class="font-semibold">Código {{ channels.paymentSystemCode }}</h5>
                            <span class="text-gray-700"> {{ channels.participantCode }}</span>
                        </div>
                        <h5 class="font-semibold">Último certificado</h5>
                        <div class="grid grid-cols-4 gap-32">
                            <div class="col-span-1 flex flex-col">
                                <p class="text-gray-600 text-[12px]">Certificado activo</p>
                                <span class="font-medium text-gray-700 truncate">{{ channels.publicCertificates[channels.publicCertificates.length - 1]?.serialNumber }}</span>
                            </div>
                            <div class="col-span-1 flex flex-col">
                                <p class="text-gray-600 text-[12px]">Válido desde</p>
                                <span class="font-medium text-gray-700">{{ channels.publicCertificates[channels.publicCertificates.length - 1]?.validFrom }}</span>
                            </div>
                            <div class="col-span-1 flex flex-col">
                                <p class="text-gray-600 text-[12px]">Válido hasta</p>
                                <span class="font-medium text-gray-700">{{ channels.publicCertificates[channels.publicCertificates.length - 1]?.validTo }}</span>
                            </div>
                            <div class="col-span-1 flex flex-col">
                                <p class="text-gray-600 text-[12px]">Último cambio</p>
                                <span class="font-medium text-gray-700">{{ channels.publicCertificates[channels.publicCertificates.length - 1]?.createdAt }}</span>
                            </div>
                        </div>
                        <div class="flex flex-row justify-end">
                            <XButton label="Actualizar" class="w-[10.714rem]" @click="participantUpdate(channels)" />
                        </div>
                    </div>
                </XAccordionContent>
            </XAccordionPanel>
        </XAccordion>
    </div>
    <XDivider />
    <div class="mt-12 flex justify-end gap-2 pb-12">
        <XButton variant="text" label="Salir"
            @click="() => router.push('/admin/configuration/participants/')" class="w-[10.714rem] " />
        <XButton variant="outlined" label="Registrar" @click="registerNewParticipantfunc()" />
        <!-- <XButton variant="outlined" label="Registrar" type="submit" /> -->
    </div>
</template>
<script lang="ts" setup>
// import { usePartipantsService } from '~/componsables/useParticipants';


// const { loadParticipantExternal } = usePartipantsService()
// const code = useRouteParams('code');

// onMounted(async () => {
//     try {
//         const response = await loadParticipantExternal(code.value);
//         console.log('response: ',response)
//     } catch (error) {
        
//     }

// })

import { usePartipantsService } from '~/componsables/useParticipants'
import { participantsService } from '~/services/participantsService'
import { useToast } from 'primevue/usetoast'
import { useDates } from '~/componsables/useDates'

const { loadParticipantExternal, updateCertificatePublicParticipantExternal, getChannels, registerCertificatePublicExternal, UpdateParticipantExrternal } = usePartipantsService()
const { formatDate } = useDates()
const router = useRouter();
const visible = ref(false)
const testData = ref()
const visibleSecondChannel = ref(false)
const toast = useToast()
const route = useRoute()
const registered = ref()
const flagRegistered = ref(true)
const listChannels = ref()
const channelMain = ref()
const channelSecondary = ref()
const certificateUpdate = ref()
const code = computed(() => route.params?.code || null)
const mainChannel = ref({})
const dataParticipant = ref<any>({})
const newMergeList = ref()
const newListUpdate = ref()
const newListCertificateUpdate = ref<any>([])
const secondaryChannels = ref([])
const lastpublicCertificate = ref({})
const CheckedMainChannel = ref(false)
const lastPulbicSecondaryCertificate = ref({})


async function registerNewParticipantfunc(){
    console.log(dataParticipant.value)
    const { acronym, name, participantCode, paymentGatewayCode } = dataParticipant.value
    const data = {
          code: participantCode,
          paymentGatewayCode: paymentGatewayCode,
          acronym: acronym,
          name: name,
          logo: "",
          paymentGateways: newListCertificateUpdate.value
    }
    console.log('la data final es: ', data)
    // const response  = await UpdateParticipantExrternal(data)
    // console.log('la response es: ',response);
    // console.log('data participant: ',dataParticipant.value)
    // console.log('lis certificates: ',newListCertificateUpdate.value)
}


async function participantUpdate(participant:any){
  const { participantCode, paymentGatewayCode } = participant
  console.log('participant charge',participant)
  visible.value = true;
  certificateUpdate.value = participant
}

function clear(channels:any){
    channels.publicCertificate = ''
    channels.code = ''
}

async function registrarCertificate(channel: any){
    console.log('canala a registrar es: ', channel)

        console.log('data capturada: ',code)
    try {
        const response = await registerCertificatePublicExternal({
            publicCertificate: {
                ...channel.publicCertificate
            }
        })
        if (response) {
            console.log('code before: ', response)
            console.log('listaMerge', newListUpdate.value)
            channel = {
                ...channel, 
                publicCertificates: [{
                    validFrom: formatDate(response.ValidFrom),
                    validTo: formatDate(response.ValidTo),
                    serialNumber: response.serialNumber
                }]
            }
            newListCertificateUpdate.value.push({
                code: channel.paymentGatewayCode,
                paymentGatewayParticipantCode: channel.codeChannel,
                publicCertificate: channel.publicCertificate
            })
            // console.log('code registro certificate: ', channel)
            searchAndRemplace(channel,newListUpdate.value)
            console.log('code registro certificate: ', newListUpdate.value)
            console.log('newlistCertificate', newListCertificateUpdate.value)
        }

    } catch (error) {
        // throw new Error(error)
        console.log(error)
    }
    //     try {
    //     const { participantCode, paymentGatewayCode, publicCertificate: { base64Content } } = channel
    //     const response = await updateCertificatePublic(base64Content, participantCode, paymentGatewayCode)
    //     console.log('la response es: ',response)
    //     visible.value =false
    //     if(response.wasSaved){
    //         toast.add({
    //         severity: 'success',
    //         summary: 'Certificado actualizado',
    //         detail: 'El ceetificado se actualizo con exito',
    //         life: 5000
    //         })
    //     }
    // } catch (error) {
    //     console.log('error' , error)
    //     toast.add({
    //     severity: 'error',
    //     summary: 'Certificado no actualizado',
    //     detail: 'Hubo un problema al actualizar el certificado',
    //     life: 5000
    //     })
    // }
}

    function searchAndRemplace(val:any, list:any){
          const encontrado = list.findIndex(item => item.paymentGatewayCode === val.paymentGatewayCode);
          if(encontrado !== -1){
            list[encontrado] = val
          }
          return list
    }

async function updateCertificade(){
    try {
        const { participantCode, paymentGatewayCode, newVal: { base64Content } } = certificateUpdate.value
        const response = await updateCertificatePublic(base64Content, participantCode, paymentGatewayCode)
        console.log('la response es: ',response)
        visible.value =false
        if(response.wasSaved){
            toast.add({
            severity: 'success',
            summary: 'Certificado actualizado',
            detail: 'El ceetificado se actualizo con exito',
            life: 5000
            })
        }
    } catch (error) {
        toast.add({
        severity: 'error',
        summary: 'Certificado no actualizado',
        detail: 'Hubo un problema al actualizar el certificado',
        life: 5000
        })
    }

}

async function updateCertificatePublic (base64:string, participantCode:string, paymentGatewayCode:string){
    const publiccertificate = {
          reason: '',
          publicCertificate: {
                base64Content: base64
          }
    }
    return await updateCertificatePublicParticipantExternal(publiccertificate, participantCode, paymentGatewayCode)
}
watch(registered,(newVal) => {
    certificateUpdate.value = { ...certificateUpdate.value, newVal}
    flagRegistered.value = false
    console.log('archivo', newVal)
})



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
    try {
        if (code.value) {
        console.log("Código recibido:", code.value)
        newMergeList.value = await getChannels()
        newMergeList.value = newMergeList.value.map(item => {
            console.log('el item es: ',item)
            return {
                ...item,
                paymentGatewayCode: item.code,
                paymentSystemCode: item.displayName,
                publicCertificates: [],
                isActive: false
            }
        })
        const response = await loadParticipantExternal(code.value)
        console.log('participante', response)
        // console.log('channels', reponseOptions)
        listChannels.value = response.participants
        listChannels.value.forEach(element => {
            if(element.isMain){
                dataParticipant.value = {
                    name: element.name,
                    acronym: element.acronym,
                    participantCode: element.participantCode,
                    paymentGatewayCode: element.paymentGatewayCode
                }
            }
            return element.publicCertificates = element.publicCertificates.map(certificate => ({
                ...certificate,
                validFrom: formatDate(certificate.validFrom),
                validTo: formatDate(certificate.validTo),
                createdAt: formatDate(certificate.createdAt)

            }))
        })
        // console.log('lista con valores de retorno: ',listChannels.value)
        newListUpdate.value = newMergeList.value.map(item => {
            const reemplazo = listChannels.value.find(obj => obj.paymentGatewayCode === item.code);
            return reemplazo ? reemplazo : item;
        })
        // console.log('channels for participant list: ', listChannels.value)
        console.log('la nueva lista merge es: ', newListUpdate.value)
    } else {
        console.warn("No se encontró el parámetro 'code'")
    }
    } catch (error) {
    // throw new Error(error);
    }
})
</script>