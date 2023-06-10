import { sha256 } from "js-sha256";
import { useUserConfig } from "@/stores/userConfig";
import { UseFetchOptions } from "nuxt/app";

// avoid raw password in code
const hashSalt = "KHf2VFK6jR7TNbUwEDvrE3IpBlGKcnmuWcY4QX51Ifc=";

let userConfig: any = null;

// Response type
export interface Response<T> {
  code: number;
  data: T;
  msg: string;
}

type UrlType =
  | string
  | Request
  | Ref<string | Request>
  | (() => string | Request);
export type HttpOption<T> = UseFetchOptions<Response<T>>;

// handle params
const paramsSerializer = (params?: Record<string, any>) => {
  if (!params) return;
  const searchParams = new URLSearchParams();
  for (const key in params) {
    const value = params[key];
    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, item));
    } else {
      searchParams.append(key, value);
    }
  }
  return searchParams;
};

const fetch = <T>(url: UrlType, option: UseFetchOptions<Response<T>>) => {
  return useFetch<Response<T>>(url, {
    // before request
    onRequest({ options }) {
      // get user config
      if (process.client && !userConfig) {
        userConfig = useUserConfig();
      }
      // get method params serializer
      options.params = paramsSerializer(options.params);
      // when mothod is get, add params "t" to avoid cache
      if (options.method?.toLocaleUpperCase() === "GET") {
        options.params = options.params ?? {};
        options.params.t = Date.now();
      }
      // when body has password, hash it
      if (options.body && options.body.hasOwnProperty("password")) {
        const data = options.body as Record<string, any>;
        data.password = sha256(data.password + hashSalt);
        options.body = data;
      }
      if (!userConfig.login || !userConfig.token) {
        userConfig.logout();
        return;
      }
      options.headers = new Headers(options.headers);
      options.headers.set("Authorization", `Bearer ${userConfig.token}`);
    },
    onResponseError({ response }) {
      console.error(response);
      return Promise.reject(response?._data ?? null);
    },
    ...option,
  });
};

// auto export request
export const request = {
  get: <T>(url: UrlType, params?: any, option?: HttpOption<T>) => {
    return fetch<T>(url, { method: "get", params, ...option });
  },

  post: <T>(url: UrlType, body?: any, option?: HttpOption<T>) => {
    return fetch<T>(url, { method: "post", body, ...option });
  },

  put: <T>(url: UrlType, body?: any, option?: HttpOption<T>) => {
    return fetch<T>(url, { method: "put", body, ...option });
  },

  delete: <T>(url: UrlType, body?: any, option?: HttpOption<T>) => {
    return fetch<T>(url, { method: "delete", body, ...option });
  },
};

export const islogin = (): Boolean => {
  if (!userConfig) userConfig = useUserConfig();
  return userConfig && userConfig.login;
};

export const logout = (): void => {
  if (!userConfig) userConfig = useUserConfig();
  userConfig.logout();
};

export { login } from "./user";