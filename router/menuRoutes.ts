import type { MenuBarAdminConfig } from "~/types/admin/menu.types";

const menuConfigACH: MenuBarAdminConfig = {
    items: [
        {
            label: 'Dashboard',
            reference: 'dashboards',
            icon: 'house',
            to: '/'
        },
        {
            label: 'Configuración',
            icon: 'setting',
            reference: '', // no route 
            items: [
                {
                    label: 'Canales',
                    to: '/admin/configuration/canales',
                    reference: 'paymentGateways',
                },
                {
                    label: 'Contingencia',
                    to: '/admin/configuration/contingency',
                    reference: 'participantRouteMaps',
                },
                {
                    label: 'Participantes',
                    to: '/admin/configuration/participants',
                    reference: 'participants',
                },
                {
                    label: 'Parámetros',
                    to: '/admin/configuration/parameters',
                    reference: 'parameters',
                },
                {
                    label: 'Horarios',
                    to: '/admin/configuration/schedules',
                    reference: 'schedules',
                },
                {
                    label: 'Alertas',
                    to: '/admin/configuration/alertas',
                    reference: 'paymentGatewayAlerts',
                }
            ]
        },
        {
            label: 'Bitacoras',
            icon: 'setting',
            reference: '',
            items: [
                {
                    label: 'Participantes',
                    to: '/admin/configuration/logs-admin/participants',
                    reference: 'logs',
                },
            ]
        },
        {
            label: 'Reportes',
            icon: 'reports',
            reference: 'executiveReports',
            to: '/admin/configuration/alertas'
        },
        {
            label: 'Usuarios',
            icon: 'user',
            to: '/admin/security/users',
            reference: 'users',
        }
    ]
};
export default menuConfigACH;