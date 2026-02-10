import Home from "@/features/home/index";
import { getAgentTrends } from "@/services";
import { getPrompt } from "@/services/prompt.service";

export default async function HomePage() {
  const response: any = await getPrompt();
  const defaultTrends = await getAgentTrends({
    limit: 5,
  });

  return (
    <Home defaultPrompt={response || ""} defaultTrends={defaultTrends.data} />
  );
}
