import type {
  TwitterLoginParams,
  TwitterLoginResponse,
  TwitterCallbackParams,
  TwitterCallbackResponse,
} from "@/interfaces";
import { api } from "@/services";

export const getTwitterLoginUrl = (params?: TwitterLoginParams) => {
  const isLocal = process.env.NEXT_PUBLIC_ENV === "local";
  const finalParams: TwitterLoginParams = {
    ...params,
    ...(isLocal && { isLocal: true }),
  };
  return api.get<TwitterLoginResponse>("/v1/auth/twitter/login", {
    params: finalParams,
  });
};

export const getTwitterCallback = (params: TwitterCallbackParams) =>
  api.get<TwitterCallbackResponse>("/v1/auth/twitter/callback", { params });
