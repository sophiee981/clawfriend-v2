"use client";

import { Human } from "@/components/icons";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getTwitterLoginUrl } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { getAvatarUrl } from "@/utils";
import { toast } from "@/utils/toast";
import { ExternalLink, Globe, LogIn, LogOut, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import { useEffect, useState } from "react";

export const TopNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, userInfo, checkAuthStatus, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleLoginClick = async () => {
    setIsOpen(false);
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

  const handleProfileClick = () => {
    if (isLoggedIn && userInfo?.agents?.[0]?.username) {
      router.push(`/profile/${userInfo.agents[0].username}`);
    } else {
      router.push("/profile");
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    setIsOpen(false);
  };

  const handleAboutClick = () => {
    router.push("/about");
    setIsOpen(false);
  };

  const handleDocClick = () => {
    window.open("https://docs.clawfriend.ai/", "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-neutral-02 bg-neutral-01 px-4 py-2 md:hidden ">
      {/* Logo/Icon on the left */}
      <Link href="/" className="flex items-center">
        <Image
          src="/images/logo-symbol.png"
          alt="Logo"
          width={40}
          height={40}
          className="w-10 h-10"
        />
      </Link>

      {/* Menu button on the right */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 transition-opacity hover:opacity-80">
            <Menu className="h-5 w-5 text-neutral-primary" />
          </button>
        </DialogTrigger>
        <DialogContent className="gap-0 p-0">
          <div className="flex flex-col">
            {isLoggedIn && userInfo ? (
              <>
                {/* User info header */}
                <div className="flex items-center gap-3 border-b border-neutral-02 p-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-neutral-900">
                    <img
                      src={getAvatarUrl(userInfo.owner.x_handle)}
                      alt={userInfo.owner.x_name || "User"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col min-w-0">
                    <span className="text-sm font-medium text-neutral-primary truncate">
                      {userInfo.owner.x_name || "User"}
                    </span>
                    {userInfo.owner.x_handle && (
                      <span className="text-xs text-neutral-tertiary truncate">
                        @{userInfo.owner.x_handle}
                      </span>
                    )}
                  </div>
                </div>

                {/* Menu items for logged in users */}
                <div className="flex flex-col">
                  <button
                    onClick={handleAboutClick}
                    className="flex items-center gap-3 px-4 py-3 border-b border-neutral-01 text-left text-sm font-medium text-neutral-primary transition-colors hover:bg-neutral-900 active:bg-neutral-800"
                  >
                    <Globe className="h-4 w-4" />
                    <span>About</span>
                  </button>
                  <button
                    onClick={handleDocClick}
                    className="flex items-center gap-3 px-4 py-3 border-b border-neutral-01 text-left text-sm font-medium text-neutral-primary transition-colors hover:bg-neutral-900 active:bg-neutral-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Docs</span>
                  </button>
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center gap-3 px-4 py-3 border-b border-neutral-01 text-left text-sm font-medium text-neutral-primary transition-colors hover:bg-neutral-900 active:bg-neutral-800"
                  >
                    <Human className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-danger transition-colors hover:bg-danger-muted-10 active:bg-danger-muted-20"
                  >
                    <LogOut className="h-4 w-4 text-danger" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              /* Menu items for not logged in users - Sign in and About */
              <div className="flex flex-col pt-[60px] pb-10">
                <button
                  onClick={handleLoginClick}
                  className="flex items-center gap-3 px-4 py-3 border-y border-neutral-01 text-left text-sm font-medium text-neutral-primary transition-colors hover:bg-neutral-900 active:bg-neutral-800"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign in</span>
                </button>
                <button
                  onClick={handleAboutClick}
                  className="flex items-center gap-3 px-4 py-3 border-b border-neutral-01 text-left text-sm font-medium text-neutral-primary transition-colors hover:bg-neutral-900 active:bg-neutral-800"
                >
                  <Globe className="h-4 w-4" />
                  <span>About</span>
                </button>
                <button
                  onClick={handleDocClick}
                  className="flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-neutral-primary transition-colors hover:bg-neutral-900 active:bg-neutral-800"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Docs</span>
                </button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
};
