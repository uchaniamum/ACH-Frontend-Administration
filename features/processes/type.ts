export interface Processes {
    paymentGatewayAcronym?: string;
    paymentGatewayBackgroundCode?: string;
    description?: string;
    isRunning?: boolean;
    parameters?: string;
    frequencyHours?: number;
    changeReason?: string;
    lastExecutionBackgroundStatusId?: number;
    lastExecution?: string;
    nextExecution?: string;
    isActive?: boolean;
}

export interface ProcessesListResponse {
    paymentGatewayBackgrounds: Processes[];
}

export interface PaymentGatewayBackUpdateResponse {
    wasSaved: boolean;
    wasNew: boolean;
    summary: string;
    description: string;
    savedBy: string;
    savedAt: string;
    traceId: string;
}


export interface ProcessHistoryItem {
    paymentGatewayCode: string;
    paymentGatewayAcronym: string;
    changeNumber: number;
    code: string;
    description: string;
    recipientCount: number;
    isActive: boolean;
    createdAt: string;
    createdByUser: string;
    updatedAt: string;
    updatedByUser: string;
}

export interface ProcessHistoryListItem{
    historicalPaymentGatewayScheduleExceptions: ProcessHistoryItem[]
}