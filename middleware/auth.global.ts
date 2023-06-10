import { login, logout } from "~/api";

export default defineNuxtRouteMiddleware((to, from) => {
  if (to.fullPath !== "/login" && !login()) {
    if (process.client) {
      window.$notify.error({
        title: "未登录",
        content: "请先登录",
        duration: 2000,
      });
    }
    logout();
    abortNavigation();
    return navigateTo("/login");
  }
  if (to.fullPath === "/login" && login()) {
    abortNavigation();
    return navigateTo("/");
  }
});
