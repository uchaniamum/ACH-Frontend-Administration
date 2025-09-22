export interface Processes{
    paymentGatewayAcronym?: string;
    paymentGatewayBackgroundCode?: string;
    description?: string;
    isRunning?: boolean;
    parameters?:string;
    frequencyHours?: number;
    changeReason?: string;
    lastExecutionBackgroundStatusId?:number;
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
