import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Heart, MoreHorizontal, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { likeSkill } from "@/services";
import { toast } from "@/utils/toast";
import { AcademyItem } from "../data";

interface SkillCardProps {
  item: AcademyItem;
  onAddToAgent: () => void;
}

export const SkillCard = ({ item, onAddToAgent }: SkillCardProps) => {
  const router = useRouter();
  const [likes, setLikes] = useState(item.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

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
        responseData.liked ? "Đã thích skill này" : "Đã bỏ thích skill này"
      );
    } catch (error: any) {
      // Rollback on error
      setIsLiked(previousIsLiked);
      setLikes(previousLikes);
      
      const errorMessage = error?.error || error?.message || "Có lỗi xảy ra khi thích skill";
      toast.error(errorMessage);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div
      className="flex flex-col gap-4 p-4 rounded-xl border border-neutral-02 bg-bg-secondary hover:border-neutral-03 transition-colors cursor-pointer"
      onClick={handleCardClick}
    >
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
        <button
          className="text-neutral-tertiary hover:text-neutral-primary transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
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

      <div className="flex items-center justify-between pt-2 border-t border-neutral-02 mt-auto">
        <div className="flex gap-4">
          <button
            className={`flex items-center gap-1.5 transition-colors group ${
              isLiked
                ? "text-brand-primary"
                : "text-neutral-tertiary hover:text-brand-primary"
            } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart
              className={`h-4 w-4 ${
                isLiked ? "fill-current" : "group-hover:fill-current"
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
            onClick={(e) => {
              e.stopPropagation();
              // Share logic
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
