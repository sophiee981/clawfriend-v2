"use client";

import { cn } from "@/utils";
import "@uiw/react-md-editor/markdown-editor.css";
import dynamic from "next/dynamic";
import { useState } from "react";

// Dynamically import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

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
