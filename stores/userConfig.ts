const expireTime = 1000 * 60 * 60 * 24 * 15; // 15 days

// user store
export const useUserConfig = defineStore("userConfig", {
  state: () => ({
    user: {} as user,
    token: "",
    loginTime: 0,
  }),
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    getLoginTime: (state) => state.loginTime,
    login: (state) => state.loginTime + expireTime > Date.now(),
  },
  actions: {
    setUser(user: user) {
      this.user = user;
    },
    setToken(token: string) {
      this.token = token;
    },
    setLoginTime(loginTime: number) {
      this.loginTime = loginTime;
    },
    logout() {
      this.user = {} as user;
      this.token = "";
      this.loginTime = 0;
    },
  },
  persist: process.client && {
    storage: persistedState.localStorage,
  },
});
