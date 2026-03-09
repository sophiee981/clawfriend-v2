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
import { TweetContent } from "@/features/feeds/components/PostCard";
import type { Tweet } from "@/interfaces/feeds";
import { formatTimestamp, getAvatarUrl } from "@/utils";
import { formatNumberShort } from "@/utils/number";
import Link from "next/link";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { trackTweetView } from "@/services/feeds.service";
import { useTrackView } from "@/hooks/useTrackView";

interface MainPostCardProps {
  tweet: Tweet;
}

export const MainPostCard = ({ tweet }: MainPostCardProps) => {
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
      const targetId = tweet?.type === "REPOST" && tweet?.parentTweet
        ? tweet.parentTweet.id
        : tweet?.id;
      if (targetId) {
        trackView(targetId);
      }
    },
    {
      threshold: 0.5,
      rootMargin: "0px",
      minVisibleTime: 500,
    }
  );

  // For REPOST type, use parentTweet for stats and content
  const isRepost = tweet?.type === "REPOST";
  const displayTweet = isRepost && tweet?.parentTweet ? tweet.parentTweet : tweet;

  const images = displayTweet?.medias?.filter((m) => m.type === "image") || [];
  const videos = displayTweet?.medias?.filter((m) => m.type === "video") || [];

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setViewerOpen(true);
  };

  return (
    <div
      ref={trackViewRef}
      className="border-b border-neutral-02 p-4"
    >
      {/* Repost Indicator */}
      {isRepost && (
        <div className="flex items-center gap-2 mb-2 text-[13px] text-neutral-tertiary">
          <RepostLine />
          <Link
            href={
              tweet?.agent?.username ? `/profile/${tweet?.agent.username}` : "#"
            }
            className="hover:underline"
          >
            <span className="font-medium text-neutral-primary">
              {tweet?.agent?.displayName}
            </span>
          </Link>
          <span>reposted</span>
        </div>
      )}

      {/* Header with Avatar */}
      <div className="flex gap-4 mb-4">
        {/* Avatar */}
        <div className="shrink-0">
          <Link
            href={
              tweet?.agent?.username ? `/profile/${tweet?.agent.username}` : "#"
            }
          >
            <CompleteAvatar
              src={getAvatarUrl(tweet?.agent?.username)}
              name={tweet?.agent?.username}
              size="lg"
              className="h-10 w-10 border-0 cursor-pointer hover:opacity-80 transition-opacity"
              lastPingAt={tweet.agent?.lastPingAt}
            />
          </Link>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isRepost && tweet?.parentTweet ? (
            <>
              {/* Reposter's comment if exists */}
              {/* {tweet.content && (
                <div className="mb-3 text-[18px] leading-5 text-neutral-primary">
                  <TweetContent content={tweet.content} />
                </div>
              )} */}

              {/* Parent Tweet Card */}
              <div className="border border-neutral-800 rounded-lg overflow-hidden mb-4">
                <div className="p-3">
                  {/* Parent Tweet Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <Link
                      href={
                        tweet.parentTweet.agent?.username
                          ? `/profile/${tweet.parentTweet.agent.username}`
                          : "#"
                      }
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
                  {images?.length > 0 && (
                    <div
                      className={`mb-3 gap-2 ${images?.length === 1
                        ? "grid grid-cols-1"
                        : images?.length === 2
                          ? "grid grid-cols-2"
                          : images?.length === 3
                            ? "grid grid-cols-2"
                            : "grid grid-cols-2"
                        }`}
                    >
                      {images?.map((media, index) => (
                        <div
                          key={index}
                          className={`rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${images?.length === 3 && index === 0 ? "col-span-2" : ""
                            }`}
                          onClick={() => handleImageClick(index)}
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

                  {/* Parent Tweet Videos */}
                  {videos?.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {videos?.map((media, index) => (
                        <VideoPlayer key={index} url={media.url} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Normal Tweet Layout - Header */}
              <div className="flex flex-col gap-0.5 mb-2">
                {/* Name and verified badge */}
                <div className="flex items-center gap-1">
                  <Link
                    href={
                      tweet?.agent?.username
                        ? `/profile/${tweet?.agent.username}`
                        : "#"
                    }
                  >
                    <span className="text-[15px] font-medium leading-5 text-neutral-primary cursor-pointer hover:underline">
                      {tweet?.agent?.displayName}
                    </span>
                  </Link>
                  {tweet?.agent?.xUsername && (
                    <TwitterVerifiedBlue className="w-4 h-4 flex-shrink-0 text-[#1D9BF0]" />
                  )}
                </div>

                {/* Username, price, time, visibility */}
                <div className="flex items-center gap-2 text-[13px] leading-4 text-neutral-tertiary">
                  <span className="truncate max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                    @{tweet?.agent?.username}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-[#717171] opacity-60 flex-shrink-0" />
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-primary text-right">
                      {formatNumberShort(tweet?.agent?.sharePriceBNB)}
                    </span>
                    <div className="flex items-center">
                      <ChainPair className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-[#717171] opacity-60 flex-shrink-0" />
                  <span className="flex-shrink-0">
                    {formatTimestamp(tweet?.createdAt)}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-[#717171] opacity-60 flex-shrink-0" />
                  <GlobeAmericas className="w-4 h-4 flex-shrink-0" />
                </div>
              </div>

              {/* Post content */}
              {displayTweet?.content && (
                <div className="mb-4 text-[18px] leading-5 text-neutral-primary">
                  <TweetContent content={displayTweet.content} />
                </div>
              )}

              {/* Images */}
              {images?.length > 0 && (
                <div
                  className={`mb-4 gap-2 ${images?.length === 1
                    ? "grid grid-cols-1"
                    : images?.length === 2
                      ? "grid grid-cols-2"
                      : images?.length === 3
                        ? "grid grid-cols-2"
                        : "grid grid-cols-2"
                    }`}
                >
                  {images?.map((media, index) => (
                    <div
                      key={index}
                      className={`rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ${images?.length === 3 && index === 0 ? "col-span-2" : ""
                        }`}
                      onClick={() => handleImageClick(index)}
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
              {videos?.length > 0 && (
                <div className="mb-4 space-y-2">
                  {videos?.map((media, index) => (
                    <VideoPlayer key={index} url={media.url} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Stats Bar - Use stats from parentTweet for REPOST */}
      <div className="flex items-center justify-around py-3 text-[11px] sm:text-[13px] leading-4 text-neutral-tertiary border-t border-neutral-02">
        <div className="flex items-center gap-1">
          <span className="font-medium text-neutral-primary">
            {formatNumberShort(displayTweet?.repliesCount, {
              useShorterExpression: true,
            })}
          </span>
          <span>Replies</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium text-neutral-primary">
            {formatNumberShort(displayTweet?.repostsCount, {
              useShorterExpression: true,
            })}
          </span>
          <span>Reposts</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium text-neutral-primary">
            {formatNumberShort(displayTweet?.likesCount, {
              useShorterExpression: true,
            })}
          </span>
          <span>Likes</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium text-neutral-primary">
            {formatNumberShort(displayTweet?.humanViewCount || 0, {
              useShorterExpression: true,
            })}
          </span>
          <span>Human Views</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium text-neutral-primary">
            {formatNumberShort(displayTweet?.viewsCount || 0)}
          </span>
          <span>Agent Views</span>
        </div>
      </div>

      {/* Action Bar - aligned to left edge */}
      <div className="flex items-center justify-around pt-3 border-t border-neutral-02">
        {/* Comment */}
        <CommentLine className="w-6 h-6 text-neutral-tertiary" />

        {/* Repost */}
        <RepostLine className="w-6 h-6 text-neutral-tertiary" />

        {/* Like */}
        <HeartLine className="w-6 h-6 text-neutral-tertiary" />

        <Human className="w-6 h-6 text-neutral-tertiary" />

        <Bot className="w-6 h-6 text-neutral-tertiary" />
      </div>

      {/* Image Viewer Modal */}
      {viewerOpen && (
        <ImageViewer
          images={images || []}
          initialIndex={selectedImageIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
};
