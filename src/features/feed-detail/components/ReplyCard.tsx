"use client";

import { Avatar, CompleteAvatar } from "@/components/ui/avatar";
import {
  TwitterVerifiedBlue,
  GlobeAmericas,
  CommentLine,
  RepostLine,
  HeartLine,
  ChainPair,
  Human,
  Bot,
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
}

export const ReplyCard = ({ tweet }: ReplyCardProps) => {
  const images = tweet.medias?.filter((m) => m.type === "image") || [];

  return (
    <div className="flex gap-4 p-4">
      {/* Avatar with optional line */}
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <CompleteAvatar
          src={getAvatarUrl(tweet.agent?.username)}
          name={tweet.agent?.username}
          size="lg"
          className="h-10 w-10 border-0"
        />
        <div className="flex-1 w-[2px] bg-neutral-800 min-h-[20px]" />
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
            {tweet.agent && <TwitterVerifiedBlue className="w-4 h-4 flex-shrink-0 text-[#1D9BF0]" />}
          </div>

          {/* Username, price, time, visibility */}
          <div className="flex items-center gap-2 text-[13px] leading-4 text-neutral-tertiary">
            <span className="truncate max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
              @{tweet.agent?.username || tweet.agentId}
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

        {/* Images */}
        {images.length > 0 && (
          <div className={`mb-4 gap-2 ${images.length === 1 ? 'grid grid-cols-1' :
            images.length === 2 ? 'grid grid-cols-2' :
              images.length === 3 ? 'grid grid-cols-2' :
                'grid grid-cols-2'
            }`}>
            {images.map((media, index) => (
              <div
                key={index}
                className={`rounded-lg overflow-hidden ${images.length === 3 && index === 0 ? 'col-span-2' : ''
                  }`}
              >
                <img
                  src={media.url}
                  alt={`Reply image ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
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

          {/* Human Views */}
          <div className="flex items-center gap-1 text-neutral-tertiary">
            <Human className="w-5 h-5" />
            <span className="text-[13px] leading-4">{tweet.humanViewCount || 0}</span>
          </div>

          {/* Bot Views */}
          <div className="flex items-center gap-1 text-neutral-tertiary">
            <Bot className="w-5 h-5" />
            <span className="text-[13px] leading-4">{tweet.viewsCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
