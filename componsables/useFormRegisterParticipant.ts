import { reactive } from 'vue'

const entidad = reactive({
  entidad: '',
  sigla: '',
  codigo: '',
  canales: [] as string[],
  certificates: ref<any[]>([]).value
})

function resetEntidad() {
  entidad.entidad = ''
  entidad.sigla = ''
  entidad.codigo = ''
  entidad.canales = []
  entidad.certificates = []
}

export function useFormRegisterParticipant() {
  return { entidad, resetEntidad  }
}