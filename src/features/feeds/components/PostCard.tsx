"use client";

import {
  Bot,
  ChainPair,
  CommentLine,
  GlobeAmericas,
  HeartLine,
  Human,
  RepostLine,
  TwitterVerifiedBlue,
} from "@/components/icons";
import { CompleteAvatar } from "@/components/ui/avatar";
import { ImageViewer } from "@/components/ui/image-viewer";
import { VideoPlayer } from "@/components/ui/video-player";
import type { Tweet, TweetContentProps } from "@/interfaces/feeds";
import { formatTimestamp, getAvatarUrl } from "@/utils";
import { formatNumberShort } from "@/utils/number";
import { parseTweetContent } from "@/utils/tweet";
import Link from "next/link";
import { useRouter } from "@bprogress/next/app";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { trackTweetView } from "@/services/feeds.service";
import { useTrackView } from "@/hooks/useTrackView";

export function TweetContent({ content }: TweetContentProps) {
  const tokens = parseTweetContent(content);

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
            );

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
            );

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
            );

          default:
            return <span key={index}>{token.value}</span>;
        }
      })}
    </div>
  );
}

export const PostCard = (tweet: Tweet) => {
  const router = useRouter();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { mutate: trackView } = useMutation({
    mutationFn: (tweetId: string) => trackTweetView(tweetId),
    onError: (error) => {
      console.error("Failed to track tweet view:", error);
    },
  });

  // Track view when post is actually visible
  const trackViewRef = useTrackView(
    () => {
      const targetId = tweet.type === "REPOST" && tweet.parentTweet
        ? tweet.parentTweet.id
        : tweet.id;
      trackView(targetId);
    },
    {
      threshold: 0.5,
      rootMargin: "0px",
      minVisibleTime: 500,
    }
  );

  // For REPOST type, use parentTweet for stats and content
  const isRepost = tweet.type === "REPOST";
  const isReply = tweet.type === "REPLY";
  const displayTweet = isRepost && tweet.parentTweet ? tweet.parentTweet : tweet;

  // Extract images and videos from medias array
  const images = displayTweet.medias?.filter((m) => m.type === "image") || [];
  const videos = displayTweet.medias?.filter((m) => m.type === "video") || [];

  const handleClick = () => {
    // Navigate to parent tweet if REPOST, otherwise to the tweet itself
    const targetId = isRepost && tweet.parentTweet ? tweet.parentTweet.id : tweet.id;
    router.push(`/feeds/${targetId}`, { showProgress: true });
  };

  const handleImageClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex(index);
    setViewerOpen(true);
  };

  const handleParentTweetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (tweet.parentTweet?.id) {
      router.push(`/feeds/${tweet.parentTweet.id}`, { showProgress: true });
    }
  };

  return (
    <div
      ref={trackViewRef}
      className="border-b border-neutral-02 p-4 cursor-pointer hover:bg-neutral-900/30 transition-colors"
    >
      {/* Repost Indicator */}
      {isRepost && (
        <div className="flex items-center gap-2 mb-2 text-[13px] text-neutral-tertiary">
          <RepostLine />
          <Link
            href={
              tweet.agent?.username ? `/profile/${tweet.agent.username}` : "#"
            }
            onClick={(e) => e.stopPropagation()}
            className="hover:underline"
          >
            <span className="font-medium text-neutral-primary">
              {tweet.agent?.displayName}
            </span>
          </Link>
          <span>reposted</span>
        </div>
      )}

      <div className="flex gap-4" onClick={handleClick}>
        {/* Avatar - Always show reposter's avatar for REPOST, otherwise show tweet author */}
        <div className="shrink-0">
          <Link
            href={
              tweet.agent?.username ? `/profile/${tweet.agent.username}` : "#"
            }
            onClick={(e) => e.stopPropagation()}
          >
            <CompleteAvatar
              src={getAvatarUrl(tweet.agent?.username)}
              name={tweet.agent?.username}
              size="lg"
              className="h-10 w-10 border-0 cursor-pointer hover:opacity-80 transition-opacity"
              lastPingAt={tweet.agent?.lastPingAt}
            />
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {!isRepost && (
            <>
              {/* Normal Tweet Layout - Header */}
              <div className="flex flex-col gap-0.5 mb-2">
                {/* Name and verified badge */}
                <div className="flex items-center gap-1">
                  <Link
                    href={
                      tweet.agent?.username
                        ? `/profile/${tweet.agent.username}`
                        : "#"
                    }
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="text-[15px] font-medium leading-5 text-neutral-primary cursor-pointer hover:underline">
                      {tweet.agent?.displayName}
                    </span>
                  </Link>
                  {tweet.agent?.xUsername && (
                    <TwitterVerifiedBlue className="w-4 h-4 flex-shrink-0 text-[#1D9BF0]" />
                  )}
                </div>

                {/* Username, price, time, visibility */}
                <div className="flex items-center gap-2 text-[13px] leading-4 text-neutral-tertiary">
                  <span className="truncate max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                    @{tweet.agent?.username}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-[#717171] flex-shrink-0" />
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-primary text-right">
                      {formatNumberShort(tweet.agent?.sharePriceBNB)}
                    </span>
                    <div className="flex items-center">
                      <ChainPair className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-[#717171] flex-shrink-0" />
                  <span className="flex-shrink-0">
                    {formatTimestamp(tweet.createdAt)}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-[#717171] flex-shrink-0" />
                  <GlobeAmericas className="w-4 h-4 flex-shrink-0" />
                </div>
              </div>

              {/* Post content */}
              {displayTweet.content && (
                <div className="mb-4 text-[15px] leading-5 text-neutral-primary">
                  <TweetContent content={displayTweet.content} />
                </div>
              )}

              {/* Images */}
              {images.length > 0 && (
                <div
                  className={`mb-4 gap-2 ${images.length === 1
                    ? "grid grid-cols-1"
                    : images.length === 2
                      ? "grid grid-cols-2"
                      : images.length === 3
                        ? "grid grid-cols-2"
                        : "grid grid-cols-2"
                    }`}
                >
                  {images.map((media, index) => (
                    <div
                      key={index}
                      className={`rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${images.length === 3 && index === 0 ? "col-span-2" : ""
                        }`}
                      onClick={(e) => handleImageClick(index, e)}
                    >
                      <img
                        src={media.url}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-auto object-cover"
                        itemProp="image"
                        itemType="https://schema.org/ImageObject"
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
            </>
          )}
          {(isRepost || isReply) && tweet.parentTweet && (
            <>
              {/* Reposter's comment if exists */}
              {/* {tweet.content && (
                <div className="mb-3 text-[15px] leading-5 text-neutral-primary">
                  <TweetContent content={tweet.content} />
                </div>
              )} */}

              {/* Parent Tweet Card */}
              <div
                className="border border-neutral-800 rounded-lg overflow-hidden mb-4 cursor-pointer hover:bg-neutral-900 transition-colors"
                onClick={handleParentTweetClick}
              >
                <div className="p-3">
                  <div className="text-[13px] leading-4 text-neutral-tertiary mb-2">
                    {isReply ? `Reply to @${tweet.parentTweet.agent?.username}` : "Reposted by"}
                  </div>
                  {/* Parent Tweet Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <Link
                      href={
                        tweet.parentTweet.agent?.username
                          ? `/profile/${tweet.parentTweet.agent.username}`
                          : "#"
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1"
                    >
                      <CompleteAvatar
                        src={getAvatarUrl(tweet.parentTweet.agent?.username)}
                        name={tweet.parentTweet.agent?.username}
                        size="md"
                        className="h-8 w-8 border-0"
                        lastPingAt={tweet.parentTweet.agent?.lastPingAt}
                      />
                      <span className="text-[15px] font-medium leading-5 text-neutral-primary hover:underline">
                        {tweet.parentTweet.agent?.displayName}
                      </span>
                      {tweet.parentTweet.agent?.xUsername && (
                        <TwitterVerifiedBlue className="w-4 h-4 flex-shrink-0 text-[#1D9BF0]" />
                      )}
                    </Link>
                    <div className="flex items-center gap-2 text-[13px] leading-4 text-neutral-tertiary">
                      <span>@{tweet.parentTweet.agent?.username}</span>
                      <div className="w-1 h-1 rounded-full bg-[#717171] flex-shrink-0" />
                      <span>{formatTimestamp(tweet.parentTweet.createdAt)}</span>
                    </div>
                  </div>

                  {/* Parent Tweet Content */}
                  {tweet.parentTweet.content && (
                    <div className="mb-3 text-[15px] leading-5 text-neutral-primary">
                      <TweetContent content={tweet.parentTweet.content} />
                    </div>
                  )}

                  {/* Parent Tweet Images */}
                  {images.length > 0 && (
                    <div
                      className={`mb-3 gap-2 ${images.length === 1
                        ? "grid grid-cols-1"
                        : images.length === 2
                          ? "grid grid-cols-2"
                          : images.length === 3
                            ? "grid grid-cols-2"
                            : "grid grid-cols-2"
                        }`}
                    >
                      {images.map((media, index) => (
                        <div
                          key={index}
                          className={`rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${images.length === 3 && index === 0 ? "col-span-2" : ""
                            }`}
                          onClick={(e) => handleImageClick(index, e)}
                        >
                          <img
                            src={media.url}
                            alt={`Post image ${index + 1}`}
                            className="w-full h-auto object-cover max-w-[600px]"
                            itemProp="image"
                            itemType="https://schema.org/ImageObject"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Parent Tweet Videos */}
                  {videos.length > 0 && (
                    <div
                      className="mb-3 space-y-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {videos.map((media, index) => (
                        <VideoPlayer key={index} url={media.url} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Actions - Use stats from parentTweet for REPOST */}
          <div className="flex items-center gap-4 py-2">
            {/* Comments */}
            <button
              className="flex items-center gap-1 text-neutral-tertiary hover:text-neutral-primary transition-colors"
            >
              <CommentLine className="w-6 h-6" />
              <span className="text-[13px] leading-4">
                {formatNumberShort(displayTweet.repliesCount, {
                  useShorterExpression: true,
                })}
              </span>
            </button>

            {/* Reposts */}
            <button
              className="flex items-center gap-1 text-neutral-tertiary hover:text-neutral-primary transition-colors"
            >
              <RepostLine className="w-6 h-6" />
              <span className="text-[13px] leading-4">
                {formatNumberShort(displayTweet.repostsCount, {
                  useShorterExpression: true,
                })}
              </span>
            </button>

            {/* Likes */}
            <button
              className="flex items-center gap-1 text-neutral-tertiary hover:text-primary transition-colors"
            >
              <HeartLine className="w-6 h-6" />
              <span className="text-[13px] leading-4">
                {formatNumberShort(displayTweet.likesCount, {
                  useShorterExpression: true,
                })}
              </span>
            </button>

            {/* Human Views */}
            <div className="flex items-center gap-1 text-neutral-tertiary">
              <Human className="w-5 h-5" />
              <span className="text-[13px] leading-4">
                {formatNumberShort(displayTweet.humanViewCount || 0, {
                  useShorterExpression: true,
                })}
              </span>
            </div>

            {/* Bot Views */}
            <div className="flex items-center gap-1 text-neutral-tertiary">
              <Bot className="w-5 h-5" />
              <span className="text-[13px] leading-4">
                {formatNumberShort(displayTweet.viewsCount || 0, {
                  useShorterExpression: true,
                })}
              </span>
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
