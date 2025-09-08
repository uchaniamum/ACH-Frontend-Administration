<template>
    <Toast position="top-right" />
    <div class="flex flex-col">
        <XHeader title="Nuevo participante destinatario" class="cursor-pointer" @click="router.push('/admin/configuration/participants/')" />
        <Form class="flex flex-col gap-20" v-slot="{ values }">
            <h4 class="font-semibold">Nuevo participante destinatario</h4>
            <div class="flex flex-col gap-12 px-[calc((200/14)*1rem)]">
                <div class="grid grid-cols-2 gap-10">
                    <XInputText label-required label="Código" class="col-span-1" name="codigo"
                        v-model="dataCertificate.codigo" :rules="[(v: any) => !!v || 'El campo es requerido']" />
                    <XInputText label-required label="Siglas" class="col-span-1" name="siglas"
                        v-model="dataCertificate.sigla" :rules="[(v: any) => !!v || 'El campo es requerido']" />
                </div>
                <div class="grid grid-cols-2 gap-10">
                    <XInputText label-required abel-required label="Entidad" class="col-span-q" name="entidad"
                        v-model="dataCertificate.participant" :rules="[(v: any) => !!v || 'El campo es requerido']" />
                    <XSelect placeholder="Selecione un canal principal" :options="channels" option-label="displayName"
                        name="mainChannel" option-value="code" label="Canal Principal"
                        v-model="dataCertificate.mainChannel"
                        :rules="[(v: any) => !!v || 'El campo es requerido',
                        // (v: any) => {
                        //     return listCertificates.find(element => element.paymentGatewayCode === v)?.registered
                        //         ? true
                        //         : 'Seleccione un canal principal valido'
                        // }
                        ]" />
                </div>
                <XSnackBar variant="info" class="col-span-2">
                    <div class="w-full flex justify-center items-center">
                        <span class="">El código es el único campo que no puede ser editado luego de la creación de un
                            nuevo participante</span>
                    </div>
                </XSnackBar>
            </div>
            <div class="flex flex-col px-[calc((200/14)*1rem)]">
                <h4 class="font-semibold">Canales</h4>
                <span>Selecione el canal para configurarlo</span>
                <Accordion multiple>
                    <AccordionPanel :value="index" v-for="(channel, index) in listCertificates" :key="index">
                        <AccordionHeader>
                            <div class="flex flex-row gap-8">
                                <ToggleSwitch v-model="channel.registered" />
                                <p class="flex flex-row gap-2 justify-center items-center">
                                    <span>Canal {{ channel.name }}</span>
                                </p>
                                <XTag :severity="!channel.registered ? 'danger' : 'success'"
                                    :value="!channel.registered ? 'Certificado no cargado' : 'Certificado cargado'" />
                            </div>
                        </AccordionHeader>
                        <AccordionContent>
                            <div class="m-0 flex flex-col">
                                <div class="flex flex-col" v-if="!channel.registered">
                                    <div class="w-full">
                                        <XInputText label="Código del canal" :name='`channel${index}`' v-model="channel.paymentGatewayCode"
                                            label-required class="w-full" />
                                    </div>
                                    <div class="w-full flex flex-col mt-12">
                                        <FileUploadCertificate documents-accepted=".txt"
                                            @registered="channel.publicCertificate = $event" />
                                    </div>
                                </div>
                                <div class="flex flex-col gap-12" v-if="channel.registered">
                                    <div class="flex flex-col">
                                        <H5 class="font-semibold">Código {{ channel.name }}</H5>
                                        <span> {{ channel.dataCertificate.serialNumber }}</span>
                                    </div>
                                    <h5 class="font-semibold">Certificado</h5>
                                    <div class="grid grid-cols-4 gap-32">
                                        <div class="flex flex-col">
                                            <p class="text-[12px]">Certificado activo</p>
                                            <span>{{ channel.dataCertificate.serialNumber }}</span>
                                        </div>
                                        <div class="flex flex-col">
                                            <p class="text-[12px]">Válido desde</p>
                                            <span>{{ channel.dataCertificate.ValidFrom }}</span>
                                        </div>
                                        <div class="flex flex-col">
                                            <p class="text-[12px]">Válido hasta</p>
                                            <span>{{ channel.dataCertificate.ValidTo }}</span>
                                        </div>
                                        <div class="flex flex-col">
                                            <p class="text-[12px]">Estado</p>
                                            <XTag severity="success" value="Activo" class="w-[60px]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-12 flex justify-end gap-2">
                                <XButton variant="text" label="Limpiar" @click="clearChannel(channel)"
                                    :disabled="!channel.registered" class="w-[10.714rem]" />
                                <XButton variant="outlined" label="Registrar" @click="registerCertificate(channel)" :disabled="channel.registered"/>
                            </div>
                            <!-- cliente propio -->
                             <XDivider class="my-10"/>
                            <div class="flex flex-col" v-if="type == 'own' " >
                                <div class="flex flex-col" v-if="!channel.registeredPrivate">
                                    <h4 class="font-semibold"> Certificado privado</h4>
                                    <XInputText label="Password" :name="`password-${index}`" v-model="channel.password"
                                        label-required class="w-full" />
                                    <FileUploadCertificate documents-accepted=".pfx"
                                        @registered="channel.privateCertificate = $event" />
                                </div>
                                <div class="flex flex-col gap-12" v-if="channel.registeredPrivate">
                                    <div class="flex flex-col">
                                        <H5 class="font-semibold">Código {{ channel.name }}</H5>
                                        <span> {{ channel.dataCertificatePrivate.serialNumber }}</span>
                                    </div>
                                    <h5 class="font-semibold">Certificado</h5>
                                    <div class="grid grid-cols-4 gap-32">
                                        <div class="flex flex-col">
                                            <p class="text-[12px]">Certificado activo</p>
                                            <span>{{ channel.dataCertificatePrivate.serialNumber }}</span>
                                        </div>
                                        <div class="flex flex-col">
                                            <p class="text-[12px]">Válido desde</p>
                                            <span>{{ channel.dataCertificatePrivate.ValidFrom }}</span>
                                        </div>
                                        <div class="flex flex-col">
                                            <p class="text-[12px]">Válido hasta</p>
                                            <span>{{ channel.dataCertificatePrivate.ValidTo }}</span>
                                        </div>
                                        <div class="flex flex-col">
                                            <p class="text-[12px]">Estado</p>
                                            <XTag severity="success" value="Activo" class="w-[60px]" />
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-12 flex justify-end gap-2">
                                    <XButton variant="text" label="Limpiar" @click="clearChannelPrivate(channel)"
                                        :disabled="!channel.registeredPrivate" class="w-[10.714rem]" />
                                    <XButton variant="outlined" label="Registrar" @click="chargePrivateCertificate(channel)" :disabled="channel.registeredPrivate" />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionPanel>
                </Accordion>
                <XDivider class="py-12" />
                <div class="mt-12 flex justify-end gap-2 pb-12">
                    <XButton variant="text" label="Salir"
                        @click="() => router.push('/admin/configuration/participants/')" class="w-[10.714rem] " />
                    <XButton variant="outlined" label="Registrar" @click="registerNewParticipantfunc()" />
                    <!-- <XButton variant="outlined" label="Registrar" type="submit" /> -->
                </div>
            </div>
        </Form>
    </div>
    <!-- <XConfirmDialog v-model="visible" icon="x:warning-circle" icon-color="text-blue-600" title="Mensaje">
        <template #message>
            <div class="space-y-2">
                <span>Estaseguro de registrar este participante vdsvsdvssvds</span>
            </div>
        </template>
        <template #buttons>
            <div class="flex gap-3">
                <XButton label="Cancel" severity="secondary" outlined @click="visible = false" />
                <XButton label="Save" @click="RegisterParticipant()" />
            </div>
        </template>
    </XConfirmDialog> -->
</template>

<script lang="ts" setup>
import { Form } from 'vee-validate';
import { useDates } from '~/componsables/useDates';
import { useFormRegisterParticipant } from '~/componsables/useFormRegisterParticipant'
import { usePartipantsService } from '~/componsables/useParticipants'

const schema = {
    codigo: '',
    siglas: '',
    entidad: '',
    mainChannels: ''
}

const router = useRouter()
const toast = useToast()
const { getChannels, registerCertificatePublicExternal, registerParticipant, chargeCertificatePrivate, registerParticipantOwn  } = usePartipantsService();
const { entidad } = useFormRegisterParticipant();
const type = useRouteParams('type');
const { formatDate } = useDates();
const channels = ref([])
const newCertificate = ref({})
const dataCertificate = ref({
    participant: '',
    sigla: '',
    codigo: '',
    mainChannel: ''
})
const certificate = ref({})
const listCertificates = ref()

onBeforeMount(() => {
    console.log('montar 1')
    if(type.value == 'own' || type.value == 'new'){
        return 
    }else{
        router.push('admin/configuration/participants')
    }
})

onMounted(async () => {
    console.log('montar 2')
    console.log(type.value)
    channels.value = await loadChannels()
    console.log('el valor es: ',channels.value)
    listCertificates.value = channels.value.map((item:any) => {
        if (item.isActive) {
            return {
                ...item,
                name: item.displayName,
                paymentGatewayCode: '',
                registered: false,
                registeredPrivate: false,
                dataCertificate: {
                    serialNumber: '',
                    ValidFrom: '',
                    ValidTo: ''
                },
                dataCertificatePrivate: {
                    serialNumber: '',
                    ValidFrom: '',
                    ValidTo: ''
                }
            }
        }
        return null;
    })
    console.log('lista de certificados es: ',listCertificates.value)
})

const loadChannels = async () => {
    try {
        return await getChannels();
    } catch (error) {
        console.log('error urgente :v', error)
    }
}

function clearChannel(channel) {
    channel.code = '',
    channel.publicCertificate = {},
    channel.registered = false

    console.log('delete', channel)
}

function clearChannelPrivate(channel) {
    channel.password = '',
    channel.privateCertificate = {},
    channel.registeredPrivate = false

    console.log('delete', channel)
}

// Register
async function registerCertificate(code) {
    console.log('data capturada: ',code)
    try {
        const response = await registerCertificatePublicExternal({
            publicCertificate: {
                ...code.publicCertificate
            }
        })
        if (response) {
            console.log('code before: ', code)
            code = {
                ...code, dataCertificate: {
                    ValidFrom: formatDate(response.ValidFrom),
                    ValidTo: formatDate(response.ValidTo),
                    serialNumber: response.serialNumber
                }
            }
            console.log('code registro certificate: ', code)
            searchCertificate(listCertificates.value, { ...code })
        }
        console.log('list update publicc', listCertificates.value)
    } catch (error) {
        throw new Error(error)
    }

}

function searchCertificate(list, certificade) {
    console.log('certificate', certificade)
    if (list.length > 0) {
        const index = list.findIndex(data => data.paymentGatewayCode == certificade.paymentGatewayCode)
        if (index !== -1) {
            console.log('existe', certificade)
            certificade.registered = true
            list[index] = certificade
        } else {
            console.log('no existe')
            certificade.registered = true
            list.push(certificade)
        }
    } else {
        certificade.registered = true
        list.push(certificade)
    }

}

async function registerNewParticipantfunc() {    
    const data ={
        ...dataCertificate.value,
        ...listCertificates.value
    }
    console.log('la data es: ', data)
    const { codigo, participant, sigla, mainChannel} = data
    const newList:any = []
    listCertificates.value.forEach(element => {
            if(element.code !== '' && element.publicCertificate){
                if(type.value == 'own'){
                    console.log(element.code)
                    const certificate = {
                        code: element.code,
                        paymentGatewayParticipantCode: element.paymentGatewayCode,
                        publicCertificate: element.publicCertificate,
                        privateCertificate: {
                            ...element.privateCertificate,
                            password: element.password
                        }
                    }
                    newList.push(certificate)
                }else{
                    const certificate = {
                        code: element.code,
                        paymentGatewayParticipantCode: element.paymentGatewayCode,
                        publicCertificate: element.publicCertificate,
                        privateCertificate: {
                            base64Content: '',
                            password: ''
                        }
                    }
                    newList.push(certificate)
                }
            }
    });
    const newPartcipant = {
        code: codigo,
        paymentGatewayCode: mainChannel,
        acronym: sigla,
        name: participant,
        logo: '',
        paymentGateways: newList
    }
    console.log(
        'test',newPartcipant
    )
    const response = ref()
    if(type.value == 'own'){
       response.value  = await registerParticipantOwn(newPartcipant)
    }else{
       response.value = await registerParticipant(newPartcipant)
    }
    console.log('response', response.value)
    if(response){
    toast.add({
            severity: 'success',
            summary: 'Certificado actualizado',
            detail: 'Actualización certificado',
            life: 5000
        })
    router.push('/admin/configuration/participants/')
    }else{
        // router.push('/admin/configuration/participants/')
     toast.add({
            severity: 'error',
            summary: 'Hubo un problema al registrar el participante',
            detail: 'No se actualizo el participante',
            life: 5000
        })
    }
    
}

async function chargePrivateCertificate({ privateCertificate: { base64Content }, password, code,  }:any){
    const chargingCertificate = {
            privateCertificate: {
                base64Content: base64Content,
                password: password
            }
    }
    console.log('data private: ', chargingCertificate)
    console.log('list general: ', listCertificates.value)
    try {
        const { ValidFrom, ValidTo, serialNumber } = await chargeCertificatePrivate(chargingCertificate)
        console.log('response private', { ValidFrom, ValidTo, serialNumber })
        const found = listCertificates.value.find(item => item.code == code);
        console.log('found', found.dataCertificate.ValidFrom)
        if(certificate){
            found.dataCertificatePrivate = {
                serialNumber: serialNumber,
                ValidFrom: formatDate(ValidFrom),
                ValidTo: formatDate(ValidTo)
            }
            found.registeredPrivate = true
        }

        console.log('list update: ',listCertificates.value)

    } catch (error) {
        
    }

}

// watch(channels,(newVal:JSON)=>{
//     listCertificates.push(newVal)
//     console.log('el valor es: ',newVal)
// })

// import { ref } from 'vue'
// import { useRouter } from 'vue-router'

// const router = useRouter()
// const toast = useToast()

const visible = ref(false)
const codigo = ref()
const sigla = ref()

watch(certificate, (newVal: any) => {
    console.log('file recuperate', newVal)
})

// function RegisterParticipant() {
//     visible.value = false
//     toast.add({
//         severity: 'success',
//         summary: 'Certificado actualizado',
//         detail: 'Actualización certificado',
//         life: 5000
//     })
//     router.push('/admin/configuration/participants/')
// }

const listChannels = reactive([
    {
        codigo: "10A5DS100F567JWEE",
        nameChannel: "ACCL",
        isActive: false,
        isActivecheck: false,
        validoDesde: "10/11/2025",
        validoHasta: '10/11/2025'

    },
    // {
    //     codigo: "10A5DS100F567JWEE",
    //     nameChannel: "LIP",
    //     isActive: false,
    //     isActivecheck: false,
    //     validoDesde: "10/11/2025",
    //     validoHasta: '10/11/2025'
    // },
    // {
    //     codigo: "10A5DS100F567JWEE",
    //     nameChannel: "MLD",
    //     isActive: false,
    //     isActivecheck: false,
    //     validoDesde: "10/11/2025",
    //     validoHasta: '10/11/2025'
    // },
    // {
    //     codigo: "10A5DS100F567JWEE",
    //     nameChannel: "UNILNK",
    //     isActive: false,
    //     isActivecheck: false,
    //     validoDesde: "10/11/2025",
    //     validoHasta: '10/11/2025'
    // },
])
</script>