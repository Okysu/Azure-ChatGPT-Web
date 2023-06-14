import { request } from ".";

export const getWallet = () => {
  return request.get("/api/wallet");
};
