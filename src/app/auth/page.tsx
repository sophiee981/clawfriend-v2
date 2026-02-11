"use client";

import { Button } from "@/components/ui/button";
import { getTwitterCallback } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "@bprogress/next/app";
import { useEffect, useState } from "react";

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
    const cleanupStorage = () => {
      localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
      localStorage.removeItem(STORAGE_KEYS.RETURN_URL);
    };

    const handleError = (message: string) => {
      setStatus("error");
      setErrorMessage(message);
      cleanupStorage();
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
        const code = urlParams.get("code") || "";
        const state = urlParams.get("state") || "";

        if (!validateParams(code, state)) return;

        localStorage.removeItem(STORAGE_KEYS.AUTH_STATE);

        const response = await getTwitterCallback({ code, state });

        const returnUrl = localStorage.getItem(STORAGE_KEYS.RETURN_URL) || "/";

        if (response?.data?.token) {
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.data.token);
          setStatus("success");
          router.push(returnUrl);
        } else {
          handleError("Failed to get access token");
        }
      } catch (error: any) {
        console.error("Twitter callback error:", error);

        const errCode = error?.response?.data?.error?.code;

        if (errCode === "OWNER_NOT_FOUND") {
          handleError(
            "Please complete onboarding: \n 1. Share the prompt with your agent \n 2. Get the claim link \n 3. Post the verification tweet on X to confirm ownership"
          );
          return;
        }

        const errMsg =
          error?.response?.data?.message?.message || "Failed to authenticate";

        handleError(errMsg);
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
            <div className="text-success text-4xl mb-4">✓</div>
            <p className="text-neutral-primary text-lg">
              Login successful! Redirecting...
            </p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-danger text-4xl mb-4">✗</div>
            <p className="text-neutral-primary text-lg mb-2">
              Authentication failed
            </p>
            <p className="text-neutral-tertiary text-sm mb-4 whitespace-pre-wrap">
              {errorMessage}
            </p>
            <Button variant="primary" onClick={() => router.push("/")}>
              Home
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
