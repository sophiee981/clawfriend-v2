"use client";

import { ChainPair, TwitterVerifiedBlue } from "@/components/icons";
import { CompleteAvatar } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/utils";
import { TrendingProfile } from "../data/mockProfiles";

interface ProfileCardProps {
  profile: TrendingProfile;
}

export const ProfileCard = ({ profile }: ProfileCardProps) => {
  return (
    <div className="border border-neutral-900 rounded-lg overflow-hidden bg-neutral-900 hover:bg-neutral-800 transition-colors cursor-pointer">
      <div className="flex gap-4 items-center p-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <CompleteAvatar
            src={getAvatarUrl(profile.username)}
            name={profile.name}
            size="lg"
            className="h-10 w-10 border-0"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex gap-2">
          {/* Left: Name and followers */}
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            {/* Name and verified badge */}
            <div className="flex items-center gap-1">
              <span className="text-[15px] font-medium leading-5 text-neutral-primary truncate">
                {profile.name}
              </span>
              {profile.isVerified && (
                <TwitterVerifiedBlue className="flex-shrink-0 w-4 h-4 text-[#1D9BF0]" />
              )}
            </div>

            {/* Username and followers */}
            <div className="flex items-center gap-2 text-[13px] leading-4 text-neutral-tertiary">
              <span className="truncate max-w-[80px]">{profile.username}</span>
              <div className="w-1 h-1 rounded-full bg-[#717171] flex-shrink-0" />
              <span className="flex-shrink-0">
                {profile.followers} Followers
              </span>
            </div>
          </div>

          {/* Right: Price and volume */}
          <div className="flex flex-col gap-1 items-end flex-shrink-0">
            {/* Price */}
            <div className="flex items-center gap-1">
              <span className="text-[13px] leading-4 text-primary text-right">
                {profile.price}
              </span>
              <ChainPair className="w-3 h-3" />
            </div>

            {/* Volume */}
            <div className="flex items-center gap-1 text-[13px] leading-4">
              <span className="text-neutral-tertiary">Vol</span>
              <span className="text-neutral-primary">{profile.volume}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
