import type { Schedule, ScheduleFormRegular } from "~/features/schedules/type";

export function useScheduleModalRegular() {
    // State
    const modalScheduleRegular = ref(false);
    const loading = ref(false);

    const schedulesDetails = ref<ScheduleFormRegular>({
        transactionCode: '',
        code: '',
        acronym: '',
        transactionCodeDescription: '',
        startTime: '',
        endTime: '',
        description: '',
        scheduleType: '',
        scheduleWeek: {
            isMondayAvailable: false,
            isTuesdayAvailable: false,
            isWednesdayAvailable: false,
            isThursdayAvailable: false,
            isFridayAvailable: false,
            isSaturdayAvailable: false,
            isSundayAvailable: false
        },
    });

    // Computed
    const modalTitle = computed(() => 'Editar horario regular')

    // Methods
    const openModal = (scheduleData?: Schedule) => {
        modalScheduleRegular.value = true

        if (scheduleData) {
            loadScheduleData(scheduleData)
        } else {
            resetForm()
        }
    }

    const closeModal = () => {
        modalScheduleRegular.value = false
        resetForm()
    }

    const loadScheduleData = (schedule: ScheduleFormRegular) => {
        schedulesDetails.value = {
            transactionCode: schedule.transactionCode || '',
            code: schedule.code || '',
            acronym: schedule.acronym || '',
            transactionCodeDescription: schedule.transactionCodeDescription || '',
            startTime: schedule.startTime || '',
            endTime: schedule.endTime || '',
            description: schedule.description || '',
            scheduleType: schedule.scheduleType  || '',
            scheduleWeek: {
                isMondayAvailable: schedule.scheduleWeek.isMondayAvailable || false,
                isTuesdayAvailable: schedule.scheduleWeek.isMondayAvailable || false,
                isWednesdayAvailable: schedule.scheduleWeek.isMondayAvailable || false,
                isThursdayAvailable: schedule.scheduleWeek.isMondayAvailable || false,
                isFridayAvailable: schedule.scheduleWeek.isMondayAvailable || false,
                isSaturdayAvailable: schedule.scheduleWeek.isMondayAvailable || false,
                isSundayAvailable: schedule.scheduleWeek.isMondayAvailable || false
            },
        };
    }

    const resetForm = () => {
        schedulesDetails.value = {
            transactionCode: '',
            code: '',
            acronym: '',
            transactionCodeDescription: '',
            startTime: '',
            endTime: '',
            description: '',
            scheduleType: '',
            scheduleWeek: {
                isMondayAvailable: false,
                isTuesdayAvailable: false,
                isWednesdayAvailable: false,
                isThursdayAvailable: false,
                isFridayAvailable: false,
                isSaturdayAvailable: false,
                isSundayAvailable: false
            },
        }
    }

    return {
        // State
        modalScheduleRegular,
        loading,
        schedulesDetails,

        // Computed
        modalTitle,

        // Methods
        openModal,
        closeModal,
        loadScheduleData,
        resetForm
    }
}