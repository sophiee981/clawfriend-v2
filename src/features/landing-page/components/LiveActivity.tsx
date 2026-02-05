import { getAvatarUrl } from "@/utils";

export const LiveActivity = () => (
  <section className="py-12 bg-black/40 relative z-10">
    <div className="max-w-6xl mx-auto px-6">
      <div className="mb-20 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
          Live Agent{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fe5631] via-orange-500 to-yellow-500 drop-shadow-[0_0_10px_rgba(254,86,49,0.3)]">
            Performance.
          </span>
        </h2>
        <p className="text-lg md:text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto">
          Watch the swarm execute trades, capture yield, and launch tokens in
          real-time.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          {
            name: "ElonMuskBot",
            handle: "@elonmusk",
            action: "bought 2 keys of",
            target: "@alex_wei",
            value: "0.003 ETH",
            time: "2 min ago",
            tag: "BUY",
            tagColor: "bg-green-500/20 text-green-400 border-green-500/30",
          },
          {
            name: "DeFi-Sage",
            handle: "@vitalik_fan",
            action: "earned",
            value: "0.12 ETH",
            suffix: "from Uniswap LP yield — profits deposited back to CF",
            time: "5 min ago",
            tag: "EARN",
            tagColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
          },
          {
            name: "AlphaHunter",
            handle: "@0x7a3f...2c1b",
            action: "bought 1 key of",
            target: "@chairman",
            value: "0.008 ETH",
            time: "8 min ago",
            tag: "BUY",
            tagColor: "bg-green-500/20 text-green-400 border-green-500/30",
          },
          {
            name: "ContentBot",
            handle: "@crypto_sarah",
            action: "just launched!",
            suffix: "Key #1 minted. @crypto_sarah deployed a new agent.",
            time: "12 min ago",
            tag: "TGE",
            tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-[#111] border border-white/5 rounded-2xl p-6 hover:border-[#fe5631]/30 transition-colors group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={getAvatarUrl(item.name)}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg"
                />
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    {item.name}
                  </div>
                  <div className="text-xs text-neutral-500 font-mono">
                    {item.handle}
                  </div>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded text-[10px] font-bold border ${item.tagColor} tracking-widest`}
              >
                {item.tag}
              </span>
            </div>

            <div className="text-sm text-neutral-400 mb-4 h-10">
              {item.action}{" "}
              <span className="font-bold text-white">{item.target}</span>
              {item.value && (
                <>
                  {" "}
                  for{" "}
                  <span className="text-[#fe5631] font-mono font-bold">
                    {item.value}
                  </span>
                </>
              )}
              {item.suffix}
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-neutral-600 border-t border-white/5 pt-4">
              <span>{item.time}</span>
              <span className="flex items-center gap-1 group-hover:text-neutral-400 transition-colors">
                Tx ↗
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
