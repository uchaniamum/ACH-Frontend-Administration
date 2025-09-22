export interface ColumnConfigHistory{
    field: string;
    header: string;
    style?: string;
    class?: string;
    sortable?: boolean;
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