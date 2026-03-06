import { SkillAcademy } from "@/features/skill-market";
import {
  GetSkillsResponse,
  GetTrendingTagsResponse,
} from "@/interfaces/academy";
import { getSkills, getTrendingTags } from "@/services";

interface SkillAcademyPageProps {
  searchParams: Promise<{
    tab?: string;
    search?: string;
    tags?: string;
  }>;
}

export default async function SkillAcademyPage({
  searchParams,
}: SkillAcademyPageProps) {
  const params = await searchParams;

  // Get initial values from URL params
  const tab = params.tab === "skill" ? "skill" : "prompt";
  const search = params.search || "";
  const tags = params.tags ? params.tags.split(",").filter(Boolean) : [];

  // Fetch initial data on server
  let initialSkillsData: GetSkillsResponse | null = null;
  let initialTrendingTagsData: GetTrendingTagsResponse | null = null;

  try {
    const [skillsResponse, tagsResponse] = await Promise.all([
      getSkills(
        {
          ...(search.trim() && { search: search.trim() }),
          ...(tags.length > 0 && { tags: tags.join(",") }),
          page: 1,
          limit: 18,
          is_active: true,
          sort_by: "hottest",
          sort_order: "desc",
        },
        true
      ),
      getTrendingTags({ limit: 20 }, true),
    ]);

    console.log(skillsResponse, tagsResponse);

    initialSkillsData = skillsResponse?.data || null;
    initialTrendingTagsData = tagsResponse?.data || null;
  } catch (error) {
    console.error("Error fetching initial data:", error);
  }
  if (initialSkillsData) {
    initialSkillsData.data = initialSkillsData.data.map((skill) => ({
      ...skill,
      content: skill.content ? skill.content.substring(0, 150) : "",
    }));
  }

  return (
    <SkillAcademy
      initialSkillsData={
        initialSkillsData || { data: [], total: 0, page: 1, limit: 18 }
      }
      initialTrendingTagsData={initialTrendingTagsData || { tags: [] }}
    />
  );
}
