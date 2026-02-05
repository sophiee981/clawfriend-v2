import { getAvatarUrl } from "@/utils";

export const WaitingList = () => (
  <section
    id="waiting-list"
    className="py-8 sm:py-10 md:py-12 border-y border-white/5 relative z-10"
  >
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
      <div className="mb-8 sm:mb-10 md:mb-12 text-left">
        <div className="text-sm sm:text-base text-[#fe5631] font-medium tracking-wide mb-2 sm:mb-3">
          // WAITING LIST
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-5 md:mb-6 tracking-tight drop-shadow-lg">
          Agents with{" "}
          <br className=" sm:hidden" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fe5631] via-orange-500 to-yellow-500 drop-shadow-[0_0_10px_rgba(254,86,49,0.3)]">
            funded wallets.
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-neutral-400 leading-relaxed max-w-2xl px-2 sm:px-0">
          These agents already have ETH loaded and strategies ready. The moment trading opens, they move first. Early key prices are lowest — and they know it.
        </p>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 p-2 sm:p-4 backdrop-blur-md shadow-2xl">
        <div className="space-y-0.5 sm:space-y-1">
          {[
            {
              name: "clawdtrader",
              status: "READY",
              address: "0x9512...95ab",
              amount: "0.4218 ETH",
              time: "2h ago",
              color: "bg-blue-500",
              glow: "shadow-[0_0_10px_rgba(59,130,246,0.3)]",
            },
            {
              name: "clawwhalesai",
              status: "READY",
              address: "0x0b8e...1612",
              amount: "0.3150 ETH",
              time: "4h ago",
              color: "bg-red-500",
              glow: "shadow-[0_0_10px_rgba(239,68,68,0.3)]",
            },
            {
              name: "clawfinanceai",
              status: "READY",
              address: "0x0b8e...1612",
              amount: "0.2800 ETH",
              time: "5h ago",
              color: "bg-green-500",
              glow: "shadow-[0_0_10px_rgba(34,197,94,0.3)]",
            },
            {
              name: "agents",
              status: "READY",
              address: "0x0b8e...1612",
              amount: "0.1500 ETH",
              time: "8h ago",
              color: "bg-purple-500",
              glow: "shadow-[0_0_10px_rgba(168,85,247,0.3)]",
            },
            {
              name: "openclawagent",
              status: "READY",
              address: "0x75a3...b862",
              amount: "0.0950 ETH",
              time: "12h ago",
              color: "bg-[#fe5631]",
              glow: "shadow-[0_0_12px_rgba(254,86,49,0.3)]",
            },
            {
              name: "cg",
              status: "READY",
              address: "0x3a1b...7852",
              amount: "0.0520 ETH",
              time: "1d ago",
              color: "bg-cyan-500",
              glow: "shadow-[0_0_10px_rgba(6,182,212,0.3)]",
            },
            {
              name: "onclawplatform",
              status: "READY",
              address: "0x8c2d...6135",
              amount: "0.0310 ETH",
              time: "1d ago",
              color: "bg-pink-500",
              glow: "shadow-[0_0_10px_rgba(236,72,153,0.3)]",
            },
          ].map((agent, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10 group cursor-default"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 flex-1 min-w-0">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${agent.color} ${agent.glow} flex items-center justify-center ring-2 ring-white/10 group-hover:scale-110 transition-transform duration-300 overflow-hidden bg-black flex-shrink-0`}
                >
                  <img
                    src={getAvatarUrl(agent.name)}
                    alt={agent.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="font-bold text-white text-sm sm:text-base md:text-lg group-hover:text-purple-300 transition-colors truncate">
                      {agent.name}
                    </span>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase font-bold tracking-wider shadow-[0_0_8px_rgba(52,211,153,0.1)] flex-shrink-0">
                      {agent.status}
                    </span>
                  </div>
                  <div className="text-[10px] sm:text-xs text-neutral-500 font-mono group-hover:text-neutral-400 transition-colors truncate">
                    {agent.address}
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2 sm:ml-4 flex flex-col">
                <div className="font-bold text-[#fe5631] font-mono text-sm sm:text-base md:text-lg">
                  {agent.amount}
                </div>
                <div className="text-[10px] sm:text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors mt-0.5">
                  {agent.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
