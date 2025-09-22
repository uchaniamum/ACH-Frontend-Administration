import type { BreadCrumbMenuItem, CommonActions, ModulesMenu } from "~/types/admin/breadcrumb.Menu.types";

export const breadcrumbConfig = {
    pages: {
        // Channels
        channels:{
            list:[
                { label: 'Inicio', route: '/' },
                { label: 'Canales' }
            ],
            edit:[
                { label: 'Inicio',  route: '/' },
                { 
                    label: 'Canales', 
                    route: '/admin/configuration/channels' 
                },
                { label: 'Editar Canal' }
            ]
        },
        // Parameters
        parameters:{
            list:[
                { label: 'Inicio', route: '/' },
                { label: 'Parámetros' }
            ],
        },
        // Schedule
        schedule:{
            list:[
                { label: 'Inicio', route: '/' },
                { label: 'Horarios' }
            ],
        },
        // Contingency
        contingency:{
            list:[
                { label: 'Inicio', route: '/' },
                { label: 'Enrutamiento y operabilidad' }
            ],
            edit: [
                { label: 'Inicio',  route: '/' },
                { 
                    label: 'Enrutamiento y operabilidad', 
                    route: '/admin/configuration/contingency' 
                },
                { label: 'Cambiar Canal' }
            ]
        },
        // Users
        users:{
            list:[
                { label: 'Inicio', route: '/' },
                { label: 'Usuario' }
            ]
        },
        //Processes
        processes:{
            list:[
                { label: 'Inicio', route: '/' },
                { label: 'Procesos' }
            ]
        },
        //HistoryContingency
        historyContingency:{
            list:[
                { label: 'Inicio', route: '/' },
                { label: 'Bitacora Contingencia' }
            ] 
        },
        //HistoryUser
        historyUser:{
            list:[
                { label: 'Inicio', route: '/' },
                { label: 'Bitácora - Usuarios' }
            ] 
        },
        //HistoryParameter
        historyParameter:{
            list:[
                { label: 'Inicio', route: '/' },
                { label: 'Bitácora - Parámetros' }
            ] 
        },
        historyChannels:{
            list:[
                { label: 'Inicio', route: '/' },
                { label: 'Bitácora - Administrador canales' }
            ] 
        },
    }
} as const;


export function getBreadcrumbItems(module: ModulesMenu, action: CommonActions): BreadCrumbMenuItem[] {
    const moduleConfig = breadcrumbConfig.pages[module];
    
    if (!moduleConfig || !moduleConfig[action as keyof typeof moduleConfig]) {
        console.warn(`Breadcrumb no encontrado: ${module}.${action}`);
        return [{ label: 'Inicio', route: '/' }];
    }
    
    return moduleConfig[action as keyof typeof moduleConfig];
}