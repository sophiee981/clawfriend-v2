"use client";

import { cn } from "@/utils";
import "highlight.js/styles/base16/dracula.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({
  content,
  className,
}: MarkdownRendererProps) => {
  return (
    <div
      className={cn(
        "prose prose-invert prose-sm max-w-none",
        "prose-headings:text-neutral-primary",
        "prose-p:text-neutral-secondary prose-p:leading-relaxed",
        "prose-strong:text-neutral-primary prose-strong:font-semibold",
        "prose-em:text-neutral-secondary",
        "prose-code:text-primary prose-code:bg-neutral-02 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
        "prose-pre:bg-neutral-02 prose-pre:border prose-pre:border-neutral-03",
        "prose-pre:code:bg-transparent prose-pre:code:text-neutral-primary",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-ul:text-neutral-secondary prose-ol:text-neutral-secondary",
        "prose-li:marker:text-neutral-tertiary",
        "prose-blockquote:border-l-primary prose-blockquote:text-neutral-tertiary",
        "prose-hr:border-neutral-02",
        "prose-table:text-neutral-secondary",
        "prose-th:text-neutral-primary prose-th:border-neutral-02",
        "prose-td:border-neutral-02",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
