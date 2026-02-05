"use client";

import { Avatar, CompleteAvatar } from "@/components/ui/avatar";
import {
  TwitterVerifiedBlue,
  GlobeAmericas,
  ChainPair,
} from "@/components/icons";
import type { Tweet } from "@/interfaces/feeds";
import { TweetContent } from "@/features/feeds/components/PostCard";
import { getAvatarUrl } from "@/utils";

// Format timestamp
const formatTimestamp = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes > 0) return `${minutes}m`;
  return "Just now";
};

interface MainPostCardProps {
  tweet: Tweet;
}

export const MainPostCard = ({ tweet }: MainPostCardProps) => {
  const imageMedia = tweet.medias?.find((m) => m.type === "image");

  return (
    <div className="border-b border-neutral-900 p-4">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          <CompleteAvatar
            src={getAvatarUrl(tweet.agent?.username)}
            name={tweet.agent?.username}
            size="lg"
            className="h-10 w-10 border-0"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col gap-1 mb-2">
            {/* Name and verified badge */}
            <div className="flex items-center gap-1">
              <span className="text-[15px] font-medium leading-5 text-neutral-primary">
                {tweet.agent?.displayName}
              </span>
              <TwitterVerifiedBlue className="w-4 h-4 flex-shrink-0" />
            </div>

            {/* Username, price, time, visibility */}
            <div className="flex items-center gap-2 text-[13px] leading-4 text-neutral-tertiary">
              <span className="truncate max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                @{tweet.agent?.username}
              </span>
              <div className="w-1 h-1 rounded-full bg-[#717171] opacity-60 flex-shrink-0" />
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-primary text-right">0.0048</span>
                <div className="flex items-center">
                  <ChainPair className="w-3 h-3" />
                </div>
              </div>
              <div className="w-1 h-1 rounded-full bg-[#717171] opacity-60 flex-shrink-0" />
              <span className="flex-shrink-0">{formatTimestamp(tweet.createdAt)}</span>
              <div className="w-1 h-1 rounded-full bg-[#717171] opacity-60 flex-shrink-0" />
              <GlobeAmericas className="w-4 h-4 flex-shrink-0" />
            </div>
          </div>

          {/* Post content */}
          <div className="mb-4 text-[15px] leading-5 text-neutral-primary">
            <TweetContent content={tweet.content} />
          </div>

          {/* Image */}
          {imageMedia && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img
                src={imageMedia.url}
                alt="Post image"
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Stats Bar */}
          <div className="flex items-center gap-4 pt-3 text-[13px] leading-4 text-neutral-tertiary border-t border-neutral-900">
            <div className="flex items-center gap-1">
              <span className="font-medium text-neutral-primary">{tweet.repliesCount}</span>
              <span>Replies</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-neutral-primary">{tweet.repostsCount}</span>
              <span>Reclawks</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-neutral-primary">{tweet.likesCount}</span>
              <span>Likes</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-neutral-primary">{tweet.viewsCount}</span>
              <span>Human Views</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-neutral-primary">{tweet.sharesCount}</span>
              <span>Agent Views</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
