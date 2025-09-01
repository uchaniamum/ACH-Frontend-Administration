<template>
<Toast position="top-right" />
<XConfirmDialog
    v-model="visible"
    icon="x:warning-circle"
    icon-color="text-yellow-600"
    title="Mensaje"
>
    <template #message>
        <div class="space-y-2">
            <p>
                <span>¿Estás seguro de que deseas registrar el nuevo participante </span>
                <span class="font-semibold">{{ entidad.entidad }}</span>
            </p>
        </div>
    </template>
    <template #buttons>
            <div class="flex gap-3">
                <XButton label="Cancelar" severity="secondary" outlined @click="visible=false"/>
                <XButton label="Registrar" @click="sendNewParticipant()" />
            </div>
    </template>
</XConfirmDialog>
    <div class="flex-col gap-20">
        <div class="flex flex-col gap-8">
            <XHeader title="Nuevo participante destinatario" @click="router.push('/admin/configuration/participants')"
                :breadcrumb-items="items"
                :show-breadcrumb="true"
            />
            <span class="text-normal font-normal">Complete los datos requeridos para registrar un nuevo participante destinatario y cargue los certificados correspondientes. </span>
        </div>
        <div class="flex flex-col gap-20">
            <Stepper value="1" class="mt-20">
                <StepList class="px-[calc((340/14)*1rem)]">
                    <Step value="1">Datos generales</Step>
                    <Step value="2">Cargar certificados</Step>
                </StepList>
                <StepPanels>
                    <StepPanel v-slot="{ activateCallback }" value="1">
                        <VForm v-slot="{ values }" @submit="(values) => console.log('OK',values)" @invalid-submit="() => console.log('ERROR')">
                            <!-- <div>hola{{ values }}</div> -->
                            <participant-step-general-data class="px-[calc((190/14)*1rem)]" @channel="channelsSelected = $event"/>
                            <div class="flex pt-6 justify-end gap-12">
                                <Button variant="outlined" label="Cancelar" iconPos="right" @click="router.push('/admin/configuration/participants')" />
                                <!-- <Button label="Siguiente" iconPos="right" @click="handleNext(activateCallback)" /> -->
                                <Button label="Siguiente" iconPos="right" type="submit" @click="activateCallback('2'); nextchannel=true" />
                            </div>
                        </VForm>
                    </StepPanel>
                    <StepPanel v-slot="{ activateCallback }" value="2">
                        <participant-step-upload-certificates :channels="nextchannel"/>
                        <div class="flex pt-6 justify-end gap-12">
                            <Button variant="outlined" label="Cancelar" iconPos="right" @click="activateCallback('1'); nextchannel=false" />
                            <Button label="Siguiente" iconPos="right" @click="visible=true" :disabled="entidad.certificates.length == 0 ? true : false"/>
                        </div>
                    </StepPanel>
                </StepPanels>
            </Stepper> 
        </div>
    </div>
</template>

<script setup lang="ts">
import { Form as VForm } from 'vee-validate'
import { useFormRegisterParticipant } from '~/componsables/useFormRegisterParticipant';
import { usePartipantsService } from '~/componsables/useParticipants'


import { useRouter } from 'vue-router'

const router = useRouter()
const toast = useToast()
const visible = ref(false)
const { entidad, resetEntidad  } = useFormRegisterParticipant();
const { registerParticipant } = usePartipantsService()
async function sendNewParticipant(){
//   console.log('Enviando nuevo participante:', entidad)
//   console.log('Enviando nuevo participante:', entidad.certificates)
try {
    const response = await registerParticipant({
    name: entidad.entidad,
    acronym: entidad.sigla,
    code: entidad.codigo,
    isSelf: false,
    urlIcon: '',
    paymentSystems: entidad.certificates,
    references: ['']
  })
  router.push('/admin/configuration/participants')
  toast.add({
        severity: 'success',
        summary: 'Certificado actualizado',
        detail: 'Actualización certificado',
        life: 5000
      })
  resetEntidad()
} catch (error) {
   console.log(error) 
}
}
  
  
const channelsSelected = ref({})
const nextchannel = ref(false)
const items = ref([
    { label: 'Inicio'},
    { label: 'Configuración' },
    { label: 'Participantes' }
])


function handleNext(activateCallback:any) {
  console.log('✅ Canales seleccionados:', channelsSelected.value)
  activateCallback('2')
}

</script>

<style scoped>

</style>