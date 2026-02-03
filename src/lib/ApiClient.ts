import { toast } from "@/utils/toast";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

export interface ApiResponse {
  data?: any;
  status?: number;
  success?: boolean;
  error?: string;
}

const errorMessage = "An error occurred during execution";

const errorCallback = (status: number, dataError: any) => {
  const message =
    dataError?.message || dataError?.error || dataError?.payload?.message;

  return { status, error: message || errorMessage };
};

const handleUnauthorized = () => {
  toast.error("Unauthorized");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

class ApiClient {
  baseURL: string;
  hasToken: boolean;

  constructor(baseURL?: string, hasToken?: boolean) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_BASE_URL || "";
    this.hasToken = hasToken || true;
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
          const token = localStorage.getItem("accessToken") ?? "";
          config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response.data;
      },
      async (error: AxiosError) => {
        const resError = error.response;
        const dataError: any = resError?.data;

        switch (resError?.status) {
          case 401:
            handleUnauthorized();

            return errorCallback(401, dataError);
          case 403:
            return errorCallback(403, dataError);
          default:
            return errorCallback(400, dataError);
        }
      }
    );
    return api;
  }
}

export default ApiClient;
