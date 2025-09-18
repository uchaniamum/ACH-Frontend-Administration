<template>
  <!-- Contenedor superior con degradado -->
  <div
    class="w-full p-6 rounded-t-lg border border-gray-200 mb-0"
    style="background: linear-gradient(to left, #E7EEFE, #9EBBFC) top no-repeat, white;"
  >
    <div class="flex flex-col sm:flex-row justify-between items-center gap-2 px-4 py-2 w-full">
      <h2 class="text-[20px] font-bold text-[#073395]">
        Panel Ejecutivo Transferencias Interbancarias
      </h2>
      <select
        class="px-3 h-16 border border-gray-300 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[280px]"
      >
        <option value="" selected>Al 30 de septiembre, del 2025</option>
        <option value="septiembre">Septiembre 2025</option>
        <option value="agosto">Agosto 2025</option>
        <option value="julio">Julio 2025</option>
      </select>
    </div>
  </div>

  <!-- Contenedor inferior pegado -->
  <div class="w-full p-6 border border-gray-200 rounded-b-lg mt-0 mb-12 bg-white">
    <p class="text-gray-600">
      Analiza las transferencias interbancarias mediante gráficos que facilitan la visualización del comportamiento y el volumen de las operaciones.
    </p>
  </div>

  <!-- Contenedor flexible -->
  <div class="flex flex-wrap gap-8 justify-center">
    <!-- Bloque 1 -->
    <div class="flex flex-col flex-[2] min-w-[300px]">
      <div class="px-6 py-3 border border-gray-200 bg-[#6D99FB] rounded-t-2xl mb-4">
        <h2 class="text-[18px] text-white font-bold text-center">
          Total Movimientos de Transacciones
        </h2>
      </div>

      <div class="flex gap-4 flex-col sm:flex-row">
        <!-- Recibidos -->
        <div class="flex-1 p-4 bg-white border border-gray-200 flex flex-col rounded-none sm:rounded-bl-2xl">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-black font-bold text-[14px] m-0">Recibidos</h3>
            <Icon name="x:arrow-br-circle" class="text-[#92ACE5] w-10 h-10" />
          </div>
          <div class="px-8 py-4 bg-[#6D99FB] text-white rounded-xl font-bold text-center text-lg mb-4">
            $us 500,00
          </div>
          <div class="p-4 bg-white border border-gray-200 rounded-2xl h-48 flex flex-col justify-between">
            <div class="flex justify-between items-center">
              <span class="text-[#0C55F8]">QR</span>
              <span class="text-[#0C55F8]">$us.150</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[#0C55F8]">Expres</span>
              <span class="text-[#0C55F8]">$us.75</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[#0C55F8]">Asíncrono</span>
              <span class="text-[#0C55F8]">$us.30</span>
            </div>
          </div>
        </div>

        <!-- Enviados -->
        <div class="flex-1 p-4 bg-white border border-gray-200 flex flex-col rounded-none sm:rounded-br-2xl">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-black font-bold text-[14px] m-0">Enviados</h3>
            <Icon name="x:arrow-tr-circle" class="text-[#92ACE5] w-10 h-10" />
          </div>
          <div class="px-8 py-4 bg-[#6D99FB] text-white rounded-xl font-bold text-center text-lg mb-4">
            $us 50,000.00
          </div>
          <div class="p-4 bg-white border border-gray-200 rounded-2xl h-48 flex flex-col justify-between">
            <div class="flex justify-between items-center">
              <span class="text-[#0C55F8]">QR</span>
              <span class="text-[#0C55F8]">$us.300,000</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[#0C55F8]">Expres</span>
              <span class="text-[#0C55F8]">$us.100,000</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[#0C55F8]">Asíncrono</span>
              <span class="text-[#0C55F8]">$us.100,000</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bloque 2 -->
    <div class="flex flex-col flex-[2] min-w-[300px]">
      <div class="px-6 py-3 border border-gray-200 bg-[#92ACE5] rounded-t-2xl mb-4">
        <h2 class="text-[18px] text-white font-bold text-center">
          Total Cantidad de Transacciones
        </h2>
      </div>

      <div class="flex gap-4 flex-col sm:flex-row">
        <!-- Recibidos -->
        <div class="flex-1 p-4 bg-white border border-gray-200 flex flex-col rounded-none sm:rounded-bl-2xl">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-black font-bold text-[14px] m-0">Recibidos</h3>
            <Icon name="x:arrow-br-circle" class="text-[#92ACE5] w-10 h-10" />
          </div>
          <div class="px-8 py-4 bg-[#92ACE5] text-white rounded-xl font-bold text-center text-lg mb-4">
            $us 200,00
          </div>
          <div class="p-4 bg-white border border-gray-200 rounded-2xl h-48 flex flex-col justify-between">
            <div class="flex justify-between items-center">
              <span class="text-[#0C55F8]">QR</span>
              <span class="text-[#0C55F8]">$us.80</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[#0C55F8]">Expres</span>
              <span class="text-[#0C55F8]">$us.50</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[#0C55F8]">Asíncrono</span>
              <span class="text-[#0C55F8]">$us.70</span>
            </div>
          </div>
        </div>

        <!-- Enviados -->
        <div class="flex-1 p-4 bg-white border border-gray-200 flex flex-col rounded-none sm:rounded-br-2xl">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-black font-bold text-[14px] m-0">Enviados</h3>
            <Icon name="x:arrow-tr-circle" class="text-[#92ACE5] w-10 h-10" />
          </div>
          <div class="px-8 py-4 bg-[#92ACE5] text-white rounded-xl font-bold text-center text-lg mb-4">
            $us 1500,00
          </div>
          <div class="p-4 bg-white border border-gray-200 rounded-2xl h-48 flex flex-col justify-between">
            <div class="flex justify-between items-center">
              <span class="text-[#0C55F8]">QR</span>
              <span class="text-[#0C55F8]">$us.600</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[#0C55F8]">Expres</span>
              <span class="text-[#0C55F8]">$us.400</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-[#0C55F8]">Asíncrono</span>
              <span class="text-[#0C55F8]">$us.500</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bloque 3 -->
    <div class="flex flex-col flex-[1] min-w-[240px]">
      <div class="px-6 py-3 border border-gray-200 bg-[#052263] rounded-t-2xl mb-4">
        <h2 class="text-[18px] text-white font-bold text-center">
          Eficiencia
        </h2>
      </div>
      <div class="flex gap-4 flex-col sm:flex-row">
        <div class="flex-1 p-4 bg-white border border-gray-200 flex flex-col rounded-none sm:rounded-b-2xl">
          <div class="px-8 py-4 bg-[#F5A623] text-white rounded-xl font-bold text-center text-lg mb-4">
            <!-- valor -->
          </div>
          <div class="p-2 bg-white border border-gray-200 rounded-2xl flex flex-col justify-center gap-2 min-h-[80px]">
            <div class="flex justify-between items-center w-full">
              <div class="flex items-center gap-1">
                <Icon name="x:arrow-tr-circle" />
                <span class="text-[#0C55F8]">Enviados</span>
              </div>
              <span class="text-[#0C55F8]">80%</span>
            </div>
            <div class="flex justify-between items-center w-full">
              <div class="flex items-center gap-1">
                <Icon name="x:arrow-br-circle" />
                <span class="text-[#0C55F8]">Recibidos</span>
              </div>
              <span class="text-[#0C55F8]">50%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>
