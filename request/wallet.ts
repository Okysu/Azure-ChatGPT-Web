import { request } from ".";

export const getWallet = () => {
  return request.get("/api/wallet");
};

interface pushWalletOptions {
  key: string;
}

export const pushWallet = (data: pushWalletOptions) => {
  return request.post("/api/wallet/push", data);
};
