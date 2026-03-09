import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { likeSkill } from "@/services";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/utils";
import { toast } from "@/utils/toast";
import {
  Download,
  Edit,
  MoreHorizontal,
  Share2,
  Star,
  Trash2,
} from "lucide-react";
import { useRouter } from "@bprogress/next/app";
import { useEffect, useState } from "react";
import { AcademyItem } from "../type";

interface SkillCardProps {
  item: AcademyItem;
  onAddToAgent: () => void;
  onEdit?: (item: AcademyItem) => void;
  onDelete?: (itemId: string) => void;
}

export const SkillCard = ({
  item,
  onAddToAgent,
  onEdit,
  onDelete,
}: SkillCardProps) => {
  const router = useRouter();
  const { userInfo, isLoggedIn } = useAuthStore();
  const [likes, setLikes] = useState(item.likes);
  const [isLiked, setIsLiked] = useState(item.is_liked);
  const [isLiking, setIsLiking] = useState(false);

  // Sync state with props when item changes
  useEffect(() => {
    setLikes(item.likes);
    setIsLiked(item.is_liked);
  }, [item.likes, item.is_liked]);

  const isCurrentUserCreator =
    userInfo?.agents?.[0]?.username === item.author?.username && !!item.author?.username;

  const handleCardClick = () => {
    router.push(`/skill-market/${item.id}`);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error("Please log in to star this skill");
      return;
    }

    if (isLiking) return;

    const previousLikes = likes;
    const previousIsLiked = isLiked;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiking(true);

    try {
      const skillId = item.id;
      const response = (await likeSkill(skillId)) as any;

      // Update with actual response
      // Response might be wrapped in data property or be direct
      const responseData = response?.data || response;
      setIsLiked(responseData.liked);
      setLikes(responseData.like_count);

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

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-neutral-02 bg-bg-secondary hover:border-neutral-03 transition-colors cursor-pointer">
      <div
        onClick={handleCardClick}
        className="cursor-pointer  flex flex-col gap-4"
      >
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 border border-neutral-02">
              <AvatarImage src={item.author?.avatar} alt={item.author?.name} />
              <AvatarFallback>{item.author?.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-body-sm-bold text-neutral-primary">
                  {item.author?.name}
                </span>
                {isCurrentUserCreator && (
                  <Badge
                    variant="secondary"
                    type="tonal"
                    className="text-[#fe5631] bg-[rgba(254,86,49,0.12)] border-none font-medium text-[10px] shrink-0 uppercase h-6"
                  >
                    Your Agent
                  </Badge>
                )}
              </div>
              <span className="text-body-xs text-neutral-tertiary">
                {item.author?.handle}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!!isCurrentUserCreator && !!item.author && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="text-neutral-tertiary hover:text-neutral-primary transition-colors flex items-center justify-center h-10 w-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-neutral-02 border border-neutral-02"
                >
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(item);
                    }}
                    className="flex items-center gap-2 cursor-pointer hover:bg-overlay-light-5 rounded-md"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Delete clicked for item.id:", item.id);
                      onDelete?.(item.id);
                    }}
                    className="flex items-center gap-2 cursor-pointer text-danger hover:bg-danger-muted-10 rounded-md"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center flex-wrap">
            <h3 className="text-heading-xs text-neutral-primary font-bold line-clamp-1">
              {item.title}
            </h3>
          </div>
          {item.content && (
            <p className="text-body-sm text-neutral-secondary line-clamp-3">
              {item.content}
            </p>
          )}

        </div>

        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              type="tonal"
              className="text-neutral-tertiary bg-neutral-02 hover:bg-neutral-03 border-none font-normal text-xs"
            >
              #{tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-neutral-02 mt-auto">
        <div className="flex gap-4">
          <button
            className={cn(
              "flex items-center gap-1.5 transition-colors group",
              isLiking && "opacity-50 cursor-not-allowed",
              isLiked
                ? "text-yellow"
                : "text-neutral-tertiary hover:text-yellow"
            )}
            onClick={handleLike}
            disabled={isLiking}
          >
            <Star
              className={cn(
                "h-4 w-4 transition-colors",
                isLiked
                  ? "text-yellow fill-yellow-400"
                  : "text-neutral-tertiary group-hover:text-yellow group-hover:fill-yellow-400"
              )}
            />
            <span className="text-xs font-medium">{likes}</span>
          </button>

          <button
            className="flex items-center gap-1.5 text-neutral-tertiary hover:text-neutral-secondary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Download className="h-4 w-4" />
            <span className="text-xs font-medium">{item.uses} uses</span>
          </button>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            buttonType="ghost"
            className="h-8 w-8 p-0 text-neutral-tertiary hover:text-[#fe5631]"
            onClick={async (e) => {
              e.stopPropagation();
              try {
                const detailUrl = `${window.location.origin}/skill-market/${item.id}`;
                await navigator.clipboard.writeText(detailUrl);
                toast.success("Detail link copied!");
              } catch (error) {
                toast.error("Failed to copy link");
              }
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs bg-[#fe5631] text-white hover:bg-[#ff6d47]"
            onClick={(e) => {
              e.stopPropagation();
              onAddToAgent();
            }}
          >
            Add to Agent
          </Button>
        </div>
      </div>
    </div>
  );
};
