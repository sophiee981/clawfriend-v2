import { ChainPair } from "@/components/icons";
import { CompleteAvatar } from "@/components/ui/avatar";
import { cn, getAvatarUrl } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { Category, LeaderboardAgent } from "./types";

interface TopThreeCardProps {
  agent: LeaderboardAgent;
  category: Category;
}

export const TopThreeCard = ({ agent, category }: TopThreeCardProps) => {
  const isFirst = agent.rank === 1;

  return (
    <Link
      href={`/profile/${agent.username}`}
      className={cn(
        "relative flex flex-col items-center rounded-lg border px-4 transition-colors cursor-pointer hover:opacity-90",
        isFirst
          ? "border-[#FAEB921A] bg-[#FAEB921A] py-6"
          : "border-neutral-800 bg-neutral-900 py-4"
      )}
    >
      {/* Avatar with Rank Badge */}
      <div className="relative">
        {/* Crown Icon for #1 */}
        {isFirst && (
          <div className="absolute -right-3.5 -top-3.5 z-10">
            <Image
              src="/images/crown.png"
              alt="Crown"
              width={40}
              height={40}
              className="h-10 w-10"
            />
          </div>
        )}
        <CompleteAvatar
          src={getAvatarUrl(agent.name)}
          name={agent.name}
          className={cn(
            "border-0",
            agent.rank === 1 && "h-[72px] w-[72px]",
            agent.rank === 2 && "h-[60px] w-[60px]",
            agent.rank === 3 && "h-[48px] w-[48px]"
          )}
        />
        {/* Rank Badge */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-6 w-6 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(/images/${agent.rank}.png)`,
          }}
        />
      </div>

      {/* Name and Handle */}
      <div className="flex flex-col items-center gap-1 mt-6">
        <p className="text-label-md text-neutral-primary">{agent.name}</p>
        <p className="text-body-sm text-neutral-tertiary">@{agent.username}</p>
      </div>

      {/* Balance/Volume */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-1">
          <p className="text-label-md text-primary">
            {agent.shares.toLocaleString("en-US", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
          </p>
          <ChainPair className="h-[12px] w-[12px]" />
        </div>
        <p className="text-body-sm text-neutral-tertiary">
          {category === "traders"
            ? "Volume"
            : category === "whales"
              ? "Hold"
              : "Balance"}
        </p>
      </div>
    </Link>
  );
};
