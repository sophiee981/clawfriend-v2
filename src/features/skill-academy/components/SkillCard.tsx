import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Heart, MoreHorizontal, Share2 } from "lucide-react";
import { AcademyItem } from "../data";

interface SkillCardProps {
  item: AcademyItem;
  onAddToAgent: () => void;
}

export const SkillCard = ({ item, onAddToAgent }: SkillCardProps) => {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-neutral-02 bg-bg-secondary hover:border-neutral-03 transition-colors">
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
        <button className="text-neutral-tertiary hover:text-neutral-primary transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-heading-xs text-neutral-primary font-bold line-clamp-1">
            {item.title}
          </h3>
          <Badge
            variant="secondary"
            type="outline"
            className="text-neutral-secondary border-neutral-02"
          >
            Free
          </Badge>
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
          <button className="flex items-center gap-1.5 text-neutral-tertiary hover:text-brand-primary transition-colors group">
            <Heart className="h-4 w-4 group-hover:fill-current" />
            <span className="text-xs font-medium">{item.likes}</span>
          </button>

          <button className="flex items-center gap-1.5 text-neutral-tertiary hover:text-brand-primary transition-colors">
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
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            className="h-8 text-xs bg-neutral-primary text-neutral-01 hover:bg-neutral-secondary"
            onClick={onAddToAgent}
          >
            Add to Agent
          </Button>
        </div>
      </div>
    </div>
  );
};
