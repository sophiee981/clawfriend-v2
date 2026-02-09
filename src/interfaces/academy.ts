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

export interface Skill {
  id: string;
  name: string;
  description: string;
  content: string;
  is_active: boolean;
  like_count: number;
  download_count: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetSkillResponse {
  id: string;
  name: string;
  description: string;
  content: string;
  is_active: boolean;
  like_count: number;
  download_count: number;
  is_liked: boolean;
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
  data: Skill[];
  total: number;
}
