"use client";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { ProgressProvider } from "@bprogress/next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppInitlize } from "./AppInitlize";
import { AuthProvider } from "./AuthProvider";
import { ClientWalletProvider } from "./ClientWalletProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ClientWalletProvider>
        <AuthProvider>
          <ProgressProvider
            height="4px"
            color="#fe5631"
            disableSameURL={true}
            options={{
              showSpinner: false,
            }}
          >
            <ThemeProvider>{children}</ThemeProvider>
            <AppInitlize />
          </ProgressProvider>
        </AuthProvider>
      </ClientWalletProvider>
    </QueryClientProvider>
  );
}
