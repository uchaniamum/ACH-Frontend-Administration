import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import menuConfigACH from '~/navigation/menuRoutes'
import type { MenuBarAdminItem } from '~/types/admin/menu.types'


export const useMenuNavigation = () => {
  const router = useRouter()
  const route = useRoute()

  const activeKeys = ref<string[]>([])

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

        if (item.items) {
          const found = findPath(item.items, newPath)
          if (found) return found
        }
      }
      return null
    }

    return findPath(menuItems.value) || []
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
    const item = findItemByRoute(route.path)
    if (item?.key) {
      activeKeys.value = getItemPath(item.key)
    }
  }

  const isItemActive = (item: MenuBarAdminItem): boolean => {
    return item.key ? activeKeys.value.includes(item.key) : false
  }

  return {
    menuItems,
    activeKeys,
    handleMenuClick,
    initializeFromRoute,
    isItemActive,
    findItemByKey
  }
}