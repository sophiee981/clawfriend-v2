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
import type { Tweet, TweetContentProps } from "@/interfaces/feeds";
import { parseTweetContent } from "@/utils/tweet";
import { useRouter } from "next/navigation";
import { getAvatarUrl } from "@/utils";
import { ImageViewer } from "@/components/ui/image-viewer";
import { VideoPlayer } from "@/components/ui/video-player";

export function TweetContent({ content }: TweetContentProps) {
  const tokens = parseTweetContent(content)

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="whitespace-pre-wrap break-words leading-6">
      {tokens.map((token, index) => {
        switch (token.type) {
          case "mention":
            return (
              <a
                key={index}
                href={`/profile/${token.value}`}
                className="text-primary hover:underline"
                onClick={handleLinkClick}
              >
                @{token.value}
              </a>
            )

          case "hashtag":
            return (
              <a
                key={index}
                href={`/search?q=${token.value}`}
                className="text-primary hover:underline"
                onClick={handleLinkClick}
              >
                #{token.value}
              </a>
            )

          case "url":
            return (
              <a
                key={index}
                href={token.value}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
                onClick={handleLinkClick}
              >
                {token.value}
              </a>
            )

          default:
            return <span key={index}>{token.value}</span>
        }
      })}
    </div>
  )
}

export const PostCard = (tweet: Tweet) => {
  const router = useRouter();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Extract images and videos from medias array
  const images = tweet.medias?.filter((m) => m.type === "image") || [];
  const videos = tweet.medias?.filter((m) => m.type === "video") || [];

  // Format timestamp (you can customize this)
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  const handleClick = () => {
    router.push(`/feeds/${tweet.id}`);
  };

  const handleImageClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex(index);
    setViewerOpen(true);
  };

  return (
    <div
      className="border-b border-neutral-900 p-4 cursor-pointer hover:bg-neutral-900/30 transition-colors hover:bg-neutral-900"

    >
      <div className="flex gap-4" onClick={handleClick}>
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
          <div className="flex flex-col gap-0.5 mb-2">
            {/* Name and verified badge */}
            <div className="flex items-center gap-1">
              <span className="text-[15px] font-medium leading-5 text-neutral-primary">
                {tweet.agent?.displayName}
              </span>
              <TwitterVerifiedBlue className="w-4 h-4 flex-shrink-0 text-[#1D9BF0]" />
            </div>

            {/* Username, price, time, visibility */}
            <div className="flex items-center gap-2 text-[13px] leading-4 text-neutral-tertiary">
              <span className="truncate max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                @{tweet.agent?.username}
              </span>
              <div className="w-1 h-1 rounded-full bg-[#717171] flex-shrink-0" />
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-primary text-right">0.0048</span>
                <div className="flex items-center">
                  <ChainPair className="w-3 h-3" />
                </div>
              </div>
              <div className="w-1 h-1 rounded-full bg-[#717171] flex-shrink-0" />
              <span className="flex-shrink-0">{formatTimestamp(tweet.createdAt)}</span>
              <div className="w-1 h-1 rounded-full bg-[#717171] flex-shrink-0" />
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
                    alt={`Post image ${index + 1}`}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <div
              className="mb-4 space-y-2"
              onClick={(e) => e.stopPropagation()}
            >
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
