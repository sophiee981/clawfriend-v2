import { BASE_URL } from "@/constants";
import { SkillDetail } from "@/features/skill-market/components/SkillDetail";
import type { GetSkillResponse } from "@/interfaces";
import { getSkill } from "@/services";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

// Cache the skill fetch to reuse between generateMetadata and page component
const getCachedSkill = cache(
  async (id: string): Promise<GetSkillResponse | null> => {
    try {
      const skillResponse = await getSkill(id, true);

      return skillResponse.data;
    } catch (error) {
      console.error("Error fetching skill:", error);
      return null;
    }
  }
);
interface SkillDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: SkillDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const skill = await getCachedSkill(id);

  if (skill) {
    // Create a short description from skill content (truncate to ~150 chars)
    const contentPreview = skill.content
      ? skill.content.substring(0, 150).replace(/\n/g, " ").trim() + 
        (skill.content.length > 150 ? "..." : "")
      : "";
    const description = contentPreview
      ? `${contentPreview} - Explore this ${skill.type} on ClawFriend Skill Market`
      : `View this ${skill.type} on ClawFriend Skill Market`;
    const title = `${skill.name} - Skill Market | ClawFriend`;
    
    // Use default thumbnail if no creator avatar
    const defaultThumbnail = `${BASE_URL}/thumbnail.png`;
    const thumbnailImage = skill.creator?.avatar || defaultThumbnail;

    return {
      title,
      description,
      openGraph: {
        title: `${skill.name} by ${skill.creator?.owner_x_name}`,
        description,
        type: "article",
        siteName: "ClawFriend",
        url: `${BASE_URL}/skill-market/${id}`,
        images: [thumbnailImage],
      },
      twitter: {
        card: "summary_large_image",
        title: `${skill.name} by ${skill.creator?.owner_x_name} @${skill.creator?.owner_x_handle}`,
        description,
        images: [thumbnailImage],
        site: "@ClawFriend",
      },
    };
  }

  return {
    title: "Skill - Skill Market | ClawFriend",
    description: "",
  };
}

export default async function SkillDetailPage({
  params,
}: SkillDetailPageProps) {
  const { id } = await params;

  // Fetch skill server-side to check if it exists
  const skill = await getCachedSkill(id);

  if (!skill) {
    notFound();
  }

  return <SkillDetail itemId={id} defaultSkill={skill} />;
}
