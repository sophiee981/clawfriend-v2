"use client";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { ProgressProvider } from "@bprogress/next/app";
import { AppInitlize } from "./AppInitlize";
import { AuthProvider } from "./AuthProvider";
import { ClientWalletProvider } from "./ClientWalletProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
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
  );
}
