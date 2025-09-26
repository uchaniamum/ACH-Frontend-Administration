<template>
  <div
    class="w-1/3 max-w-[450px] bg-white border-gray-500 rounded-2xl"
    :class="[['SENT', 'RECEIVED'].includes(props.movementType) ? 'border p-9' : '']"
  >

    <div v-if="['SENT', 'RECEIVED'].includes(props.movementType)">
      <h3 class="font-semibold text-xl text-[#2A303A]">{{ props.movementType == "SENT" ? "Datos del destinatario" : "Datos del originante" }}</h3>

      <XInputText
        v-model="accountNumber"
        name="accountNumber"
        label="Numero de cuenta"
        placeholder="Ingresa numero"
        :validation="(val: string) => (val ?? '').replace(/[^0-9-]/g, '').substring(0, 20)"
      />

      <div class="flex justify-center mt-4">
        <h3
          class="text-primary font-normal text-[12px] m-0 cursor-pointer hover:underline flex items-center gap-1"
          @click="destinationShowMore = !destinationShowMore"
        >
          {{ destinationShowMore ? "Ocultar criterios de búsqueda" : "Más criterios de búsqueda" }}
          <Icon name="x:thik-nav-arrow-down" class="ml-3 transition-all" :class="[ destinationShowMore && 'rotate-180' ]" />
        </h3>
      </div>
      <!-- Sección desplegable centrada -->
      <transition name="fade">
        <div v-show="destinationShowMore" class="mt-4">
          <XSelect
            v-model="externalParticipantCode"
            name="externalParticipantCode"
            option-label="displayName"
            option-value="code"
            :options="[{ code: 'ALL', displayName: 'Todos' }, ...(props.optionsFilters?.externalParticipants ?? [])]"
          />
        </div>
      </transition>
    </div>
    
    <!-- Show empty space -->
    <div v-else />

  </div>
</template>

<script setup lang="ts">
  import type { Filters } from "~/types/admin/reports";

  const props = defineProps<{
    movementType: string;
    optionsFilters: Filters;
  }>();


  const accountNumber = defineModel<string>("account-number", { default: "" });
  const externalParticipantCode = defineModel<string>("external-participant-code");
  const destinationShowMore = defineModel<boolean>("destination-show-more", { default: false });
</script>

<style scoped>
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

