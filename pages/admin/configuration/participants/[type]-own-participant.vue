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
                <XInputText class="col-start-2 col-span-5" name="codigo" label="Codigo" v-model="codigo" :disabled="(type === 'edith')"
                    label-required />
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
                    canales necesarios</span>
            </div>
            <div class="flex flex-col">
                <Accordion multiple>
                    <AccordionPanel :value="index" v-for="(channel, index) in channelsAvailable">
                        <AccordionHeader>
                            <div class="flex flex-row gap-8">
                                <Checkbox :name="`check-${index}`" v-model="channel.isActive" binary />
                                <p class="flex flex-row gap-2 justify-start items-center">
                                    <span>Canal {{ channel.displayName }}</span>
                                </p>
                            </div>
                        </AccordionHeader>
                        <AccordionContent>
                            <div class="flex flex-col gap-12">
                                <div class="flex flex-row gap-4">
                                    <h5 class="text-[16px] text-gray-900 font-semibold flex-shrink-0">Datos del canal
                                    </h5>
                                    <Divider class="flex-grow" />
                                </div>
                                <div class="grid grid-cols-2 gap-x-12">
                                    <XInputText class="col-span-1" v-model="channel.codeChannel"
                                        :name="`codigoCanal-${index}`" label="Código del canal"
                                        :rules="[(v: any) => (!channel.paymentGatway || !!v) || 'El campo es requerido']"
                                        label-required />
                                    <div class="flex flex-col col-span-1 gap-y-4">
                                        <span>Estado del canal</span>
                                        <div class="flex flex-row gap-x-20">
                                            <div class="flex items-center gap-2">
                                                <RadioButton v-model="channel.isActive" inputId="channel-active"
                                                    :value="true" :disabled="type !== 'edith'" />
                                                <label for="channel-active">Activo</label>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <RadioButton v-model="channel.isActive" inputId="channel-inactive"
                                                    :value="false" :disabled="type !== 'edith'" />
                                                <label for="channel-inactive">Inactivo</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-row gap-4">
                                    <h5 class="text-[16px] text-gray-900 font-semibold flex-shrink-0">Certificados</h5>
                                    <Divider class="flex-grow" />
                                </div>
                                <Tabs value="0">
                                    <TabList>
                                        <Tab value="0">Público</Tab>
                                        <Tab value="1">Privado </Tab>
                                    </TabList>
                                    <TabPanels>
                                        <TabPanel value="0" class="p-0">
                                            <div class="flex flex-col">
                                                <div v-if="channel.publicCertificates.length < 1"
                                                    class="flex flex-col justify-center items-center">
                                                    <h4 class="font-semibold">Aun no hay un certificado público cargado
                                                    </h4>
                                                    <p>Realiza el proceso de carga de certificados públicos tocando el
                                                        botón de
                                                        “actualizar”.</p>
                                                </div>
                                                <div v-else>
                                                    <div class="mt-12 mb-4 col-span-3">
                                                        <span class="font-semibold text-primary-700">Certificado Privado
                                                            /
                                                            Último certificado</span>
                                                    </div>
                                                    <div class="grid grid-cols-3 gap-60 mb-12">
                                                        <div class="flex flex-col">
                                                            <span class="text-[12px] text-gray-600">Certificado
                                                                activo</span>
                                                            <p class="text-[#5F6A7B] truncate">{{
                                                                channel.publicCertificates[channel.publicCertificates.length
                                                                    - 1].serialNumber
                                                            }}
                                                            </p>
                                                        </div>
                                                        <div class="flex flex-col">
                                                            <span class="text-[12px] text-gray-600">Válido desde</span>
                                                            <p class="text-[#5F6A7B]">{{
                                                                channel.publicCertificates[channel.publicCertificates.length
                                                                    - 1].validFrom }}
                                                            </p>
                                                        </div>
                                                        <div class="flex flex-col">
                                                            <span class="text-[12px] text-gray-600 ">Válido hasta</span>
                                                            <p class="text-[#5F6A7B]">{{
                                                                channel.publicCertificates[channel.publicCertificates.length
                                                                    - 1].validTo }}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-if="channel.publicCertificates.length > 0 && 'createdAt' in channel.publicCertificates[channel.publicCertificates.length - 1]"
                                                    class="flex justify-end gap-8 mt-12">
                                                    <XButton variant="text" label="Ver historial"
                                                        @click="historialCertificates(channel.paymentGatewayCode, channel.paymentSystemCode, codeParticipant)" />
                                                    <XButton label="Actualizar" @click="activeModal(index)" />
                                                </div>
                                                <div v-else class="flex justify-end gap-8 mt-12">
                                                    <XButton variant="text" label="Limpiar" @click="clean(index)" />
                                                    <XButton label="Cargar" @click="activeModal(index)" />
                                                </div>
                                            </div>
                                        </TabPanel>
                                        <TabPanel value="1">
                                            <div class="flex flex-col">
                                                <div v-if="channel.privateCertificates.length < 1"
                                                    class="flex flex-col justify-center items-center">
                                                    <h4 class="font-semibold">Aun no hay un certificado público cargado
                                                    </h4>
                                                    <p>Realiza el proceso de carga de certificados públicos tocando el
                                                        botón de
                                                        “actualizar”.</p>
                                                </div>
                                                <div v-else>
                                                    <div class="mt-12 mb-4 col-span-3">
                                                        <span class="font-semibold text-primary-700">Certificado Privado
                                                            /
                                                            Último certificado</span>
                                                    </div>
                                                    <div class="grid grid-cols-3 gap-60 mb-12">
                                                        <div class="flex flex-col">
                                                            <span class="text-[12px] text-gray-600">Certificado
                                                                activo</span>
                                                            <p class="text-[#5F6A7B] truncate">{{
                                                                channel.privateCertificates[channel.privateCertificates.length
                                                                    - 1].serialNumber
                                                            }}
                                                            </p>
                                                        </div>
                                                        <div class="flex flex-col">
                                                            <span class="text-[12px] text-gray-600">Válido desde</span>
                                                            <p class="text-[#5F6A7B]">{{
                                                                channel.privateCertificates[channel.privateCertificates.length
                                                                    - 1].validFrom }}
                                                            </p>
                                                        </div>
                                                        <div class="flex flex-col">
                                                            <span class="text-[12px] text-gray-600 ">Válido hasta</span>
                                                            <p class="text-[#5F6A7B]">{{
                                                                channel.privateCertificates[channel.privateCertificates.length
                                                                    - 1].validTo }}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-if="channel.privateCertificates.length > 0"
                                                    class="flex justify-end gap-8 mt-12">
                                                    <XButton variant="text" label="Ver historial"
                                                        @click="clean(index)" />
                                                    <XButton label="Actualizar" @click="activeModal(index)" />
                                                </div>
                                                <div v-else class="flex justify-end gap-8 mt-12">
                                                    <XButton variant="text" label="Limpiar" @click="clean(index)" />
                                                    <XButton label="Cargar" @click="activeModal(index)" />
                                                </div>
                                            </div>
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
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
</template>
<script lang="ts" setup>
import { useDates } from '~/componsables/useDates';
import { usePartipantsService } from '~/componsables/useParticipants';

const { getChannels, getParticipantOwn, loadParticipantExternal } = usePartipantsService();
const { formatDate } = useDates()
const ownCode = ref()
const router = useRouter()
const type = useRouteParams('type');

const channelsAvailable = ref<any>([])
const visibleModal = ref(false)
const indexList = ref<number>()

const entidad = ref(null)
const sigla = ref(null)
const codigo = ref(null)
const main = ref(null)
const active = ref(true)
const inactive = ref(false)

onMounted(async () => {
    const channels = await loadChannels()
    if (type.value !== 'edith') {
        return
    }
    const { code, name, acronym, paymentGatewayCode } = await getParticipantOwn()
    const dataOwn = await loadParticipantExternal(code)
    entidad.value = name
    sigla.value = acronym
    codigo.value = code
    main.value = paymentGatewayCode
    channelsAvailable.value = channels.map((element: any) => {
        const match = dataOwn.participants.find((item: any) => item.paymentGatewayCode === element.code)
        if (match) {
            const convertDataCertificatePrivate = match.privateCertificates.map((element: any) => {
                return {
                    ...element,
                    validFrom: formatDate(element.validFrom),
                    validTo: formatDate(element.validTo)
                }
            })
            const convertDataCertificatePublic = match.publicCertificates.map((element: any) => {
                return {
                    ...element,
                    validFrom: formatDate(element.validFrom),
                    validTo: formatDate(element.validTo)
                }
            })
            const replace = {
                ...match,
                codeChannel: "",
                displayName: match.paymentSystemCode,
                code: match.paymentGatewayCode,
                privateCertificates: convertDataCertificatePrivate,
                publicCertificates: convertDataCertificatePublic
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
    console.log("la lista de canales es: ", channelsAvailable.value)

})

function activeModal(index: number) {
    indexList.value = index
    visibleModal.value = true
}

function registroParticipant(event: any) {
    console.log("los datos del formulario son: ", event)
}

function clean(index: number) {
    console.log("el index es: ", index)
    delete channelsAvailable.value[index].base64
    delete channelsAvailable.value[index].dataCertificate
    console.log("la nueva lista es: ", channelsAvailable.value)
}

const siglaAvatar = computed(() => {
    if (!sigla.value) return "" // por si viene vacío o undefined
    return sigla.value.slice(0, 3)
})

function sendForm() {
    console.log("send Form: ", channelsAvailable.value)
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
                codeChannel: '',


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