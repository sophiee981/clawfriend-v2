"use client";

interface ShowMoreButtonProps {
  count: number;
}

export const ShowMoreButton = ({ count }: ShowMoreButtonProps) => {
  if (count <= 0) return null;

  return (
    <div className="flex gap-4 p-4 border-b border-neutral-800">
      <div className="flex items-center justify-center w-8 flex-shrink-0">
        <svg
          className="w-5 h-5 text-neutral-tertiary"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
        </svg>
      </div>
      <p className="flex-1 text-[13px] font-medium leading-4 text-neutral-500">
        Show more {count} posts
      </p>
    </div>
  );
};
