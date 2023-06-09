<template>
  <n-config-provider :locale="settings.locale" :date-locale="settings.dateLocale" :theme-overrides="themeOverrides"
    :theme="settings.theme" inline-theme-disabled>
    <n-global-style />
    <n-loading-bar-provider>
      <n-message-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <globalMessage />
          </n-notification-provider>
        </n-dialog-provider>
      </n-message-provider>
    </n-loading-bar-provider>
    <NuxtPage />
  </n-config-provider>
</template>

<script setup lang="ts">
// appConfig stores the app's global settings
import { useAppConfig } from "~/stores/appConfig";
// pinia storeToRefs
import { storeToRefs } from "pinia";
// locale and dateLocale are used to set the language of the app
import { zhCN, dateZhCN, enUS, dateEnUS, lightTheme, darkTheme, useOsTheme } from "naive-ui";
// global message component
import globalMessage from "~/components/globalMessage.vue";

// naive ui global config
const settings = reactive({
  locale: zhCN,
  dateLocale: dateZhCN,
  theme: lightTheme,
});

// naive ui global theme
// TODO: personal theme
const themeOverrides = {};

// inject the appConfig store
const appConfig = useAppConfig();
const { locale, theme, isMobile } = storeToRefs(appConfig);

// set theme
const setTheme = (theme: string) => {
  switch (theme) {
    case "dark":
      settings.theme = darkTheme;
      break;
    case "light":
      settings.theme = lightTheme;
      break;
    case "auto":
      settings.theme = useOsTheme().value === "dark" ? darkTheme : lightTheme;
      break;
    default:
      settings.theme = useOsTheme().value === "dark" ? darkTheme : lightTheme;
      break;
  }
};

// set locale
const setLocale = (locale: string) => {
  switch (locale) {
    case "zh-CN":
      settings.locale = zhCN;
      settings.dateLocale = dateZhCN;
      break;
    case "en-US":
      settings.locale = enUS;
      settings.dateLocale = dateEnUS;
      break;
    default:
      settings.locale = enUS;
      settings.dateLocale = dateEnUS;
      break;
  }
};

// watch theme and locale
watch(locale, (value) => {
  setLocale(value);
});

watch(theme, (value) => {
  setTheme(value);
});

// set theme and locale
if (process.client) {
  nextTick(() => {
    setTheme(theme.value);
    setLocale(locale.value);
  });

  // choose auto theme, change theme when system theme changed
  window.addEventListener("focus", function () {
    // check the theme is auto
    if (theme.value === "auto") {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        settings.theme = darkTheme;
      } else {
        settings.theme = lightTheme;
      }
    }
  });

  // resize
  window.addEventListener("resize", function () {
    if (window.innerWidth < 768) {
      isMobile.value = true;
    } else {
      isMobile.value = false;
    }
  });
  isMobile.value = window.innerWidth < 768;
}
</script>