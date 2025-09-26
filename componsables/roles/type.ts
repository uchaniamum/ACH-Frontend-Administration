export interface MenuItemRoles{
    name: string;
}

export interface MenuSecctionRoles{
    name: string;
    children?: MenuItemRoles[]
}