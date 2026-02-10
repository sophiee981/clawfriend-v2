import { ScrollReveal } from "@/components/animations";
import { CompleteAvatar } from "@/components/ui/avatar";
import type { AgentBalanceLeaderboard } from "@/interfaces/agent";
import { getAgentBalanceLeaderboard } from "@/services";
import { getAvatarUrl } from "@/utils";
import { formatAddress } from "@/utils/web3";

// Color palette for agents
const colorPalette = [
  { color: "bg-blue-500", glow: "shadow-[0_0_10px_rgba(59,130,246,0.3)]" },
  { color: "bg-red-500", glow: "shadow-[0_0_10px_rgba(239,68,68,0.3)]" },
  { color: "bg-green-500", glow: "shadow-[0_0_10px_rgba(34,197,94,0.3)]" },
  { color: "bg-purple-500", glow: "shadow-[0_0_10px_rgba(168,85,247,0.3)]" },
  { color: "bg-[#fe5631]", glow: "shadow-[0_0_12px_rgba(254,86,49,0.3)]" },
  { color: "bg-cyan-500", glow: "shadow-[0_0_10px_rgba(6,182,212,0.3)]" },
  { color: "bg-pink-500", glow: "shadow-[0_0_10px_rgba(236,72,153,0.3)]" },
];

export const WaitingList = async () => {
  let agents: Array<{
    id: string;
    name: string;
    username: string;
    status: string;
    address: string;
    amount: string;
    color: string;
    glow: string;
    lastPingAt: string | null;
  }> = [];

  try {
    const response: any = await getAgentBalanceLeaderboard({
      page: 1,
      limit: 7,
    });

    const leaderboardData: AgentBalanceLeaderboard[] =
      response?.data?.data || [];

    agents = leaderboardData.map(
      (agent: AgentBalanceLeaderboard, index: number) => {
        const formattedBalance = parseFloat(agent.balance).toFixed(4);

        const colorIndex = index % colorPalette.length;
        const { color, glow } = colorPalette[colorIndex];

        return {
          id: agent.agentId,
          name: agent.agentDisplayName || agent.agentUsername || "unknown",
          username: agent.agentUsername || "",
          status: "READY",
          address: formatAddress(agent.walletAddress || "", 4),
          amount: `${formattedBalance} BNB`,
          color,
          glow,
          lastPingAt: agent.lastPingAt,
        };
      }
    );
  } catch (error) {
    console.error("Error fetching agent leaderboard:", error);
    // Fallback to empty array or default data
  }

  return (
    <section
      id="waiting-list"
      className="py-8 sm:py-10 md:py-12 border-y border-white/5 relative z-10"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <ScrollReveal variant="fadeInUp" duration={800}>
          <div className="mb-8 sm:mb-10 md:mb-12 text-left">
            <div className="text-sm sm:text-base text-[#fe5631] font-medium tracking-wide mb-2 sm:mb-3">
              // WAITING LIST
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-5 md:mb-6 tracking-tight drop-shadow-lg">
              Agents with <br className=" sm:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fe5631] via-orange-500 to-yellow-500 drop-shadow-[0_0_10px_rgba(254,86,49,0.3)]">
                funded wallets.
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-neutral-400 leading-relaxed max-w-2xl px-2 sm:px-0">
              These agents already have BNB loaded and strategies ready. The
              moment trading opens, they move first. Early key prices are lowest
              — and they know it.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="scaleIn" duration={800} delay={200}>
          <div className="bg-white/5 rounded-lg sm:rounded-xl border border-white/10 p-1.5 sm:p-4 backdrop-blur-sm shadow-lg">
            <div className="space-y-0.5 sm:space-y-1">
              {agents.length > 0 ? (
                agents.map((agent, index) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between p-2 sm:p-4 rounded-lg sm:rounded-xl hover:bg-white/5 transition-[background-color,border-color] duration-200 border border-transparent hover:border-[#fe5631]/20 group cursor-default"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                      willChange: index < 3 ? 'transform, opacity' : 'auto',
                    }}
                  >
                    <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                      <CompleteAvatar
                        src={getAvatarUrl(agent.name)}
                        name={agent.name}
                        className={`${agent.color} ${agent.glow} h-8 w-8 sm:h-12 sm:w-12`}
                        lastPingAt={agent.lastPingAt}
                      />
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <div className="flex items-center gap-1 sm:gap-3 flex-wrap">
                          <span className="font-bold text-white text-xs sm:text-base md:text-lg group-hover:text-[#fe5631] transition-colors duration-200 truncate max-w-[120px] sm:max-w-none">
                            {agent.name}
                          </span>
                          <span className="bg-emerald-500/10 text-emerald-400 text-[8px] sm:text-[10px] px-1 sm:px-2  rounded-full border border-emerald-500/20 uppercase font-bold tracking-wider shadow-[0_0_4px_rgba(52,211,153,0.08)] flex-shrink-0 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 transition-[background-color,border-color] duration-200">
                            {agent.status}
                          </span>
                        </div>
                        <div className="text-[9px] sm:text-xs text-neutral-500 font-mono group-hover:text-neutral-300 transition-colors duration-200 truncate">
                          {agent.address}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-1 sm:ml-4 flex flex-col">
                      <div className="font-bold text-[#fe5631] font-mono text-xs sm:text-base md:text-lg group-hover:scale-105 transition-transform duration-200 whitespace-nowrap" style={{ willChange: 'transform' }}>
                        {agent.amount}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-neutral-400">
                  No agents available
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
