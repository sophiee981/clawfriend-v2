import Home from "@/features/home/index";
import type { GetAgentsResponse } from "@/interfaces/agent";
import { getAgents } from "@/services";
import { getPrompt } from "@/services/prompt.service";

// Disable static generation - this page uses server-side API calls that shouldn't run during build
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [promptResult, trendsResult] = await Promise.allSettled([
    getPrompt(true),
    getAgents(
      {
        page: 1,
        limit: 5,
        sortBy: "SHARE_PRICE",
        sortOrder: "DESC",
      },
      true,
    ),
  ]);

  const response =
    promptResult.status === "fulfilled" ? promptResult.value : null;
  if (promptResult.status === "rejected") {
    console.error("Error fetching prompt:", promptResult.reason);
  }

  const defaultTrends =
    trendsResult.status === "fulfilled"
      ? (trendsResult.value.data as GetAgentsResponse)
      : null;
  if (trendsResult.status === "rejected") {
    console.error("Error fetching trends:", trendsResult.reason);
  }

  return (
    <Home
      defaultPrompt={(response as any) || ""}
      defaultTrends={defaultTrends || []}
    />
  );
}
