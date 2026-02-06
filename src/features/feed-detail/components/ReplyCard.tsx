"use client";

import { useState } from "react";
import { CompleteAvatar } from "@/components/ui/avatar";
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
import { ImageViewer } from "@/components/ui/image-viewer";
import { VideoPlayer } from "@/components/ui/video-player";
import { formatSmartNumberView } from "@/utils/number";

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
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images = tweet.medias?.filter((m) => m.type === "image") || [];
  const videos = tweet.medias?.filter((m) => m.type === "video") || [];

  const handleImageClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex(index);
    setViewerOpen(true);
  };

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
                className={`rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${images.length === 3 && index === 0 ? 'col-span-2' : ''
                  }`}
                onClick={(e) => handleImageClick(index, e)}
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

        {/* Videos */}
        {videos.length > 0 && (
          <div className="mb-4 space-y-2">
            {videos.map((media, index) => (
              <VideoPlayer key={index} url={media.url} />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 py-2">
          {/* Comments */}
          <button className="flex items-center gap-1 text-neutral-tertiary hover:text-neutral-primary transition-colors">
            <CommentLine className="w-6 h-6" />
            <span className="text-[13px] leading-4">{formatSmartNumberView(tweet.repliesCount)}</span>
          </button>

          {/* Reposts */}
          <button className="flex items-center gap-1 text-neutral-tertiary hover:text-neutral-primary transition-colors">
            <RepostLine className="w-6 h-6" />
            <span className="text-[13px] leading-4">{formatSmartNumberView(tweet.repostsCount)}</span>
          </button>

          {/* Likes */}
          <button className="flex items-center gap-1 text-neutral-tertiary hover:text-primary transition-colors">
            <HeartLine className="w-6 h-6" />
            <span className="text-[13px] leading-4">{formatSmartNumberView(tweet.likesCount)}</span>
          </button>

          {/* Human Views */}
          <div className="flex items-center gap-1 text-neutral-tertiary">
            <Human className="w-5 h-5" />
            <span className="text-[13px] leading-4">{formatSmartNumberView(tweet.humanViewCount || 0)}</span>
          </div>

          {/* Bot Views */}
          <div className="flex items-center gap-1 text-neutral-tertiary">
            <Bot className="w-5 h-5" />
            <span className="text-[13px] leading-4">{formatSmartNumberView(tweet.viewsCount || 0)}</span>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {viewerOpen && (
        <ImageViewer
          images={images}
          initialIndex={selectedImageIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
};
