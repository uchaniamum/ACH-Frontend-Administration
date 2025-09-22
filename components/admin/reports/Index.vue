<template>
    <div>
        <XHeader title="Consulta de transferencias interbancarias" :breadcrumb-items="itemsBreadParameters"
            :show-breadcrumb="true">
            <template #description>
                <p>Consulta las transferencias interbancarias aplicando filtros en función a los criterios de búsqueda
                    disponibles.</p>
            </template>
        </XHeader>
        <div class="pt-12 flex flex-col gap-20">
            <div class="flex justify-between gap-4">
                <p>Selecciona un tipo de movimiento y llena los campos necesarios para realizar la búsqueda.</p>
            </div>
            <div class="flex justify-start p-3">
                <div class="flex gap-3 rounded-lg bg-[#F0F5FF] p-3">
                    <button @click="accion1"
                        class="px-2 py-2 min-w-[100px] rounded-md text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white">
                        <Icon name="x:arrow-tr-circle" class="text-[#5F6A7B] w-7 h-7" />
                        Enviados
                    </button>
                    <button @click="accion2"
                        class="px-3 py-2 min-w-[100px] rounded-md text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white">
                        <Icon name="x:arrow-br-circle" class="text-[#5F6A7B] w-7 h-7" />
                        Recibidos
                    </button>
                    <button @click="accion3"
                        class="px-3 py-2 min-w-[100px] rounded-md text-[#5F6A7B] text-sm cursor-pointer transition-colors hover:bg-[#6F8CCE] hover:text-white">
                        <Icon name="x:transfer" class="text-[#5F6A7B] w-7 h-7" />
                        Ambos
                    </button>
                </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-4 w-full">
                <div
                    class="w-full sm:w-1/3 p-4 bg-white border border-gray-200 rounded-2xl h-65 flex flex-col justify-between">
                    <!-- Contenedor fila para título + select -->
                    <div class="flex items-center justify-between gap-2">
                        <h3 class="text-black font-bold text-[16px] m-0">Datos del Cliente</h3>
                        <XSelect name="cuenta" optionLabel="label" optionValue="value" placeholder="Cuenta"
                            :dropdown="true" appendTo="body" class="w-100" />
                    </div>
                    <XInputText name="codigo" label="Numero de cuenta" label-required placeholder="Ingresa numero" />
                </div>
                <!-- Tarjeta 2 -->
                <div class="w-full sm:w-1/3 p-4 bg-white border border-gray-200 rounded-2xl h-auto flex flex-col">
                    <h3 class="text-black font-bold text-[16px] m-0">
                        Detalles de la transferencia
                    </h3>

                    <XDatePicker v-model="date" label="Fecha" name="fechaTransferencia" label-required
                        :rules="[(v: any) => !!v || 'El campo es requerido']" :pt="{
                            calendarContainer: { class: 'bg-white' },
                            panel: { class: 'bg-[#f1f1f1]' },
                        }">
                        <!-- Icono en el campo -->
                        <template #icon>
                            <Icon name="x:calendar-1" class="text-[#92ACE5] w-11 h-11" />
                        </template>
                    </XDatePicker>

                    <!-- Trigger -->
                    <h3 class="text-blue font-normal text-[12px] m-0 cursor-pointer hover:underline flex items-center gap-1 mt-2"
                        @click="showFilters = !showFilters">
                        {{ showFilters ? 'Ocultar criterios de búsqueda' : 'Más criterios de búsqueda' }}
                        <Icon :name="showFilters ? 'x:nav-arrow-down' : 'x:nav-arrow-up'" />
                    </h3>

                    <!-- Sección desplegable -->
                    <transition name="fade">
                        <div v-show="showFilters" class="mt-3">
                            <!-- Subtítulo -->
                            <h3 class="text-blue font-normal text-[12px] m-0 mb-2">
                                Tipo de Transferencia
                            </h3>

                            <!-- Botones -->
                            <div class="flex flex-wrap gap-2">
                                <XButton label="QR" class="!w-[50px]" />
                                <XButton label="Express" class="!w-[60px]" />
                                <XButton label="Asíncrono" class="!w-[75px]" />
                                <XButton label="Todos" class="!w-[50px]" />
                            </div>
                            <h3 class="text-blue font-normal text-[12px] m-0 mb-2">
                                Moneda
                            </h3>

                            <!-- Botones -->
                            <div class="flex flex-wrap gap-2">
                                <XButton label="Gs" class="!w-[50px]" />
                                <XButton label="BRL" class="!w-[50px]" />
                                <XButton label="$US" class="!w-[50px]" />
                                <XButton label="EUR" class="!w-[50px]" />
                                <XButton label="Todos" class="!w-[50px]" />
                            </div>
                        </div>
                    </transition>
                </div>
                <div
                    class="w-full sm:w-1/3 p-4 bg-white border border-gray-200 rounded-2xl h-65 flex flex-col justify-between">
                    <h3 class="text-black font-bold text-[16px] m-0">Datos del Destinatario</h3>
                    <XInputText name="codigo" label="Numero de cuenta" placeholder="Ingresa numero" />
                </div>
            </div>
            <XSnackBar icon="x:info-empty" bg-circle="bg-[#A6C4F6]" closable class="border-[#A6C4F6] mb-4"
                class-icon="text-[#3698DB] w-[22px] h-[22px]">
                <p class="text-[#5F6A7B]">
                    Recuerda que al seleccionar la opción
                    <span class="font-bold">“Más criterios de búsqueda”</span>,
                    se habilitarán campos adicionales que te permitirán realizar la consulta de manera más específica.
                </p>
            </XSnackBar>
            <div class="self-end flex gap-8">
                <XButton label="Limpiar" :disabled="selectedBanks.length === 0" variant="outlined" class="!w-[150px]"
                    @click="handleChannelChange('channel')">
                    <template #icon>
                        <Icon name="x:clean" class="w-5 h-5" />
                    </template>
                </XButton>

                <XButton label="Buscar" :disabled="selectedBanks.length === 0" class="!w-[200px]"
                    @click="handleChannelChange('contingency')">
                    <template #icon>
                        <Icon name="x:search" class="w-5 h-5" />
                    </template>
                </XButton>
            </div>



            <!--    <DataTable 
                    :value="paginatedChannels" 
                    :loading="loading"
                    dataKey="id"
                    filterDisplay="row"
                    :rows="paginationChannelRows"
                    :first="paginationChannelFirst"
                    @page="onPageChange"
                    v-model:filters="filters"
                    :globalFilterFields="['code', 'name', 'acronym', 'aliases']"
                >
                <Column field="code" header="Codigo" sortable :showFilterMenu="false" class="min-w-[143px]">
                    <template #body="{ data }">
                        {{ data.code }}
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <IconField>
                            <InputText 
                                v-model="filterModel.value"  
                                type="text" 
                                @input="filterCallback()" 
                                class="!w-47" 
                                placeholder="Buscar"
                            />
                            <XInputIcon icon="search" />
                        </IconField>
                    </template>
                </Column>
                <Column field="name" header="Nombre" :showFilterMenu="false" class="min-w-[328px]">
                    <template #body="{ data }">
                        {{ data.name }}
                    </template>
                    <template #filter="{ filterModel, filterCallback }" >
                        <XSelect 
                            name="filterRole"
                            v-model="filterModel.value" 
                            @change="filterCallback()" 
                            :options="nameOptions" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Buscar" 
                            class="w-[300px]" 
                            :showClear="true"
                        />
                    </template>
                </Column>
                <Column field="acronym" header="Sigla" :showFilterMenu="false" class="w-[145px]">
                    <template #body="{ data }">
                        {{ data.acronym }}
                    </template>
                    <template #filter="{ filterModel, filterCallback }" >
                        <XSelect 
                            name="filterRole"
                            v-model="filterModel.value" 
                            @change="filterCallback()" 
                            :options="acronymOptions" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Buscar" 
                            class="!min-w-48" 
                            :showClear="true"
                        />
                    </template>
                </Column>
                <Column field="aliases" header="Alias CPD" :showFilterMenu="false" style="width:145px">
                    <template #body="{ data }">
                        <div v-for="(route, index) in data.routes" :key="index">
                            {{ route.alias }}
                        </div>
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <XSelect 
                            name="filterAlias"
                            v-model="filterModel.value" 
                            @change="filterCallback()" 
                            :options="aliasOptions" 
                            optionLabel="label" 
                            optionValue="value"
                            placeholder="Buscar" 
                            class="!min-w-47" 
                            :showClear="true"
                        />
                    </template>
                </Column>
                <Column field="updatedAt" header="Última modificación" :showFilterMenu="false" class="!min-w-[189px]">
                    <template #body="{ data }">
                        {{ formatDate(data.updatedAt) }}
                    </template>
                    <template #filter="{ filterModel, filterCallback }">
                        <IconField>
                            <InputText 
                                v-model="filterModel.value" 
                                type="text" 
                                @input="filterCallback()" 
                                class="!w-70" 
                                placeholder="Buscar"
                            />
                            <XInputIcon icon="search" />
                        </IconField>
                    </template>
                </Column>
                <Column field="accion" header="Acción" class="!w-[122px]">
                    <template #body="{ data }">
                        <div class="flex gap-4">
                            <XButton variant="outlined" icon="edit-pencil" @click="navigateToEditChannel(data)" />
                            <XButton variant="outlined" icon="user" @click="navigateToHistory(data)" />
                            <XButton variant="outlined" icon="privacy-policy" @click="navigateToCertificates(data)" />
                        </div> 
                    </template>
                </Column>
            </DataTable>-->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const selectedBanks = ref<string[]>([]);
const showFilters = ref(false);
const accion1 = () => alert("Botón Enviados presionado");
const accion2 = () => alert("Botón Recibidos presionado");
const accion3 = () => alert("Botón Ambos presionado");

const handleChannelChange = (type: 'channel' | 'contingency') => {
}
</script>

<style>
/* Animación simple para desplegar */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>