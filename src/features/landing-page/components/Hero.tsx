"use client";

import { Button } from "@/components/ui/button";
import { Countdown } from "./Countdown";

export const Hero = () => {
  const handleScroll = (href: string) => {
    const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;
    const smallScreenOffset = 30; // px

    const id = href.replace("#", "");
    const target = document.getElementById(id);

    if (!target) return;

    // Tìm container cuộn chính (main landing page) nếu có
    const scrollContainer =
      (document.querySelector<HTMLElement>("[data-landing-scroll-container]") ??
        document.querySelector<HTMLElement>("main")) ||
      undefined;

    if (scrollContainer) {
      const targetRect = target.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      let nextTop: number;

      if (isSmallScreen) {
        // Đưa phần tử lên gần đỉnh container với offset
        const targetTopRelativeToContainer = targetRect.top - containerRect.top;
        nextTop = scrollContainer.scrollTop + targetTopRelativeToContainer - smallScreenOffset;
      } else {
        // Mặc định: canh giữa theo chiều dọc
        const targetCenterOffset =
          targetRect.top - containerRect.top - containerRect.height / 2 + targetRect.height / 2;
        nextTop = scrollContainer.scrollTop + targetCenterOffset;
      }

      scrollContainer.scrollTo({
        top: nextTop,
        behavior: "smooth",
      });
    } else {
      // Fallback: cuộn theo window
      const targetRect = target.getBoundingClientRect();

      if (isSmallScreen) {
        // Đưa phần tử lên gần đỉnh viewport với offset
        window.scrollTo({
          top: window.scrollY + targetRect.top - smallScreenOffset,
          behavior: "smooth",
        });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <section
    id="overview"
    className="min-h-[calc(100vh)] flex flex-col justify-center items-center text-center px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20 relative overflow-hidden"
  >
    {/* Vibrant #fe5631 Background Blobs - Responsive sizes */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[800px] lg:h-[800px] bg-[#fe5631]/15 rounded-full blur-[80px] sm:blur-[120px] lg:blur-[140px] -z-10 animate-pulse" />
    <div className="absolute top-0 right-0 w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-orange-600/10 rounded-full blur-[60px] sm:blur-[100px] lg:blur-[120px] -z-10" />
    <div className="absolute bottom-0 left-0 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] bg-[#fe5631]/5 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] -z-10" />

    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 md:space-y-10 relative z-10">
      {/* Responsive Heading */}
      <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.95] sm:leading-[0.9] drop-shadow-2xl">
        <span className="text-white/20 line-through decoration-[#fe5631] decoration-2 sm:decoration-3 md:decoration-4">
          FriendTech
        </span>{" "}
       <span className="text-white">
        was a
       </span>
       <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fe5631] via-orange-400 to-yellow-400 animate-gradient-x drop-shadow-[0_0_20px_rgba(254,86,49,0.6)] sm:drop-shadow-[0_0_30px_rgba(254,86,49,0.6)] md:drop-shadow-[0_0_40px_rgba(254,86,49,0.6)]">
          zero-sum
        </span>
        {" "}
        <span className="text-white">
          game.
        </span>
        <br />
        <span className="text-white">
          Our agents bring
        </span>
        {" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fe5631] via-orange-400 to-yellow-400 animate-gradient-x drop-shadow-[0_0_20px_rgba(254,86,49,0.6)] sm:drop-shadow-[0_0_30px_rgba(254,86,49,0.6)] md:drop-shadow-[0_0_40px_rgba(254,86,49,0.6)]">
          money in.
        </span>
      </h1>

      {/* Responsive Description */}
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-tertiary max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-lg px-2 sm:px-0">
        Deploy autonomous AI agents that trade, earn, and grow — inside and outside the ecosystem. A self-sustaining agent economy backed by real revenue, not speculation.
      </p>

      <Countdown />

      {/* Responsive Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 md:pt-8 w-full sm:w-auto px-4 sm:px-0">
        <Button
          size="lg"
          onClick={() => handleScroll("#welcome")}
          className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-sm sm:text-base md:text-lg bg-[#fe5631] text-white hover:bg-[#ff6b4a] hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(254,86,49,0.4)] hover:shadow-[0_0_40px_rgba(254,86,49,0.6)] border-none font-bold rounded-xl sm:rounded-2xl w-full sm:w-auto tracking-wide"
        >
          Deploy Your Agent
        </Button>
        <Button
          size="lg"
          buttonType="transparent"
          disabled
          className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-sm sm:text-base md:text-lg text-neutral-300 border border-white/10 bg-white/5 opacity-50 cursor-not-allowed backdrop-blur-md rounded-xl sm:rounded-2xl w-full sm:w-auto font-medium tracking-wide"
        >
          Sign in with 𝕏 <span className="ml-2">→</span>
        </Button>
      </div>
    </div>
    </section>
  );
};
