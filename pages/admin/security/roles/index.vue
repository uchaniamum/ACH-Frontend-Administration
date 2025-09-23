<template>
    <div class="flex flex-col gap-16">
        <XHeader title="Accesos y roles" :breadcrumb-items="itemsBreadRolesAccess" :show-breadcrumb="true">
            <template #description>
                <p class="text-gray-800">Consulta los accesos configurados para cada rol del sistema y verifica la relación entre perfiles y permisos asignados.</p>
            </template>
        </XHeader>
        <div class="flex flex-row items-center">
            <div class="bg-gray-50 pl-12 pr-8 rounded-[1.143rem]">
                <table>
		        	<tr>
		        		<td rowspan="2" class="border-b py-12 pl-16 pr-28 text-[1.143rem]  font-semibold">Seguridad</td>
		        		<td class="border-b py-6 px-8 text-gray-700">Usuarios</td>
		        	</tr>
		        	<tr class=" py-6">
		        		<td class="border-b py-6 pl-8 text-gray-700">Accesos y roles</td>
		        	</tr>
                    <tr>
		        		<td rowspan="7" class="border-b py-12 pl-16 pr-28 text-[1.143rem]  font-semibold">Configuración</td>
		        		<td class="border-b py-6 pl-8 text-gray-700">Adm. de canales</td>
		        	</tr>
		        	<tr class=" py-6">
		        		<td class="border-b py-6 pl-8 text-gray-700">Participantes</td>
		        	</tr>
                    <tr class=" py-6">
		        		<td class="border-b py-6 pl-8 text-gray-700">Horarios</td>
		        	</tr>
                    <tr class=" py-6">
		        		<td class="border-b py-6 pl-8 text-gray-700">Contingencia</td>
		        	</tr>
                    <tr class=" py-6">
		        		<td class="border-b py-6 pl-8 text-gray-700">Config. de alertas</td>
		        	</tr>
                    <tr class=" py-6">
		        		<td class="border-b py-6 pl-8 text-gray-700">Parámetros</td>
		        	</tr>
                    <tr class=" py-6">
		        		<td class="border-b py-6 pl-8 text-gray-700">Procesos</td>
		        	</tr>
                    <tr>
		        		<td class="border-b py-6 pl-16 pr-28 text-[1.143rem]  font-semibold">Auditoría</td>
		        		<td class="border-b py-6 pl-8 text-gray-700">Bitácora</td>
		        	</tr>
                    <tr>
		        		<td rowspan="2" class="border-b py-12 pl-16 pr-28 text-[1.143rem]  font-semibold">Transacciones</td>
		        		<td class="border-b py-6 px-8 text-gray-700">Reg. Transacciones</td>
		        	</tr>
		        	<tr class=" py-6">
		        		<td class="border-b py-6 pl-8 text-gray-700">Aut. Transacciones</td>
		        	</tr>
                    <tr>
		        		<td rowspan="7" class="border-b py-12 pl-16 pr-28 text-[1.143rem]  font-semibold">Configuración</td>
		        		<td class="border-b py-6 pl-8 text-gray-700">Adm. de canales</td>
		        	</tr>
		        	<tr class=" py-6">
		        		<td class="border-b py-6 pl-8 text-gray-700">Participantes</td>
		        	</tr>
                    <tr class=" py-6">
		        		<td class="border-b py-6 pl-8 text-gray-700">Horarios</td>
		        	</tr>
                    <tr class=" py-6">
		        		<td class="border-b py-6 pl-8 text-gray-700">Contingencia</td>
		        	</tr>
		        </table>
            </div>
            <div>
                hoal2
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getBreadcrumbItems } from '~/navigation/breadcrumbConfig';

// State
const itemsBreadRolesAccess = getBreadcrumbItems('roles', 'list');
</script>