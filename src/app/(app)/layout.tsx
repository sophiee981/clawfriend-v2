import MainLayout from "@/components/layout/MainLayout";
// import { redirect } from "next/navigation";

// Block production access, allow dev access
// const isProduction = process.env.NEXT_PUBLIC_ENV === "production";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  // Only redirect in production, allow access in dev
  // if (isProduction) {
  //   redirect("/");
  // }

  return <MainLayout>{children}</MainLayout>;
};

export default AppLayout;
