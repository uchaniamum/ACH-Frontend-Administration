<template>
    <div v-if="!loading && currentParticipants?.length" class="flex flex-col gap-12">
        <XCard v-for="participant in currentParticipants" :key="participant.code"
            class="border border-gray-400 flex gap-2 text-gray-900 p-6">
            <template #content>
                <div class="grid grid-cols-12 gap-8">
                    <div class="col-span-4 flex justify-between items-start">
                        <div class="flex gap-12">
                            <XAvatar v-if="participant.urlIcon" :image="participant.urlIcon" class="w-20 h-20" />
                            <Icon v-else name="x:bank" class="w-20 h-20 text-gray-400" />
                            <div>
                                <p class="text-sm text-gray-500">Entidad</p>
                                <p class="text-base font-semibold text-gray-900">{{ participant.name }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-1 flex-col gap-2">
                        <p class="font-sm text-gray-600">Código</p>
                        <span class="font-lg font-semi bold">{{ participant.participantCode }}</span>
                    </div>
                    <div class="col-span-1 flex-col gap-2">
                        <p class="font-sm text-gray-600">Siglas</p>
                        <span class="font-lg font-semi bold">{{ participant.acronym }}</span>
                    </div>
                    <div class="col-span-3 flex-col gap-2">
                        <p class="font-sm text-gray-600">Canales</p>
                        <span class="font-lg font-semi bold">
                            {{ formatPaymentSystems(participant.paymentSystems) }}
                        </span>
                    </div>
                    <div class="col-span-3 flex justify-end items-center">
                        <XButton label="Editar" variant="outlined" class="w-65" @click="checkCanales(participant)" />
                    </div>
                </div>
            </template>
        </XCard>
    </div>
</template>

<script setup lang="ts">
import { XButton, XCard } from '#components';
import type { ParticipantsDetail } from '~/features/participants/types';

const router = useRouter()
type ParticipantMode = 'ownParticipants' | 'externalParticipants';

interface Props {
    participants: {
        ownParticipants: ParticipantsDetail[];
        externalParticipants: ParticipantsDetail[];
    };
    mode: ParticipantMode;
    loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
});

const checkCanales = (participant: string) => {
    console.log(participant)
    if (participant.isSelf) {
        emit('participantSelected', 'edith');
    } else {
        emit('participantSelected', participant.participantCode);
    }
    // emit('participantSelected', participant.isSelf ? participant.code : participant.participantCode);
};

const emit = defineEmits<{
    'participantSelected': [participant: ParticipantsDetail | string],
}>();

const currentParticipants = computed(() => {
    return props.participants[props.mode];
});

const formatPaymentSystems = (paymentSystems?: Array<{ paymentSystemAcronym: string }>) => {
    if (!paymentSystems?.length) return 'Ninguno';
    return paymentSystems.map(sys => sys.acronym).join(' / ');
};

</script>

<style scoped></style>