import { SkillDetail } from "@/features/skill-academy/components/SkillDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <SkillDetail itemId={id} />;
}
