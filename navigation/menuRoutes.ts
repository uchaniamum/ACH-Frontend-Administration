import type { MenuBarAdminConfig } from "~/types/admin/menu.types";

const menuConfigACH: MenuBarAdminConfig = {
    items: [
        {
            key: 'dashboard',
            label: 'Dashboard',
            icon: 'house',
            to: '/'
        },
        {
            key: 'configuration',
            label: 'Configuración',
            icon: 'setting',
            items: [
                {
                    key:'channels',
                    label: 'Canales',
                    to: '/admin/configuration/channels',
                },
                {
                    key:'contingency',
                    label: 'Contingencia',
                    to: '/admin/configuration/contingency',
                },
                {
                    key:'participants',
                    label: 'Participantes',
                    to: '/admin/configuration/participants',
                },
                {
                    key:'parameters',
                    label: 'Parámetros',
                    to: '/admin/configuration/parameters',
                },
                {
                    key:'schedules',
                    label: 'Horarios',
                    to: '/admin/configuration/schedules'
                },
                {
                    key:'alerts',
                    label: 'Alertas',
                    to: '/admin/configuration/alertas'
                }

            ]
        },
        {
            key: 'monitoring',
            label: 'Monitoreo',
            icon: 'reports',
            items: [
                {
                    key:'processes',
                    label: 'Procesos',
                    to: '/admin/monitoring/processes',
                }
            ]
        },
        {
            key: 'users',
            label: 'Usuarios',
            icon: 'user',
            to: '/admin/security/users'
        },
        {
            key: 'historical',
            label: 'Bitacora',
            icon: 'setting',
            items: [
                {
                    key:'historicalChannels',
                    label: 'Bitácora Canales',
                    to: '/admin/configuration/channels/HistoricalChannel',
                },
                {
                    key:'historicalContingency',
                    label: 'Bitácora Contingencias',
                    to: '/admin/configuration/contingency/HistoricalContingency',
                },
                {
                    key:'participants',
                    label: 'Bitácora Participantes',
                    to: '/admin/configuration/participants',
                },
                {
                    key:'historicalParameters',
                    label: 'Bitácora Parámetros',
                    to: '/admin/configuration/parameters/HistoricalParameters',
                },
                {
                    key:'schedules',
                    label: 'Horarios',
                    to: '/admin/configuration/schedules'
                },
                {
                    key:'historicalUsers',
                    label: 'Bitácora Usuarios',
                    to: '/admin/security/users/HistoricalUser'
                }

            ]
        },
    ]
};
export default menuConfigACH;