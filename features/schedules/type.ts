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
    scheduleExceptions?: ScheduleExceptions[];
    isInbound?: boolean,
    exceptionCounter?: number
}

export interface ScheduleWeek {
    isMondayAvailable: boolean;
    isTuesdayAvailable: boolean;
    isWednesdayAvailable: boolean;
    isThursdayAvailable: boolean;
    isFridayAvailable: boolean;
    isSaturdayAvailable: boolean;
    isSundayAvailable: boolean;

}

export interface ScheduleExceptions {
    code: string;
    effectiveOn: string;
    startTime: string;
    endTime: string;
    description: string;
    isFullDay: boolean;
    isActive: boolean;
}

export interface ScheduleResponseList {
    paymentTransactionSchedule: Schedule[]
}

export interface ScheduleFormData {
    code?: string // ← ESTE ES EL CAMPO CRÍTICO
    transactionCode?: string
    acronym?: string
    transactionCodeDescription?: string
    scheduleEffectiveDate?: string
    startTime?: string
    endTime?: string
    changeReason?: string
    base64JustificationFile?: string
    isActive?: boolean
}


export interface ScheduleFormRegular {
    transactionCode: string;
    code: string;
    acronym: string;
    transactionCodeDescription: string;
    scheduleWeek: ScheduleWeek;
    startTime: string;
    endTime: string;
    description: string;
    scheduleType: string;
}

export interface ScheduleDetailReponse {
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

export interface ScheduleExceptionRequest {
    paymentGatewayCode: string;
    transactionCode: string;
    scheduleEfectiveDate: Date;
    startTime: string;
    endTime: string;
    changeReason: string;
    base64JustificationFile?: string;
    isActive?: boolean;
}

export interface ScheduleRegularRequest {
    paymentGatewayCode: string;
    transactionCode: string;
    isMondayAvailable: boolean;
    isTuesdayAvailable: boolean;
    isWednesdayAvailable: boolean;
    isThursdayAvailable: boolean;
    isFridayAvailable: boolean;
    isSaturdayAvailable: boolean;
    isSundayAvailable: boolean;
    startTime: string;
    endTime: string;
    changeReason: string;
    base64JustificationFile: string;
}


export interface ScheduleInActiveException {
    paymentGatewayCode: string;
    transactionCode: string;
    scheduleEfectiveDate: string;
    isActive: boolean
}