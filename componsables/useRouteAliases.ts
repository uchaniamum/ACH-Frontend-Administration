// composables/useRouteAliases.ts
import { computed } from 'vue'
import type { Ref } from 'vue'
import type { ChannelsListItem } from '~/features/channels/type'

export function useRouteAliases(channels: Ref<ChannelsListItem[]>) {
  return computed(() => {
    if (!channels.value || channels.value.length === 0) {
      return []
    }
    
    try {
      // Obtener todos los alias únicos
      const allAliases = channels.value.flatMap(channel =>
        channel.routes.map(route => route.alias)
      )
      
      const uniqueAliases = [...new Set(allAliases)].filter(alias => 
        alias && alias.trim() !== ''
      )
      
      uniqueAliases.sort()
      
      return uniqueAliases.map(alias => ({
        label: alias,
        value: alias
      }))
      
    } catch (error) {
      console.error('Error extracting aliases:', error)
      return []
    }
  })
}