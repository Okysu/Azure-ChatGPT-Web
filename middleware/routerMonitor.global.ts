import { login } from "~/api";

export default defineNuxtRouteMiddleware((to, from) => {
  // if (to.fullPath !== "/login" && !login()) {
  //   return navigateTo("/login");
  // }
});
