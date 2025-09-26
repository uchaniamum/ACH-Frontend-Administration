export function useLoading() {
  const loadingState = useState<{ message: string; show: boolean; }>("loading", () => ({ message: "", show: false }));

  function show(message: string): void {
    loadingState.value.message = message;
    loadingState.value.show = true;
  }

  function hide(): void {
    loadingState.value.message = "";
    loadingState.value.show = false;
  }

  return {
    show,
    hide,
  }
}
