import { ChainPair } from "@/components/icons";
import { CompleteAvatar } from "@/components/ui/avatar";
import { cn, getAvatarUrl } from "@/utils";
import { formatSmartNumber } from "@/utils/number";
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
        "relative flex flex-col items-center rounded-lg border px-2 sm:px-4 transition-colors cursor-pointer hover:opacity-90",
        isFirst
          ? "border-[#FAEB921A] bg-[#FAEB921A] py-3 sm:py-6"
          : "border-neutral-800 bg-neutral-900 py-2 sm:py-4"
      )}
    >
      {/* Avatar with Rank Badge */}
      <div className="relative">
        {/* Crown Icon for #1 */}
        {isFirst && (
          <div className="absolute -right-2.5 sm:-right-3.5 -top-2.5 sm:-top-3.5 z-10">
            <Image
              src="/images/crown.png"
              alt="Crown"
              width={40}
              height={40}
              className="h-7 w-7 sm:h-10 sm:w-10"
            />
          </div>
        )}
        <CompleteAvatar
          src={getAvatarUrl(agent.username)}
          name={agent.name}
          className={cn(
            "border-0",
            agent.rank === 1 && "h-[56px] w-[56px] sm:h-[72px] sm:w-[72px]",
            agent.rank === 2 && "h-[48px] w-[48px] sm:h-[60px] sm:w-[60px]",
            agent.rank === 3 && "h-[40px] w-[40px] sm:h-[48px] sm:w-[48px]"
          )}
        />
        {/* Rank Badge */}
        <div
          className="absolute -bottom-1.5 sm:-bottom-2 left-1/2 -translate-x-1/2 h-5 w-5 sm:h-6 sm:w-6 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(/images/${agent.rank}.png)`,
          }}
        />
      </div>

      {/* Name and Handle */}
      <div className="flex flex-col items-center gap-0.5 sm:gap-1 mt-4 sm:mt-6 w-full sm:w-auto">
        <p className="text-label-sm sm:text-label-md text-neutral-primary max-w-[100px] sm:max-w-none truncate text-center">
          {agent.name}
        </p>
        <p className="text-body-xs sm:text-body-sm text-neutral-tertiary max-w-[100px] sm:max-w-none truncate text-center">
          @{agent.username}
        </p>
      </div>

      {/* Balance/Volume */}
      <div className="flex flex-col items-center gap-0.5">
        <div className="flex items-center gap-1">
          <p className="text-label-sm sm:text-label-md text-primary">
            {formatSmartNumber(agent.shares)}
          </p>
          <ChainPair className="h-[10px] w-[10px] sm:h-[12px] sm:w-[12px]" />
        </div>
        <p className="text-body-xs sm:text-body-sm text-neutral-tertiary">
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
