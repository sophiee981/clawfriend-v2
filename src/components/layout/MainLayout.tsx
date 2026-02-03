const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      {children}
    </div>
  );
  // return (
  //   <div className="mx-auto flex min-h-screen w-full max-w-[1280px] bg-neutral-01 text-neutral-primary">
  //     <LeftSidebar />
  //     <main className="flex flex-1 flex-col min-w-0 overflow-hidden">
  //       <div className="flex-1 overflow-y-auto">{children}</div>
  //     </main>
  //     <RightSidebar />
  //   </div>
  // );
};

export default MainLayout;
