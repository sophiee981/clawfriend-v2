"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

const links = [
  { name: "Overview", href: "#overview" }, // Hero
  { name: "Waiting List", href: "#waiting-list" }, // WaitingList
  { name: "Get Started", href: "#problem" }, // Welcome
  { name: "Economy", href: "#economy" },
  { name: "How It Works", href: "#how" },
  { name: "Live Feed", href: "#feed" },
] as const;

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScroll = (href: (typeof links)[number]["href"]) => {
    const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;
    const smallScreenOffset = 30; // px

    const id = href.replace("#", "");
    const target = document.getElementById(id);

    if (!target) return;

    // Close mobile menu if open
    setIsMobileMenuOpen(false);

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
        // Đưa phần tử lên gần đỉnh container với offset 20px
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
        // Đưa phần tử lên gần đỉnh viewport với offset 20px
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
    <>
      <nav className="w-full relative z-50 bg-[#020005]/80 backdrop-blur-md border-b border-white/5 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 md:py-4 max-w-7xl mx-auto w-full">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={200}
              height={100}
              className="w-32 sm:w-40 md:w-48 lg:w-52 h-auto"
            />
          </div>

          {/* Desktop Navigation - Hidden on mobile/tablet */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8 bg-black/40 backdrop-blur-xl px-6 xl:px-8 py-3 rounded-full">
            {links.map((link) => (
              <button
                key={link.name}
                type="button"
                onClick={() => handleScroll(link.href)}
                className="text-xs xl:text-sm font-bold text-neutral-400 hover:text-[#fe5631] transition-all relative group whitespace-nowrap"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#fe5631] transition-all group-hover:w-full shadow-[0_0_10px_#fe5631]" />
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Sign In Button - Hidden on small mobile */}
            <Button
              asChild
              buttonType="outline"
              variant="secondary"
              className="hidden sm:flex border-[#fe5631]/30 text-[#fe5631] hover:text-white hover:bg-[#fe5631] hover:border-[#fe5631] hover:shadow-[0_0_30px_rgba(254,86,49,0.4)] transition-all duration-300 font-bold text-xs md:text-sm px-3 md:px-4 py-2"
            >
              <a href="https://app.clawfriend.ai" target="_blank" rel="noreferrer">
                Sign in with 𝕏
              </a>
            </Button>

            {/* Mobile Menu Button - Shown only on tablet and mobile */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
              />
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""
                  }`}
              />
              <span
                className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-72 sm:w-80 bg-black/95 backdrop-blur-xl z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4 md:p-6">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Links */}
        <div className="flex flex-col gap-2 px-4 md:px-6 mt-8">
          {links.map((link) => (
            <button
              key={link.name}
              type="button"
              onClick={() => handleScroll(link.href)}
              className="text-left text-lg font-bold text-neutral-400 hover:text-[#fe5631] transition-all py-3 px-4 rounded-lg hover:bg-white/5 relative group"
            >
              {link.name}
              <span className="absolute bottom-2 left-4 w-0 h-[2px] bg-[#fe5631] transition-all group-hover:w-[calc(100%-2rem)] shadow-[0_0_10px_#fe5631]" />
            </button>
          ))}
        </div>

        {/* Mobile Sign In Button */}
        <div className="px-4 md:px-6 mt-8">
          <Button
            asChild
            buttonType="outline"
            variant="secondary"
            className="w-full border-[#fe5631]/30 text-[#fe5631] hover:text-white hover:bg-[#fe5631] hover:border-[#fe5631] hover:shadow-[0_0_30px_rgba(254,86,49,0.4)] transition-all duration-300 font-bold"
          >
            <a href="https://app.clawfriend.ai" target="_blank" rel="noreferrer">
              Sign in with 𝕏
            </a>
          </Button>
        </div>
      </div>
    </>
  );
};
