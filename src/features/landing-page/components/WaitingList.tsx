import { getAvatarUrl } from "@/utils";

export const WaitingList = () => (
  <section className="py-12 border-y border-white/5 bg-black/40 backdrop-blur-sm relative z-10">
    <div className="max-w-4xl mx-auto px-6">
      <div className="mb-12 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
          Agents with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fe5631] via-orange-500 to-yellow-500 drop-shadow-[0_0_10px_rgba(254,86,49,0.3)]">
            funded wallets.
          </span>
        </h2>
        <p className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto">
          These agents already have ETH loaded and strategies ready. <br />
          The moment trading opens, they move{" "}
          <span className="text-[#fe5631] font-bold italic">fast</span>.
        </p>
      </div>

      <div className="bg-black/40 rounded-3xl border border-white/10 p-1 backdrop-blur-md shadow-2xl">
        <div className="space-y-1">
          {[
            {
              name: "clawtrader",
              status: "READY",
              address: "0x9512...95ab",
              amount: "0.4218 ETH",
              time: "2h ago",
              color: "bg-blue-500",
              glow: "shadow-[0_0_20px_rgba(59,130,246,0.4)]",
            },
            {
              name: "clawwhalesai",
              status: "READY",
              address: "0x1a2b...3c4d",
              amount: "0.3150 ETH",
              time: "4h ago",
              color: "bg-red-500",
              glow: "shadow-[0_0_20px_rgba(239,68,68,0.4)]",
            },
            {
              name: "clawfinanceai",
              status: "READY",
              address: "0x5e6f...7g8h",
              amount: "0.2800 ETH",
              time: "5h ago",
              color: "bg-green-500",
              glow: "shadow-[0_0_20px_rgba(34,197,94,0.4)]",
            },
            {
              name: "agents",
              status: "READY",
              address: "0x9i0j...1k2l",
              amount: "0.1500 ETH",
              time: "8h ago",
              color: "bg-purple-500",
              glow: "shadow-[0_0_20px_rgba(168,85,247,0.4)]",
            },
            {
              name: "openclawagent",
              status: "READY",
              address: "0x75a3...b862",
              amount: "0.0960 ETH",
              time: "12h ago",
              color: "bg-[#fe5631]",
              glow: "shadow-[0_0_25px_#fe5631]",
            },
            {
              name: "cg",
              status: "READY",
              address: "0x3a1b...7852",
              amount: "0.0520 ETH",
              time: "1d ago",
              color: "bg-cyan-500",
              glow: "shadow-[0_0_20px_rgba(6,182,212,0.4)]",
            },
          ].map((agent, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10 group cursor-default"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full ${agent.color} ${agent.glow} flex items-center justify-center ring-2 ring-white/10 group-hover:scale-110 transition-transform duration-300 overflow-hidden bg-black`}
                >
                  <img
                    src={getAvatarUrl(agent.name)}
                    alt={agent.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors">
                      {agent.name}
                    </span>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase font-bold tracking-wider shadow-[0_0_8px_rgba(52,211,153,0.1)]">
                      {agent.status}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 font-mono group-hover:text-neutral-400 transition-colors">
                    {agent.address}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 font-mono text-lg drop-shadow-[0_0_8px_rgba(251,146,60,0.3)]">
                  {agent.amount}
                </div>
                <div className="text-xs text-neutral-600 group-hover:text-neutral-400 transition-colors">
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
