<template>
    <div class="flex flex-col gap-12">
        <h4 class="font-semibold">Datos del participante</h4>
        <div class="grid grid-cols-2 gap-12">
            <XInputText label="Entidad" name="entidad" v-model="entidad.entidad" label-required class="col-span-2":rules="[
            (v: any) => !!v || 'El campo es requerido']" />
            <div class="grid grid-cols-2 gap-10 col-span-2">
                <XInputText           :rules="[
            (v: any) => !!v || 'El campo es requerido']" label="Siglas" name="siglas" v-model="entidad.sigla" label-required class="col-span-1"/>
                <XInputText label="Código" name="codigo" v-model="entidad.codigo" label-required class="col-span-1" :rules="[
            (v: any) => !!v || 'El campo es requerido']" />
            </div>
            <XSnackBar variant="info"  class="col-span-2">
                <div class="w-full flex justify-center items-center">
                    <span class="">El código es el único campo que no puede ser editado luego de la creación de un nuevo participante</span>
                </div>
            </XSnackBar>
            <div class="col-span-2">
                <div class="flex flex-col gap-6">
                    <h4 class="font-semibold">Canales</h4>
                    <span>Selecciona el canal del nuevo participante, luego pueden ser agregados los canales necesarios</span>
                </div>
                <!-- <Field name="test" v-slot="{ field }" type="checkbox"> -->
                    <CheckBoxGroup v-model="entidad.canales" name="test" class="flex justify-between flex-row col-span-2 my-12">
                        <div class="flex justify-center gap-2">
                            <CheckBox name="test" input-id="accl" :value="{ name: 'ACCL'}"/>
                            <label for="accl"> ACCL</label>
                        </div>
                        <div class="flex justify-center gap-2">
                            <CheckBox name="test" input-id="lip" :value="{ name: 'LIP'}" />
                            <label for="lip"> LIP </label>
                        </div>
                        <div class="flex justify-center gap-2">
                            <CheckBox name="test" input-id="mild" :value="{ name: 'MILD'}" />
                            <label for="mild"> MILD </label>
                        </div>
                        <div class="flex justify-center gap-2">
                            <CheckBox  name="test" input-id="unlink" :value="{ name: 'UNILINK'}" />
                            <label for="unlink"> UNILINK </label>
                        </div>
                    </CheckBoxGroup>
                <!-- </Field> -->
                <XSnackBar variant="info"  class="col-span-2">
                    <div class="w-full flex justify-center items-center">
                        <span>El canal seleccionado será tomado en cuenta como “canal principal”, esto puede ser cambiado luego de crear el nuevo participante</span>
                    </div>
                </XSnackBar>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { Field } from 'vee-validate'
import { useFormRegisterParticipant } from '~/componsables/useFormRegisterParticipant'
// const entidad = ref('')
const siglas = ref('')
const codigo = ref('')
const canales = ref([])
// const accl = ref(false)
// const lip = ref(false)
// const mild = ref(false)
// const unilink = ref(false)

const { entidad } = useFormRegisterParticipant()


const emit = defineEmits<{
    'channel': [value:any],
}>();



// watch([accl, lip, mild, unilink], () => {
//   emit('channel', {
//     accl: accl.value,
//     lip: lip.value,
//     mild: mild.value,
//     unilink: unilink.value
//   })
// })

</script>