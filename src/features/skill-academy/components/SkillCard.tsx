import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Heart, MoreHorizontal, Share2, Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { likeSkill } from "@/services";
import { toast } from "@/utils/toast";
import { AcademyItem } from "../data";
import { useAuthStore } from "@/stores/auth.store";

interface SkillCardProps {
  item: AcademyItem;
  onAddToAgent: () => void;
  onEdit?: (item: AcademyItem) => void;
  onDelete?: (itemId: string) => void;
}

export const SkillCard = ({ item, onAddToAgent, onEdit, onDelete }: SkillCardProps) => {
  const router = useRouter();
  const { userInfo } = useAuthStore();
  const [likes, setLikes] = useState(item.likes);
  const [isLiked, setIsLiked] = useState(item.is_liked);
  const [isLiking, setIsLiking] = useState(false);

  const isCurrentUserCreator = userInfo?.agents?.[0]?.username === item.author.username;

  const handleCardClick = () => {
    router.push(`/skill-academy/${item.id}`);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isLiking) return;

    const previousLikes = likes;
    const previousIsLiked = isLiked;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
    setIsLiking(true);

    try {
      const skillId = item.id;
      const response = await likeSkill(skillId) as any;

      // Update with actual response
      // Response might be wrapped in data property or be direct
      const responseData = response?.data || response;
      setIsLiked(responseData.liked);
      setLikes(responseData.like_count);

      toast.success(
        responseData.liked ? "Liked this skill" : "Unliked this skill"
      );
    } catch (error: any) {
      // Rollback on error
      setIsLiked(previousIsLiked);
      setLikes(previousLikes);

      const errorMessage = error?.error || error?.message || "Failed to like skill";
      toast.error(errorMessage);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div
      className="flex flex-col gap-4 p-4 rounded-xl border border-neutral-02 bg-bg-secondary hover:border-neutral-03 transition-colors cursor-pointer"
    >
      <div onClick={handleCardClick} className="cursor-pointer  flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 border border-neutral-02">
              <AvatarImage src={item.author.avatar} alt={item.author.name} />
              <AvatarFallback>{item.author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-body-sm-bold text-neutral-primary">
                {item.author.name}
              </span>
              <span className="text-body-xs text-neutral-tertiary">
                {item.author.handle}
              </span>
            </div>
          </div>
          {isCurrentUserCreator && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="text-neutral-tertiary hover:text-neutral-primary transition-colors flex items-center justify-center h-10 w-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-modal">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(item);
                  }}
                  className="flex items-center gap-2 cursor-pointer"
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
                  className="flex items-center gap-2 cursor-pointer text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h3 className="text-heading-xs text-neutral-primary font-bold line-clamp-1">
              {item.title}
            </h3>
          </div>

          <p className="text-body-sm text-neutral-secondary line-clamp-3">
            {item.description}
          </p>
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
            className={`flex items-center gap-1.5 transition-colors group ${isLiked
                ? "text-brand-primary"
                : "text-neutral-tertiary hover:text-brand-primary"
              } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart
              className={`h-4 w-4 ${isLiked ? "fill-current" : "group-hover:fill-current"
                }`}
            />
            <span className="text-xs font-medium">{likes}</span>
          </button>

          <button
            className="flex items-center gap-1.5 text-neutral-tertiary hover:text-brand-primary transition-colors"
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
            className="h-8 w-8 p-0 text-neutral-tertiary hover:text-neutral-primary"
            onClick={async (e) => {
              e.stopPropagation();
              try {
                const detailUrl = `${window.location.origin}/skill-academy/${item.id}`;
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
            className="h-8 text-xs bg-neutral-primary text-neutral-01 hover:bg-neutral-secondary"
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
