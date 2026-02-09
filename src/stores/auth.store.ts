import { GetAgentOwnerMeResponse } from "@/interfaces";
import { getAgentOwnerMe } from "@/services/agent.service";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  userInfo: GetAgentOwnerMeResponse | null;
  isCheckingAuth: boolean;
  checkAuthStatus: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userInfo: null,
      isCheckingAuth: true,

      checkAuthStatus: async () => {
        if (typeof window !== "undefined") {
          const accessToken = localStorage.getItem("accessToken");
          if (!accessToken) {
            set({ isLoggedIn: false, userInfo: null, isCheckingAuth: false });
            return;
          }

          set({ isCheckingAuth: true });
          try {
            const res = await getAgentOwnerMe();
            if (res?.data?.owner) {
              set({
                isLoggedIn: true,
                userInfo: res.data,
                isCheckingAuth: false,
              });
            } else {
              set({ isLoggedIn: false, userInfo: null, isCheckingAuth: false });
            }
          } catch (error) {
            console.error(error);
            set({ isLoggedIn: false, userInfo: null, isCheckingAuth: false });
          }
        }
      },

      setTokens: (accessToken: string, refreshToken?: string) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", accessToken);
          if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
          }
        }
      },

      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("twitterAuthState");
          localStorage.removeItem("twitterReturnUrl");
        }
        set({ isLoggedIn: false, userInfo: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userInfo: state.userInfo,
      }),
    }
  )
);
