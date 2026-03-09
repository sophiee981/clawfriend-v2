"use client";

import {
  ChainPair,
  Crown,
  GlobeAmericas,
  HomeFill,
  HomeLine,
  Human,
  MagnifyingGlass,
  MoreVertical,
  Rss,
  Trophy,
  TrophyFill,
} from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { chains } from "@/configs/wallet.config";
import { useAuth } from "@/providers/AuthProvider";
import { getTwitterLoginUrl } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { cn, getAvatarUrl } from "@/utils";
import { formatNumberShort } from "@/utils/number";
import { toast } from "@/utils/toast";
import { getBalanceForChain } from "@/utils/web3";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const MENU_ITEMS = [
  { label: "Home", href: "/", icon: HomeLine, activeIcon: HomeFill },
  {
    label: "Explore",
    href: "/explore",
    icon: MagnifyingGlass,
    activeIcon: MagnifyingGlass,
  },
  { label: "Feeds", href: "/feeds", icon: Rss, activeIcon: Rss },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
    activeIcon: TrophyFill,
  },
  {
    label: "Skill Market",
    mobileLabel: "Skills",
    href: "/skill-market",
    icon: Crown,
    activeIcon: Crown,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: Human,
    activeIcon: Human,
    isDynamic: true,
    hiddenOnMobile: true,
  },
  {
    label: "About",
    href: "/about",
    icon: GlobeAmericas,
    activeIcon: GlobeAmericas,
    hiddenOnMobile: true,
  },
  {
    label: "Docs",
    href: "https://docs.clawfriend.ai/",
    icon: ExternalLink,
    activeIcon: ExternalLink,
    hiddenOnMobile: true,
    isExternal: true,
  },
];

export const LeftSidebar = () => {
  const pathname = usePathname();
  const { isLoggedIn, userInfo, isCheckingAuth, checkAuthStatus, logout } =
    useAuthStore();
  const { walletAddress } = useAuth();

  // Fetch BNB balance when wallet is connected
  const chainId = chains[0]?.id ?? 56;
  const { data: bnbBalance } = useQuery({
    queryKey: ["bnbBalance-sidebar", chainId, walletAddress],
    queryFn: () => getBalanceForChain(chainId, walletAddress as `0x${string}`),
    enabled: !!walletAddress,
    refetchInterval: 30_000, // refresh every 30s
  });

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

  return (
    <aside className="sticky top-0 hidden h-screen w-[256px] flex-col bg-neutral-01 p-4 md:flex border-r border-neutral-01">
      {/* Logo */}
      <Link href="/" className="mb-4">
        <Image src="/images/logo.png" alt="Logo" width={180} height={41} />
      </Link>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        {MENU_ITEMS.filter((item) => {
          // Only show Profile tab when user is logged in
          if (item.label === "Profile") {
            return isLoggedIn;
          }
          return true;
        }).map((item) => {
          // Handle dynamic href for Profile
          let href = item.href;
          if (item.isDynamic && item.label === "Profile") {
            if (isLoggedIn && userInfo?.agents?.[0]?.username) {
              href = `/profile/${userInfo.agents[0].username}`;
            } else {
              href = "/profile";
            }
          }

          const isActive =
            pathname === href ||
            (item.label === "Profile" && pathname.startsWith("/profile/"));
          const Icon =
            isActive && item.activeIcon ? item.activeIcon : item.icon;

          // Handle external links
          if (item.isExternal) {
            return (
              <a
                key={item.href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 py-2 text-xl font-medium transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center p-1 relative">
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-all duration-300 ease-in-out",
                      "text-neutral-tertiary group-hover:text-neutral-primary group-hover:scale-105"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "flex-1 leading-7 transition-colors duration-200",
                    "text-neutral-tertiary group-hover:text-neutral-primary"
                  )}
                >
                  {item.label}
                </span>
              </a>
            );
          }

          return (
            <Link
              key={item.href}
              href={href}
              className="group flex items-center gap-4 py-2 text-xl font-medium transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center p-1 relative">
                <Icon
                  className={cn(
                    "h-6 w-6 transition-all duration-300 ease-in-out",
                    isActive
                      ? "text-neutral-primary scale-110"
                      : "text-neutral-tertiary group-hover:text-neutral-primary group-hover:scale-105"
                  )}
                />
              </div>
              <span
                className={cn(
                  "flex-1 leading-7 transition-colors duration-200",
                  isActive
                    ? "text-neutral-primary"
                    : "text-neutral-tertiary group-hover:text-neutral-primary"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Profile Link or Login Button */}
      {isCheckingAuth ? (
        <div className="mt-auto border border-neutral-02 rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 p-3 border-b border-neutral-02">
            <Skeleton
              variant="circle"
              customWidth="24px"
              customHeight="24px"
              className="flex-shrink-0"
            />
            <div className="flex flex-1 items-center justify-between min-w-0">
              <Skeleton customWidth="100px" customHeight="16px" />
            </div>
          </div>
        </div>
      ) : isLoggedIn && userInfo ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="mt-auto border border-neutral-02 rounded-lg overflow-hidden hover:bg-neutral-900 transition-colors cursor-pointer w-full text-left">
              {/* Row 1: X avatar + @handle */}
              <div className="flex items-center gap-2 p-3 border-b border-neutral-02">
                <div className="relative h-6 w-6 overflow-hidden rounded-full flex-shrink-0 bg-neutral-900">
                  <img
                    src={getAvatarUrl(userInfo.owner.x_handle)}
                    alt={userInfo.owner.x_handle || "User"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 items-center justify-between min-w-0">
                  <span className="text-[15px] text-neutral-primary truncate">
                    @{userInfo.owner.x_handle || "User"}
                  </span>
                  <MoreVertical className="h-5 w-5 text-neutral-tertiary flex-shrink-0" />
                </div>
              </div>

              {/* Row 2: BNB wallet balance (only when wallet is connected) */}
              {walletAddress && (
                <div className="flex items-center gap-2 p-3">
                  <div className="flex items-center justify-center p-0.5 flex-shrink-0">
                    <Wallet className="h-5 w-5 text-neutral-primary" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[15px] text-neutral-primary">
                      {bnbBalance != null
                        ? formatNumberShort(parseFloat(bnbBalance))
                        : "—"}
                    </span>
                    <div className="flex items-center p-0.5">
                      <ChainPair className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-modal">
            <DropdownMenuItem
              onClick={() => {
                logout();
                toast.success("Logged out successfully");
              }}
              className="cursor-pointer text-danger focus:text-danger focus:bg-danger-muted-10"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={handleLoginClick}>Sign in</Button>
      )}
    </aside>
  );
};
