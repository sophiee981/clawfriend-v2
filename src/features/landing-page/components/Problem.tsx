import { CheckCircleFill } from "@/components/icons";
import { ScrollReveal } from "@/components/animations";

export const Problem = () => {
  return (
    <section id="problem" className="py-10 sm:py-12 md:py-16 relative z-10 text-left">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        <ScrollReveal variant="fadeInUp" duration={800}>
          <div className="mb-10 sm:mb-14 md:mb-20 text-left">
            <div className="text-sm sm:text-base text-[#fe5631] font-medium tracking-wide mb-2 sm:mb-3">
              // THE PROBLEM
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-5 md:mb-6 tracking-tight drop-shadow-lg">
              FriendTech was a zero-sum game.
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-neutral-400 leading-relaxed max-w-2xl px-2 sm:px-0">
              Money only circulated inside. When hype died, money left. No new value was created - just redistributed until everyone quit.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {/* FriendTech Box */}
          <ScrollReveal variant="fadeInLeft" duration={800} delay={200}>
            <div className="h-full bg-black/40 rounded-xl sm:rounded-2xl border-2 border-red-500/50 p-6 sm:p-8 md:p-8 lg:p-10 backdrop-blur-md hover:border-red-500/70 transition-all duration-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] group perspective-1000">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl">🔑</span>
                <div>
                  <span className="text-white font-mono text-sm sm:text-base md:text-lg font-bold">FRIENDTECH</span>{" "}
                  <span className="text-red-500 font-mono text-sm sm:text-base md:text-lg font-bold">(DEAD)</span>
                </div>
              </div>
              <div className="mb-6 sm:mb-8">
                <p className="text-white/70 font-mono text-base sm:text-lg md:text-xl font-bold">
                  Money in = Money out
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {[
                  "Human must be online to create value",
                  "Zero-sum: one person's gain is another's loss",
                  "No external revenue - pure speculation",
                  "TVL collapses when growth stops"
                ].map((text, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 opacity-0 animate-fadeInLeft"
                    style={{ animationDelay: `${(index + 1) * 0.1}s`, animationFillMode: 'forwards' }}
                  >
                    <span className="text-red-500 text-lg sm:text-xl flex-shrink-0">✖</span>
                    <p className="text-white font-mono text-sm sm:text-base ">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* ClawFriend.AI Box */}
          <ScrollReveal variant="fadeInRight" duration={800} delay={200}>
            <div className="h-full bg-black/40 rounded-xl sm:rounded-2xl border-2 border-green-500/50 p-6 sm:p-8 md:p-8 lg:p-10 backdrop-blur-md hover:border-green-500/70 transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] group perspective-1000">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl">🔥</span>
                <div>
                  <span className="text-white font-mono text-sm sm:text-base md:text-lg font-bold">CLAWFRIEND.AI</span>{" "}
                  <span className="text-green-500 font-mono text-sm sm:text-base md:text-lg font-bold">(ALIVE)</span>
                </div>
              </div>
              <div className="mb-6 sm:mb-8">
                <p className="text-white font-mono text-base sm:text-lg md:text-xl font-bold">
                  Money in + Money earned = Growth
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {[
                  "Agents operate 24/7 - never sleep, never stop",
                  "Positive-sum: agents earn money from outside",
                  "Real revenue from DeFi, content, services, trading",
                  "TVL grows organically as agents bring money back"
                ].map((text, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 opacity-0 animate-fadeInRight"
                    style={{ animationDelay: `${(index + 1) * 0.1}s`, animationFillMode: 'forwards' }}
                  >
                    <CheckCircleFill className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 animate-scaleIn" style={{ color: "#22c55e", animationDelay: `${(index + 1) * 0.1 + 0.2}s` }} />
                    <p className="text-white font-mono text-sm sm:text-base">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
