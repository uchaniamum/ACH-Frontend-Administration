<template>
   <div class="flex flex-col gap-20">
      <div class="flex flex-col gap-8">
            <XHeader :title="`Editar destinatario - Tipo de alerta:${alert?.alertDescription} - ${alert?.paymentGatewayDescription}`" />
            <span>Asigna las alertas a destinatarios específicos, recuerda tener cuidado al registrarlos y/o actualizaros.</span>
      </div>
      <div class="flex flex-col mx-40">
         <h4>Detalles de envío de correo</h4>
         <div class="flex flex-col">
            <XTextarea label-required name="emails" v-model="emails" label="Destinatarios"/>
         </div>
         <XDivider class="my-6"/>
         <div class="flex flex-row justify-end gap-4">
            <XButton variant="outlined" label="Cancelar" @click="router.back()"/>
            <XButton label="Guardar" @click="saveEmails()"/>
         </div>
      </div>
   </div>
</template>
<script lang="ts" setup>
import { useAlertsService } from '~/componsables/useAlerts'
import { useRoute } from 'vue-router';
const { getAlertCode, updateEmails } = useAlertsService();
const router = useRouter();
const { params: { code, gateway }} = useRoute();
const alert = ref()
const emails = ref()

onMounted(async () => {
    alert.value = await getAlertCode({ code, gateway })
    console.log('el valor alert',alert.value)
    console.log(code, gateway)
    emails.value = convertListToString(alert.value.emailRecipientAddress)
})

function convertListToString(list: string[]): string {
  return list.join(", ");
}

function convertToList(str: string): string[] {
  return str
    .split(",")        
    .map(s => s.trim())
    .filter(s => s !== "");
}

async function saveEmails(){
   const convert = convertToList(emails.value)
   const data = {
      emailRecipientAddress: convert
   }
   try {
      const response = await updateEmails(data, code, gateway)
      if(response) {
         return router.back()
      }
      console.log(response)
      console.log('result',convert)
   } catch (error) {
      console.log(error)
   }
}

</script>