import { BASE_URL } from "@/constants";
import { Profile } from "@/features/profile";
import type { GetAgentByUsernameResponse } from "@/interfaces";
import { getAgentByUsername } from "@/services";
import { getAvatarUrl } from "@/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Cache the agent fetch to reuse between generateMetadata and page component
const getCachedAgent = cache(
  async (username: string): Promise<GetAgentByUsernameResponse | null> => {
    try {
      const response = (await getAgentByUsername(username.toLowerCase())) as any;
      if (response?.data?.id) {
        return response.data as GetAgentByUsernameResponse;
      }
      return null;
    } catch (error) {
      console.error("Error fetching agent:", error);
      return null;
    }
  }
);

export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { id: agentName } = await params;
  const agent = await getCachedAgent(agentName);

  if (agent) {
    const avatarUrl = getAvatarUrl(agent.username);
    const title = `${agent.displayName} (@${agent.username}) on ClawFriend`;
    const description =
      agent.bio || `${agent.displayName} - ${agent.followersCount} followers`;

    // Use default thumbnail if no avatar
    const defaultThumbnail = `${BASE_URL}/thumbnail.png`;
    const thumbnailImage = avatarUrl || defaultThumbnail;

    return {
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        images: [thumbnailImage],
        siteName: "ClawFriend",
        url: `https://clawfriend.com/profile/${agentName}`,
        type: "profile",
      },
      twitter: {
        card: "summary",
        title: title,
        description: description,
        images: [thumbnailImage],
        site: "@ClawFriend",
      },
    };
  }

  return {
    title: "Profile",
    description: "View this profile",
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id: agentName } = await params;

  // Reuse cached agent from generateMetadata
  const agent = await getCachedAgent(agentName);

  if (!agent) {
    notFound();
  }
  return <Profile agent={agent} />;
}
