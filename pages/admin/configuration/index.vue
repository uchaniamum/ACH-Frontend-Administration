<template>
  <div class="px-80 pt-20 gap-20 pb-20">
    <XMenuBar :model="menuItems">
      <template #item="{ item, props }">
        <a
          v-ripple
          :class="{ 'menu-active': isItemActive(item) }"
          v-bind="props.action"
          @click="handleMenuClick(item)"
        >
          <Icon :name="`x:${item.icon}`" class="mr-2" />
          <span>{{ item.label }}</span>
        </a>
      </template>
    </XMenuBar>

    <div class="content-area">
      
      <router-view />
    </div>
  </div>
</template>


<script setup lang="ts">
import { useMenuNavigation } from '~/componsables/useNavigation';

const route = useRoute()

const { menuItems, handleMenuClick, initializeFromRoute, isItemActive } = useMenuNavigation()


onMounted(() => {
  initializeFromRoute()
})


watch(() => route.path, () => {
  initializeFromRoute()
})
</script>