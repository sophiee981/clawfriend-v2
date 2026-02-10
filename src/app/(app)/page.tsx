import Home from "@/features/home/index";
import { getAgentTrends } from "@/services";
import { getPrompt } from "@/services/prompt.service";

// Disable static generation - this page uses server-side API calls that shouldn't run during build
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  console.log("HomePage");
  let response: any;
  try {
    response = await getPrompt(true);
  } catch (error) {
    console.error(error);
  }

  const defaultTrends = await getAgentTrends({ limit: 5 }, true);

  return (
    <Home defaultPrompt={response || ""} defaultTrends={defaultTrends.data} />
  );
}
