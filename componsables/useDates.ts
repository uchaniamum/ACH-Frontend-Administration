
export function useDates() {

  const formatDate = (dateString: string): string => {
      if (!dateString) return 'N/A'

      try {
          const date = new Date(dateString)
          return date.toLocaleDateString('es-ES', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
          })
      } catch (error) {
          return dateString
      }
  }


  const formatTime = (time: string | Date | null | undefined): string => {
    if (!time) return 'No disponible'

    try {
      if (typeof time === 'string') {
        if (time.includes(':')) {
          return time.substring(0, 5)
        }
        const dateObj = new Date(time)
        return dateObj.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      } else {
        return time.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      }
    } catch (error) {
      return 'Hora inválida'
    }
  }

  return {
    formatDate,
    formatTime
  }

}