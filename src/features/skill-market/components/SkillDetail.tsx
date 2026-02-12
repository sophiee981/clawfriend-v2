"use client";

import { CompleteAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import {
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { GetSkillResponse } from "@/interfaces/academy";
import { getSkill, likeSkill } from "@/services";
import { deleteSkill } from "@/services/academy.service";
import { useAuthStore } from "@/stores/auth.store";
import { cn, formatTimestamp, getAvatarUrl } from "@/utils";
import { toast } from "@/utils/toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  Check,
  Code2,
  Copy,
  Download,
  Pencil,
  Share2,
  Star,
  Terminal,
  Trash2,
  User,
} from "lucide-react";
import { useRouter } from "@bprogress/next/app";
import { useEffect, useState } from "react";
import { AddToAgentModal } from "./AddToAgentModal";
import { CreateAcademyItemModal } from "./CreateAcademyItemModal";

interface SkillDetailProps {
  itemId: string;
  defaultSkill: GetSkillResponse;
}

export const SkillDetail = ({ itemId, defaultSkill }: SkillDetailProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userInfo, isLoggedIn } = useAuthStore();
  const [isAddToAgentOpen, setIsAddToAgentOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { data: skill } = useQuery({
    queryKey: ["skill", itemId],
    queryFn: async () => {
      const response = await getSkill(itemId);
      return response.data;
    },
    enabled: !!itemId,
    placeholderData: defaultSkill,
  });

  const [likes, setLikes] = useState(skill?.like_count ?? 0);
  const [isLiked, setIsLiked] = useState(skill?.is_liked ?? false);
  const [isLiking, setIsLiking] = useState(false);

  // Update local state when skill data changes
  useEffect(() => {
    if (skill) {
      setLikes(skill.like_count);
      setIsLiked(skill.is_liked);
    }
  }, [skill]);

  const handleLike = async () => {
    if (!isLoggedIn) {
      toast.error("Please login to star a skill");
      return;
    }

    if (isLiking || !skill) return;

    const previousLikes = likes;
    const previousIsLiked = isLiked;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiking(true);

    try {
      const skillId = skill.id;
      const response = (await likeSkill(skillId)) as any;

      // Update with actual response
      // Response might be wrapped in data property or be direct
      const responseData = response?.data || response;
      setIsLiked(responseData.liked);
      setLikes(responseData.like_count);

      // Invalidate query to sync with server
      queryClient.invalidateQueries({ queryKey: ["skill", itemId] });

      toast.success(
        responseData.liked ? "Starred this skill" : "Unstarred this skill"
      );
    } catch (error: any) {
      // Rollback on error
      setIsLiked(previousIsLiked);
      setLikes(previousLikes);

      const errorMessage =
        error?.error || error?.message || "Failed to star skill";
      toast.error(errorMessage);
    } finally {
      setIsLiking(false);
    }
  };

  const isOwner = userInfo?.owner?.x_handle === skill?.creator?.owner_x_handle;

  const handleDelete = async () => {
    if (!skill) return;
    setIsDeleting(true);
    try {
      await deleteSkill(skill.id);
      toast.success("Skill deleted successfully");
      router.push("/skill-market");
    } catch (error) {
      console.error("Failed to delete skill:", error);
      toast.error("Failed to delete skill");
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  const handleEditSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["skill", itemId] });
    setIsEditOpen(false);
  };

  const handleCopy = () => {
    if (!skill) return;

    let textToCopy = "";
    if (skill.type === "skill") {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.clawfriend.ai";
      textToCopy = `1. Read file ~/.openclaw/workspace/skills/clawfriend/preferences/install-community-skill.md
2. Follow instruction and Download ClawFriend community skill: ${apiBaseUrl}/v1/skill-market/${skill.id}/SKILL.md`;
    } else {
      textToCopy = skill.content;
    }

    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleShareLink = () => {
    if (!skill) return;

    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl);
    toast.success("Link copied to clipboard!");
  };

  const content = skill?.content || "";

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
          onClick={() => router.push("/skill-market")}
          variant="secondary"
          buttonType="outline"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col flex-1 w-full max-w-5xl mx-auto p-3 sm:p-4 md:p-8 gap-4 sm:gap-8 pb-20 overflow-hidden lg:h-screen">
      {/* Navigation Header */}
      <div
        className="flex items-center gap-2 sm:gap-3 text-neutral-tertiary hover:text-neutral-secondary transition-colors cursor-pointer group"
        onClick={() => router.push("/skill-market")}
      >
        <Button
          variant="secondary"
          buttonType="ghost"
          size="sm"
          className="rounded-full w-7 h-7 sm:w-8 sm:h-8 p-0 text-neutral-secondary group-hover:text-neutral-primary group-hover:bg-neutral-02"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
        <span className="text-xs sm:text-label-sm">Back to Skill Market</span>
      </div>

      <div className="flex flex-col max-lg:flex-col-reverse lg:flex-row items-start overflow-auto lg:overflow-hidden flex-1 min-h-0 scrollbar-hide">
        {/* Left Column: Info & Meta */}
        <div className="flex flex-col gap-4 sm:gap-6 overflow-visible lg:overflow-auto overflow-x-hidden lg:flex-1 min-h-0 lg:max-h-full scrollbar-hide lg:scrollbar-hover-hide pr-0 lg:pr-6">
          {/* Header Card */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2 sm:gap-4">
              <div className="flex flex-col gap-2 sm:gap-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <Badge
                    type="tonal"
                    className="uppercase tracking-wider font-semibold text-[9px] sm:text-[10px] px-2 sm:px-2.5 rounded-md"
                  >
                    {skill.type}
                  </Badge>
                  {!skill.is_active && (
                    <Badge
                      variant="secondary"
                      type="outline"
                      className="text-[9px] sm:text-[10px] px-2 sm:px-2.5"
                    >
                      Inactive
                    </Badge>
                  )}
                  {skill.created_at && (
                    <span className="text-[10px] sm:text-body-xs text-neutral-tertiary flex items-center gap-1 sm:gap-1.5">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {formatTimestamp(skill.created_at)}
                    </span>
                  )}
                </div>
                <h1 className="text-lg sm:text-heading-lg md:text-display-xs font-bold text-neutral-primary tracking-tight leading-tight">
                  {skill.name}
                </h1>
              </div>

              <div className="flex gap-1 sm:gap-2 shrink-0">
                {/* Only show if we implement sharing properly, for now just a button */}
                {isOwner && (
                  <>
                    <Button
                      variant="secondary"
                      buttonType="ghost"
                      size="sm"
                      className="rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 text-neutral-tertiary hover:text-neutral-primary hover:bg-neutral-02 transition-all duration-300 hover:scale-105"
                      onClick={() => setIsEditOpen(true)}
                    >
                      <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      buttonType="ghost"
                      size="sm"
                      className="rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 text-neutral-tertiary hover:text-danger hover:bg-danger-muted-10 transition-all duration-300 hover:scale-105"
                      onClick={() => setIsDeleteOpen(true)}
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Button>
                  </>
                )}
                <Button
                  variant="secondary"
                  buttonType="ghost"
                  size="sm"
                  className="rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0 text-neutral-tertiary hover:text-neutral-primary hover:bg-neutral-02"
                  onClick={handleShareLink}
                >
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Button>
              </div>
            </div>

            {skill.tags && skill.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                {skill.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    type="tonal"
                    className="px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs"
                  >
                    #{tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="h-px w-full bg-neutral-02" />

          {/* Config Preview */}
          <div className="flex flex-col gap-3 sm:gap-4 pt-3 sm:pt-4 ">
            <div className="flex items-center justify-between px-1 gap-2">
              <div className="flex items-center gap-2 sm:gap-2.5 text-neutral-primary">
                <div className="p-1 sm:p-1.5 bg-brand-primary/10 rounded-md">
                  <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-bold tracking-tight">Prompt</h3>
              </div>
              <Button
                size="sm"
                variant="secondary"
                buttonType="outline"
                className={cn(
                  "gap-1 sm:gap-1.5 text-[10px] sm:text-xs h-7 sm:h-8 transition-all duration-200 shadow-sm shrink-0",
                  isCopied
                    ? "border-success text-success bg-success-muted-20"
                    : "border-neutral-03 bg-bg-primary hover:bg-neutral-01 hover:border-neutral-secondary"
                )}
                onClick={handleCopy}
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">Copy Prompt</span>
                  </>
                )}
              </Button>
            </div>

            <div className="relative group rounded-lg sm:rounded-xl border border-neutral-03 bg-neutral-03 overflow-hidden shadow-xl ring-1 ring-black/5 transition-all hover:shadow-2xl">
              <div className="absolute top-0 w-full h-8 sm:h-10 bg-neutral-03 border-b border-neutral-03 flex items-center justify-between px-3 sm:px-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56] shadow-inner" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e] shadow-inner" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f] shadow-inner" />
                </div>
              </div>
              <div className="p-4 sm:p-6 pt-12 sm:pt-14">
                <MarkdownRenderer content={content} className="!max-w-[calc(100vw-48px-48px)] md:!max-w-[calc(100vw-256px-64px-48px-12px)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Actions */}
        <div className="flex flex-col gap-4 sm:gap-6 w-full lg:w-1/3 mt-4 sm:mt-6 lg:mt-0">
          {/* Creator Card */}
          {skill.creator && (
            <div className="group bg-neutral-01/80 border border-neutral-02 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:border-neutral-03 hover:-translate-y-1">
              <span className="text-[10px] sm:text-xs font-bold text-neutral-tertiary uppercase tracking-wider flex items-center gap-1.5 sm:gap-2">
                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Created By
              </span>
              <div className="flex items-center gap-3 sm:gap-4">
                <CompleteAvatar
                  src={
                    skill.creator.avatar ||
                    getAvatarUrl(skill.creator.owner_x_handle)
                  }
                  name={skill.creator.owner_x_name || skill.creator.username}
                  size="lg"
                  className="w-12 h-12 sm:w-14 sm:h-14 border-2 sm:border-4 border-bg-primary shadow-sm shrink-0"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm sm:text-body-lg font-bold text-neutral-primary truncate group-hover:text-brand-primary transition-colors">
                    {skill.creator.owner_x_name || skill.creator.username}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-body-sm text-neutral-tertiary truncate">
                      @{skill.creator.owner_x_handle}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions & Stats Card */}
          <div className="bg-neutral-01/80 border border-neutral-02 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col gap-6 sm:gap-8 shadow-sm backdrop-blur-sm">
            <div className="text-center pb-2 border-b border-neutral-02/50">
              <span className="text-[10px] sm:text-xs font-bold text-neutral-tertiary uppercase tracking-wider">
                Community Stats
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 relative">
              <div className="absolute left-1/2 top-2 bottom-2 w-px bg-neutral-02 -translate-x-1/2" />

              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl sm:text-3xl font-black text-neutral-primary tracking-tight">
                  {likes}
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-neutral-secondary uppercase tracking-wider">
                  Stars
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl sm:text-3xl font-black text-neutral-primary tracking-tight">
                  {skill.download_count}
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-neutral-secondary uppercase tracking-wider">
                  Downloads
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3 mt-2">
              <Button
                variant={isLiked ? "primary" : "secondary"}
                buttonType={isLiked ? "tonal" : "outline"}
                className={cn(
                  "w-full justify-center transition-all duration-300 text-sm sm:text-base h-9 sm:h-10",
                  isLiked &&
                  "text-yellow bg-yellow-muted hover:bg-yellow-muted/150",
                  isLiking && "opacity-50 cursor-not-allowed"
                )}
                onClick={handleLike}
                disabled={isLiking}
              >
                <Star
                  className={cn(
                    "w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 transition-transform duration-300",
                    isLiked
                      ? "text-yellow fill-yellow-400 scale-110"
                      : "text-neutral-tertiary scale-100",
                    isLiking && "animate-pulse"
                  )}
                />
                {isLiked ? "Starred Skill" : "Star Skill"}
              </Button>

              <Button
                variant="primary"
                className="w-full justify-center shadow-lg shadow-primary-muted-10 hover:shadow-primary-muted-20 transition-all text-sm sm:text-base h-9 sm:h-10"
                onClick={() => setIsAddToAgentOpen(true)}
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Add to Agent
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AddToAgentModal
        open={isAddToAgentOpen}
        onOpenChange={setIsAddToAgentOpen}
        item={
          skill
            ? {
              id: skill.id,
              title: skill.name,
              content: skill.content,
              author: skill.creator
                ? {
                  name:
                    skill.creator.display_name || skill.creator.username,
                  avatar:
                    skill.creator.avatar ||
                    getAvatarUrl(skill.creator.username),
                  handle: skill.creator.username,
                  username: skill.creator.username,
                }
                : undefined,
              type: skill.type as "skill" | "prompt",
              tags: skill.tags.map((tag) => tag.name),
              likes: skill.like_count,
              uses: skill.download_count,
              is_liked: skill.is_liked,
              createdAt: skill.created_at,
            }
            : null
        }
      />

      {skill && (
        <CreateAcademyItemModal
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          editItem={{
            id: skill.id,
            title: skill.name,
            content: skill.content,
            author: skill.creator
              ? {
                name: skill.creator.display_name || skill.creator.username,
                avatar:
                  skill.creator.avatar ||
                  getAvatarUrl(skill.creator.username),
                handle: skill.creator.owner_x_handle || "",
                username: skill.creator.username,
              }
              : undefined,
            type: skill.type as "skill" | "prompt",
            tags: skill.tags.map((tag) => tag.name),
            likes: skill.like_count,
            uses: skill.download_count,
            is_liked: skill.is_liked,
            createdAt: skill.created_at,
          }}
          onSuccess={handleEditSuccess}
        />
      )}

      <Modal open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <ModalContent className="max-w-[400px] border-neutral-02">
          <ModalHeader>
            <ModalTitle>Delete Skill</ModalTitle>
          </ModalHeader>
          <div className="py-4 text-neutral-secondary">
            Are you sure you want to delete this skill? This action cannot be
            undone.
          </div>
          <ModalFooter>
            <Button
              variant="secondary"
              buttonType="ghost"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
