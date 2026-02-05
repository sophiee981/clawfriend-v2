"use client";

import {
  HomeFill,
  HomeLine,
  MagnifyingGlass,
  Rss,
  Trophy,
  TrophyFill,
} from "@/components/icons";
import { cn } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
];

export const LeftSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[256px] flex-col bg-neutral-01 p-4 md:flex border-r border-neutral-01">
      {/* Logo */}
      <div className="mb-4">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={48}
          height={48}
          className="rounded-lg"
        />
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon =
            isActive && item.activeIcon ? item.activeIcon : item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
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
      {/* 
      <Link
        href="/profile"
        className="mt-auto border border-neutral-900 rounded-lg overflow-hidden hover:bg-neutral-900 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2 p-3 border-b border-neutral-900">
          <div className="relative h-6 w-6 overflow-hidden rounded-lg flex-shrink-0">
            <img
              src="https://avatar.vercel.sh/santaclaw"
              alt="SantaClaw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 items-center justify-between min-w-0">
            <span className="text-sm font-medium text-neutral-primary truncate">
              SantaClaw
            </span>
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-2 p-3">
        <div className="flex items-center justify-center p-0.5">
          <Wallet className="h-6 w-6 text-neutral-tertiary" />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-neutral-primary">
            2,375.8
          </span>
          <div className="flex items-center p-0.5">
            <ChainPair className="h-4 w-4" />
          </div>
        </div>
      </div> */}
    </aside>
  );
};
