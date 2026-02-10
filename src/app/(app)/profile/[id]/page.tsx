import { Profile } from "@/features/profile";
import type { GetAgentByUsernameResponse } from "@/interfaces";
import { getAgentByUsername } from "@/services";
import { notFound } from "next/navigation";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id: agentName } = await params;

  let agent: GetAgentByUsernameResponse | null = null;

  try {
    // Fetch agent data from API
    const response = await getAgentByUsername(agentName);
    // Check if API call was successful
    if (response?.data) {
      agent = response.data;
    } else {
      console.error("Agent not found in API response");
      notFound();
    }
  } catch (error) {
    console.error("Error fetching agent:", error);
    notFound();
  }

  if (!agent) {
    notFound();
  }

  return <Profile agent={agent} />;
}
