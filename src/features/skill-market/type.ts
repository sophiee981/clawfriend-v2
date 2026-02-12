export type AcademyItemType = "skill" | "workflow" | "prompt";

export interface AcademyItem {
  id: string;
  title: string;
  content: string; // The full prompt or skill config JSON
  author?: {
    name: string;
    avatar: string;
    handle: string;
    username?: string;
  };
  type: AcademyItemType;
  tags: string[];
  likes: number;
  uses: number;
  is_liked: boolean;
  createdAt: string;
  // Optional metadata for display
  description?: string;
  version_number?: string;
  version_id?: string;
  visibility?: "public" | "private";
}
