<template>
  <div class="flex flex-col justify-center gap-8">
    <XSnackBar v-if="hasInconsistencies" variant="warn">
      <h5 class="font-semibold">Configuración de participantes</h5>
      <p>Los participantes cuentan con distintas configuraciones.</p>
    </XSnackBar>

    <Divider align="left" type="solid"><b>Transacciones</b></Divider>
    
    <span class="text-normal font-normal text-gray-700">
      Ajusta la configuración de las transacciones involucradas.                            
    </span>

    <TransactionCard
      v-for="(config, code) in transactionConfig"
      :key="code"
      :transaction-code="code"
      :config="config"
      :contingency-state="contingencyStates[config.switchRef]"
      @update:contingency-state="contingencyStates[config.switchRef] = $event"
    />

    <Divider align="left" type="solid"><b>Mensaje de respuesta</b></Divider>
    
    <span class="text-normal font-normal text-gray-700">
      Comunica a los externos sobre el cambio de canal.                                
    </span>
    
    <XInputText 
      :model-value="titleContingency"
      name="tituloContingencia"
      label="Titulo" 
      label-required
      placeholder="Ingresa el título del mensaje"
      @update:model-value="$emit('update:title', $event)"
    />
    
    <XTextarea 
      :model-value="messageContingency"
      name="clarifications" 
      rows="5" 
      class="w-full" 
      placeholder="Ingresa el contenido del mensaje" 
      label-required 
      label="Mensaje"
      @update:model-value="$emit('update:message', $event)"
    />

    <Divider align="left" type="solid"><b>Aclaraciones</b></Divider>
    
    <span class="text-normal font-normal text-gray-700">
      Detalla el motivo del cambio y adjunta el respaldo correspondiente.
    </span>
    
    <XTextarea 
      :model-value="justification"
      name="clarifications" 
      rows="5" 
      class="w-full" 
      placeholder="Describe el motivo de la contingencia" 
      label-required 
      label="Justificación"
      @update:model-value="$emit('update:justification', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { TRANSACTION_CONFIG } from './type';


defineProps({
  hasInconsistencies: Boolean,
  contingencyStates: Object,
  titleContingency: String,
  messageContingency: String,
  justification: String
});

defineEmits(['update:title', 'update:message', 'update:justification']);

const transactionConfig = TRANSACTION_CONFIG;
</script>