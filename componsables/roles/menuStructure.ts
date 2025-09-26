// constants/menuStructure.ts
export const MENU_STRUCTURE = [
    {
        name: 'Seguridad',
        children: [
            { name: 'Usuarios' },
            { name: 'Accesos y roles' }
        ]
    },
    {
        name: 'Configuración',
        children: [
            { name: 'Adm. de canales' },
            { name: 'Participantes' },
            { name: 'Horarios' },
            { name: 'Contingencia' },
            { name: 'Config. de alertas' },
            { name: 'Parámetros' },
            { name: 'Procesos' }
        ]
    },
    {
        name: 'Auditoría',
        children: [
            { name: 'Bitácora' }
        ]
    },
    {
        name: 'Transacciones',
        children: [
            { name: 'Reg. Transacciones' },
            { name: 'Aut. Transacciones' }
        ]
    },
    {
        name: 'Reportes',
        children: [
            { name: 'Dashboard' },
            { name: 'Reporte ejecutivo' },
            { name: 'Órdenes y mensajes' },
            { name: 'Rep. de conciliación' }
        ]
    }
];