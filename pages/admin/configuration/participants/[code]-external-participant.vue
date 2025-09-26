<template>
    <Form v-slot="{ values }" @submit="registroParticipant($event)" class="flex flex-col gap-20">
        <div class="flex flex-col gap-8">
            <XHeader title="Nuevo participante destinatario" />
            <span>Complete los datos requeridos para registrar un nuevo participante destinatario y cargue los
                certificados correspondientes.</span>
        </div>
        <div>
            {{ values }}
        </div>
        <div class="flex flex-col">
            <div class="grid grid-cols-12 gap-12">
                <Avatar class="bg-primary-100 text-primary" :label="siglaAvatar ? siglaAvatar : ''">
                    <template v-if="siglaAvatar == ''" #icon>
                        <Icon name="x:bank" class="col-span-1 text-primary" />
                    </template>
                </Avatar>
                <XInputText class="col-span-5" name="entidad" label="Entidad" v-model="entidad" label-required />
                <XInputText class="col-span-5" name="siglas" label="Siglas" v-model="sigla" label-required />
                <XInputText class="col-start-2 col-span-5" name="codigo" label="Codigo" v-model="codigo"
                    :disabled="!!codeParticipant" label-required />
                <XSelect class="col-span-5" placeholder="Selecione un canal principal" :options="channelsAvailable"
                    option-label="displayName" name="mainChannel" option-value="code" label="Canal Principal"
                    label-required v-model="main" :rules="[(v: any) => !!v || 'El campo es requerido',]" />
                <XSnackBar class="col-span-12 flex items-center" variant="info">
                    <p>El código es el único campo que no puede ser editado luego de la creación de un nuevo
                        participante</p>
                </XSnackBar>
            </div>
        </div>
        <div class="flex flex-col">
            <div class="flex flex-col gap-6 mt-12">
                <h4 class="font-semibold">Canales</h4>
                <span class="font-medium">Gestiona los canal del nuevo participante, luego pueden ser agregados los
                    canales
                    necesarios</span>
            </div>
            <div class="flex flex-col">
                <Accordion multiple>
                    <AccordionPanel :value="index" v-for="(channel, index) in channelsAvailable">
                        <AccordionHeader @click="channel.paymentGatway = !channel.paymentGatway">
                            <div class="flex flex-row gap-8">
                                <Checkbox :name="`check-${index}`" v-model="channel.paymentGatway" binary class="pointer-events-none"/>
                                <p class="flex flex-row gap-2 justify-start items-center">
                                    <span>Canal {{ channel.displayName }}</span>
                                </p>
                                <XTag v-if="main == channel.code" severity="success" value="Principal" />
                            </div>
                        </AccordionHeader>
                        <AccordionContent>
                            <div class="flex flex-col gap-12">
                                <div class="flex flex-row gap-4">
                                    <h5 class="text-[16px] text-gray-900 font-semibold flex-shrink-0">Datos del canal
                                    </h5>
                                    <Divider class="flex-grow" />
                                </div>
                                <div>
                                    <div class="grid grid-cols-2 gap-x-12">
                                        <XInputText class="col-span-1" v-model="channel.participantCode"
                                            :name="`codigoCanal-${index}`" label="Código del canal"
                                            :rules="[(v: any) => (!channel.paymentGatway || !!v) || 'El campo es requerido']"
                                            label-required />
                                        <div class="flex flex-col col-span-1 gap-y-4">
                                            <span>Estado del canal</span>
                                            <div class="flex flex-row gap-x-20">
                                                <div class="flex items-center gap-2">
                                                    <RadioButton v-model="channel.isActive" inputId="channel-active"
                                                        :value="true" :disabled="!codeParticipant" />
                                                    <label for="channel-active">Activo</label>
                                                </div>
                                                <div class="flex items-center gap-2">
                                                    <RadioButton v-model="channel.isActive" inputId="channel-inactive"
                                                        :value="false" :disabled="!codeParticipant" />
                                                    <label for="channel-inactive">Inactivo</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex flex-row gap-4">
                                        <h5 class="text-[16px] text-gray-900 font-semibold flex-shrink-0 my-12">
                                            Certificados
                                        </h5>
                                        <Divider class="flex-grow" />
                                    </div>
                                    <div class="flex flex-col">
                                        <div v-if="channel.publicCertificates.length === 0"
                                            class="flex flex-col justify-center items-center">
                                            <h4 class="font-semibold">Aun no hay un certificado público cargado</h4>
                                            <p>Realiza el proceso de carga de certificados públicos tocando el botón de
                                                “actualizar”.</p>
                                        </div>
                                        <div v-else>
                                            <div class="mb-4 col-span-3">
                                                <span class="font-semibold text-primary-700">Certificado Público /
                                                    Último
                                                    certificado</span>
                                            </div>
                                            <div class="grid grid-cols-3 gap-60 mb-12">
                                                <div class="flex flex-col">
                                                    <span class="text-[12px] text-gray-600">Certificado activo</span>
                                                    <p class="text-[#5F6A7B] truncate">{{
                                                        channel.publicCertificates[channel.publicCertificates.length -
                                                        1].serialNumber
                                                        }}
                                                    </p>
                                                </div>
                                                <div class="flex flex-col">
                                                    <span class="text-[12px] text-gray-600">Válido desde</span>
                                                    <p class="text-[#5F6A7B]">{{
                                                        channel.publicCertificates[channel.publicCertificates.length -
                                                        1].validFrom }}
                                                    </p>
                                                </div>
                                                <div class="flex flex-col">
                                                    <span class="text-[12px] text-gray-600 ">Válido hasta</span>
                                                    <p class="text-[#5F6A7B]">{{
                                                        channel.publicCertificates[channel.publicCertificates.length -
                                                        1].validTo }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="channel.publicCertificates.length > 0 && 'createdAt' in channel.publicCertificates[channel.publicCertificates.length - 1]"
                                            class="flex justify-end gap-8 mt-12">
                                            <XButton variant="text" label="Ver historial"
                                                @click="historialCertificates(channel.paymentGatewayCode, channel.paymentSystemCode, codeParticipant)" />
                                            <XButton label="Actualizar" @click="updateCertificate(index, channel)" />
                                        </div>
                                        <div v-else class="flex justify-end gap-8 mt-12">
                                            <XButton variant="text" label="Limpiar" @click="clean(index)" />
                                            <XButton label="Cargar" @click="activeModal(index)"
                                                :disabled="channel.publicCertificates.length > 0" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>
            </div>
        </div>
        <div class="flex flex-row">
            <XButton variant="text" label="Cancelar" />
            <XButton type="submit" label="Guardar" @click="sendForm()" />
        </div>
    </Form>
    <FileCertificate v-model:visible="visibleModal" @certificate="getCertificate" />
    <FileCertificate v-model:visible="visibleModalUpdate" @certificate="getCertificateUpdate" update />
</template>
<script lang="ts" setup>
import { usePartipantsService } from '~/componsables/useParticipants';
import { useGlobalToast } from '~/componsables/useGlobalToast';

const globalToast = useGlobalToast();
const { getChannels, loadParticipantExternal, updateCertificatePublicParticipantExternal,registerParticipant } = usePartipantsService();
const router = useRouter()
const code = useRouteParams<string>('code');
const chanelData = ref()
const channelsAvailable = ref<any>([])
const visibleModal = ref(false)
const visibleModalUpdate = ref(false)
const indexList = ref<number>()

const entidad = ref<string>('')
const sigla = ref<string>('')
const codigo = ref<string>('')
const main = ref("")
const channelStatus = ref(true)
const codeParticipant = ref()

onMounted(async () => {
    try {
        const channels = await loadChannels()
        console.log("la lista de canales es: ", channels)
        const newCode = JSON.parse(code.value)
        codeParticipant.value = newCode
        if (!newCode) {
            // console.log("no existe", newCode)
            channelsAvailable.value = channels.map((element: any) => {
                return {
                    ...element,
                    publicCertificates: [],
                    participantCode: ""
                }
            })
            console.log("channels si no tiene code: ", channelsAvailable.value)
            return
        }
        console.log("el code es: ", newCode)
        const getParticipant: any = await loadParticipantExternal(newCode)
        console.log(getParticipant.participants[0].name)
        entidad.value = getParticipant.participants[0].name
        sigla.value = getParticipant.participants[0].acronym
        codigo.value = JSON.stringify(newCode)
        main.value = (getParticipant.participants.find((element: any) => element.isMain)).paymentGatewayCode
        channelsAvailable.value = channels.map((element: any) => {
            const match = getParticipant.participants.find((item: any) => item.paymentGatewayCode === element.code)
            if (match) {
                const replace = {
                    ...match,
                    paymentGatway: true,
                    displayName: match.paymentSystemCode,
                    code: match.paymentGatewayCode,
                    // channelStatus: 
                }
                delete match.paymentGatewayCode
                delete match.paymentSystemCode
                return replace
            } else {
                return {
                    ...element,
                    publicCertificates: [],
                    participantCode: "",
                    isActive: false
                }
            }
        })
        console.log("channels si tiene code : ", channelsAvailable.value)
        // console.log("data: ", getParticipant)
    } catch (error) {

    }
})

function activeModal(index: number) {
    indexList.value = index
    visibleModal.value = true
}

function updateCertificate(index: number, channel: any) {
    indexList.value = index
    chanelData.value = channel
    visibleModalUpdate.value = true
}

function registroParticipant(event: any) {
    console.log("los datos del formulario son: ", event)
}

function clean(index: number) {
    console.log("el index es: ", index)
    delete channelsAvailable.value[index].base64
    channelsAvailable.value[index] = {
        ...channelsAvailable.value[index],
        publicCertificates: []
    }
    console.log("la nueva lista es: ", channelsAvailable.value)
}

const siglaAvatar = computed(() => {
    if (!sigla.value) return "" // por si viene vacío o undefined
    return sigla.value.slice(0, 3)
})


async function sendForm() {
    const newListChannels = channelsAvailable.value.map((element: any) => {
        if ("base64" in element && element.publicCertificates.length > 0) {
            return {
                code: element.code,
                isActive: true,
                paymentGatewayParticipantCode: element.participantCode,
                publicCertificate: {
                    base64Content: element.base64
                },
                privateCertificate: {
                    base64Content: "",
                    password: ""
                }
            }
        }
    }).filter(Boolean)
    let newParticipant = {
        code: codigo.value,
        paymentGatewayCode: main.value,
        acronym: sigla.value,
        name: entidad.value,
        logo: "",
        paymentGateways: [
            ...newListChannels
        ]
    }
    console.log("el valor a enviar es: ", newParticipant)
    try {
        const response = await registerParticipant(newParticipant)
        console.log("la response es: ", response)
        if(response){
            globalToast.success(`Participante ${sigla.value} registrado`);    
        }
    } catch (error) {
        console.log("hay error: ")
    }
}

function getCertificate(event: any) {
    console.log('el evento es: ', {
        index: indexList.value,
        getCertificate: event
    })
    channelsAvailable.value[indexList.value] = {
        ...channelsAvailable.value[indexList.value],
        base64: event.base64,
        publicCertificates: event.dataCertificate
    }
    console.log("la nueva lista es: ", channelsAvailable.value)
}

async function getCertificateUpdate(event: any) {
    console.log("llego aca")
    try {
        const response = await updateCertificatePublicParticipantExternal(event.base64, codeParticipant.value, chanelData.value.paymentGatewayCode)
        console.log("la response es: ", {
            data: event.base64,
            data2: codeParticipant.value,
            data3: chanelData.value.paymentGatewayCode
        })
        console.log("la response es: ", response)
    } catch (error) {
        console.log(error)
    }
}


// Charge Channels 
const loadChannels = async () => {
    try {
        const list = ref()
        const newlist = ref()
        list.value = await getChannels()
        newlist.value = list.value.map((element: any) => {
            return {
                code: element.code,
                displayName: element.displayName,
                isActive: element.isActive,
                paymentGatway: false,


            }
        })
        return newlist.value;
    } catch (error) {
        console.log('error urgente :v', error)
    }
}

function historialCertificates(gateway: string, channel: string, participantCode: string) {
    router.push(`historial/${participantCode}-${channel}-${gateway}`)
}

</script>