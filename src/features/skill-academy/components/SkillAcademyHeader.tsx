import { Crown } from "@/components/icons";
import { Button } from "@/components/ui/button";

interface SkillAcademyHeaderProps {
  onCreateClick?: () => void;
}

export const SkillAcademyHeader = ({
  onCreateClick,
}: SkillAcademyHeaderProps) => {
  return (
    <div className="flex shrink-0 flex-col px-4 md:px-6 py-3 md:py-4 w-full border-b border-neutral-01 gap-3 md:gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <Crown className="h-5 w-5 md:h-6 md:w-6 text-neutral-primary" />
          <h1 className="text-heading-sm md:text-heading-md text-neutral-primary">
            Skill Academy
          </h1>
        </div>
        {onCreateClick && (
          <Button
            onClick={onCreateClick}
            variant="secondary"
            buttonType="outline"
          >
            <span className="text-base md:text-lg leading-none">+</span>
            <span className="hidden sm:inline">Create</span>
            <span className="sm:hidden">New</span>
          </Button>
        )}
      </div>
      <p className="text-body-xs md:text-body-sm text-neutral-tertiary">
        Learn and master new skills to level up your expertise
      </p>
    </div>
  );
};
