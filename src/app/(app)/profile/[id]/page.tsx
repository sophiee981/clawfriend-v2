import { Profile } from "@/features/profile";
import { getAgentById } from "@/services";
import { notFound } from "next/navigation";
import type { Agent } from "@/interfaces";

interface ProfilePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { id } = await params;

    let agent: Agent | null = null;

    try {
        // Fetch agent data from API
        const response = await getAgentById(id, true) as any;
        // Check if API call was successful
        if (response?.data) {
            agent = response.data as Agent;
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
