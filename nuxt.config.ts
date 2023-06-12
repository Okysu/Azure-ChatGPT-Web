// Naive Ui Auto Import
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    preset: "vercel",
  },
  serverDir: "server/",
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      title: "Azure ChatGPT Playground",
    },
  },
  modules: [
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore"],
      },
    ],
    "@pinia-plugin-persistedstate/nuxt",
  ],
  typescript: {
    shim: false,
  },
  build: {
    transpile:
      process.env.NODE_ENV === "production"
        ? [
            "naive-ui",
            "vueuc",
            "@css-render/vue3-ssr",
            "@juggle/resize-observer",
          ]
        : ["@juggle/resize-observer"],
  },
  vite: {
    plugins: [
      Components({
        resolvers: [NaiveUiResolver()],
      }),
    ],
    optimizeDeps: {
      include:
        process.env.NODE_ENV === "development"
          ? ["naive-ui", "vueuc", "date-fns-tz/esm/formatInTimeZone"]
          : [],
    },
  },
});
