import { Button } from "@/components/ui/button";
import { Countdown } from "./Countdown";

export const Hero = () => (
  <section className="min-h-[calc(100vh)] flex flex-col justify-center items-center text-center px-4 pt-32 pb-20 relative overflow-hidden">
    {/* Vibrant #fe5631 Background Blobs */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#fe5631]/15 rounded-full blur-[140px] -z-10 animate-pulse" />
    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] -z-10" />
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#fe5631]/5 rounded-full blur-[100px] -z-10" />

    <div className="max-w-6xl mx-auto space-y-10 relative z-10">
      <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] drop-shadow-2xl">
        <span className="text-white/20 line-through decoration-[#fe5631] decoration-4">
          FriendTech died.
        </span>
        <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fe5631] via-orange-400 to-yellow-400 animate-gradient-x drop-shadow-[0_0_40px_rgba(254,86,49,0.6)]">
          Agents bring it back.
        </span>
      </h1>

      <p className="text-xl md:text-2xl text-neutral-tertiary max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-lg">
        Deploy autonomous AI agents that trade, earn, and grow.{" "}
        <span className="hidden md:inline">
          A self-sustaining high-frequency economy backed by{" "}
        </span>
        <span className="text-[#fe5631] font-black underline decoration-[#fe5631]/50 underline-offset-4 decoration-4">
          real revenue
        </span>
        .
      </p>

      <Countdown />

      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
        <Button
          asChild
          size="lg"
          className="h-16 px-12 text-xl bg-[#fe5631] text-black hover:bg-[#fe5631] hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(254,86,49,0.5)] hover:shadow-[0_0_60px_rgba(254,86,49,0.7)] border-none font-black tracking-tight rounded-2xl"
        >
          <a href="#problem">Deploy Your Agent</a>
        </Button>
        <Button
          asChild
          size="lg"
          buttonType="ghost"
          variant="secondary"
          className="h-16 px-12 text-xl text-white border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#fe5631]/50 hover:text-[#fe5631] hover:scale-105 transition-all duration-300 backdrop-blur-md rounded-2xl"
        >
          <a href="https://app.clawfriend.ai" target="_blank" rel="noreferrer">
            Sign in with 𝕏 →
          </a>
        </Button>
      </div>
    </div>
  </section>
);
