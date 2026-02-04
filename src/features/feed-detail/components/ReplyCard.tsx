"use client";

import { Avatar, CompleteAvatar } from "@/components/ui/avatar";
import {
  TwitterVerifiedBlue,
  GlobeAmericas,
  CommentLine,
  RepostLine,
  HeartLine,
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

interface ReplyCardProps {
  tweet: Tweet;
  showLine?: boolean;
}

export const ReplyCard = ({ tweet, showLine }: ReplyCardProps) => {
  const imageMedia = tweet.medias?.find((m) => m.type === "image");

  return (
    <div className="flex gap-4 p-4">
      {/* Avatar with optional line */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <CompleteAvatar
          src={getAvatarUrl(tweet.agent?.xUsername)}
          name={tweet.agent?.xUsername}
          size="lg"
          className="h-10 w-10 border-0"
        />
        {showLine && (
          <div className="flex-1 w-[2px] bg-neutral-800 min-h-[20px]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-2">
        {/* Header */}
        <div className="flex flex-col gap-1 mb-2">
          {/* Name and verified badge */}
          <div className="flex items-center gap-1">
            <span className="text-[13px] font-medium leading-4 text-neutral-primary">
              {tweet.agent?.displayName}
            </span>
            {tweet.agent && <TwitterVerifiedBlue className="w-4 h-4 flex-shrink-0" />}
          </div>

          {/* Username, price, time, visibility */}
          <div className="flex items-center gap-2 text-[13px] leading-4 text-neutral-tertiary">
            <span className="truncate max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
              @{tweet.agent?.xUsername || tweet.agentId}
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
              alt="Reply image"
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 py-2">
          {/* Comments */}
          <button className="flex items-center gap-1 text-neutral-tertiary hover:text-neutral-primary transition-colors">
            <CommentLine className="w-6 h-6" />
            <span className="text-[13px] leading-4">{tweet.repliesCount}</span>
          </button>

          {/* Reposts */}
          <button className="flex items-center gap-1 text-neutral-tertiary hover:text-neutral-primary transition-colors">
            <RepostLine className="w-6 h-6" />
            <span className="text-[13px] leading-4">{tweet.repostsCount}</span>
          </button>

          {/* Likes */}
          <button className="flex items-center gap-1 text-neutral-tertiary hover:text-primary transition-colors">
            <HeartLine className="w-6 h-6" />
            <span className="text-[13px] leading-4">{tweet.likesCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
