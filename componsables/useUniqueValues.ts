// composables/useUniqueValues.ts
import { computed } from 'vue'
import type { Ref } from 'vue'

export function useUniqueValues<T>(
  data: Ref<T[]>,
  fieldPath: string
) {
  return computed(() => {
    if (!data.value || data.value.length === 0) {
      return []
    }
    
    const allValues: any[] = []
    
    data.value.forEach(item => {
      if (fieldPath.includes('.')) {
        // Path anidado (ej: 'routes.alias')
        const pathParts = fieldPath.split('.')
        let currentValue: any = item
        
        for (const part of pathParts) {
          if (currentValue && typeof currentValue === 'object') {
            if (Array.isArray(currentValue)) {
              // Si es un array, procesar cada elemento
              currentValue.forEach(arrayItem => {
                if (arrayItem && typeof arrayItem === 'object' && part in arrayItem) {
                  allValues.push(arrayItem[part])
                }
              })
              break
            } else if (part in currentValue) {
              currentValue = currentValue[part]
            } else {
              break
            }
          } else {
            break
          }
        }
        
        if (currentValue && !Array.isArray(currentValue)) {
          allValues.push(currentValue)
        }
      } else {
        // Path simple
        const value = (item as any)[fieldPath]
        if (value != null) {
          allValues.push(value)
        }
      }
    })
    
    // Filtrar y obtener valores únicos
    const flatValues = allValues.flat().filter(value => 
      value != null && value.toString().trim() !== ''
    )
    
    const uniqueValues = [...new Set(flatValues)]
    uniqueValues.sort()
    
    return uniqueValues.map(value => ({
      label: value.toString(),
      value: value
    }))
  })
}