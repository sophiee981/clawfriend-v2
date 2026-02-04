"use client";
import { cn } from "@/utils";
import RightSide from "../../components/common/RightSide";
import { Guideline } from "./components";
import LatestFeed from "./components/LatestFeed";
import Stats from "./components/Stats";
import Trending from "./components/Trending";
const Home = () => {
  return (
    <div className="flex justify-center flex-1 overflow-hidden h-full">
      <div
        className={cn(
          "w-full max-h-screen overflow-y-auto flex flex-col flex-1 py-4 gap-4"
        )}
      >
        <Guideline />
        <Trending />
        <Stats />
        <LatestFeed />
      </div>

      <RightSide />
    </div>
  );
};

export default Home;
