import type { MenuBarAdminConfig } from "~/types/admin/menu.types";

const menuConfigACH: MenuBarAdminConfig = {
    items: [
        {
            label: 'Dashboard',
            icon: 'house',
            to: '/admin/dashboard'
        },
        {
            label: 'Configuración',
            icon: 'setting',
            items: [
                {
                    label: 'Canales',
                    to: '/admin/configuration/canales',
                },
                {
                    label: 'Participantes',
                    to: '/admin/configuration/participantes',
                },
                {
                    label: 'Horarios',
                    to: '/admin/configuration/horarios'
                }
            ]
        },
        {
            label: 'Reportes',
            icon: 'reports',
        },
        {
            label: 'Usuarios',
            icon: 'user',
            to: '/admin/security/users'
        }
    ]
};
export default menuConfigACH;