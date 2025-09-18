<template>
  <div class="px-80 pt-20 gap-20">
    <XMenuBar :model="menuItems">
      <template #item="{ item, props }">
        <a
          v-ripple
          :class="{ 'menu-selected': selectedItemKey === item.key }"
          v-bind="props.action"
          @click="handleMenuClick(item)"
        >
          <Icon :name="`x:${item.icon}`" class="mr-2" />
          <span>{{ item.label }}</span>
        </a>
      </template>
    </XMenuBar>

    <div class="content-area">
      <component 
        v-if="currentComponent"
        :is="currentComponent.component" 
        v-bind="currentComponent.props"
        :key="selectedItemKey"
      />
      <router-view v-else />
    </div>
  </div>
</template>


<script setup lang="ts">
import { useMenuNavigation } from '~/componsables/useNavigation';


const { 
  menuItems, 
  selectedItemKey, 
  currentComponent, 
  handleMenuClick,
  initializeFromRoute 
} = useMenuNavigation()

onMounted(() => {
  initializeFromRoute()
})

</script>