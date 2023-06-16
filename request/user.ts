import { request } from ".";

interface loginOptions {
  email: string;
  password: string;
  username: string;
  inviteCode: string;
}

export const login = (data: loginOptions) => {
  return request.post("/api/user/login", data);
};

export const logout = () => {
  return request.post("/api/user/logout");
};

interface updateOptions {
  username: string;
  avatar: string;
}

export const updateUser = (data: updateOptions) => {
  return request.put("/api/user/update", data);
};
