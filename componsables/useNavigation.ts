import { ref, computed, type Component } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import menuConfigACH from '~/router/menuRoutes'
import type { MenuBarAdminItem } from '~/types/admin/menu.types'

interface CurrentComponent {
  component: Component
  props?: Record<string, any>
}

export const useMenuNavigation = () => {
  const router = useRouter()
  const route = useRoute()
  
  // Estado reactivo
  const selectedItemKey = ref<string>('')
  const currentComponent = ref<CurrentComponent | null>(null)

  // Usar la configuración del menú existente
  const menuItems = computed(() => {
    return menuConfigACH.items.map(item => ({
      ...item,
      key: item.key || generateKeyFromPath(item.to || item.label)
    }))
  })

  // Generar key desde la ruta o label
  const generateKeyFromPath = (path: string): string => {
    return path.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  // Función para aplanar el menú jerárquico y obtener todos los items
  const flattenMenuItems = (items: MenuBarAdminItem[]): MenuBarAdminItem[] => {
    const flattened: MenuBarAdminItem[] = []
    
    const flatten = (menuItems: MenuBarAdminItem[]) => {
      menuItems.forEach(item => {
        const itemWithKey = {
          ...item,
          key: item.key || generateKeyFromPath(item.to || item.label)
        }
        flattened.push(itemWithKey)
        
        if (item.items) {
          flatten(item.items)
        }
      })
    }
    
    flatten(items)
    return flattened
  }

  // Obtener todos los items aplanados para búsquedas
  const allItems = computed(() => flattenMenuItems(menuItems.value))

  // Función para buscar un item por key
  const findItemByKey = (key: string): MenuBarAdminItem | null => {
    return allItems.value.find(item => {
      const itemKey = item.key || generateKeyFromPath(item.to || item.label)
      return itemKey === key
    }) || null
  }

  // Función para buscar un item por ruta
  const findItemByRoute = (routePath: string): MenuBarAdminItem | null => {
    return allItems.value.find(item => {
      if (!item.to) return false
      // Comparar rutas exactas o si la ruta actual comienza con la ruta del item
      return item.to === routePath || routePath.startsWith(item.to)
    }) || null
  }

  // Manejo del click en el menú
  const handleMenuClick = (item: MenuBarAdminItem) => {
    const itemKey = item.key || generateKeyFromPath(item.to || item.label)
    selectedItemKey.value = itemKey

    // Si tiene subitems, no navegar (es un item padre)
    if (item.items && item.items.length > 0) {
      currentComponent.value = null
      return
    }

    // Si tiene una ruta, navegar
    if (item.to) {
      currentComponent.value = null
      router.push(item.to)
    }
  }

  // Inicializar desde la ruta actual
  const initializeFromRoute = () => {
    const currentPath = route.path
    
    // Buscar el item que mejor coincida con la ruta actual
    let matchingItem: MenuBarAdminItem | null = null
    let longestMatch = 0
    
    allItems.value.forEach(item => {
      if (item.to && currentPath.startsWith(item.to)) {
        if (item.to.length > longestMatch) {
          longestMatch = item.to.length
          matchingItem = item
        }
      }
    })
    
    if (matchingItem) {
      const itemKey = matchingItem.key || generateKeyFromPath(matchingItem.to || matchingItem.label)
      selectedItemKey.value = itemKey
    }
  }

  // Función para seleccionar un item programáticamente
  const selectItem = (key: string) => {
    const item = findItemByKey(key)
    if (item) {
      handleMenuClick(item)
    }
  }

  // Computed para obtener el item actualmente seleccionado
  const selectedItem = computed(() => {
    return findItemByKey(selectedItemKey.value)
  })

  // Función para verificar si un item está visible
  const isItemVisible = (item: MenuBarAdminItem): boolean => {
    return item.visible !== false // Por defecto visible, solo oculto si visible = false
  }

  // Función para verificar permisos (puedes expandir esta lógica)
  const hasPermission = (item: MenuBarAdminItem): boolean => {
    // Aquí puedes agregar tu lógica de permisos
    // Por ejemplo, verificar contra un store de usuario o contexto de permisos
    return true // Por defecto, todos los permisos habilitados
  }

  // Filtrar items basado en visibilidad y permisos
  const visibleMenuItems = computed(() => {
    const filterItems = (items: MenuBarAdminItem[]): MenuBarAdminItem[] => {
      return items
        .filter(item => isItemVisible(item) && hasPermission(item))
        .map(item => ({
          ...item,
          items: item.items ? filterItems(item.items) : undefined
        }))
    }
    
    return filterItems(menuItems.value)
  })

  return {
    // Estado
    menuItems: visibleMenuItems,
    selectedItemKey,
    currentComponent,
    selectedItem,

    // Métodos
    handleMenuClick,
    initializeFromRoute,
    selectItem,
    findItemByKey,
    findItemByRoute,
    isItemVisible,
    hasPermission
  }
}