export interface IconConfig {
    icon?: string;
    iconClass?: string | ((rowData: any) => string);
    
    conditionalIcon?: {
        condition: string | ((rowData: any) => boolean);  
        trueIcon: string; 
        falseIcon: string;
        trueIconClass?: string;
        falseIconClass?: string;
        iconClass?: string | ((rowData: any) => string);
    };
    
    textClass?: string;
    defaultText?: string;
    
    additionalText?: string | ((rowData: any) => string);
    additionalTextClass?: string;
}

export interface ColumnConfigHistory{
    field: string;
    header: string;
    style?: string;
    class?: string;
    sortable?: boolean;
    vueTemplate?: Component;
    iconConfig?: IconConfig;
    formatter?: (value: any, rowData?: any) => string;
    template?: (value: any, rowData?: any) => string; 
    searchFormatter?: (value: any, rowData?: any) => string;
}

export interface HistoryConfig<T = any>{
    columns: ColumnConfigHistory[];
    searchFields: string[];
    pageSize: number;
    service:{
        getData: () => Promise<{ data: T[] }>;
    }
}