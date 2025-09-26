import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import menuConfigACH from '~/router/menuRoutes'
import type { MenuBarAdminItem } from '~/types/admin/menu.types'


export const useMenuNavigation = () => {
  const router = useRouter()
  const route = useRoute()
<<<<<<< HEAD
  
  // Estado reactivo
  const selectedItemKey = ref<string>('')
  const currentComponent = ref<CurrentComponent | null>(null)
=======

  const activeKeys = ref<string[]>([])
>>>>>>> 6abac5dfde0a97019fd77fecbcfe51fbf9bd7058

  const menuItems = computed(() => menuConfigACH.items)

  const findItemByKey = (key: string, items = menuItems.value): MenuBarAdminItem | null => {
    for (const item of items) {
      if (item.key === key) return item
      if (item.items) {
        const found = findItemByKey(key, item.items)
        if (found) return found
      }
    }
    return null
  }

<<<<<<< HEAD
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
        
=======
  // Buscar item por ruta
  const findItemByRoute = (routePath: string): MenuBarAdminItem | null => {
    const findInItems = (items: MenuBarAdminItem[]): MenuBarAdminItem | null => {
      for (const item of items) {
        if (item.to === routePath) return item
        if (item.items) {
          const found = findInItems(item.items)
          if (found) return found
        }
      }
      return null
    }
    return findInItems(menuItems.value)
  }

  // Obtener path completo (padre + hijo)
  const getItemPath = (targetKey: string): string[] => {
    const findPath = (items: MenuBarAdminItem[], currentPath: string[] = []): string[] | null => {
      for (const item of items) {
        const newPath = [...currentPath, item.key!]

        if (item.key === targetKey) {
          return newPath
        }

>>>>>>> 6abac5dfde0a97019fd77fecbcfe51fbf9bd7058
        if (item.items) {
          const found = findPath(item.items, newPath)
          if (found) return found
        }
      }
      return null
    }
<<<<<<< HEAD
    
    flatten(items)
    return flattened
=======

    return findPath(menuItems.value) || []
>>>>>>> 6abac5dfde0a97019fd77fecbcfe51fbf9bd7058
  }

  const handleMenuClick = (item: MenuBarAdminItem) => {
    if (!item.key) return

    const itemPath = getItemPath(item.key)
    activeKeys.value = itemPath

    if (item.to) {
      router.push(item.to)
    }
  }

  const initializeFromRoute = () => {
<<<<<<< HEAD
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
=======
    const item = findItemByRoute(route.path)
    if (item?.key) {
      activeKeys.value = getItemPath(item.key)
>>>>>>> 6abac5dfde0a97019fd77fecbcfe51fbf9bd7058
    }
  }

  const isItemActive = (item: MenuBarAdminItem): boolean => {
    return item.key ? activeKeys.value.includes(item.key) : false
  }

<<<<<<< HEAD
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

=======
>>>>>>> 6abac5dfde0a97019fd77fecbcfe51fbf9bd7058
  return {
    menuItems,
    activeKeys,
    handleMenuClick,
    initializeFromRoute,
    isItemActive,
    findItemByKey
  }
}