"use client";

import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProgressProvider } from "@bprogress/next/app";

interface ProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ProgressProvider
        height="4px"
        color="#fe5631"
        disableSameURL={true}
        options={{
          showSpinner: false,
        }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </ProgressProvider>
    </QueryClientProvider>
  );
}
