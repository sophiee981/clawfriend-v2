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
  description: string;
  content: string;
  is_active: boolean;
  type: "skill" | "prompt";
}

export interface CreateSkillResponse {
  id: string;
  name: string;
  description: string;
  content: string;
  is_active: boolean;
  created_at: string;
}

export interface UpdateSkillRequest {
  name: string;
  description: string;
  content: string;
  is_active: boolean;
}

export interface UpdateSkillResponse {
  id: string;
  name: string;
  description: string;
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
  description: string;
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
  description: string;
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
}

export interface GetSkillsParams {
  page: number;
  limit: number;
  search?: string;
  is_active?: boolean;
  type?: string;
}

export interface GetSkillsResponse {
  data: {
    data: Skill[];
    total: number;
    page: number;
    limit: number;
  };
  statusCode: number;
  message: string;
}
