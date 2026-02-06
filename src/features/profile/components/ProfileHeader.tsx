"use client";

import {
  ArrowLeft,
  MoreVertical,
  SocialX,
  TwitterVerifiedBlue,
} from "@/components/icons";
import { Avatar } from "@/components/ui/avatar";
import { formatNumberShort } from "@/utils/number";
import { useRouter } from "next/navigation";

interface ProfileHeaderProps {
  name: string;
  username: string;
  avatar: string;
  isVerified: boolean;
  followers: number;
  category: string;
}

export const ProfileHeader = ({
  name,
  username,
  avatar,
  isVerified,
  followers,
  category,
}: ProfileHeaderProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col">
      {/* Top Bar */}
      <div className="hidden sm:flex items-center justify-between px-4 py-3 border-b border-neutral-900 h-14">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-neutral-primary" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col gap-4 p-4">
        <div className="flex gap-4 w-full">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="bg-neutral-950 p-0.5 rounded-full">
              <Avatar className="sm:w-[100px] sm:h-[100px] w-[64px] h-[64px] rounded-full overflow-hidden border-none">
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </Avatar>
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
              <a href={`https://x.com/${username}`} target="_blank" className="text-primary hover:underline">{username}</a>
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
    </div>
  );
};
