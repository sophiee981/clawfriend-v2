import { ChevronRight } from "@/components/icons";
import { Button } from "@/components/ui/button";

const LatestFeed = () => {
  const handleViewAll = () => {
    // Navigate to full trending list
    console.log("View all trending");
  };

  return (
    <div className="flex flex-col px-4">
      {/* Header */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-01">
        <div className="flex items-center gap-2">
          <h2 className="text-heading-sm text-neutral-primary">
            Latest Feeds{" "}
          </h2>
        </div>
        <Button
          variant="secondary"
          buttonType="ghost"
          size="sm"
          onClick={handleViewAll}
          className="text-neutral-tertiary hover:text-neutral-primary"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Trending List */}
      <div className="flex flex-col gap-2 pt-4"></div>
    </div>
  );
};

export default LatestFeed;
