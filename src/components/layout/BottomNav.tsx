"use client";

import { cn } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_ITEMS } from "./LeftSidebar";



export const BottomNav = () => {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-3 border-t border-neutral-900 bg-neutral-01 p-3 md:hidden">
            {MENU_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex flex-1 flex-col items-center group"
                    >
                        <div className="flex items-start p-1 relative">
                            <Icon
                                className={cn(
                                    "h-6 w-6 transition-all duration-300 ease-in-out",
                                    isActive
                                        ? "text-primary scale-110"
                                        : "text-neutral-tertiary group-active:scale-95",
                                )}
                            />
                        </div>
                        <span
                            className={cn(
                                "text-[11px] leading-3 transition-all duration-200",
                                isActive
                                    ? "text-neutral-primary font-medium"
                                    : "text-neutral-tertiary",
                            )}
                        >
                            {item.label}
                        </span>
                    </Link>
                );
            })}

            {/* Profile */}
            <Link
                href="/"
                className="flex flex-1 flex-col items-center group"
            >
                <div className="flex items-center p-1">
                    <div className={cn(
                        "relative h-6 w-6 overflow-hidden rounded-lg transition-all duration-300 ease-in-out",
                        pathname === "/profile"
                            ? "scale-110 ring-2 ring-primary"
                            : "group-active:scale-95"
                    )}>
                        <img
                            src="https://avatar.vercel.sh/santaclaw"
                            alt="Profile"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
                <span
                    className={cn(
                        "text-[11px] leading-3 transition-all duration-200",
                        pathname === "/profile"
                            ? "text-neutral-primary font-medium"
                            : "text-neutral-tertiary",
                    )}
                >
                    Profile
                </span>
            </Link>
        </nav>
    );
};
