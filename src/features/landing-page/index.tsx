import { Economy } from "./components/Economy";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorksSimple } from "./components/HowItWorksSimple";
import { LiveActivity } from "./components/LiveActivity";
import { Navbar } from "./components/Navbar";
import { Problem } from "./components/Problem";
import { WaitingList } from "./components/WaitingList";
import { Welcome } from "./components/Welcome";
import { ScrollProgress, ScrollDownIndicator } from "@/components/animations";

const LandingPage = async () => {
  return (
    <main
      className="min-h-screen max-h-screen text-white selection:bg-purple-500/30 font-sans overflow-y-scroll"
      data-landing-scroll-container
    >
      <ScrollProgress />
      {/* <ScrollDownIndicator /> */}
      
      <div className="fixed top-0 inset-x-0 z-50 supports-[backdrop-filter]:bg-black/10">
        <Navbar />
      </div>

      {/* Enhanced Background with Grid, Gradients, and Floating Shapes */}
      <div className="fixed inset-0 -z-20 bg-[#020005]">
        {/* Animated Grid Pattern - Enhanced visibility */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:4rem_4rem] animate-[grid_20s_linear_infinite]" />
        </div>

        {/* Multi-color Gradient Overlays - Balanced and softer */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(254,86,49,0.12),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_20%,rgba(168,85,247,0.08),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_20%_60%,rgba(59,130,246,0.06),rgba(255,255,255,0))]" />

        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#a855f714] rounded-full blur-3xl animate-[float_15s_ease-in-out_infinite]" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-[#f9731614] rounded-full blur-3xl animate-[float_20s_ease-in-out_infinite_reverse]" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-[#3b82f614] rounded-full blur-3xl animate-[float_18s_ease-in-out_infinite]" />

        {/* Animated Icons/Shapes - Subtle */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-[#c084fc33] rotate-45 animate-[spin_10s_linear_infinite]" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-[#fb923c33] rounded-full animate-[pulse_3s_ease-in-out_infinite]" />
        {/* <div className="absolute bottom-1/3 left-1/2 w-5 h-5 bg-[#60a5fa33] rotate-12 animate-[bounce_4s_ease-in-out_infinite]" /> */}
        <div className="absolute top-2/3 right-1/4 w-4 h-4 bg-[#f472b633] rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />

        {/* Additional decorative elements */}
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-[#22d3ee26] rounded-full animate-[pulse_4s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-[#fbbf2426] rotate-45 animate-[spin_15s_linear_infinite]" />

        {/* Dark overlay for better text contrast - lighter */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/25" />

        {/* Noise Texture */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-18 brightness-100 contrast-150 mix-blend-overlay"></div>

        {/* Spotlight Effects - Balanced */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-[#a855f714] to-transparent blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />

        {/* Footer Area Effects - For balance */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-t from-[#f9731612] to-transparent blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute bottom-10 left-20 w-64 h-64 bg-[#a855f710] rounded-full blur-3xl animate-[float_17s_ease-in-out_infinite]" />
        <div className="absolute bottom-32 right-16 w-72 h-72 bg-[#3b82f610] rounded-full blur-3xl animate-[float_22s_ease-in-out_infinite_reverse]" />

        {/* Footer decorative icons */}
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-[#c084fc30] rounded-full animate-[pulse_5s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-[#22d3ee30] rotate-45 animate-[spin_12s_linear_infinite]" />
        <div className="absolute bottom-20 left-2/3 w-2 h-2 bg-[#fb923c30] rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
      </div>

      <Hero />
      <WaitingList />
      <Welcome />
      <Problem />
      <HowItWorksSimple />

      <Economy />
      {/* <HowItWorks /> */}
      <LiveActivity />
      <Footer />
    </main>
  );
};

export default LandingPage;
