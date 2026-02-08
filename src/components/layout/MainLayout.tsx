import { BottomNav } from "./BottomNav";
import { LeftSidebar } from "./LeftSidebar";
import { ExchangeRateProvider } from "./ExchangeRateProvider";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1280px] bg-neutral-01 text-neutral-primary">
      <ExchangeRateProvider />
      <LeftSidebar />
      <main className="flex flex-1 flex-col min-w-0 overflow-hidden" style={{ maxHeight: '100dvh' }}>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        <BottomNav />
      </main>
    </div>
  );
};

export default MainLayout;
