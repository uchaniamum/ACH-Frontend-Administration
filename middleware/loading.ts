import { useLoading } from "~/componsables/useLoading";

export default defineNuxtRouteMiddleware(() => {
  const loading = useLoading()
  loading.show();
});
