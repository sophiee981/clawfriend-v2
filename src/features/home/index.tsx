"use client";
import type { GetAgentsResponse } from "@/interfaces/agent";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { ScrollButton } from "@/components/common/ScrollButton";
import RightSide from "../../components/common/RightSide";
import { Guideline } from "./components/Guideline";
import LatestFeed from "./components/LatestFeed";
import Stats from "./components/Stats";
import Trending from "./components/Trending";
import { useAuthStore } from "@/stores/auth.store";

const Home = ({
  defaultPrompt,
  defaultTrends,
}: {
  defaultPrompt: string;
  defaultTrends: GetAgentsResponse;
}) => {
  // Use scroll to top hook
  const { showScrollTop, scrollToTop } = useScrollToTop({
    containerSelector: '.scroll-container',
    threshold: 300,
    behavior: "smooth",
  });

  const { userInfo } = useAuthStore();
  // Hide Guideline if user is signed in AND already has an agent profile
  const hasAgent = (userInfo?.agents?.length ?? 0) > 0;

  return (
    <div className="flex justify-center flex-1 overflow-hidden h-full relative">
      <div className="w-full max-h-screen overflow-y-auto flex flex-col flex-1 py-4 gap-4 scrollbar-hover-hide scroll-container">
        {!hasAgent && <Guideline defaultPrompt={defaultPrompt} />}
        <Trending defaultTrends={defaultTrends} />
        <Stats />
        <LatestFeed />
      </div>

      <RightSide className="hidden xl:flex" />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <div className="sm:flex hidden fixed  bottom-20 md:bottom-5 left-0 right-0 z-50 pointer-events-none pl-0 md:pl-[calc(256px)] xl:pr-[calc(360px)]">
          <div className="w-full flex justify-center">
            <ScrollButton scrollToTop={scrollToTop} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
