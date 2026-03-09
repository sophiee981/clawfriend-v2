"use client";

import { cn, getAvatarUrl } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_ITEMS } from "./LeftSidebar";
import { useAuthStore } from "@/stores/auth.store";
import { getTwitterLoginUrl } from "@/services/auth.service";
import { toast } from "@/utils/toast";
import { Human } from "@/components/icons";

export const BottomNav = () => {
  const pathname = usePathname();
  const menuItems = MENU_ITEMS.filter((item) => !item.hiddenOnMobile);
  const { isLoggedIn, userInfo } = useAuthStore();

  const handleLoginClick = async () => {
    try {
      const response = await getTwitterLoginUrl();
      if (response?.data?.url) {
        if (response.data.state) {
          localStorage.setItem("twitterAuthState", response.data.state);
        }
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
    <nav
      className="flex items-center gap-3 border-t border-neutral-02 bg-neutral-01 p-3 md:hidden"
      style={{
        paddingBottom:
          "max(0.75rem, calc(0.75rem + env(safe-area-inset-bottom)))",
      }}
    >
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-1 flex-col items-center"
          >
            <div className="flex items-start p-1 relative">
              <Icon
                className={cn(
                  "h-6 w-6 transition-all duration-300 ease-in-out",
                  isActive ? "text-primary" : "text-neutral-tertiary"
                )}
              />
            </div>
            <span
              className={cn(
                "text-[11px] leading-3 transition-all duration-200",
                isActive ? "text-primary" : "text-neutral-tertiary"
              )}
            >
              {item.mobileLabel || item.label}
            </span>
          </Link>
        );
      })}

      {/* Profile / Sign in */}
      {isLoggedIn && userInfo ? (
        <Link
          href={userInfo.agents?.[0]?.username ? `/profile/${userInfo.agents[0].username}` : "/profile"}
          className="flex flex-1 flex-col items-center"
        >
          <div className="flex items-center p-1">
            <div className={cn(
              "relative overflow-hidden rounded-full flex-shrink-0",
              "h-6 w-6",
              pathname.startsWith("/profile") ? "ring-2 ring-primary" : ""
            )}>
              <img
                src={getAvatarUrl(userInfo.owner.x_handle)}
                alt={userInfo.owner.x_handle || "User"}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <span className={cn(
            "text-[11px] leading-3 transition-all duration-200 truncate max-w-[52px]",
            pathname.startsWith("/profile") ? "text-primary" : "text-neutral-tertiary"
          )}>
            @{userInfo.owner.x_handle || "Me"}
          </span>
        </Link>
      ) : (
        <button
          onClick={handleLoginClick}
          className="flex flex-1 flex-col items-center cursor-pointer"
        >
          <div className="flex items-start p-1">
            <Human className="h-6 w-6 text-neutral-tertiary" />
          </div>
          <span className="text-[11px] leading-3 text-neutral-tertiary">Sign in</span>
        </button>
      )}

      {/* Profile (old commented) */}
      {/* <Link
                href="/profile"
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
            </Link> */}
    </nav>
  );
};
