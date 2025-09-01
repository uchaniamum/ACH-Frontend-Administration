<template>
  <div class="flex flex-row">
    <span>Carga los certificados en los canales establecidos</span>
  </div>
  <XAccordion>
    <XAccordionPanel v-for="(canal,index) in listChannels" :key="index" value="1">
      <XAccordionHeader>
        <div class="flex flex-row gap-8">
          <XToggleSwitch v-model="canal.active"/>
          <p class="flex flex-row gap-2 justify-center items-center">
            <span>Canal {{ canal.name }}</span>
          </p>
        </div>
      </XAccordionHeader>
      <XAccordionContent>
        <div class="m-0 flex flex-col">
          <div class="flex justify-end gap-2">
            <label for="main">Marcar como canal principal</label>
            <XCheckBox v-model="canal.isPrimary" input-id="main" name="main" :value="true" binary />
          </div>
          <div class="flex flex-col" v-if="!canal.active">
            <div class="w-full">
            <XInputText label="Código del canal" name="codigoCanal" v-model="canal.codigoCanal" label-required
              class="w-full" />
            </div>
            <div class="w-full flex flex-col mt-12">
              <FileUploadCertificate @verificationComplete="(data) => channelSelected= {...data, canal: canal.name}" @registered="checkedACCL = $event"/>
            </div>
          </div>
          <div class="flex flex-col gap-12" v-if="canal.active">
            <div class="flex flex-col">
              <H5 class="font-semibold">Código ACCL</H5>
              <span> {{ canal.codigo }}</span>
            </div>
            <h5 class="font-semibold">Certificado</h5>
            <div class="grid grid-cols-4 gap-32">
              <div class="flex flex-col">
                <p class="text-[12px]">Certificado activo</p>
                <span>{{ canal.codigo }}</span>
              </div>
              <div class="flex flex-col">
                <p class="text-[12px]">Certificado activo</p>
                <span>{{ canal.validoDesde }}</span>
              </div>
              <div class="flex flex-col">
                <p class="text-[12px]">Válido desde</p>
                <span>{{ canal.validoHasta }}</span>
              </div>
              <div class="flex flex-col">
                <p class="text-[12px]">Estado</p>
                <XTag severity="success" value="Activo" class="w-[60px]" />
              </div>
            </div>
            <div  class="mt-12 flex justify-end gap-2">
              <XButton variant="text" label="Limpiar" @click="() => cleanCertificate(canal)" class="w-[10.714rem]"/>
              <XButton variant="outlined" label="Registrar" disabled/>
            </div>
          </div>
        </div>
      </XAccordionContent>
    </XAccordionPanel>
  </XAccordion>
</template>
<script lang="ts" setup>
import { useFormRegisterParticipant } from '~/componsables/useFormRegisterParticipant';

const { entidad } = useFormRegisterParticipant();
const listChannels:any = ref([])
const channelSelected:any = ref({})
const props = defineProps<{
  channels: boolean
}>();

watch(() => props.channels, (newVal) => {
  if (newVal) {
      entidad.canales.forEach((canal: any) => {
      listChannels.value.push({
        name: canal.name,
        codigoCanal: '',
        codigo: '',
        validoDesde: '',
        validoHasta: '',
        active: false,
        isPrimary: false,
        dataCertificate: {}
      })
  });
  } else {
    listChannels.value = []
  }
});

function cleanCertificate(canal){
  canal.codigo = ''
  canal.validoDesde = ''
  canal.validoHasta = ''
  canal.dataCertificate = {}
  canal.active = false
  console.log('Canal limpiado', listChannels.value)
}

watch(channelSelected, (newVal) => {
  // console.log('channle', listChannels.value)
  console.log('Datos del certificado recibidos en step-upload-certificates:', newVal)
  if(newVal){
    listChannels.value.forEach(element => {
      if(element.name == newVal.canal){
        element.codigo = newVal.certificateInfo.nroSerie
        element.validoDesde = newVal.certificateInfo.validacionInicio
        element.validoHasta = newVal.certificateInfo.validacionFin
        element.dataCertificate = newVal.publicCertificate
        element.active = checkedACCL.value
        entidad.certificates.push({
          code: newVal.canal,
          isPrimary: element.isPrimary,
          paymentGatewayCode: element.codigoCanal,
          publicCertificate: {
          base64Content: newVal.publicCertificate.base64Content,
          },
          privateCertificate: {
              base64Content: '',
              password: ''
          },
        })
      }
    });
  }
  // console.log('Lista de canales actualizada:', listChannels.value)
  console.log('Lista de canales actualizada:', entidad)
})

watch(entidad.canales, (newVal) => {
  console.log('Los canales son', newVal);
});

const canalCertificate = ref({
  codigoCanal: ''
})
const checkedACCL = ref(false)
const mainChannel = ref(false)
const channelACCL = ref()
const channelLIP = ref()
const channelMILD = ref()
const channelUNILINK = ref()
// const {certificateInfo, verificationPayload} = channelACCL.value || {}


</script>