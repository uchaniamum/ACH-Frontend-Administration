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
                    label: 'Contingencia',
                    to: '/admin/configuration/contingency',
                },
                {
                    label: 'Participantes',
                    to: '/admin/configuration/participants',
                },
                {
                    label: 'Parámetros',
                    to: '/admin/configuration/parameters',
                },
                {
                    label: 'Horarios',
                    to: '/admin/configuration/schedules'
                },
                {
                    label: 'Alertas',
                    to: '/admin/configuration/alertas'
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