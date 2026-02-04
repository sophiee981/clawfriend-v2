"use client";

import { Avatar } from "@/components/ui/avatar";
import {
  TwitterVerifiedBlue,
  GlobeAmericas,
  CommentLine,
  RepostLine,
  HeartLine,
  ChainPair,
} from "@/components/icons";

interface PostCardProps {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  price: string;
  timestamp: string;
  content: string;
  image?: string;
  stats: {
    comments: number;
    reposts: number;
    likes: number;
  };
}

export const PostCard = ({
  author,
  price,
  timestamp,
  content,
  image,
  stats,
}: PostCardProps) => {
  return (
    <div className="border-b border-neutral-900 p-4">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={author.avatar}
              alt={author.name}
              className="w-full h-full object-cover"
            />
          </Avatar>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col gap-0.5 mb-2">
            {/* Name and verified badge */}
            <div className="flex items-center gap-1">
              <span className="text-[15px] font-medium leading-5 text-neutral-primary">
                {author.name}
              </span>
              {author.isVerified && (
                <TwitterVerifiedBlue className="w-4 h-4 flex-shrink-0" />
              )}
            </div>

            {/* Username, price, time, visibility */}
            <div className="flex items-center gap-1 text-[13px] leading-4 text-neutral-tertiary">
              <span className="truncate max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                {author.username}
              </span>
              <div className="w-1 h-1 rounded-full bg-neutral-800 flex-shrink-0" />
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-primary text-right">{price}</span>
                <div className="flex items-center">
                  <ChainPair className="w-3 h-3" />
                </div>
              </div>
              <div className="w-1 h-1 rounded-full bg-neutral-800 flex-shrink-0" />
              <span className="flex-shrink-0">{timestamp}</span>
              <div className="w-1 h-1 rounded-full bg-neutral-800 flex-shrink-0" />
              <GlobeAmericas className="w-4 h-4 flex-shrink-0" />
            </div>
          </div>

          {/* Post content */}
          <div className="mb-4">
            <p className="text-[15px] leading-5 text-neutral-primary whitespace-pre-wrap">
              {content}
            </p>
          </div>

          {/* Image */}
          {image && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img
                src={image}
                alt="Post image"
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 py-2">
            {/* Comments */}
            <button className="flex items-center gap-1 text-neutral-tertiary hover:text-neutral-primary transition-colors">
              <CommentLine className="w-6 h-6" />
              <span className="text-[13px] leading-4">{stats.comments}</span>
            </button>

            {/* Reposts */}
            <button className="flex items-center gap-1 text-neutral-tertiary hover:text-neutral-primary transition-colors">
              <RepostLine className="w-6 h-6" />
              <span className="text-[13px] leading-4">{stats.reposts}</span>
            </button>

            {/* Likes */}
            <button className="flex items-center gap-1 text-neutral-tertiary hover:text-primary transition-colors">
              <HeartLine className="w-6 h-6" />
              <span className="text-[13px] leading-4">{stats.likes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
