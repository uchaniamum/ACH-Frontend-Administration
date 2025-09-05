import type { Schedule, ScheduleDetailReponse, ScheduleFormData } from "~/features/schedules/type";

export function useScheduleModalDetail() {
    // State
    const modalScheduleDetail = ref(false);
    const loading = ref(false);

    const schedulesDetails = ref<ScheduleDetailReponse | null>(null);

    // Methods
    const openModal = (scheduleData?: Schedule | ScheduleFormData) => {
        modalScheduleDetail.value = true

        if (scheduleData) {
            loadScheduleData(scheduleData)
        } else {
            resetData()
        }
    }

    const closeModal = () => {
        modalScheduleDetail.value = false
        resetData()
    }

    const loadScheduleData = (schedule: Schedule | ScheduleDetailReponse) => {
        // Si es un objeto ScheduleDetailResponse completo (desde la API)
        if ('scheduleWeek' in schedule && 'scheduleExceptions' in schedule) {
            schedulesDetails.value = schedule as ScheduleDetailReponse;
        } 
        // Si es un objeto Schedule simple (desde la tabla)
        else if ('acronym' in schedule) {
            // Crear un objeto temporal hasta que lleguen los datos completos de la API
            schedulesDetails.value = {
                transactionCode: schedule.transactionCode || '',
                code: schedule.code || '',
                acronym: schedule.acronym || '',
                transactionCodeDescription: schedule.transactionCodeDescription || '',
                scheduleWeek: {
                    isMondayAvailable: false,
                    isTuesdayAvailable: false,
                    isWednesdayAvailable: false,
                    isThursdayAvailable: false,
                    isFridayAvailable: false,
                    isSaturdayAvailable: false,
                    isSundayAvailable: false
                },
                startTime: schedule.startTime || '',
                endTime: schedule.endTime || '',
                description: schedule.description || '',
                scheduleType: schedule.scheduleType || '',
                scheduleExceptions: []
            };
        }
    }

    const resetData = () => {
        schedulesDetails.value = null;
    }

    return {
        // State
        modalScheduleDetail,
        loading,
        schedulesDetails,

        // Methods
        openModal,
        closeModal,
        loadScheduleData,
        resetData
    }
}