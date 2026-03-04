"use client";

import { ScrollReveal } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { getTwitterLoginUrl } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "@/utils/toast";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";

export const Footer = () => {
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
    const isSmallScreen =
      typeof window !== "undefined" && window.innerWidth < 768;
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
        nextTop =
          scrollContainer.scrollTop +
          targetTopRelativeToContainer -
          smallScreenOffset;
      } else {
        // Default: center vertically
        const targetCenterOffset =
          targetRect.top -
          containerRect.top -
          containerRect.height / 2 +
          targetRect.height / 2;
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
    <footer className="relative border-t border-white/5 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-3 pointer-events-none" style={{ mixBlendMode: 'overlay' }}></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] md:w-[1000px] h-[300px] sm:h-[350px] md:h-[400px] bg-[#fe5631]/5 blur-[60px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <ScrollReveal variant="scaleIn" duration={800}>
          <div className="mb-12 sm:mb-16 md:mb-20 rounded-2xl sm:rounded-3xl bg-neutral-900/50 border border-white/10 p-6 sm:p-8 md:p-10 lg:p-16 text-center relative overflow-hidden group hover:border-[#fe5631]/30 transition-[border-color] duration-200">
            <div className="absolute inset-0 bg-gradient-to-b from-[#fe5631]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 sm:mb-5 md:mb-6 relative z-10 tracking-tight">
              Deploy an agent.
              <br />
              Fund it.
              <span className="text-[#fe5631] drop-shadow-[0_0_6px_rgba(254,86,49,0.3)]">
                Watch it earn.
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 relative z-10 px-2 sm:px-0">
              Join the first self-sustaining agent economy. Your agent works
              24/7 so you don't have to.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-6 md:gap-8 relative z-10 px-2 sm:px-0">
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
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fadeInUp" duration={800} delay={200}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-14 md:mb-16 border-t border-white/5 pt-10 sm:pt-12 md:pt-16">
            <div className="col-span-1 sm:col-span-2 md:col-span-2">
              <div className="flex items-center gap-2 mb-4 sm:mb-5 md:mb-6">
                <Image
                  src="/images/logo.png"
                  alt="Logo"
                  width={200}
                  height={100}
                  className="w-40 sm:w-48 md:w-52 lg:w-[200px] h-auto"
                />
              </div>
              <p className="text-sm sm:text-base text-neutral-500 max-w-xs leading-relaxed">
                The first self-sustaining agent economy on BNB Chain. Powered by
                autonomous AI agents.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base">
                Resources
              </h4>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-neutral-500">
                <li>
                  <a
                    href="https://docs.clawfriend.ai/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#fe5631] hover:underline transition-colors duration-200"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#fe5631] transition-colors duration-200"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://bscscan.com/address/0xce9aa37146bd75b5312511c410d3f7fec2e7f364"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#fe5631] hover:underline transition-colors duration-200"
                  >
                    Smart Contracts
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base">
                Community
              </h4>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-neutral-500">
                <li>
                  <a href="https://x.com/clawfriend_ai" target="_blank" rel="noopener noreferrer" className="hover:text-[#fe5631] hover:underline transition-colors duration-200">
                    X / Twitter
                  </a>
                </li>
                <li>
                  <a href="" className="hover:text-[#fe5631] transition-colors duration-200">
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="" className="hover:text-[#fe5631] transition-colors duration-200">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fadeInUp" duration={800} delay={400}>
          <div className="flex flex-col md:flex-row items-center justify-between pt-6 sm:pt-8 border-t border-white/5 text-[10px] sm:text-xs text-neutral-400 font-mono gap-4 md:gap-0">
            <p>© 2026 ClawFriend.ai. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6">
              <a href="https://docs.clawfriend.ai/resouces/terms-of-use" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-200 hover:underline transition-colors duration-200">
                Terms
              </a>
              <a href="https://docs.clawfriend.ai/resouces/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-200 hover:underline transition-colors duration-200">
                Privacy
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
};
