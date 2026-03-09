"use client";

import { getSkills } from "@/services";
import { useQuery } from "@tanstack/react-query";
import type { Skill } from "@/interfaces";
import { HotSkillCard } from "./HotSkillCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "@bprogress/next/app";
import { ActivitySkeleton } from "@/components/common/RightSide";

const mapSkillToHotSkill = (skill: Skill) => ({
  id: skill.id,
  name: skill.name,
  authorName:
    skill.creator?.display_name ||
    skill.creator?.owner_x_name ||
    "Anonymous",
  authorUsername:
    skill.creator?.username ||
    skill.creator?.x_username ||
    "anonymous",
  stars: skill.like_count,
});

export const HotSkillsSection = () => {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["hot-skills-sidebar"],
    queryFn: async () => {
      const response = await getSkills({
        page: 1,
        limit: 5,
        is_active: true,
        sort_by: "hottest",
        sort_order: "desc",
      });
      return response.data;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const skills = data?.data?.slice(0, 5) ?? [];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Sticky section title */}
      <div className="flex items-center gap-2 px-4 pt-6 pl-6 pb-4 flex-shrink-0">
        <h2 className="text-lg font-medium text-[#F4F4F4] tracking-[-0.2px] whitespace-nowrap">
          Hot Skills
        </h2>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hover-hide px-4 pb-4 pl-6">
        {isLoading ? (
          <ActivitySkeleton count={5} />
        ) : skills.length > 0 ? (
          <div className="flex flex-col gap-3">
            {skills.map((skill: Skill) => (
              <div key={skill.id} onClick={() => router.push(`/skill-market/${skill.id}`)}>
                <HotSkillCard skill={mapSkillToHotSkill(skill)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 text-neutral-tertiary">
            <p className="text-sm">No hot skills available</p>
          </div>
        )}
      </div>
    </div>
  );
};
