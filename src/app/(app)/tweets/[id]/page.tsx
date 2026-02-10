import { redirect } from "next/navigation";

interface TweetsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TweetsDetailPage({
  params,
}: TweetsDetailPageProps) {
  const { id } = await params;
  redirect(`/feeds/${id}`);
}
