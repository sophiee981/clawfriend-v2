import { redirect } from "next/navigation";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  redirect("/");
};

export default AppLayout;
