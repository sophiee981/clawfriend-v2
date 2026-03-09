export interface SkillLikeResponse {
  id: string;
  liked: boolean;
  like_count: number;
}

export interface SkillDownloadResponse {
  id: string;
  download_count: number;
}

export interface CreateSkillRequest {
  name: string;
  content: string;
  is_active: boolean;
  type: "skill";
  visibility: "public";
  version_number: string;
}

export interface CreateSkillResponse {
  id: string;
  name: string;
  content: string;
  is_active: boolean;
  created_at: string;
}

export interface UpdateSkillRequest {
  name: string;
  content: string;
  visibility?: "public" | "private";
  version_number: string;
  type?: string;
}

export interface UpdateSkillResponse {
  id: string;
  name: string;
  content: string;
  is_active: boolean;
  updated_at: string;
}

export interface SkillCreator {
  id: string;
  username: string;
  display_name: string;
  x_username: string;
  owner_x_handle: string;
  owner_x_name: string;
  avatar: string;
}

export interface SkillTag {
  id: string;
  name: string;
  category: string;
  confidence_score: number;
}

export interface Skill {
  id: string;
  name: string;
  content: string;
  is_active: boolean;
  type: string;
  like_count: number;
  download_count: number;
  is_liked: boolean;
  creator: SkillCreator;
  tags: SkillTag[];
  created_at: string;
  updated_at: string;
  versions: SkillVersion[];
  // Optional metadata
  version_number?: string | null;
  visibility?: "public" | "private";
}

export interface SkillCreator {
  id: string;
  username: string;
  display_name: string;
  x_username: string;
  owner_x_handle: string;
  owner_x_name: string;
  avatar: string;
}

export interface SkillTag {
  id: string;
  name: string;
  category: string;
  confidence_score: number;
}

export interface GetSkillResponse {
  id: string;
  name: string;
  content: string;
  is_active: boolean;
  type: string;
  like_count: number;
  download_count: number;
  is_liked: boolean;
  creator: SkillCreator;
  tags: SkillTag[];
  created_at: string;
  updated_at: string;
  // Optional metadata
  version_number?: string;
  visibility?: "public" | "private";
  versions?: SkillVersion[];
  can_view_full_content?: boolean;
}

export interface SkillVersion {
  id: string;
  versionNumber: string;
  name: string;
  description: string;
  content: string;
  type: string;
  created_at: string;
  updated_at: string;
  tags?: SkillTag[];
}

export interface GetSkillsParams {
  page: number;
  limit: number;
  search?: string;
  is_active?: boolean;
  tags?: string;
  sort_by?: "hottest" | "created_at" | "trending";
  sort_order?: "asc" | "desc";
}

export interface GetSkillsResponse {
  data: Skill[];
  total: number;
  page: number;
  limit: number;

}

export interface TrendingTag {
  id: string;
  name: string;
  category: string;
  usage_count: number;
}

export interface GetTrendingTagsParams {
  limit?: number;
}

export interface GetTrendingTagsResponse {
  tags: TrendingTag[];

}
