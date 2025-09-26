export interface BreadCrumbMenuItem{
    label: string;
    icon?: string;
    route?: string;
} 

export interface BreadCrumbMenuModule{
    [action: string]: BreadCrumbMenuItem[];
}

export interface BreadCrumbMenuConfig{
    base: Record<string, BreadCrumbMenuItem>;
    pages: Record<string, BreadCrumbMenuModule>;
}

//Puede no usarse
export type BreadcrumMenuParams = Record<string, string | number>;

export type CommonActions = 'list' | 'create' | 'edit' | 'detail';

export type ModulesMenu =
    | 'contingency'
    | 'users' 
    | 'roles'
    | 'channels'
    | 'parameters'
    | 'schedule'
    | 'processes'
    | 'historyContingency'
    | 'historyUser'
    | 'historyParameter'
    | 'historyChannels'
    | 'historySchedule'
    | 'historyProcess'
    ;