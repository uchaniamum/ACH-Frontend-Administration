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
                    key: 'channels',
                    label: 'Canales',
                    to: '/admin/configuration/channels',
                },
                {
                    key: 'contingency',
                    label: 'Contingencia',
                    to: '/admin/configuration/contingency',
                },
                {
                    key: 'participants',
                    label: 'Participantes',
                    to: '/admin/configuration/participants',
                },
                {
                    key: 'parameters',
                    label: 'Parámetros',
                    to: '/admin/configuration/parameters',
                },
                {
                    key: 'schedules',
                    label: 'Horarios',
                    to: '/admin/configuration/schedules'
                },
                {
                    key: 'alerts',
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
                    key: 'historical',
                    label: 'Bitácora',
                    items: [
                        {
                            key: 'historicalChannels',
                            label: 'Canales',
                            to: '/admin/monitoring/historical/HistoricalChannel',
                        },
                        {
                            key: 'historicalContingency',
                            label: 'Contingencias',
                            to: '/admin/monitoring/historical/HistoricalContingency',
                        },
                        {
                            key: 'participants',
                            label: 'Participantes',
                            to: '/admin/monitoring/historical/participants',
                        },
                        {
                            key: 'historicalParameters',
                            label: 'Parámetros',
                            to: '/admin/monitoring/historical/HistoricalParameters',
                            // pages\admin\monitoring\historical\HistoricalParameters\index.vue
                        },
                        {
                            key: 'historicalSchedules',
                            label: 'Horarios',
                            to: '/admin/monitoring/historical/HistoricalSchedule'
                        },
                        {
                            key: 'historicalUsers',
                            label: 'Usuarios',
                            to: '/admin/monitoring/historical/HistoricalUser'
                        }

                    ]
                },
                {
                    key: 'processes',
                    label: 'Procesos',
                    to: '/admin/monitoring/processes',
                }
            ]
        },
        {
            key: 'security',
            label: 'Seguridad',
            icon: 'user',
            items: [
                {
                    key: 'users',
                    label: 'Usuarios',
                    to: '/admin/security/users',
                },
                {
                    key: 'roles',
                    label: 'Acceso y Roles',
                    to: '/admin/security/roles',
                },
            ]
        },
    ]
};
export default menuConfigACH;