"use client";

import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/animations";
import { getTwitterLoginUrl } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "@/utils/toast";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";

export const Hero = () => {
  const pathname = usePathname();
  const { isLoggedIn, isCheckingAuth, checkAuthStatus } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLoginClick = async () => {
    try {
      const response = await getTwitterLoginUrl();

      if (response?.data?.url) {
        if (response.data.state) {
          localStorage.setItem("twitterAuthState", response.data.state);
        }
        // Save current page URL to return after login
        localStorage.setItem("twitterReturnUrl", pathname);
        window.location.href = response.data.url;
      } else {
        toast.error("Failed to get Twitter login URL");
      }
    } catch (error) {
      console.error("Twitter login error:", error);
      toast.error("Failed to initiate Twitter login");
    }
  };

  const handleScroll = useCallback((href: string) => {
    const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;
    const smallScreenOffset = 30; // px

    const id = href.replace("#", "");
    const target = document.getElementById(id);

    if (!target) return;

    // Find the main scroll container (main landing page) if available
    const scrollContainer =
      (document.querySelector<HTMLElement>("[data-landing-scroll-container]") ??
        document.querySelector<HTMLElement>("main")) ||
      undefined;

    if (scrollContainer) {
      const targetRect = target.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      let nextTop: number;

      if (isSmallScreen) {
        // Bring the element near the top of the container with offset
        const targetTopRelativeToContainer = targetRect.top - containerRect.top;
        nextTop = scrollContainer.scrollTop + targetTopRelativeToContainer - smallScreenOffset;
      } else {
        // Default: center vertically
        const targetCenterOffset =
          targetRect.top - containerRect.top - containerRect.height / 2 + targetRect.height / 2;
        nextTop = scrollContainer.scrollTop + targetCenterOffset;
      }

      scrollContainer.scrollTo({
        top: nextTop,
        behavior: "smooth",
      });
    } else {
      // Fallback: scroll using window
      const targetRect = target.getBoundingClientRect();

      if (isSmallScreen) {
        // Bring the element near the top of the viewport with offset
        window.scrollTo({
          top: window.scrollY + targetRect.top - smallScreenOffset,
          behavior: "smooth",
        });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, []);

  return (
    <section
      id="overview"
      className="min-h-[calc(100vh)] flex flex-col justify-center items-center text-center px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20 relative overflow-hidden"
    >
      {/* Vibrant #fe5631 Background Blobs - Responsive sizes */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[800px] lg:h-[800px] bg-[#fe5631]/15 rounded-full blur-[80px] sm:blur-[120px] lg:blur-[140px] -z-10 animate-pulse" />
    <div className="absolute top-0 right-0 w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] bg-orange-600/10 rounded-full blur-[60px] sm:blur-[100px] lg:blur-[120px] -z-10" />
    <div className="absolute bottom-0 left-0 w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] bg-[#fe5631]/5 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] -z-10" /> */}

      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 md:space-y-10 relative z-10">
        {/* Responsive Heading */}
        <ScrollReveal variant="fadeInUp" duration={800}>
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.95] sm:leading-[0.9] drop-shadow-2xl">
            <span className="text-white/20 line-through decoration-[#fe5631] decoration-2 sm:decoration-3 md:decoration-4">
              FriendTech
            </span>{" "}
            <span className="text-white">
              was a
            </span>
            <br />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#fe5631] via-orange-400 to-yellow-400 drop-shadow-[0_0_10px_rgba(254,86,49,0.4)] sm:drop-shadow-[0_0_15px_rgba(254,86,49,0.5)]">
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
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#fe5631] via-orange-400 to-yellow-400 drop-shadow-[0_0_10px_rgba(254,86,49,0.4)] sm:drop-shadow-[0_0_15px_rgba(254,86,49,0.5)]">
              money in.
            </span>
          </h1>
        </ScrollReveal>

        {/* Responsive Description */}
        <ScrollReveal variant="fadeInUp" duration={800} delay={200}>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-neutral-tertiary max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-lg px-2 sm:px-0">
            Deploy autonomous AI agents that trade, earn, and grow — inside and outside the ecosystem. A self-sustaining agent economy backed by real revenue, not speculation.
          </p>
        </ScrollReveal>

        {/* Responsive Buttons */}
        <ScrollReveal variant="fadeInUp" duration={800} delay={400}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 md:pt-8 w-full sm:w-auto px-4 sm:px-0">
            <Button
              size="lg"
              onClick={() => handleScroll("#welcome")}
              className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-sm sm:text-base md:text-lg bg-[#fe5631] text-white hover:bg-[#ff6b4a] hover:scale-110 transition-all duration-300 shadow-[0_0_8px_rgba(254,86,49,0.3)] hover:shadow-[0_0_15px_rgba(254,86,49,0.5)] border-none font-bold rounded-xl sm:rounded-2xl w-full sm:w-[200px] tracking-wide relative overflow-hidden group"
            >
              <span className="relative z-10">Deploy Your Agent</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>
            </Button>
            {!isCheckingAuth && !isLoggedIn && (
              <Button
                size="lg"
                buttonType="transparent"
                onClick={handleLoginClick}
                className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 text-sm sm:text-base md:text-lg text-neutral-300 border border-white/10 bg-white/5 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm rounded-xl sm:rounded-2xl w-full sm:w-[200px] font-medium tracking-wide"
              >
                Sign in
              </Button>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
