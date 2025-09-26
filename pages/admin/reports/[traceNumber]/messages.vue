<template>
  <div>
    <XHeader
      title="Ver Mensajes de orden"
      :breadcrumb-items="[
        { label: 'Inicio', url: '/' },
        { label: 'Monitoreo', url: '/transferencias' },
        { label: 'Reporte', url: '/admin/reports' },
        { label: `Mensajes de transferencia [${traceNumber}]` },
      ]"
      :show-breadcrumb="true"
      @back-click="goBack"
    />
    
    <p class="flex justify-between gap-4 mt-9 mb-10">
      Realice el seguimiento a los mensajes de petición y respuesta, verificando sus estados,
      archivos XML, así como la fecha y hora correspondientes.
    </p>
    


    <XTable size="small" class="report-table overflow-x-auto whitespace-nowrap block">
      <thead>
        <tr>
          <th>Tipo Mensaje</th>
          <th>Número de intentos</th>
          <th>Inicio envío</th>
          <th>Fin envío</th>
          <th>
            <AdminReportsFilterMainReportTableFilter
              v-model="transactionStatusDescriptionFilter"
              label="Etapa"
              :options="messagesList"
              option-key="transactionStatusDescription"
            />
          </th>
          <th>Código de respuesta</th>
          <th>Detalles</th>
        </tr>
      </thead>
      <tbody v-if="filteredMessagesList.length == 0">
        <tr>
          <td colspan="7" class="text-center">- No se encontraron mensajes -</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr
          v-for="(message, index) in filteredMessagesList"
          :key="index"
        >
          <td>{{ message.messageCode }}</td>
          <td>{{ message.attemptNumber }}</td>
          <td>{{ message.createdFormattedDateTime }}</td>
          <td>{{ message.updatedFormattedDateTime }}</td>
          <td>
            <AdminReportsStatusBadge :code="message.transactionStatusCode" :description="message.transactionStatusDescription" />
          </td>
          <td>{{ message.returnCode }}</td>
          <td class="flex items-center">
            <XButton class="ml-3 font-medium px-6" @click="() => showFile(traceNumber, message)">Detalle Archivo</XButton>
          </td>
        </tr>
      </tbody>
    </XTable>

    <div class="mb-30" />

    <!-- XML Modal -->
    <XDialog v-model:visible="showFileModal" :show-header="false" modal :closable="false" class="w-full max-w-[800px]">
      <section class="text-gray-800">
        <h2 class="mt-10 text-2xl font-semibold mb-10">{{ fileTitle }} del mensaje</h2>

        <div class="flex flex-wrap mx-10">
          <div class="w-1/2">
            <h3 class="text-lg font-semibold mb-5">Orden:</h3>

            <div>
              <span class="font-medium">Nro. de orden originante: </span>
              <span>{{ transfersResponse.originator.traceNumber }}</span>
            </div>
            <div>
              <span class="font-medium">Nro. de orden destinatario: </span>
              <span>{{ transfersResponse.receiver.traceNumber }}</span>
            </div>
          </div>
          <div class="w-1/2">
            <h3 class="text-lg font-semibold mb-5">Mensaje:</h3>

            <div>
              <span class="font-medium">Tipo mensaje: </span>
              <span>{{ currentMessageCode }}</span>
            </div>
            <div>
              <span class="font-medium">Fecha procesamiento: </span>
              <span>{{ currentUpdatedFormattedDateTime }}</span>
            </div>
          </div>
          <div class="w-full">
            <div>
              <span class="font-medium">Nro. de orden ACH: </span>
              <span>{{ transfersResponse.financialTransaction.transferId }}</span>
            </div>
            <div>
              <span class="font-medium">Monto: </span>
              <span>{{ transfersResponse.amount }} {{ transfersResponse.currencyDisplayName }}</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-10">
          <XButton variant="text" @click="downloadFile">
            <div class="font-medium flex items-center px-3">
              <Icon name="x:download" />
              <span class="ml-3">Descargar {{ fileTitle }}</span>
            </div>
          </XButton>
          <XButton variant="text" @click="copyFileContent">
            <div class="font-medium flex items-center px-3">
              <Icon name="x:paste-clipboard" />
              <span class="ml-3">Copiar contenido</span>
            </div>
          </XButton>
        </div>

        <pre
          class="rounded-lg max-h-[400px]"
          :class="{
            'language-json': ['application/json'].includes(fileMimeType),
            'language-xml': ['application/xml', 'text/xml', 'application/atom+xml'].includes(fileMimeType)
          }"
        ><code ref="xmlCode">{{ formatFileContent(fileContent) }}</code></pre>

        <div class="mt-10 border-t pt-10 flex justify-end">
          <XButton class="font-medium flex items-center px-20" @click="showFileModal = false">Cerrar</XButton>
        </div>

      </section>
    </XDialog>

    <Toast />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from "vue";

  import type { Messages, IndividualTransactionResponse } from "~/types/admin/reports";
  import { reportsService } from "~/services/reportsService";

  import { useLoading } from "~/componsables/useLoading";
  
  import Prism from "prismjs";
  import "prismjs/components/prism-markup";
  import "prismjs/components/prism-json";
  import "prismjs/themes/prism-tomorrow.css";

  import downloadjs from "downloadjs";

  definePageMeta({ middleware: "loading" }); // Show initial loading

  const route = useRoute();

  const traceNumber = ref("");

  const transactionStatusDescriptionFilter = ref<string[]>([]);

  const messagesList = ref<Messages[]>([]);
  const transfersResponse = ref<IndividualTransactionResponse>({});

  const clipboard = useClipboard();
  const toast = useToast();

  const loading = useLoading();

  
  onMounted(async () => {
    traceNumber.value = route.params.traceNumber;

    const messagesResponse = await reportsService.getIndividualTransactionMessages(traceNumber.value);
    transfersResponse.value = await reportsService.getIndividualTransaction(traceNumber.value);

    messagesList.value = messagesResponse.messages;
  });


  function goBack() {
    useRouter().push("/admin/reports");
  }


  // Filter
  const filteredMessagesList = computed<Messages[]>(() => {
    let filteredMessagesResponse = messagesList.value;

    if (transactionStatusDescriptionFilter.value.length > 0)
      filteredMessagesResponse = filteredMessagesResponse.filter(m => transactionStatusDescriptionFilter.value.includes(m.transactionStatusDescription));

    return filteredMessagesResponse;
  });


  // Show XML
  const showFileModal = ref(false);
  const fileContent = ref("");
  const fileMimeType = ref("");
  const xmlCode = ref(null);
  const fileTitle = ref("");

  const currentMessageCode = ref("");
  const currentAttemptNumber = ref<number>();
  const currentUpdatedFormattedDateTime = ref("");

  async function showFile(traceNumber: string, messageObject: Messages) {
    const fileResponse = await reportsService.getIndividualTransactionMessagesXML(traceNumber, messageObject.messageCode, messageObject.attemptNumber);

    currentMessageCode.value = messageObject.messageCode;
    currentAttemptNumber.value = messageObject.attemptNumber;
    currentUpdatedFormattedDateTime.value = messageObject.updatedFormattedDateTime;

    showFileModal.value = true;

    fileContent.value = fileResponse.content;
    fileMimeType.value = fileResponse.mimeType;

    
    fileTitle.value = "Contenido";
    if (["application/xml", "text/xml", "application/atom+xml"].includes(fileMimeType.value)) fileTitle.value = "XML";
    if (["application/json"].includes(fileMimeType.value)) fileTitle.value = "JSON";


    nextTick(() => { Prism.highlightElement(xmlCode.value) });
  }


  function formatFileContent(content: string) {
    if (["application/xml", "text/xml", "application/atom+xml"].includes(fileMimeType.value)) return formatXml(content);
    if (["application/json"].includes(fileMimeType.value)) return formatJson(content);

    return content;
  }


  function formatXml(xml: string): string {
    const PADDING = "  ";
    const reg = /(>)(<)(\/*)/g;
    let xmlFormatted = "";
    let pad = 0;

    xml = xml.replace(reg, "$1\r\n$2$3");
    xml.split("\r\n").forEach((node: string) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) pad -= 1;
      } else if (node.match(/^<\w[^>]*[^/]>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }

      xmlFormatted += PADDING.repeat(pad) + node + "\r\n";
      pad += indent;
    });

    return xmlFormatted;
  }


  function formatJson(jsonString: string) {
    try {
      // Parsear a objeto y volver a convertir con indentación
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      console.error('JSON inválido:', e);
      return jsonString; // Si falla, retorna el original
    }
  }


  // Actions
  function copyFileContent() {
    let detailMessage = "¡Archivo copiado!";

    if (["application/xml", "text/xml", "application/atom+xml"].includes(fileMimeType.value)) detailMessage = "¡XML copiado!";
    if (["application/json"].includes(fileMimeType.value)) detailMessage = "¡XML copiado!";

    clipboard.copy(fileContent.value);
    toast.add({ severity: "info", detail: detailMessage, life: 3000 });
  }

  function downloadFile() {
    let fileType = ".txt";

    if (["application/xml", "text/xml", "application/atom+xml"].includes(fileMimeType.value)) fileType = ".xml";
    if (["application/json"].includes(fileMimeType.value)) fileType = ".json";

    downloadjs(fileContent.value, `${traceNumber.value}-${currentMessageCode.value}-${currentAttemptNumber.value}.${fileType}`, fileMimeType.value);
  }
</script>

<style lang="postcss" scoped>

  .report-table {
    --spacing-table-row: calc(8 * (2 / 14) * 1rem);

    thead>tr>th,
    tbody>tr>td {
      @apply !px-10;
    }

    thead>tr>th { @apply !py-7; }
    thead>tr>td { @apply !py-5; }
  }
</style>

