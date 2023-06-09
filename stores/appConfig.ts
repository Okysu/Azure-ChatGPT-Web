// app config store
export const useAppConfig = defineStore("appConfig", {
  state: () => ({
    locale: "zhCN",
    theme: "auto",
    isMobile: false,
    collapsed: false,
    model: {
      maxTokens: 1000,
      temperature: 0.9,
      topP: 1,
      frequencyPenalty: 0.0,
      presencePenalty: 0.6,
    } as options,
  }),
  getters: {
    getLocale: (state) => state.locale,
    getTheme: (state) => state.theme,
    getIsMobile: (state) => state.isMobile,
    getCollapsed: (state) => state.collapsed,
    getModel: (state) => state.model,
  },
  actions: {
    setLocale(locale: string) {
      this.locale = locale;
    },
    setTheme(theme: string) {
      this.theme = theme;
    },
    setIsMobile(isMobile: boolean) {
      this.isMobile = isMobile;
    },
    setCollapsed(collapsed: boolean) {
      this.collapsed = collapsed;
    },
    setModel(model: options) {
      this.model = model;
    }
  },
  persist: true,
});
