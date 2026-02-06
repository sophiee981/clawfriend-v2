import Home from "@/features/home/index";
import { getAgentBalanceLeaderboard } from "@/services";
import { getPrompt } from "@/services/prompt.service";

export default async function HomePage() {
  const response: any = await getPrompt();
  const defaultLeaderboard = await getAgentBalanceLeaderboard({
    page: 1,
    limit: 5,
  });

  return (
    <Home
      defaultPrompt={response || ""}
      defaultLeaderboard={defaultLeaderboard.data}
    />
  );
}
