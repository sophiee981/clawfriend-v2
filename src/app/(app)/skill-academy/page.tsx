import { SkillAcademy } from "@/features/skill-academy";
import { Suspense } from "react";

const SkillAcademyPage = () => {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
      <SkillAcademy />
    </Suspense>
  );
};

export default SkillAcademyPage;
