"use client";
import RightSide from "../../components/common/RightSide";
import { Guideline } from "./components";
import LatestFeed from "./components/LatestFeed";
import Stats from "./components/Stats";
import Trending from "./components/Trending";
const Home = () => (
  <div className="flex justify-center flex-1 overflow-hidden h-full">
    <div className="w-full max-h-screen overflow-y-auto flex flex-col flex-1 py-4 gap-4 scrollbar-hover-hide">
      <Guideline />
      <Trending />
      <Stats />
      <LatestFeed />
    </div>

    <RightSide className="hidden xl:flex" />
  </div>
);

export default Home;
