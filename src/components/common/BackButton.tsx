"use client";

import { ArrowLeft } from "@/components/icons";
import { useRouter } from "@bprogress/next/app";
import { useEffect, useState } from "react";

export const BackButton = () => {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if there's history to go back to
    setCanGoBack(window.history.length > 1);
  }, []);

  const handleBack = () => {
    if (canGoBack) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center justify-center w-9 h-9 shrink-0 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
    >
      <ArrowLeft className="w-6 h-6 text-neutral-primary" />
    </button>
  );
};
