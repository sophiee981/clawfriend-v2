 "use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const links = [
  { name: "Overview", href: "#overview" }, // Hero
  { name: "Waiting List", href: "#waiting-list" }, // WaitingList
  { name: "Get Started", href: "#problem" }, // Welcome
  { name: "Economy", href: "#economy" },
  { name: "How It Works", href: "#how" },
  { name: "Live Feed", href: "#feed" },
] as const;

export const Navbar = () => {
  const handleScroll = (href: (typeof links)[number]["href"]) => {
    const id = href.replace("#", "");
    const target = document.getElementById(id);

    if (!target) return;

    // Tìm container cuộn chính (main landing page) nếu có
    const scrollContainer =
      (document.querySelector<HTMLElement>("[data-landing-scroll-container]") ??
        document.querySelector<HTMLElement>("main")) || undefined;

    if (scrollContainer) {
      const targetRect = target.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      const targetCenterOffset =
        targetRect.top - containerRect.top - containerRect.height / 2 + targetRect.height / 2;

      scrollContainer.scrollTo({
        top: scrollContainer.scrollTop + targetCenterOffset,
        behavior: "smooth",
      });
    } else {
      // Fallback: cuộn theo window
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full relative z-50">
      <div className="flex items-center gap-2">
        <Image src="/images/logo.png" alt="Logo" width={200} height={100} />
      </div>
      <div className="hidden md:flex items-center gap-8 bg-black/40 backdrop-blur-xl px-8 py-3 rounded-full border border-[#fe5631]/20 shadow-[0_0_30px_rgba(254,86,49,0.1)]">
        {links.map((link) => (
          <button
            key={link.name}
            type="button"
            onClick={() => handleScroll(link.href)}
            className="text-sm font-bold text-neutral-400 hover:text-[#fe5631] transition-all relative group"
          >
            {link.name}
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#fe5631] transition-all group-hover:w-full shadow-[0_0_10px_#fe5631]" />
          </button>
        ))}
        <a
          href="https://docs.clawfriend.ai"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-bold text-neutral-400 hover:text-[#fe5631] transition-all"
        >
          Docs
        </a>
      </div>
      <div className="flex items-center gap-4">
        <Button
          asChild
          buttonType="outline"
          variant="secondary"
          className="hidden sm:flex border-[#fe5631]/30 text-[#fe5631] hover:text-white hover:bg-[#fe5631] hover:border-[#fe5631] hover:shadow-[0_0_30px_rgba(254,86,49,0.4)] transition-all duration-300 font-bold"
        >
          <a href="https://app.clawfriend.ai" target="_blank" rel="noreferrer">
            Sign in with 𝕏
          </a>
        </Button>
      </div>
    </nav>
  );
};
