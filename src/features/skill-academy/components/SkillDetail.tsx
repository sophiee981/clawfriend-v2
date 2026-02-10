"use client";

import { CompleteAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getSkill, likeSkill } from "@/services";
import { cn, formatTimestamp, getAvatarUrl } from "@/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Check,
  Code2,
  Copy,
  Download,
  Heart,
  Share2,
  Terminal,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddToAgentModal } from "./AddToAgentModal";

interface SkillDetailProps {
  itemId: string;
}

export const SkillDetail = ({ itemId }: SkillDetailProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAddToAgentOpen, setIsAddToAgentOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const {
    data: skill,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["skill", itemId],
    queryFn: async () => {
      const response = await getSkill(itemId);
      return response.data;
    },
    enabled: !!itemId,
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: () => likeSkill(Number(itemId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skill", itemId] });
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleCopy = () => {
    if (skill?.content) {
      navigator.clipboard.writeText(skill.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const content = skill?.content || "";

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 gap-8 pb-20">
        {/* Navigation Header Skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton customWidth="32px" customHeight="32px" variant="circle" />
          <Skeleton customWidth="120px" customHeight="16px" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Info & Meta Skeleton */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Header Card Skeleton */}
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-3 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Skeleton customWidth="80px" customHeight="20px" />
                    <Skeleton customWidth="60px" customHeight="20px" />
                    <Skeleton customWidth="100px" customHeight="16px" />
                  </div>
                  <Skeleton customWidth="85%" customHeight="32px" />
                </div>
                <Skeleton
                  customWidth="40px"
                  customHeight="40px"
                  variant="circle"
                />
              </div>

              <div className="space-y-2 mt-2">
                <Skeleton customWidth="100%" customHeight="20px" />
                <Skeleton customWidth="95%" customHeight="20px" />
                <Skeleton customWidth="80%" customHeight="20px" />
              </div>

              {/* Tags Skeleton */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Skeleton customWidth="60px" customHeight="24px" />
                <Skeleton customWidth="80px" customHeight="24px" />
                <Skeleton customWidth="70px" customHeight="24px" />
              </div>
            </div>

            <div className="h-px w-full bg-neutral-02" />

            {/* Config Preview Skeleton */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton customWidth="20px" customHeight="20px" />
                  <Skeleton customWidth="100px" customHeight="20px" />
                </div>
                <Skeleton customWidth="80px" customHeight="32px" />
              </div>

              <div className="relative rounded-xl border border-neutral-02 bg-neutral-01 overflow-hidden shadow-sm">
                <div className="absolute top-0 w-full h-8 bg-neutral-02/50 border-b border-neutral-02 flex items-center px-3 gap-1.5">
                  <Skeleton
                    customWidth="10px"
                    customHeight="10px"
                    variant="circle"
                  />
                  <Skeleton
                    customWidth="10px"
                    customHeight="10px"
                    variant="circle"
                  />
                  <Skeleton
                    customWidth="10px"
                    customHeight="10px"
                    variant="circle"
                  />
                </div>
                <div className="p-4 pt-10 space-y-2">
                  <Skeleton customWidth="100%" customHeight="16px" />
                  <Skeleton customWidth="95%" customHeight="16px" />
                  <Skeleton customWidth="90%" customHeight="16px" />
                  <Skeleton customWidth="85%" customHeight="16px" />
                  <Skeleton customWidth="92%" customHeight="16px" />
                  <Skeleton customWidth="88%" customHeight="16px" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Actions Skeleton */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-6">
            {/* Creator Card Skeleton */}
            <div className="bg-bg-secondary border border-neutral-02 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
              <Skeleton customWidth="100px" customHeight="12px" />
              <div className="flex items-center gap-4">
                <Skeleton
                  variant="circle"
                  customWidth="48px"
                  customHeight="48px"
                />
                <div className="flex flex-col gap-2 flex-1">
                  <Skeleton customWidth="120px" customHeight="18px" />
                  <Skeleton customWidth="100px" customHeight="14px" />
                </div>
              </div>
            </div>

            {/* Actions & Stats Card Skeleton */}
            <div className="bg-bg-secondary border border-neutral-02 rounded-2xl p-5 flex flex-col gap-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-02">
                <Skeleton customWidth="120px" customHeight="16px" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <Skeleton customWidth="40px" customHeight="24px" />
                  <Skeleton customWidth="80px" customHeight="14px" />
                </div>
                <div className="flex flex-col gap-1">
                  <Skeleton customWidth="40px" customHeight="24px" />
                  <Skeleton customWidth="100px" customHeight="14px" />
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <Skeleton customWidth="100%" customHeight="44px" />
                <Skeleton customWidth="100%" customHeight="44px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !itemId) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-neutral-02 flex items-center justify-center text-neutral-tertiary">
          <Terminal className="w-8 h-8" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-heading-sm text-neutral-primary">
            Failed to load skill
          </h3>
          <p className="text-neutral-tertiary">
            {error
              ? "Something went wrong while fetching the data."
              : "Invalid skill ID provided."}
          </p>
        </div>
        <Button
          onClick={() => router.back()}
          variant="secondary"
          buttonType="outline"
        >
          Go Back
        </Button>
      </div>
    );
  }

  // Not found state
  if (!skill) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-neutral-02 flex items-center justify-center text-neutral-tertiary">
          <Terminal className="w-8 h-8" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-heading-sm text-neutral-primary">
            Skill not found
          </h3>
          <p className="text-neutral-tertiary">
            The skill you are looking for does not exist or has been removed.
          </p>
        </div>
        <Button
          onClick={() => router.back()}
          variant="secondary"
          buttonType="outline"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 gap-8 pb-20 overflow-hidden">
      {/* Navigation Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          buttonType="ghost"
          size="sm"
          className="rounded-full w-8 h-8 p-0 text-neutral-secondary hover:text-neutral-primary hover:bg-neutral-02"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <span
          className="text-body-sm font-medium text-neutral-tertiary hover:text-neutral-secondary transition-colors cursor-pointer"
          onClick={() => router.back()}
        >
          Back to Academy
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Info & Meta */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Header Card */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="custom-indigo"
                    type="tonal"
                    className="uppercase tracking-wider font-semibold text-[10px] px-2.5 rounded-md"
                  >
                    {skill.type}
                  </Badge>
                  {!skill.is_active && (
                    <Badge
                      variant="secondary"
                      type="outline"
                      className="text-[10px] px-2.5"
                    >
                      Inactive
                    </Badge>
                  )}
                  {skill.created_at && (
                    <span className="text-body-xs text-neutral-tertiary flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatTimestamp(skill.created_at)}
                    </span>
                  )}
                </div>
                <h1 className="text-heading-lg md:text-display-xs font-bold text-neutral-primary tracking-tight leading-tight">
                  {skill.name}
                </h1>
              </div>

              <div className="flex gap-2 shrink-0">
                {/* Only show if we implement sharing properly, for now just a button */}
                <Button
                  variant="secondary"
                  buttonType="ghost"
                  size="sm"
                  className="rounded-full w-10 h-10 p-0 text-neutral-tertiary hover:text-neutral-primary hover:bg-neutral-02"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <p className="text-body-lg text-neutral-tertiary leading-relaxed">
              {skill.description}
            </p>

            {skill.tags && skill.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {skill.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    type="tonal"
                    className="px-3 py-1 text-xs"
                  >
                    #{tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="h-px w-full bg-neutral-02" />

          {/* Config Preview */}
          <div className="flex flex-col gap-4 pt-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5 text-neutral-primary">
                <div className="p-1.5 bg-brand-primary/10 rounded-md">
                  <Code2 className="w-5 h-5 text-brand-primary" />
                </div>
                <h3 className="text-lg font-bold tracking-tight">
                  Configuration
                </h3>
              </div>
              <Button
                size="sm"
                variant="secondary"
                buttonType="outline"
                className={cn(
                  "gap-1.5 text-xs h-8 transition-all duration-200 shadow-sm",
                  isCopied
                    ? "border-success text-success bg-success-muted-20"
                    : "border-neutral-03 bg-bg-primary hover:bg-neutral-01 hover:border-neutral-secondary",
                )}
                onClick={handleCopy}
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Config
                  </>
                )}
              </Button>
            </div>

            <div className="relative group rounded-xl border border-neutral-03 bg-[#1e1e1e] overflow-hidden shadow-xl ring-1 ring-black/5 transition-all hover:shadow-2xl">
              <div className="absolute top-0 w-full h-10 bg-[#252526] border-b border-[#3e3e42] flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-inner" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-inner" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-inner" />
                </div>
              </div>
              <div className="p-6 pt-14 overflow-x-auto custom-scrollbar">
                {content}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Actions */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-6">
          {/* Creator Card */}
          {skill.creator && (
            <div className="group bg-neutral-01/80 border border-neutral-02 rounded-2xl p-5 flex flex-col gap-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:border-neutral-03 hover:-translate-y-1">
              <span className="text-xs font-bold text-neutral-tertiary uppercase tracking-wider flex items-center gap-2">
                <User className="w-3.5 h-3.5" />
                Created By
              </span>
              <div className="flex items-center gap-4">
                <CompleteAvatar
                  src={
                    skill.creator.avatar || getAvatarUrl(skill.creator.username)
                  }
                  name={skill.creator.display_name || skill.creator.username}
                  size="lg"
                  className="w-14 h-14 border-4 border-bg-primary shadow-sm"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-body-lg font-bold text-neutral-primary truncate group-hover:text-brand-primary transition-colors">
                    {skill.creator.display_name || skill.creator.username}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-body-sm text-neutral-tertiary truncate">
                      @{skill.creator.username}
                    </span>
                    {skill.creator.x_username && (
                      <span className="flex items-center gap-1 text-[10px] text-neutral-tertiary bg-neutral-02 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions & Stats Card */}
          <div className="bg-neutral-01/80 border border-neutral-02 rounded-2xl p-6 flex flex-col gap-8 shadow-sm backdrop-blur-sm">
            <div className="text-center pb-2 border-b border-neutral-02/50">
              <span className="text-xs font-bold text-neutral-tertiary uppercase tracking-wider">
                Community Stats
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 relative">
              <div className="absolute left-1/2 top-2 bottom-2 w-px bg-neutral-02 -translate-x-1/2" />

              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-black text-neutral-primary tracking-tight">
                  {skill.like_count}
                </span>
                <span className="text-xs font-medium text-neutral-secondary uppercase tracking-wider">
                  Likes
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-black text-neutral-primary tracking-tight">
                  {skill.download_count}
                </span>
                <span className="text-xs font-medium text-neutral-secondary uppercase tracking-wider">
                  Downloads
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <Button
                variant={skill.is_liked ? "primary" : "secondary"}
                buttonType={skill.is_liked ? "tonal" : "outline"}
                className={cn(
                  "w-full justify-center transition-all duration-300",
                  skill.is_liked &&
                    "text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20",
                )}
                onClick={handleLike}
                disabled={likeMutation.isPending}
              >
                <Heart
                  className={cn(
                    "w-4 h-4 mr-2 transition-transform duration-300",
                    skill.is_liked ? "fill-current scale-110" : "scale-100",
                    likeMutation.isPending && "animate-pulse",
                  )}
                />
                {skill.is_liked ? "Liked Skill" : "Like Skill"}
              </Button>

              <Button
                size="lg"
                variant="primary"
                className="w-full justify-center shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/30 transition-all"
                onClick={() => setIsAddToAgentOpen(true)}
              >
                <Download className="w-5 h-5 mr-2" />
                Add to Agent
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AddToAgentModal
        open={isAddToAgentOpen}
        onOpenChange={setIsAddToAgentOpen}
        skill={skill}
      />
    </div>
  );
};
