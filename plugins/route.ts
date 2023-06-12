import { islogin as login, clear } from "~/request";

export default defineNuxtPlugin((nuxtApp) => {
  addRouteMiddleware(
    "global-route-middleware",
    (to, from) => {
      if (process.client) {
        const router = useRouter();
        if (to.path !== "/login" && !login()) {
          abortNavigation();
          clear();
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
