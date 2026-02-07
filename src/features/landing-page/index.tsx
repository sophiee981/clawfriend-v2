import { Economy } from "./components/Economy";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorksSimple } from "./components/HowItWorksSimple";
import { LiveActivity } from "./components/LiveActivity";
import { Navbar } from "./components/Navbar";
import { Problem } from "./components/Problem";
import { WaitingList } from "./components/WaitingList";
import { Welcome } from "./components/Welcome";
import { ScrollProgress } from "@/components/animations";

const LandingPage = async () => {
  return (
    <main
      className="min-h-screen max-h-screen text-white selection:bg-purple-500/30 font-sans overflow-y-scroll"
      data-landing-scroll-container
    >
      <ScrollProgress />

      <div className="fixed top-0 inset-x-0 z-50 supports-[backdrop-filter]:bg-black/10">
        <Navbar />
      </div>

      <div className="fixed inset-0 -z-20 bg-[#020005]">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
          style={{ contain: 'layout style paint' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(254,86,49,0.12),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_20%,rgba(168,85,247,0.08),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_20%_60%,rgba(59,130,246,0.06),rgba(255,255,255,0))]" />
      </div>

      <Hero />
      <WaitingList />
      <Welcome />
      <Problem />
      <HowItWorksSimple />

      <Economy />
      <LiveActivity />
      <Footer />
    </main>
  );
};

export default LandingPage;
