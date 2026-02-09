"use client";

import { getTwitterCallback } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { TwitterCallbackResponse } from "@/interfaces";

export default function TwitterCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setTokens, checkAuthStatus } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        // Get return URL from localStorage (fallback to "/" if not found)
        const returnUrl = localStorage.getItem("twitterReturnUrl") || "/";

        if (!code || !state) {
          setStatus("error");
          setErrorMessage("Missing code or state parameter");
          localStorage.removeItem("twitterReturnUrl");
          setTimeout(() => router.push(returnUrl), 3000);
          return;
        }

        // Verify state from localStorage
        const savedState = localStorage.getItem("twitterAuthState");
        if (savedState !== state) {
          setStatus("error");
          setErrorMessage("Invalid state parameter");
          localStorage.removeItem("twitterAuthState");
          localStorage.removeItem("twitterReturnUrl");
          setTimeout(() => router.push(returnUrl), 3000);
          return;
        }

        // Remove saved state
        localStorage.removeItem("twitterAuthState");

        // Call callback API
        const response = await getTwitterCallback({
          code,
          state,
        })

        if (response?.data?.accessToken) {
          // Save tokens
          setTokens(response.data.accessToken, response.data.refreshToken);

          // Check auth status and set user info
          await checkAuthStatus();

          setStatus("success");
          // Redirect to the page user was on before login
          setTimeout(() => {
            router.push(returnUrl);
          }, 1000);
        } else {
          setStatus("error");
          setErrorMessage("Failed to get access token");
          setTimeout(() => router.push(returnUrl), 3000);
        }
      } catch (error: any) {
        console.error("Twitter callback error:", error);
        setStatus("error");
        setErrorMessage(
          error?.error || error?.message || "Failed to authenticate"
        );
        const returnUrl = localStorage.getItem("twitterReturnUrl") || "/";
        localStorage.removeItem("twitterReturnUrl");
        setTimeout(() => router.push(returnUrl), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router, setTokens, checkAuthStatus]);

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
