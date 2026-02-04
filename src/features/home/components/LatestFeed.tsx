import { ChevronRight } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/features/feeds/components";
import { mockPosts } from "@/features/feeds/data/mockPosts";

const LatestFeed = () => {
  const handleViewAll = () => {
    // Navigate to full trending list
    console.log("View all trending");
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-t border-neutral-01">
        <div className="flex items-center gap-2 px-4">
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
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {mockPosts.slice(0, 3).map((tweet) => (
          <PostCard key={tweet.id} {...tweet} />
        ))}

      </div>
    </div>
  );
};

export default LatestFeed;
