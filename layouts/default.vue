<template>
    <div class="px-80 pt-20 gap-20 pb-20">
        <XMenuBar :model="menuItems">
            <template #item="{ item, props, hasSubmenu }">
                <template v-if="item.items">
                    <a 
                      v-ripple 
                      class="flex align-items-center p-3" 
                      v-bind="props.action"
                      :class="{ 'menu-selected': selectedItemKey === item.key }"
                    >
                      <Icon :name="`x:${item.icon}`" />
                      <span class="ml-2">{{ item.label }}</span>
                      <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
                    </a>
                </template>
                <template v-else>
                    <NuxtLink 
                      v-ripple 
                      class="flex align-items-center p-3" 
                      :to="item.to" 
                      v-bind="props.action"
                      :class="{ 'menu-selected': selectedItemKey === item.key }"
                      @click="selectMenuItem(item)"
                    >
                      <Icon :name="`x:${item.icon}`" />
                      <span class="ml-2">{{ item.label }}</span>
                    </NuxtLink>
                </template>
            </template>
        </XMenuBar>
        <div class="flex flex-col pt-20">
            <NuxtPage />
        </div>
    </div>
</template>

<script setup lang="ts">
import menuConfigACH from '~/navigation/menuRoutes';
import type { MenuBarAdminItem } from '../types/admin/menu.types';

const route = useRoute();
const menuItems = ref<MenuBarAdminItem[]>([]);
const selectedItemKey = ref<string | null>(null);

onMounted(() => {
  menuItems.value = addKeysToMenuItems(menuConfigACH.items);
  updateSelectedItemFromRoute();
});

// Observar cambios de ruta para actualizar la selección
watch(() => route.path, () => {
  updateSelectedItemFromRoute();
});

// Función para agregar keys únicos a los items del menú
const addKeysToMenuItems = (items: MenuBarAdminItem[]): MenuBarAdminItem[] => {
  return items.map((item, index) => {
    const newItem = { 
      ...item, 
      key: item.to || `item-${index}` 
    };
    
    if (item.items) {
      newItem.items = addKeysToMenuItems(item.items);
    }
    
    return newItem;
  });
};

// Función para encontrar el item activo basado en la ruta
const findActiveItem = (items: MenuBarAdminItem[], path: string): MenuBarAdminItem | null => {
  for (const item of items) {
    if (item.items) {
      const hasActiveChild = item.items.some(child => 
        child.to && (path === child.to || path.startsWith(child.to + '/'))
      );
      if (hasActiveChild) {
        return item;
      }
    }
    if (item.to && (path === item.to || path.startsWith(item.to + '/'))) {
      return item;
    }
  }
  return null;
};

// Actualizar item seleccionado basado en la ruta actual
const updateSelectedItemFromRoute = () => {
  const activeItem = findActiveItem(menuItems.value, route.path);
  selectedItemKey.value = activeItem?.key || null;
};

// Seleccionar item del menú
const selectMenuItem = (item: MenuBarAdminItem) => {
  selectedItemKey.value = item.key;
};

</script>