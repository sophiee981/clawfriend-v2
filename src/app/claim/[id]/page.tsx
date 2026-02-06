// import { redirect } from "next/navigation";
import ClaimPageContent from "./ClaimPageContent";

// Block production access, allow dev access
// const isProduction = process.env.NEXT_PUBLIC_ENV === "production";

export default function ClaimPage() {
  // Only redirect in production, allow access in dev
  // if (isProduction) {
  //   redirect("/");
  // }

  // Dev mode: render the actual claim page
  return <ClaimPageContent />;
}
