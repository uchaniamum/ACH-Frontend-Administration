// composables/useFileValidation.ts
import { ref } from 'vue'

export function useFileValidation() {
  const errorMessage = ref<string>('')
  
  const validateFile = (file: File, options: {
    maxSize?: number
    allowedTypes?: string[]
    maxSizeMB?: number
  } = {}): boolean => {
    errorMessage.value = ''
    
    // Configuración por defecto
    const {
      maxSize = 10 * 1024 * 1024, // 10MB por defecto
      allowedTypes = ['.txt'],
      maxSizeMB = 10
    } = options

    // Validar tipo de archivo
    if (allowedTypes.length > 0) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      if (!allowedTypes.includes(fileExtension)) {
        errorMessage.value = `Tipo de archivo no permitido. Formatos aceptados: ${allowedTypes.join(', ')}`
        return false
      }
    }

    // Validar tamaño del archivo
    if (file.size > maxSize) {
      errorMessage.value = `El archivo es demasiado grande. Tamaño máximo permitido: ${maxSizeMB}MB`
      return false
    }

    // Validar archivo vacío
    if (file.size === 0) {
      errorMessage.value = 'El archivo está vacío'
      return false
    }

    return true
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return {
    validateFile,
    errorMessage,
    formatFileSize
  }
}