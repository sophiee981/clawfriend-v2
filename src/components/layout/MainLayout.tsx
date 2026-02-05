import { BottomNav } from "./BottomNav";
import { LeftSidebar } from "./LeftSidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1280px] bg-neutral-01 text-neutral-primary">
      <LeftSidebar />
      <main className="flex flex-1 flex-col min-w-0 overflow-hidden max-h-screen">
        <div className="flex-1 overflow-y-auto pb-[72px] md:pb-0">
          {children}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default MainLayout;
