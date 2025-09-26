<template>
  <div class="w-1/3 max-w-[450px] p-9 bg-white border border-gray-500 rounded-2xl">
    <!-- Contenedor fila para título + select -->
    <div class="flex justify-between mb-5">
      <h3 class="font-semibold text-xl text-[#2A303A]">
        Datos del Cliente
      </h3>
      <XSelect
        v-model="customerIdentifierCode"
        name="customerIdentifierCode"
        option-label="displayName"
        option-value="code"
        :options="props.optionsFilters?.customerIdentifiers ?? []"
      />
    </div>
    <XInputText
      v-model="customerIdentifier"
      name="customerIdentifier"
      :label="inputLabel"
      label-required
      placeholder="Ingresar número"
      :validation="(val: string) => (val ?? '').replace(/[^0-9-]/g, '').substring(0, 20)"
    />
  </div>
</template>

<script setup lang="ts">
  import type { Filters } from "~/types/admin/reports";

  const props = defineProps<{
    optionsFilters: Filters;
  }>();

  const customerIdentifierCode = defineModel<string>("customer-identifier-code");
  const customerIdentifier = defineModel<string>("customer-identifier");

  const inputLabel = computed(() => {
    switch (customerIdentifierCode.value) {
      case "ACCOUNT": return "Número de cuenta";
      case "CODE": return "Código de cliente";
      case "IDENTIFICATION_NUMBER": return "Número de documento";
      default: return "-";
    }
  })
</script>
