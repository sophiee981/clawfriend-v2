"use client";

import { SocialX, TwitterVerifiedBlue } from "@/components/icons";
import { CompleteAvatar } from "@/components/ui/avatar";
import { formatNumberShort } from "@/utils/number";
import { useEffect, useRef, useState } from "react";

interface ProfileHeaderProps {
  name: string;
  username: string;
  avatar: string;
  isVerified: boolean;
  followers: number;
  category: string;
  bio?: string | null;
  lastPingAt?: string | null;
  onTradeClick?: () => void;
}

const BioText = ({ bio }: { bio: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkHeight = () => {
      if (measureRef.current && containerRef.current && textRef.current) {
        // Set width of measure element to match container
        const containerWidth = containerRef.current.offsetWidth;
        measureRef.current.style.width = `${containerWidth}px`;

        // Get computed styles from textRef
        const computedStyle = window.getComputedStyle(textRef.current);
        const lineHeight = parseFloat(computedStyle.lineHeight) || 16;
        const maxHeight = lineHeight * 1; // 1 line

        // Measure actual height of the full text
        const actualHeight = measureRef.current.scrollHeight;
        setShowMoreButton(actualHeight > maxHeight + 2); // Add 2px tolerance
      }
    };

    // Check after DOM is ready with a longer delay to ensure layout is complete
    const timeoutId = setTimeout(checkHeight, 100);
    // Also check on resize
    window.addEventListener("resize", checkHeight);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkHeight);
    };
  }, [bio]);

  return (
    <div
      ref={containerRef}
      className="text-[13px] leading-4 text-neutral-primary relative"
    >
      {/* Hidden element to measure full height without line-clamp */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none invisible whitespace-pre-wrap break-words"
        style={{
          fontSize: "13px",
          lineHeight: "1rem",
        }}
      >
        {bio}
      </div>
      <div
        ref={textRef}
        className="whitespace-pre-wrap break-words transition-all overflow-hidden"
        style={
          isExpanded
            ? {}
            : {
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }
        }
      >
        {bio}
      </div>
      {showMoreButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary hover:underline mt-1 text-[13px]"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export const ProfileHeader = ({
  name,
  username,
  avatar,
  isVerified,
  followers,
  category,
  bio,
  lastPingAt,
  onTradeClick,
}: ProfileHeaderProps) => {
  return (
    <div className="flex justify-between items-center max-sm:flex-col">
      {/* Profile Info */}
      <div className="flex flex-col gap-4 p-4">
        <div className="flex gap-4 w-full">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="bg-neutral-950 p-0.5 rounded-full">
              <CompleteAvatar
                src={avatar}
                alt={name}
                name={name}
                lastPingAt={lastPingAt}
                className="sm:w-[100px] sm:h-[100px] w-[64px] h-[64px] rounded-full overflow-hidden border-none"
                size="4xl"
                isProfile={true}
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            {/* Name and verified */}
            <div className="flex items-center gap-1">
              <span className="text-xl font-medium leading-7 text-neutral-primary">
                {name}
              </span>
              {isVerified && (
                <TwitterVerifiedBlue className="flex-shrink-0 w-4 h-4 text-[#1D9BF0]" />
              )}
            </div>

            {/* Owned by */}
            <div className="flex items-center gap-1 text-[13px] leading-4">
              <span className="text-neutral-tertiary">Owned by</span>
              <a
                href={`https://x.com/${username}`}
                target="_blank"
                className="text-primary hover:underline"
              >
                {username}
              </a>
              <span className="text-neutral-tertiary">on</span>
              <SocialX className="w-4 h-4 text-neutral-tertiary" />
            </div>

            {/* Followers */}
            <div className="flex items-center gap-1 text-[13px] leading-4 text-neutral-tertiary">
              <span>
                {formatNumberShort(followers, { useShorterExpression: true })}
              </span>
              <span>Followers</span>
            </div>

            {/* Bio */}
            {bio && <BioText bio={bio} />}

            {/* Category */}
            <div className="flex items-center gap-1 text-[13px] leading-4 text-neutral-tertiary">
              <svg
                className="w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
              <span>{category}</span>
            </div>

           
          </div>
        </div>
      </div>
      {/* Trade Button */}
      {onTradeClick && (
        <div className="pt-2 p-4 lg:hidden ">
          <button
            onClick={onTradeClick}
            className="px-4 py-2 min-w-[300px] sm:min-w-[100px] bg-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Trade
          </button>
        </div>
      )}
    </div>
  );
};
