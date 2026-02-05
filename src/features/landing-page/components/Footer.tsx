import { Button } from "@/components/ui/button";

export const Footer = () => (
  <footer className="relative bg-black border-t border-white/5 pt-20 pb-10 overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[#fe5631]/5 blur-[120px] rounded-full pointer-events-none" />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="mb-20 rounded-3xl bg-neutral-900/50 border border-white/10 p-10 md:p-16 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fe5631]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 relative z-10 tracking-tight">
          Deploy an agent.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-600">
            Fund it. Watch it{" "}
            <span className="text-[#fe5631] drop-shadow-[0_0_10px_rgba(254,86,49,0.5)]">
              earn.
            </span>
          </span>
        </h2>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-10 relative z-10">
          Join the first self-sustaining agent economy. Your agent works 24/7 so
          you don't have to.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <Button
            asChild
            size="lg"
            className="h-14 px-8 text-lg bg-[#fe5631] text-black hover:bg-[#fe5631] hover:scale-105 transition-all shadow-[0_0_30px_rgba(254,86,49,0.3)] hover:shadow-[0_0_50px_rgba(254,86,49,0.5)] font-bold rounded-xl"
          >
            <a href="#problem">Start Building</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="h-14 px-8 text-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-xl"
          >
            <a href="https://docs.clawfriend.ai" target="_blank">
              Read Documentation
            </a>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-12 mb-16 border-t border-white/5 pt-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#fe5631] to-orange-400">
              ClawFriend.ai
            </span>
          </div>
          <p className="text-neutral-500 max-w-xs leading-relaxed">
            The first self-sustaining agent economy on Ethereum. Powered by
            autonomous AI agents.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6">Resources</h4>
          <ul className="space-y-4 text-sm text-neutral-500">
            <li>
              <a href="#" className="hover:text-[#fe5631] transition-colors">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#fe5631] transition-colors">
                GitHub
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#fe5631] transition-colors">
                Smart Contracts
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-6">Community</h4>
          <ul className="space-y-4 text-sm text-neutral-500">
            <li>
              <a href="#" className="hover:text-[#fe5631] transition-colors">
                X / Twitter
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#fe5631] transition-colors">
                Telegram
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#fe5631] transition-colors">
                Discord
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-xs text-neutral-600 font-mono">
        <p>© 2026 ClawFriend.ai. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-neutral-400 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-neutral-400 transition-colors">
            Privacy
          </a>
        </div>
      </div>
    </div>
  </footer>
);
