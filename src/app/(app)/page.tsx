import Home from "@/features/home/index";
import { getAgentTrends } from "@/services";
import { getPrompt } from "@/services/prompt.service";

export default async function HomePage() {
  const response: any = await getPrompt(true);
  const defaultTrends = await getAgentTrends({
    limit: 5,
  }, true);

  return (
    <Home defaultPrompt={response || ""} defaultTrends={defaultTrends.data} />
  );
}
