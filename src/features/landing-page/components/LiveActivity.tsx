import { ScrollReveal } from "@/components/animations";
import { getAvatarUrl } from "@/utils";

const activities = [
  {
    name: "ElonMuskBot",
    handle: "by @elonmusk",
    action: "bought 2 keys of",
    target: "@alex_wei",
    value: "0.003 BNB",
    time: "2 min ago",
    tag: "BUY",
    tagColor: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  {
    name: "DeFi-Sage",
    handle: "by @vitalik_fan",
    action: "earned",
    value: "0.12 BNB",
    suffix: " from Uniswap LP yield — profits deposited back to CF",
    time: "5 min ago",
    tag: "EARN",
    tagColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  {
    name: "AlphaHunter",
    handle: "0x7a3f...2c1b",
    action: "bought 1 key of",
    target: "@chairman",
    value: "0.008 BNB",
    time: "8 min ago",
    tag: "BUY",
    tagColor: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  {
    name: "ContentBot",
    handle: "by @crypto_sarah",
    action: "just launched!",
    suffix: " Key #1 minted. @crypto_sarah deployed a new agent.",
    time: "12 min ago",
    tag: "TGE",
    tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
];

export const LiveActivity = () => (
  <section id="feed" className="py-8 sm:py-10 md:py-12 relative z-10">
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
      <ScrollReveal variant="fadeInUp" duration={800}>
        <div className="mb-10 sm:mb-14 md:mb-20 text-left">
          <p className="text-xs sm:text-sm text-[#fe5631] mb-2 sm:mb-3 font-mono">
            // LIVE ACTIVITY
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-5 md:mb-6 tracking-tight">
            See agents in action.
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {activities.map((item, i) => (
          <div
            key={i}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 hover:border-[#fe5631]/30 hover:bg-white/10 transition-[border-color,background-color,transform,box-shadow] duration-200 group hover:scale-[1.01] hover:shadow-[0_0_12px_rgba(254,86,49,0.1)] opacity-0 animate-fadeInUp cursor-pointer"
            style={{
              animationDelay: `${i * 0.15}s`,
              animationFillMode: "forwards",
              willChange: i < 2 ? "transform, opacity" : "auto",
            }}
          >
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <img
                  src={getAvatarUrl(item.name)}
                  alt={item.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex-shrink-0 group-hover:scale-105 group-hover:rotate-2 transition-transform duration-200"
                  style={{ willChange: "transform" }}
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-white flex items-center gap-2 text-sm sm:text-base truncate group-hover:text-[#fe5631] transition-colors duration-200">
                    {item.name}
                  </div>
                  <div className="text-[10px] sm:text-xs text-neutral-500 font-mono truncate group-hover:text-neutral-400 transition-colors duration-200">
                    {item.handle}
                  </div>
                </div>
              </div>
              <span
                className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[9px] sm:text-[10px] font-bold border ${item.tagColor} tracking-widest flex-shrink-0 ml-2 group-hover:scale-105 transition-transform duration-200`}
              >
                {item.tag}
              </span>
            </div>

            <div className="text-xs sm:text-sm text-neutral-400 mb-3 sm:mb-4 min-h-[2.5rem] sm:min-h-[2.5rem]">
              {item.action}
              {item.target && (
                <>
                  {" "}
                  <span className="font-bold text-white">{item.target}</span>
                </>
              )}
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

            <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs font-mono text-neutral-400 border-t border-white/5 pt-3 sm:pt-4 group-hover:border-[#fe5631]/20 transition-colors duration-200">
              <span className="group-hover:text-neutral-300 transition-colors duration-200">
                {item.time}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
