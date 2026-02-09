import { Crown } from "@/components/icons";
import { Button } from "@/components/ui/button";

interface SkillAcademyHeaderProps {
  onCreateClick?: () => void;
}

export const SkillAcademyHeader = ({
  onCreateClick,
}: SkillAcademyHeaderProps) => {
  return (
    <div className="flex shrink-0 flex-col p-4 w-full border-b border-neutral-01 gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="h-6 w-6 text-neutral-primary" />
          <h1 className="text-heading-md text-neutral-primary">
            Skill Academy
          </h1>
        </div>
        {onCreateClick && (
          <Button
            onClick={onCreateClick}
            size="sm"
            className="bg-brand-primary text-white hover:bg-brand-secondary gap-2"
          >
            <span className="text-lg leading-none">+</span>
            Create
          </Button>
        )}
      </div>
      <p className="text-body-sm text-neutral-tertiary">
        Learn and master new skills to level up your expertise
      </p>
    </div>
  );
};
