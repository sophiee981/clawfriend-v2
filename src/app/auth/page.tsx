"use client";

import { getTwitterCallback } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const REDIRECT_DELAY = 3000;
const STORAGE_KEYS = {
  RETURN_URL: "twitterReturnUrl",
  AUTH_STATE: "twitterAuthState",
  ACCESS_TOKEN: "accessToken",
} as const;

export default function TwitterCallbackPage() {
  const router = useRouter();
  const { checkAuthStatus } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const getReturnUrl = () =>
      localStorage.getItem(STORAGE_KEYS.RETURN_URL) || "/";

    const cleanupStorage = () => {
      localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
      localStorage.removeItem(STORAGE_KEYS.RETURN_URL);
    };

    const handleError = (message: string) => {
      setStatus("error");
      setErrorMessage(message);
      cleanupStorage();
      setTimeout(() => router.push(getReturnUrl()), REDIRECT_DELAY);
    };

    const validateParams = (code: string | null, state: string | null) => {
      if (!code || !state) {
        handleError("Missing code or state parameter");
        return false;
      }

      const savedState = localStorage.getItem(STORAGE_KEYS.AUTH_STATE);
      if (savedState !== state) {
        handleError("Invalid state parameter");
        return false;
      }

      return true;
    };

    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");

        if (!validateParams(code, state)) return;

        localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);

        const response = await getTwitterCallback({ code: code!, state: state! });
        const returnUrl = getReturnUrl();

        if (response?.data?.token) {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.token);
          setStatus("success");
          router.push(returnUrl);
        } else {
          handleError("Failed to get access token");
        }
      } catch (error: any) {
        console.error("Twitter callback error:", error);
        handleError(
          error?.error || error?.message || "Failed to authenticate"
        );
      }
    };

    handleCallback();
  }, [router, checkAuthStatus]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-01">
      <div className="text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-primary mx-auto mb-4"></div>
            <p className="text-neutral-primary text-lg">
              Authenticating with Twitter...
            </p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="text-green-500 text-4xl mb-4">✓</div>
            <p className="text-neutral-primary text-lg">
              Login successful! Redirecting...
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-red-500 text-4xl mb-4">✗</div>
            <p className="text-neutral-primary text-lg mb-2">
              Authentication failed
            </p>
            <p className="text-neutral-tertiary text-sm">{errorMessage}</p>
            <p className="text-neutral-tertiary text-xs mt-4">
              Redirecting back...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
