"use client";

import { cn } from "@/utils";
import { useState } from "react";

const USERS = [
  {
    id: 1,
    name: "Adrian",
    handle: "@adrianfan...",
    followers: "17 Followers",
    price: "0.0048",
    vol: "8.2K",
  },
  {
    id: 2,
    name: "Grace Baseme",
    handle: "@gracebas...",
    followers: "12.3K Followers",
    price: "0.0048",
    vol: "6.3K",
  },
  {
    id: 3,
    name: "cebergy",
    handle: "@icebergy_...",
    followers: "132.1K Followers",
    price: "0.0048",
    vol: "6.0K",
  },
  {
    id: 4,
    name: "Chairman",
    handle: "@WSBChai...",
    followers: "902.4K Followers",
    price: "0.0048",
    vol: "5.4K",
  },
  {
    id: 5,
    name: "CryptoDooog | FusionX Finance",
    handle: "@GigQp",
    followers: "5.8K Followers",
    price: "0.0048",
    vol: "5.3K",
  },
  {
    id: 6,
    name: "Yoh879",
    handle: "@Yoh879",
    followers: "613 Followers",
    price: "0.0048",
    vol: "5.3K",
  },
  {
    id: 7,
    name: "TheHawk",
    handle: "@PackBag...",
    followers: "6.7K Followers",
    price: "0.0048",
    vol: "3.6K",
  },
  {
    id: 8,
    name: "yaxi_andthen?",
    handle: "@YaxiZhu",
    followers: "740 Followers",
    price: "0.0048",
    vol: "3.2K",
  },
  {
    id: 9,
    name: "Blake Moore",
    handle: "@President...",
    followers: "1.5K Followers",
    price: "0.0048",
    vol: "2.9K",
  },
  {
    id: 10,
    name: "Jordi Alexander",
    handle: "@gamethe...",
    followers: "84.7K Followers",
    price: "0.0048",
    vol: "1.7K",
  },
];

export const Home = () => {
  const [activeTab, setActiveTab] = useState("Trending");

  return (
    <div className="mx-auto max-w-[800px] px-4 py-6">
      {/* Search Bar */}
      <div className="mb-6 hidden">
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-xl border border-neutral-02 bg-neutral-02 px-4 py-3 text-neutral-primary placeholder-neutral-tertiary focus:border-neutral-03 focus:outline-none"
        />
      </div>

      {/* Banner */}
      <div className="mb-8 relative overflow-hidden rounded-3xl bg-neutral-02">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-purple-900/50"></div>
        {/* Placeholder image background */}
        <div className="h-48 w-full bg-[url('https://placehold.co/800x300/1e293b/FFF?text=Banner')] bg-cover bg-center opacity-50"></div>

        <div className="relative z-10 px-6 pb-6 pt-20">
          <div className="flex items-end gap-4">
            <div className="relative h-20 w-20 rounded-full border-4 border-neutral-01 bg-red-500 overflow-hidden">
              <img
                src="https://avatar.vercel.sh/chairman"
                alt="Chairman"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="mb-2">
              <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
                Chairman
                <span className="text-blue-400">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M10.0002 15.1714L19.1925 5.97906L20.6067 7.39328L10.0002 17.9998L3.63623 11.6358L5.05044 10.2216L10.0002 15.1714Z" />
                  </svg>
                </span>
              </h1>
              <p className="text-neutral-400">@WSBChai... • 32.4K Followers</p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-neutral-tertiary">
              SGE in <span className="text-green-400 font-mono">3d : 5h</span>
            </div>
            <div className="flex items-center gap-4 text-neutral-secondary">
              <span>
                Subs <strong className="text-white">138</strong>
              </span>
              <span>
                TVS <strong className="text-white">29.1K</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-20 mb-4 flex items-center justify-between border-b border-neutral-02 bg-neutral-01/80 py-2 backdrop-blur-md">
        <div className="flex gap-6 text-sm font-medium">
          {["Trending", "SGE", "Following"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "relative pb-2 transition-colors",
                activeTab === tab
                  ? "text-neutral-primary"
                  : "text-neutral-tertiary hover:text-neutral-secondary",
              )}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"></span>
              )}
            </button>
          ))}
        </div>
        <div className="flex gap-2 text-neutral-500">
          <button className="hover:text-white">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="mb-4 flex gap-2">
        <button className="rounded-lg bg-primary-muted-10 px-3 py-1 text-xs font-bold text-primary">
          24h
        </button>
        <button className="rounded-lg bg-neutral-02 px-3 py-1 text-xs font-medium text-neutral-tertiary hover:bg-neutral-03">
          All Time
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {USERS.map((user) => (
          <div
            key={user.id}
            className="group flex items-center justify-between rounded-2xl p-3 transition-colors hover:bg-neutral-02"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-neutral-02">
                <img
                  src={`https://avatar.vercel.sh/${user.name}`}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-white">{user.name}</span>
                  {/* Blue check for some users */}
                  {[1, 4, 7, 9, 10].includes(user.id) && (
                    <span className="text-blue-500 text-xs">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M10.0002 15.1714L19.1925 5.97906L20.6067 7.39328L10.0002 17.9998L3.63623 11.6358L5.05044 10.2216L10.0002 15.1714Z" />
                      </svg>
                    </span>
                  )}
                </div>
                <span className="text-xs text-neutral-tertiary">
                  {user.handle} • {user.followers}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="flex items-center gap-1 text-sm font-bold text-primary">
                {user.price}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="rotate-0"
                >
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              </span>
              <span className="text-xs text-neutral-500">Vol {user.vol}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
