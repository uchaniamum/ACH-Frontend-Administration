import type { PageState } from "primevue";

export function usePagination<T>(items: Ref<T[]>) {
    const firstPagination = ref(0);
    const rowsPagination = ref(10);

    const paginatedItems = computed(() => {
        return items.value.slice(firstPagination.value, firstPagination.value + rowsPagination.value);
    });

    const totalRecords = computed(() => items.value.length);

    const onPage = (event: PageState) => {
        firstPagination.value = event.first;
        rowsPagination.value = event.rows;
    };

    // Función para resetear a la primera página
    const resetPagination = () => {
        firstPagination.value = 0;
    };

    return {
        firstPagination,
        rowsPagination,
        paginatedItems,
        totalRecords,
        onPage,
        resetPagination
    };
}