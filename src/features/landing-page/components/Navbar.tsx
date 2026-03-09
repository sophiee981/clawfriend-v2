"use client";

import { Button } from "@/components/ui/button";
import { getTwitterLoginUrl } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { getAvatarUrl } from "@/utils";
import { toast } from "@/utils/toast";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { name: "Why CF", href: "#problem" }, // Problem
  { name: "How It Works", href: "#how-it-works" }, // HowItWorksSimple
  { name: "Economy", href: "#economy" }, // Economy
  { name: "Live Feed", href: "#feed" }, // LiveActivity
] as const;

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isSignInPage = pathname?.toLowerCase().includes("sign");
  const { isLoggedIn, userInfo, isCheckingAuth, checkAuthStatus, logout } =
    useAuthStore();

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

  const handleScroll = (href: string) => {
    const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 768;
    const smallScreenOffset = 30; // px

    const id = href.replace("#", "");
    const target = document.getElementById(id);

    if (!target) return;

    // Close mobile menu if open
    setIsMobileMenuOpen(false);

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
        // Bring the element near the top of the container with 20px offset
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
        // Bring the element near the top of the viewport with 20px offset
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
      <nav className="w-full relative z-50 bg-[#020005]/10 backdrop-blur-md border-b border-white/5 shadow-sm">
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 md:py-4 max-w-6xl mx-auto w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={200}
              height={100}
              className="w-32 sm:w-40 md:w-48 lg:w-52 h-auto"
            />
          </Link>

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
            <a
              href="https://docs.clawfriend.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs xl:text-sm font-bold transition-all relative group whitespace-nowrap text-neutral-400 hover:text-[#fe5631]"
            >
              Docs
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#fe5631] transition-all group-hover:w-full shadow-[0_0_10px_#fe5631]" />
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Avatar or Sign In Button - Hidden on small mobile */}
            {isCheckingAuth ? (
              <div className="hidden sm:flex h-8 w-8 rounded-full bg-neutral-900 animate-pulse" />
            ) : isLoggedIn && userInfo ? (
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg">
                  <div className="relative h-8 w-8 overflow-hidden rounded-full flex-shrink-0 bg-neutral-900">
                    <img
                      src={getAvatarUrl(userInfo.owner.x_handle)}
                      alt={userInfo.owner.x_handle || "User"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-white truncate max-w-[100px]">
                    {userInfo.owner.x_handle || "User"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    toast.success("Logged out successfully");
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-red-400 hover:text-red-300"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Button
                buttonType="outline"
                variant="secondary"
                onClick={handleLoginClick}
                className="hidden sm:flex border-[#fe5631]/30 text-[#fe5631] hover:text-white hover:bg-[#fe5631] hover:border-[#fe5631] hover:shadow-[0_0_30px_rgba(254,86,49,0.4)] transition-all duration-300 font-bold text-xs md:text-sm px-3 md:px-4 py-2"
              >
                Sign in
              </Button>
            )}

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
          <a
            href="https://docs.clawfriend.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-left text-lg font-bold transition-all py-3 px-4 rounded-lg relative group text-neutral-400 hover:text-[#fe5631] hover:bg-white/5"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Docs
            <span className="absolute bottom-2 left-4 w-0 h-[2px] bg-[#fe5631] transition-all group-hover:w-[calc(100%-2rem)] shadow-[0_0_10px_#fe5631]" />
          </a>
        </div>

        {/* Mobile Avatar or Sign In Button */}
        <div className="px-4 md:px-6 mt-4">
          {isCheckingAuth ? (
            <div className="h-10 w-full rounded-lg bg-neutral-900 animate-pulse" />
          ) : isLoggedIn && userInfo ? (
            <div className="w-full flex items-center gap-3 px-4 py-3 rounded-lg">
              <div className="relative h-10 w-10 overflow-hidden rounded-full flex-shrink-0 bg-neutral-900">
                <img
                  src={getAvatarUrl(userInfo.owner.x_handle)}
                  alt={userInfo.owner.x_handle || "User"}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 items-center min-w-0">
                <span className="text-base font-medium text-white truncate">
                  {userInfo.owner.x_handle || "User"}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  toast.success("Logged out successfully");
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-red-400 hover:text-red-300"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Button
              buttonType="outline"
              variant="secondary"
              onClick={handleLoginClick}
              className="w-full border-[#fe5631]/30 text-[#fe5631] hover:text-white hover:bg-[#fe5631] hover:border-[#fe5631] hover:shadow-[0_0_30px_rgba(254,86,49,0.4)] transition-all duration-300 font-bold"
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
