import type {
  TwitterLoginParams,
  TwitterLoginResponse,
  TwitterCallbackParams,
  TwitterCallbackResponse,
} from "@/interfaces";
import { api } from "@/services";

export const getTwitterLoginUrl = (params?: TwitterLoginParams) =>
  api.get<TwitterLoginResponse>("/v1/auth/twitter/login", { params });

export const getTwitterCallback = (params: TwitterCallbackParams) =>
  api.get<TwitterCallbackResponse>("/v1/auth/twitter/callback", { params });
