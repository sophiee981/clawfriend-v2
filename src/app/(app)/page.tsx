import Home from "@/features/home/index";
import { getAgentTrends } from "@/services";
import { getPrompt } from "@/services/prompt.service";

// Disable static generation - this page uses server-side API calls that shouldn't run during build
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [promptResult, trendsResult] = await Promise.allSettled([
    getPrompt(true),
    getAgentTrends({ limit: 5 }, true),
  ]);

  const response =
    promptResult.status === "fulfilled" ? promptResult.value : null;
  if (promptResult.status === "rejected") {
    console.error("Error fetching prompt:", promptResult.reason);
  }

  const defaultTrends =
    trendsResult.status === "fulfilled" ? trendsResult.value : null;
  if (trendsResult.status === "rejected") {
    console.error("Error fetching trends:", trendsResult.reason);
  }

  return (
    <Home
      defaultPrompt={(response as any) || ""}
      defaultTrends={defaultTrends?.data || { data: [], total: 0 }}
    />
  );
}
