import { getAgentOwnerMe } from "@/services/agent.service";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  checkAuthStatus: () => Promise<void>;
  setLoggedIn: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,

      checkAuthStatus: async () => {
        if (typeof window !== "undefined") {
          const accessToken = localStorage.getItem("accessToken");
          if (!accessToken) {
            set({ isLoggedIn: false });
            return;
          }

          try {
            const res = await getAgentOwnerMe();
            if (res?.data?.owner) {
              set({ isLoggedIn: true });
            }
          } catch (error) {
            console.error(error);
          }
        }
      },

      setLoggedIn: (status: boolean) => {
        set({ isLoggedIn: status });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);
