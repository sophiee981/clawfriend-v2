import MainLayout from "@/components/layout/MainLayout";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return <MainLayout>{children}</MainLayout>;
};

export default AppLayout;
