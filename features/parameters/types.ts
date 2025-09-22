export interface ParameterListItem {
    systemAcronym?: string;
    code?: string;
    value?: string;
    dataType?: string;
    description?: string;
}

export interface ParametersListResponse {
    parameters: ParameterListItem[]
}

export interface ParameterModalData {
    systemAcronym?: string |  undefined;
    code: string;
    value?: string | undefined;
    dataType?: string | undefined;
    description?: string | undefined;
}

//Datos para Editar Parametros 
export interface ParameterRequest {
    code: string;
    value: string;
}

export interface ParameterDetailResponse {
    code: string;
    value: string;
    dataType: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    createdByUserId: number;
    lastChangeNumber: number;
    updatedAt: string;
    updatedByUserId: number;
}


export interface ParameterSaveResponse {
    wasSaved: boolean;
    wasNew: boolean;
    summary: string;
    description: string;
    savedBy: string;
    savedAt: string;
    traceId: string;
}

//Datos para Historial de Parametros 
export interface ParameterDetailHisto {
    updatedAt: string;
    updatedByUser: string;
    value: string;
}

export interface ParameterDetailHistorialResponse {
    code: string;
    dataType: string;
    description: string;
    parameters: ParameterDetailHisto[];
}

export interface ParameterHistoryItem {
    paymentGatewayCode: string;
    paymentGatewayAcronym: string;
    changeNumber: number;
    paymentGatewayParameterCode: string;
    value: string;
    dataType: string;
    description: string;
    isActive: boolean;
    createdAt: string;
    createdByUser: string;
    updatedAt: string;
    updatedByUser: string;
}

export interface ParameterHistoryListItem{
    historicalParameters: ParameterHistoryItem[]
}