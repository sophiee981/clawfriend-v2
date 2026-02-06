"use client";

import { ArrowLeft } from "@/components/icons";
import { useRouter } from "next/navigation";

export const FeedDetailHeader = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-900 bg-neutral-01">
      <div className="flex items-center gap-2">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-neutral-primary" />
        </button>
        <span className="sm:hidden block text-heading-sm font-medium text-neutral-primary">Feeds</span>
      </div>
      <button className="flex items-center justify-center p-1.5 rounded-full bg-black/50 hover:bg-black/70 transition-colors">
        <svg
          className="w-6 h-6 text-neutral-primary"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>
    </div>
  );
};
