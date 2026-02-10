"use client";

import { cn } from "@/utils";
import "@uiw/react-md-editor/markdown-editor.css";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Skeleton } from "./skeleton";

// Skeleton component for loading state
const MarkdownEditorSkeleton = ({ height = 400 }: { height?: number }) => {
  return (
    <div className="w-full rounded-xl border border-neutral-02 bg-neutral-01 overflow-hidden" style={{ height }}>
      {/* Toolbar skeleton */}
      <div className="h-10 bg-neutral-02 border-b border-neutral-02 flex items-center gap-2 px-3">
        <Skeleton customWidth="20px" customHeight="20px" variant="rectangle" />
        <Skeleton customWidth="20px" customHeight="20px" variant="rectangle" />
        <Skeleton customWidth="20px" customHeight="20px" variant="rectangle" />
        <div className="flex-1" />
        <Skeleton customWidth="60px" customHeight="20px" variant="rectangle" />
      </div>
      {/* Editor area skeleton */}
      <div className="p-4 space-y-2" style={{ height: height - 40 }}>
        <Skeleton customWidth="100%" customHeight="16px" />
        <Skeleton customWidth="95%" customHeight="16px" />
        <Skeleton customWidth="90%" customHeight="16px" />
        <Skeleton customWidth="98%" customHeight="16px" />
        <Skeleton customWidth="85%" customHeight="16px" />
        <Skeleton customWidth="92%" customHeight="16px" />
      </div>
    </div>
  );
};

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
  height?: number;
}

export const MarkdownEditor = ({
  value,
  onChange,
  placeholder = "Enter markdown content...",
  className,
  height = 400,
}: MarkdownEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);
  
  // Create dynamic component with loading skeleton for this specific height
  const MDEditor = useMemo(
    () =>
      dynamic(() => import("@uiw/react-md-editor"), {
        ssr: false,
        loading: () => <MarkdownEditorSkeleton height={height} />,
      }),
    [height]
  );

  return (
    <div className={cn("w-full", className)} data-color-mode="dark">
      <MDEditor
        value={value}
        onChange={onChange}
        preview={isPreview ? "preview" : "edit"}
        hideToolbar={false}
        visibleDragbar={false}
        height={height}
        textareaProps={{
          placeholder,
          style: {
            fontSize: 14,
            backgroundColor: "var(--bg-neutral-01)",
            color: "inherit",
          },
        }}
        style={{
          backgroundColor: "var(--bg-neutral-01)",
        }}
        data-color-mode="dark"
      />
    </div>
  );
};
