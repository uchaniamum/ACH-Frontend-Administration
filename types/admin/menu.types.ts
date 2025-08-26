export interface MenuBarAdminItem {
    label: string;
    icon?: string;
    to?: string;
    key?: string
    items?: MenuBarAdminItem[];
    visible?: boolean;
    permission?: string;
    
}

export interface MenuBarAdminConfig {
    items: MenuBarAdminItem[];
}