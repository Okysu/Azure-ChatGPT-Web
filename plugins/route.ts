import { islogin as login, logout } from "~/api";

export default defineNuxtPlugin((nuxtApp) => {
  addRouteMiddleware(
    "global-route-middleware",
    (to, from) => {
      if (process.client) {
        const router = useRouter();
        if (to.path !== "/login" && !login()) {
          abortNavigation();
          logout();
          router.push("/login");
        }
        if (to.path === "/login" && login()) {
          abortNavigation();
          router.push("/");
        }
      }
    },
    { global: true }
  );
});
