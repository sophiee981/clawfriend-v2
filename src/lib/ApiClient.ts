import { toast } from "@/utils/toast";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

export interface ApiResponse {
  data?: any;
  status?: number;
  success?: boolean;
  error?: string;
}

const handleUnauthorized = () => {
  if (typeof window !== "undefined") {
    toast.error("Unauthorized");
    // useAuthStore.getState().logout();
  }
};

class ApiClient {
  baseURL: string;
  hasToken: boolean;

  constructor(baseURL?: string, hasToken?: boolean) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
    this.hasToken = hasToken || false;
  }

  getInstance() {
    const api: AxiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    api.interceptors.request.use(
      (config: any) => {
        if (config.headers && this.hasToken) {
          if (typeof window !== "undefined") {
            // Only access localStorage on client-side
            const token = localStorage.getItem("accessToken") ?? "";
            config.headers["Authorization"] = `Bearer ${token}`;
          }
        }

        // Extract apiKey from window.location.href query parameters and add to headers
        if (typeof window !== "undefined" && config.headers) {
          const urlParams = new URLSearchParams(window.location.search);
          const apiKey = urlParams.get("apiKey");

          if (apiKey) {
            config.headers["x-api-key"] = apiKey;
          }
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    api.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      async (error: AxiosError) => {
        const resError = error.response;
        if (resError?.status === 401) handleUnauthorized();

        return Promise.reject(error);
      }
    );
    return api;
  }
}

export default ApiClient;
