export const useFileUpload = () => {
    const toast = useToast()

    // Estado reactivo
    const fileStates = reactive(new Map())
    const selectedFile = ref<File | null>(null)
    const fileBase64 = ref<string>('')
    const isVerifying = ref(false)
    const isVerified = ref(false)
    const verificationProgress = ref(0)

    /**
     * Genera una clave única para cada archivo
     */
    const getFileKey = (file: File): string => {
        return `${file.name}-${file.size}-${file.lastModified}`
    }

    /**
     * Formatea el tamaño del archivo en bytes a formato legible
     */
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    /**
     * Obtiene el estado de carga de un archivo
     */
    const getFileStatus = (file: File) => {
        const fileKey = getFileKey(file)
        return fileStates.get(fileKey) || {
            isLoaded: false,
            progress: 0
        }
    }

    /**
     * Simula el progreso de carga de un archivo
     */
    const simulateFileLoading = (fileKey: string): void => {
        let progress = 0
        const interval = setInterval(() => {
            progress += 20

            // Actualizar progreso de carga
            if (fileStates.has(fileKey)) {
                const currentState = fileStates.get(fileKey)
                fileStates.set(fileKey, {
                    ...currentState,
                    progress: progress
                })
            }

            if (progress >= 100) {
                clearInterval(interval)

                // Marcar como cargado completo
                if (fileStates.has(fileKey)) {
                    const currentState = fileStates.get(fileKey)
                    fileStates.set(fileKey, {
                        ...currentState,
                        isLoaded: true,
                        progress: 100
                    })
                }
            }
        }, 200)
    }

    /**
     * Convierte un archivo a Base64
     */
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                const result = reader.result as string
                const base64 = result.includes('base64,')
                    ? result.split('base64,')[1]
                    : result
                resolve(base64)
            }
            reader.onerror = error => reject(error)
        })
    }

    /**
     * Maneja la selección de archivos
     */
    const onFileSelect = async (event: any): Promise<void> => {
        try {
            // Reiniciar estados
            resetFileStates()

            if (event.files.length === 0) return

            const file = event.files[0]
            selectedFile.value = file

            // Inicializar estado del archivo
            const fileKey = getFileKey(file)
            if (!fileStates.has(fileKey)) {
                fileStates.set(fileKey, {
                    isLoaded: false,
                    progress: 0,
                    file: file
                })

                // Simular carga
                simulateFileLoading(fileKey)

                // Convertir a Base64
                fileBase64.value = await fileToBase64(file)
                console.log('Archivo convertido a Base64')
            }
        } catch (error) {
            console.error('Error procesando archivo:', error)
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo procesar el archivo',
                life: 5000
            })
        }
    }

    /**
     * Reinicia todos los estados del archivo
     */
    const resetFileStates = (): void => {
        isVerifying.value = false
        isVerified.value = false
        verificationProgress.value = 0
        selectedFile.value = null
        fileBase64.value = ''
    }

    /**
     * Valida el tipo de archivo
     */
    const validateFileType = (file: File, allowedTypes: string[]): boolean => {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
        return allowedTypes.includes(fileExtension)
    }

    /**
     * Valida el tamaño del archivo
     */
    const validateFileSize = (file: File, maxSizeInMB: number): boolean => {
        const maxSizeInBytes = maxSizeInMB * 1024 * 1024
        return file.size <= maxSizeInBytes
    }

    /**
     * Valida un archivo completo
     */
    const validateFile = (
        file: File,
        allowedTypes: string[] = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.txt'],
        maxSizeInMB: number = 10
    ): { isValid: boolean; error?: string } => {
        if (!validateFileType(file, allowedTypes)) {
            return {
                isValid: false,
                error: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`
            }
        }

        if (!validateFileSize(file, maxSizeInMB)) {
            return {
                isValid: false,
                error: `El archivo es demasiado grande. Tamaño máximo: ${maxSizeInMB}MB`
            }
        }

        return { isValid: true }
    }

    /**
     * Remueve un archivo del estado
     */
    const removeFile = (fileKey?: string): void => {
        if (fileKey) {
            fileStates.delete(fileKey)
        }
        resetFileStates()
    }

    /**
     * Obtiene todos los archivos cargados
     */
    const getLoadedFiles = () => {
        const loadedFiles = []
        for (const [key, state] of fileStates.entries()) {
            if (state.isLoaded) {
                loadedFiles.push({
                    key,
                    file: state.file,
                    progress: state.progress
                })
            }
        }
        return loadedFiles
    }

    return {
        // Estado reactivo
        fileStates: readonly(fileStates),
        selectedFile: readonly(selectedFile),
        fileBase64: readonly(fileBase64),
        isVerifying: readonly(isVerifying),
        isVerified: readonly(isVerified),
        verificationProgress: readonly(verificationProgress),

        // Métodos
        onFileSelect,
        getFileKey,
        formatFileSize,
        getFileStatus,
        fileToBase64,
        resetFileStates,
        validateFile,
        validateFileType,
        validateFileSize,
        removeFile,
        getLoadedFiles
    }
}