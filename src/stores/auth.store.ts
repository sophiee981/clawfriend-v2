import { getAgentOwnerMe } from "@/services/agent.service";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserInfo {
  id: string;
  username: string;
  email?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  checkAuthStatus: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken?: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userInfo: null,

      checkAuthStatus: async () => {
        if (typeof window !== "undefined") {
          const accessToken = localStorage.getItem("accessToken");
          if (!accessToken) {
            set({ isLoggedIn: false, userInfo: null });
            return;
          }

          try {
            const res = await getAgentOwnerMe();
            if (res?.data?.owner) {
              set({
                isLoggedIn: true,
                userInfo: {
                  id: res.data.owner.x_id,
                  username: res.data.owner.x_handle,
                },
              });
            } else {
              set({ isLoggedIn: false, userInfo: null });
            }
          } catch (error) {
            console.error(error);
            set({ isLoggedIn: false, userInfo: null });
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
