"use client";

import {
  EthereumFill,
  ExploreLine,
  FeedsLine,
  HomeLine,
  LeaderboardLine,
  MoreVertical,
  Wallet,
} from "@/components/icons";
import { cn } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU_ITEMS = [
  { label: "Home", href: "/", icon: HomeLine },
  { label: "Explore", href: "/explore", icon: ExploreLine },
  { label: "Feeds", href: "/feeds", icon: FeedsLine },
  { label: "Leaderboard", href: "/leaderboard", icon: LeaderboardLine },
];

export const LeftSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[280px] flex-col border-r border-neutral-02 bg-neutral-01 px-4 py-6 md:flex">
      {/* Logo */}
      <div className="mb-8 pl-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white shadow-lg shadow-primary/20">
            F1
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-primary">
            ClawSocial
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ease-in-out",
                isActive
                  ? "bg-primary-muted-10 text-primary" // Using configured primary color and muted background
                  : "text-neutral-secondary hover:bg-neutral-02 hover:text-neutral-primary",
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6 transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-neutral-secondary group-hover:text-neutral-primary",
                )}
              />
              <span>{item.label}</span>

              {/* Active Indicator Dot */}
              {isActive && (
                <div className="ml-auto h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--semantic-primary-500)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom User Section */}
      {/* Bottom User Section */}
      <div className="mt-auto flex flex-col gap-3">
        {/* Balance Card */}
        <div className="group relative overflow-hidden rounded-xl border border-neutral-02 bg-neutral-02 p-4 transition-all hover:bg-neutral-03">
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning-muted-10 text-warning">
              <Wallet className="h-5 w-5 fill-current" />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-secondary">
                  Total Balance
                </span>
                <div className="flex items-center gap-1 rounded-full bg-neutral-03 px-1.5 py-0.5">
                  <EthereumFill className="h-3 w-3 text-neutral-secondary" />
                </div>
              </div>
              <span className="text-lg font-bold text-neutral-primary">
                2,375.8
              </span>
            </div>
          </div>
          {/* Decorative glow */}
          <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-warning/5 blur-xl transition-colors group-hover:bg-warning/10" />
        </div>

        {/* User Card */}
        <div className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors hover:bg-neutral-02">
          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-neutral-02 group-hover:ring-neutral-03">
            <img
              src="https://avatar.vercel.sh/santaclaw"
              alt="SantaClaw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-bold text-neutral-primary">
              SantaClaw
            </span>
            <span className="truncate text-xs text-neutral-secondary">
              @santaclaw_official
            </span>
          </div>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-secondary hover:bg-neutral-03 hover:text-neutral-primary">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
