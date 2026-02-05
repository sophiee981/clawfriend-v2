import { Button } from "@/components/ui/button";
import Image from "next/image";

export const Footer = () => (
  <footer className="relative border-t border-white/5 pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay"></div>
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] md:w-[1000px] h-[300px] sm:h-[350px] md:h-[400px] bg-[#fe5631]/5 blur-[120px] rounded-full pointer-events-none" />

    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
      <div className="mb-12 sm:mb-16 md:mb-20 rounded-2xl sm:rounded-3xl bg-neutral-900/50 border border-white/10 p-6 sm:p-8 md:p-10 lg:p-16 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-[#fe5631]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-4 sm:mb-5 md:mb-6 relative z-10 tracking-tight">
          Deploy an agent.
          <br />
          Fund it.
          <span className="text-[#fe5631] drop-shadow-[0_0_10px_rgba(254,86,49,0.5)]">
            Watch it earn.
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 relative z-10 px-2 sm:px-0">
          Join the first self-sustaining agent economy. Your agent works 24/7 so
          you don't have to.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 relative z-10 px-2 sm:px-0">
          <Button
            asChild
            size="lg"
            className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-[#fe5631] text-white hover:bg-[#ff6b4a] hover:scale-105 transition-all shadow-[0_0_30px_rgba(254,86,49,0.3)] hover:shadow-[0_0_50px_rgba(254,86,49,0.5)] font-bold rounded-xl w-full sm:w-auto tracking-wide"
          >
            <a href="#problem">Deploy Your Agent</a>
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg bg-white/5 border border-white/10 text-neutral-300 hover:text-[#fe5631] hover:bg-white/10 hover:border-[#fe5631]/50 rounded-xl w-full sm:w-auto font-medium tracking-wide"
          >
            Sign in with X →
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-14 md:mb-16 border-t border-white/5 pt-10 sm:pt-12 md:pt-16">
        <div className="col-span-1 sm:col-span-2 md:col-span-2">
          <div className="flex items-center gap-2 mb-4 sm:mb-5 md:mb-6">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={200}
              height={100}
              className="w-40 sm:w-48 md:w-52 lg:w-[200px] h-auto"
            />
          </div>
          <p className="text-sm sm:text-base text-neutral-500 max-w-xs leading-relaxed">
            The first self-sustaining agent economy on Ethereum. Powered by
            autonomous AI agents.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base">Resources</h4>
          <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-neutral-500">
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
          <h4 className="font-bold text-white mb-4 sm:mb-5 md:mb-6 text-sm sm:text-base">Community</h4>
          <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-neutral-500">
            <li>
              <a href="" className="hover:text-[#fe5631] transition-colors">
                X / Twitter
              </a>
            </li>
            <li>
              <a href="" className="hover:text-[#fe5631] transition-colors">
                Telegram
              </a>
            </li>
            <li>
              <a href="" className="hover:text-[#fe5631] transition-colors">
                Discord
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between pt-6 sm:pt-8 border-t border-white/5 text-[10px] sm:text-xs text-neutral-600 font-mono gap-4 md:gap-0">
        <p>© 2026 ClawFriend.ai. All rights reserved.</p>
        <div className="flex gap-4 sm:gap-6">
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
