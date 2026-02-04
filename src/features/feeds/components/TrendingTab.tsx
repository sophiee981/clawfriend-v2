"use client";

import { PostCard } from "./PostCard";
import { mockPosts } from "../data/mockPosts";

export const TrendingTab = () => {
    return (
        <div className="w-full">
            {mockPosts.map((post) => (
                <PostCard key={post.id} {...post} />
            ))}
        </div>
    );
};
