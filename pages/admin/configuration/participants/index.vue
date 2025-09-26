<template>
    <div>
        <XHeader @click="router.push('admin/configuration/participants/')" title="Gestión de Participantes" :breadcrumb-items="itemsBreadParticipants" :show-breadcrumb="true">
            <template #description>
                <p>Registra participantes propios y destinatarios, actualiza sus datos y carga los certificados públicos y privados requeridos.</p>
            </template>
        </XHeader>
        <div class="pt-12 flex flex-col gap-12">
            <h5 class="text-lg text-gray-700">Selecciona el tipo de persona que realizará la solicitud.</h5>
            <h3 class="text-[1.429rem] font-semibold">Mi Perfil</h3>
            <div v-if="participants.ownParticipants?.length < 1" class="flex justify-end">
                <XButton 
                    @click="navigateToNewParticipantOwn('create')"
                    label="Nuevo Participante" 
                    icon="think-plus" 
                    size="large" />
            </div>
            <ParticipantsFields
                :participants="{
                    ownParticipants: participants.ownParticipants || [],
                    externalParticipants: []
                }"
                mode="ownParticipants"
                :loading="loading"
                @participantSelected="participantCodeMain =  $event"
            />
            <Divider/>
            <h3 class="text-[1.429rem] font-semibold">Participantes destinatarios</h3>
            <div class="flex flex-row justify-between">
                <div class="self-center">
                    <XIconField>
                        <InputText 
                            v-model="searchTermExternal"
                            placeholder="Buscar" 
                            class="!w-[250px]"
                            @update:modelValue="onSearchExternal"
                        />
                        <XInputIcon icon="search"/>
                    </XIconField>
                </div>
                <div class="self-center">
                    <XButton 
                        @click="navigateToNewParticipantExternal(null)"
                        label="Nuevo Participante" 
                        icon="think-plus" 
                        size="large" />
                </div>
            </div>
            <ParticipantsFields
                :participants="{
                    ownParticipants: [],
                    externalParticipants: paginatedExternalParticipants
                }"
                mode="externalParticipants"
                :loading="loading"
                @participantSelected="participantCode =  $event"
            />
            
            <Paginator 
                v-if="filteredExternalParticipants.length > 0"
                v-model:first="paginationFirstExternal"
                v-model:rows="paginationRowsExternal"
                :totalRecords="filteredExternalParticipants.length"
                :rowsPerPageOptions="[2, 10, 25, 50, 100]"
                @page="onPageChange"
                class="mt-4"
            />
        </div> 
    </div>
</template>

<script setup lang="ts">

import { ref, computed } from 'vue';
import ParticipantsFields from '~/components/fields/ParticipantsFields.vue';
import { useFormRegisterParticipant } from '~/componsables/useFormRegisterParticipant';
import type { ParticipantsList } from '~/features/participants/types';
import type { ServiceError } from '~/features/users/types';
import { participantsService } from '~/services/participantsService';

definePageMeta({
    middleware: 'menu'
})

const router = useRouter();

const participantCode = ref()
const participantCodeMain = ref()

watch(participantCodeMain, (newCode) => {
    if (newCode) {
        console.log(newCode)
        // router.push(`/admin/configuration/participants/edith/${newCode}`);
        router.push(`/admin/configuration/participants/${newCode}-own-participant`);
    }
});

watch(participantCode, (newCode) => {
    if (newCode) {
        console.log(newCode)
        // router.push(`/admin/configuration/participants/edith/${newCode}`);
        router.push(`/admin/configuration/participants/${newCode}-external-participant`);
    }
});

const participants = ref<ParticipantsList>({
    ownParticipants: [],
    externalParticipants: []
});

const loading = ref(false)
const searchTermExternal = ref('') 
const paginationFirstExternal = ref(0);
const paginationRowsExternal = ref(10);

const itemsBreadParticipants = ref([
    { label: 'Inicio' },
    { label: 'Configuración' },
    { label: 'Participantes' },
]);

// Computed: Participantes externos filtrados por búsqueda
const filteredExternalParticipants = computed(() => {
    if (!searchTermExternal.value) {
        console.log(participants.value.externalParticipants)
        return participants.value.externalParticipants || [];
    }
    
    const searchTerm = searchTermExternal.value.toLowerCase();
    return (participants.value.externalParticipants || []).filter(participant =>
        participant.name?.toLowerCase().includes(searchTerm) ||
        participant.acronym?.toLowerCase().includes(searchTerm) ||
        participant.code?.toLowerCase().includes(searchTerm)
    );
});

// Computed: Participantes externos paginados
const paginatedExternalParticipants = computed(() => {
    const start = paginationFirstExternal.value;
    const end = start + paginationRowsExternal.value;
    return filteredExternalParticipants.value.slice(start, end) ?? [];
});

const onSearchExternal = () => {
    // Reiniciar paginación al buscar
    paginationFirstExternal.value = 0;
};

const onPageChange = (event: any) => {
    paginationFirstExternal.value = event.first;
    paginationRowsExternal.value = event.rows;
};

const loadParticipantsExternal = async (): Promise<void> => {
    loading.value = true
    try {
        let response = await participantsService.getParticipantsExternal({
            search: ''
        });
        const responseOwn = await loadParticipantsOwn();
        response = { ...response, ownParticipants: responseOwn}
        participants.value = response
    } catch (error) {
        console.error('Error loading participants:', error)
        const serviceError = error as ServiceError

        console.error('Error:', serviceError.message || 'Error al cargar los participantes');
        
    } finally {
        loading.value = false
    }
}

const loadParticipantsOwn = async (): Promise<void> => {
    loading.value = true
    try {
        const response = await participantsService.getParticipantsOwn({
            search: ''
        });
        const data = {
            ...response,
            urlIcon: 'https://lpz.ucb.edu.bo/wp-content/uploads/2021/10/BNB.png'
        }
        console.log('participante propio response', data)
        return [{...data, isSelf: true}]
        // return []
    } catch (error) {
        console.error('Error loading participants:', error)
        const serviceError = error as ServiceError

        console.error('Error:', serviceError.message || 'Error al cargar los participantes');
        
    } finally {
        loading.value = false
    }
}

// Lifecycle
onMounted(() => {
    loadParticipantsExternal()
})

// const navigateToNewParticipant = () => {
//     router.push('/admin/configuration/participants/NewParticipant');
// };

const navigateToNewParticipantOwn = (type:string) => {
    router.push(`/admin/configuration/participants/${type}-own-participant`);
};

const navigateToNewParticipantExternal = (code:any) => {
    router.push(`/admin/configuration/participants/${code}-external-participant`);
}

// const navigateToNewParticipant = (create:string) => {
//     router.push(`/admin/configuration/participants/create/${create}`);
// };

</script>