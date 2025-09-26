<template>
    <div>
        <XHeader title="Detalle de transferencias interbancarias" :breadcrumb-items="itemsBreadParameters"
            :show-breadcrumb="true" class="!bg-transparent !border-0">
            <template #description>
                <p class="text-black">
                    A continuación se presenta los datos correspondientes a la operación seleccionada.
                </p>
            </template>
        </XHeader>

        <div class="p-6 space-y-6">
            <!-- Primera fila de contenedores -->
            <div class="flex flex-col sm:flex-row gap-4 w-full">
                <!-- Contenedor 1: Datos del Originante -->
                <div
                    class="w-full sm:w-1/2 p-4 bg-white border-2 border-[#CEDDFE] rounded-2xl flex flex-col justify-between min-h-[200px]">
                    <h3 class="text-black font-bold text-[16px] m-0 mb-4">
                        Datos del Originante
                    </h3>
                    <div class="flex flex-col gap-3 flex-grow">
                        <p class="text-gray-600 text-[14px] m-0">
                            Banco: <span class="text-black font-medium">Banco Continental</span>
                        </p>
                        <p class="text-gray-600 text-[14px] m-0">
                            Nombre: <span class="text-black font-medium">Nombre Completo y apellido</span>
                        </p>
                        <p class="text-gray-600 text-[14px] m-0">
                            Cuenta: <span class="text-black font-medium">{{ banco || 'No especificado' }}</span>
                        </p>
                        <p class="text-gray-600 text-[14px] m-0">
                            Fecha: <span class="text-black font-medium">{{ fecha || 'No disponible' }}</span>
                        </p>
                    </div>
                </div>

                <!-- Contenedor 2: Destino / Enviado a -->
                <div
                    class="w-full sm:w-1/2 p-4 bg-white border-2 border-[#CEDDFE] rounded-2xl flex flex-col justify-between min-h-[200px]">
                    <h3 class="text-black font-bold text-[16px] m-0 mb-4">
                        Destino / Enviado a
                    </h3>
                    <div class="flex flex-col gap-3 flex-grow">
                        <p class="text-gray-600 text-[14px] m-0">
                            Banco: <span class="text-black font-medium">Banco Continental</span>
                        </p>
                        <p class="text-gray-600 text-[14px] m-0">
                            Nombre: <span class="text-black font-medium">Nombre Completo y apellido</span>
                        </p>
                        <p class="text-gray-600 text-[14px] m-0">
                            Importe: <span class="text-black font-medium">{{ importe || '0.00' }} {{ moneda || 'USD'
                                }}</span>
                        </p>
                        <p class="text-gray-600 text-[14px] m-0">
                            Estado: <span class="text-black font-medium">{{ getEstadoTexto() }}</span>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Segunda fila de contenedores -->
            <div class="flex flex-col sm:flex-row gap-4 w-full">
                <!-- Contenedor 3: Detalle de la transferencia -->
                <div
                    class="w-full sm:w-1/2 p-4 bg-white border-2 border-[#CEDDFE] rounded-2xl flex flex-col justify-between min-h-[200px]">
                    <h3 class="text-black font-bold text-[16px] m-0 mb-4">
                        Detalle de la transferencia
                    </h3>
                    <div class="flex flex-col gap-3 flex-grow">
                        <p class="text-gray-600 text-[14px] m-0">
                            Tipo: <span class="text-black font-medium">{{ getTipoTransferencia() }}</span>
                        </p>
                        <p class="text-gray-600 text-[14px] m-0">
                            Referencia: <span class="text-black font-medium font-mono text-xs">{{ generarReferencia()
                                }}</span>
                        </p>
                        <p class="text-gray-600 text-[14px] m-0">
                            Moneda: <span class="text-black font-medium">{{ moneda || 'USD' }}</span>
                        </p>
                        <p class="text-gray-600 text-[14px] m-0">
                            Comisión: <span class="text-black font-medium">$0.00</span>
                        </p>
                    </div>
                </div>

                <!-- Contenedor 4: Glosa -->
                <div
                    class="w-full sm:w-1/2 p-4 bg-white border-2 border-[#CEDDFE] rounded-2xl flex flex-col justify-between min-h-[200px]">
                    <h3 class="text-black font-bold text-[16px] m-0 mb-4">
                        Glosa
                    </h3>
                    <div class="flex flex-col gap-3 flex-grow">
                        <p class="text-gray-600 text-[14px] m-0">
                            Canal: <span class="text-black font-medium">Banca en Línea</span>
                        </p>
                        <p class="text-gray-600 text-[14px] m-0">
                            IP: <span class="text-black font-medium">192.168.1.1</span>
                        </p>
                        <p class="text-gray-600 text-[14px] m-0">
                            Usuario: <span class="text-black font-medium">admin@banco.com</span>
                        </p>
                        <p class="text-gray-600 text-[14px] m-0">
                            Dispositivo: <span class="text-black font-medium">Web Browser</span>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Tercera fila - Contenedor adicional -->
            <div class="flex justify-center w-full">
                <!-- Contenedor 5: Observaciones / Notas -->
                <div class="w-full p-4 bg-white border-2 border-[#CEDDFE] rounded-2xl min-h-[150px]">
                    <h3 class="text-black font-bold text-[16px] m-0 mb-4">
                        Detalle del débito del sistema
                    </h3>
                    <div class="flex flex-col gap-3">
                        <p class="text-gray-600 text-[14px] m-0">
                            Motivo: <span class="text-black font-medium">Pago de servicios</span>
                        </p>
                        <p class="text-gray-600 text-[14px] m-0">
                            Descripción: <span class="text-black font-medium">Transferencia realizada desde banca en
                                línea para
                                pago de proveedores</span>
                        </p>
                        <p class="text-gray-600 text-[14px] m-0">
                            Notas del sistema: <span class="text-black font-medium">Operación procesada exitosamente sin
                                observaciones</span>
                        </p>
                        <p class="text-gray-600 text-[14px] m-0">
                            Autorización: <span class="text-black font-medium">AUT-{{ generarReferencia().slice(-6)
                                }}</span>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex flex-col sm:flex-row gap-3 justify-end pt-6">
                <XButton label="← Volver" variant="outlined" @click="volver" class="w-full sm:w-auto" />
            </div>


        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()

// Obtener parámetros de la query con valores por defecto
const banco = computed(() => route.query.banco as string || 'No especificado')
const fecha = computed(() => route.query.fecha as string || new Date().toLocaleString())
const importe = computed(() => route.query.importe as string || '0.00')
const moneda = computed(() => route.query.moneda as string || 'USD')

const itemsBreadParameters = [
    { label: 'Inicio', url: '/' },
    { label: 'Monitoreo', url: '/monitoreo' },
    { label: 'Reporte' }
]

// Funciones auxiliares
const getEstadoTexto = () => {
    const imp = parseFloat(importe.value || '0')
    return imp > 1000 ? 'Completado' : 'Pendiente'
}

const getTipoTransferencia = () => {
    const imp = parseFloat(importe.value || '0')
    return imp > 1000 ? 'Express' : 'Asíncrono'
}

const generarReferencia = () => {
    const timestamp = fecha.value ? new Date(fecha.value).getTime() : Date.now()
    return `TRF-${timestamp.toString().slice(-8)}`
}

// Funciones de acción
const volver = () => {
    navigateTo('/admin/reports/')
}

const exportarPDF = () => {
    alert('Funcionalidad de exportar PDF')
}

const imprimir = () => {
    window.print()
}
</script>

<style scoped>
/* Estilos para quitar el fondo celeste del header */
.header-sin-fondo {
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
}

/* Asegurar altura mínima y distribución del espacio */
.min-h-\[200px\] {
    min-height: 200px;
}

/* Estilos para impresión */
@media print {
    .no-print {
        display: none !important;
    }
}

/* Deep selectors para penetrar en componentes hijo */
:deep(.header-sin-fondo) {
    background: transparent !important;
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
}

:deep(.header-sin-fondo *) {
    background: transparent !important;
    background-color: transparent !important;
}
</style>