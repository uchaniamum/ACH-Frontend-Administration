// composables/useSmartBackNavigation.ts

import type { MenuBarAdminConfig } from '~/types/admin/menu.types'
import menuConfigACH from './menuRoutes'
import type { NavigationFailure } from 'vue-router'

export const useSmartBackNavigation = () => {
    const router = useRouter()
    const route = useRoute()

    // Extraer todas las rutas del menuConfig para construir el mapeo automáticamente
    const buildRouteMapping = (config: MenuBarAdminConfig): Record<string, string> => {
    const mapping: Record<string, string> = {}
    
    const processItems = (items: any[], parentRoute?: string) => {
        console.log(items);
        items.forEach(item => {
            if (item.to && parentRoute) {
                mapping[item.to] = parentRoute
            }

            if (item.items) {
                const newParent = item.to || parentRoute
                processItems(item.items, newParent)
            }
        })
    }
    
    processItems(config.items)
    return mapping
    }

    const routeMapping = buildRouteMapping(menuConfigACH)

    const goBack = (customFallback?: string): Promise<void | NavigationFailure> => {
    const currentRoute = route.path
    
    if (routeMapping[currentRoute]) {
        return router.push(routeMapping[currentRoute])
    }
    
    const matchingRoute = Object.keys(routeMapping).find(routeKey => 
        currentRoute.startsWith(routeKey.split('/:')[0])
    )
    
    if (matchingRoute) {
        return router.push(routeMapping[matchingRoute])
    }
    return router.push(customFallback || '/admin')
    }

    return {
        goBack
    }
}