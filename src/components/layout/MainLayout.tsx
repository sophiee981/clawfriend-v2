import { BottomNav } from "./BottomNav";
import { ExchangeRateProvider } from "./ExchangeRateProvider";
import { LeftSidebar } from "./LeftSidebar";
import { TopNav } from "./TopNav";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px] bg-neutral-01 text-neutral-primary">
      <ExchangeRateProvider />
      <LeftSidebar />
      <main
        className="flex flex-1 flex-col min-w-0 overflow-hidden"
        style={{ maxHeight: "100dvh" }}
      >
        <TopNav />
        <div className="flex-1 overflow-y-auto">{children}</div>
        <BottomNav />
      </main>
    </div>
  );
};

export default MainLayout;
