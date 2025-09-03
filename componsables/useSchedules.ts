import type { Schedule, SchudeleFormData } from "~/features/schedules/type";
import type { ModalMode } from "~/features/users/types";

export function useScheduleModal() {
    // State
    const modalSchedule = ref(false);
    const mode = ref<ModalMode>('create')
    const loading = ref(false);

    const schedulesDetails = ref<SchudeleFormData>({
        paymentGatewayCode: '',
        transactionCode: '',
        scheduleEffectiveDate: '',
        startTime: '', 
        endTime: '',
        changeReason: '',
        base64JustificationFile: '',
    });

    // Computed
    const isEditMode = computed(() => mode.value === 'edit')
    const modalTitle = computed(() =>
        isEditMode.value ? 'Editar horario extraordinario' : 'Nuevo horario extraordinario '
    )

    // Methods
    const openModal = (modalMode: ModalMode, scheduleData?: Schedule) => {
        mode.value = modalMode
        modalSchedule.value = true

        if (modalMode === 'edit' && scheduleData) {
            loadScheduleData(scheduleData)
        } else {
            resetForm()
        }
    }

    const closeModal = () => {
        modalSchedule.value = false
        mode.value = 'create'
        resetForm()
    }

    const loadScheduleData = (schedule: Schedule) => {
        schedulesDetails.value = {
            paymentGatewayCode: schedule.code || '', 
            transactionCode: schedule.transactionCode || '',
            scheduleEffectiveDate: '', 
            startTime: schedule.startTime || '',
            endTime: schedule.endTime || '',
            changeReason: '',
            base64JustificationFile: ''
        };
    }


    const resetForm = () => {
        schedulesDetails.value = {
            paymentGatewayCode: '',
            transactionCode: '',
            scheduleEffectiveDate:'',
            startTime: '',
            endTime: '',
            changeReason: '',
            base64JustificationFile: '',
        }
    }

    return {
        // State
        modalSchedule,
        mode,
        loading,
        schedulesDetails,

        // Computed
        isEditMode,
        modalTitle,

        // Methods
        openModal,
        closeModal,
        loadScheduleData,
        resetForm
    }
}