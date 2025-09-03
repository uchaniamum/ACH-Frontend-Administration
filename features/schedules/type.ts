export interface Schedule {
    transactionCode: string;
    code: string;
    acronym: string;
    transactionCodeDescription: string;
    scheduleWeek: ScheduleWeek;
    startTime: string;
    endTime: string;
    description: string;
    scheduleType: string;
    scheduleExceptions: ScheduleExceptions[];
}

export interface ScheduleWeek {
    isMondayAvailable: boolean,
    isTuesdayAvailable: boolean,
    isWednesdayAvailable: boolean,
    isThursdayAvailable: boolean,
    isFridayAvailable: boolean,
    isSaturdayAvailable: boolean,
    isSundayAvailable: boolean
}

export interface ScheduleExceptions {
    code: string;
    effectiveOn: string;
    startTime: string;
    endTime: string;
    description: string;
    isFullDay: string;
    ssActive: string;
}

export interface ScheduleResponseList {
    paymentTransactionSchedule: Schedule[]
}

export interface SchudeleFormData {
    paymentGatewayCode: string,
    transactionCode: string,
    scheduleEffectiveDate: Date | string,
    startTime: Date | string,
    endTime: Date | string,
    changeReason: string,
    base64JustificationFile?: string
}

export interface ExtraordinaryScheduleForm {
    baseScheduleCode?: string; // Código del horario base
    transactionCode?: string;
    effectiveDate?: string;
    startTime?: string;
    endTime?: string;
    reason?: string;
    justificationFile?: string;
}

export interface SchudeleDetailReponse {
    transactionCode: string;
    code: string;
    acronym: string;
    transactionCodeDescription: string;
    scheduleWeek: ScheduleWeek;
    startTime: string;
    endTime: string;
    description: string;
    scheduleType: string;
    scheduleExceptions: ScheduleExceptions[];
}