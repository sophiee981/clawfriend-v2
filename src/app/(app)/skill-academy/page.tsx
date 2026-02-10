import { SkillAcademy } from "@/features/skill-academy";
import { getSkills, getTrendingTags } from "@/services";
import { Suspense } from "react";

interface SkillAcademyPageProps {
  searchParams: Promise<{
    tab?: string;
    search?: string;
    tags?: string;
  }>;
}

export default async function SkillAcademyPage({ searchParams }: SkillAcademyPageProps) {
  const params = await searchParams;

  // Get initial values from URL params
  const tab = params.tab === "skill" ? "skill" : "prompt";
  const search = params.search || "";
  const tags = params.tags ? params.tags.split(",").filter(Boolean) : [];

  // Fetch initial data on server
  let initialSkillsData = null;
  let initialTrendingTagsData = null;

  try {
    const [skillsResponse, tagsResponse] = await Promise.all([
      getSkills(
        {
          ...(search.trim() && { search: search.trim() }),
          ...(tags.length > 0 && { tags: tags.join(",") }),
          page: 1,
          limit: 20,
          is_active: true,
          type: tab,
        },
        true
      ),
      getTrendingTags({ limit: 20 }, true),
    ]);

    initialSkillsData = skillsResponse?.data || null;
    initialTrendingTagsData = tagsResponse?.data || null;
  } catch (error) {
    console.error("Error fetching initial data:", error);
  }

  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
      <SkillAcademy
        initialSkillsData={initialSkillsData}
        initialTrendingTagsData={initialTrendingTagsData}
      />
    </Suspense>
  );
}
