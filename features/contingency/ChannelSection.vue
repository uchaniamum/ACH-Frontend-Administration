<template>
  <div class="flex flex-col justify-center gap-8">
    <div v-if="hasInconsistentConfigurations" class="mb-4">
      <XSnackBar variant="warn">
        <h5 class="font-semibold">Configuraciones diferentes detectadas</h5>
        <p>Los participantes seleccionados tienen distintas configuraciones de gateway.</p>
      </XSnackBar>
    </div>
    
    <Divider align="left" type="solid"><b>Canal</b></Divider>
    
    <span class="text-normal font-normal text-gray-700">
      Selecciona el canal al que deseas cambiar las transacciones del participante.
    </span>

    <DataTable :value="transactionData" class="w-full">
      <Column header="Transacción" sortable class="min-w-80">
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <span>{{ data.transaction }}</span>
            <span v-tooltip="data.tooltip">
              <Icon name="x:info-empty" class="text-sky-500 w-[14.666px] h-[14.666px]"/>
            </span>
          </div>
        </template>
      </Column>
      
      <Column 
        v-for="gateway in paymentGatewayOptions" 
        :key="gateway.value" 
        :header="gateway.label"
        class="text-center min-w-24"
      >
        <template #body="{ data }">
          <div class="flex justify-center">
            <Checkbox 
              v-model="data.gateways[gateway.value]"
              :binary="true"
              @change="$emit('gateway-change', data, gateway.value, $event)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
defineProps({
  hasInconsistentConfigurations: Boolean,
  transactionData: Array,
  paymentGatewayOptions: Array
});

defineEmits(['gateway-change']);
</script>