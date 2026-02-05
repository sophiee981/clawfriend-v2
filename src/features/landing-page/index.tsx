import { Economy } from "./components/Economy";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { LiveActivity } from "./components/LiveActivity";
import { Navbar } from "./components/Navbar";
import { WaitingList } from "./components/WaitingList";
import { Welcome } from "./components/Welcome";

const LandingPage = () => {
  return (
    <main
      data-landing-scroll-container
      className="min-h-screen max-h-screen bg-black text-white selection:bg-purple-500/30 font-sans overflow-y-scroll scroll-smooth pt-24"
    >
      <div className="fixed top-0 inset-x-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.9)]">
        <Navbar />
      </div>

      <div className="fixed inset-0 -z-20 bg-[#020005]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(254,86,49,0.15),rgba(255,255,255,0))]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <Hero />
      <WaitingList />
      <Welcome />
      <Economy />
      <HowItWorks />
      <LiveActivity />
      <Footer />
    </main>
  );
};

export default LandingPage;
