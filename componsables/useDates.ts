
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
          console.error('Error in function formatDate: ', error);
          return dateString
      }
  }


  const formatTime = (time: string | Date | null | undefined): string | Date => {
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
      console.error('Error in function formatTime: ', error);
      return time
    }
  }

  const formatDateTimeDirect = (dateTimeString: string): string => {
    if (!dateTimeString) return 'N/A'
    
    try {
        const date = new Date(dateTimeString);
        
        // Formatear fecha como YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        // Formatear hora como HH:MM
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
        console.error('Error in function formatDateTimeDirect: ', error);
        return dateTimeString;
    }
}

  return {
    formatDate,
    formatTime,
    formatDateTimeDirect
  }

}