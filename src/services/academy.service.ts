import type {
  CreateSkillRequest,
  CreateSkillResponse,
  GetSkillResponse,
  GetSkillsParams,
  GetSkillsResponse,
  GetTrendingTagsParams,
  GetTrendingTagsResponse,
  SkillDownloadResponse,
  SkillLikeResponse,
  UpdateSkillRequest,
  UpdateSkillResponse,
} from "@/interfaces";
import { apiWithToken } from "@/services";

export const getSkills = (params: GetSkillsParams) =>
  apiWithToken.get<GetSkillsResponse>("/v1/academy/skills", { params });

export const getSkill = (skillId: string) =>
  apiWithToken.get<GetSkillResponse>(`/v1/academy/skills/${skillId}`);

export const createSkill = (data: CreateSkillRequest) =>
  apiWithToken.post<CreateSkillResponse>("/v1/academy/skills", data);

export const updateSkill = (skillId: number | string, data: UpdateSkillRequest) =>
  apiWithToken.put<UpdateSkillResponse>(`/v1/academy/skills/${skillId}`, data);

export const likeSkill = (skillId: number | string) =>
  apiWithToken.post<SkillLikeResponse>(`/v1/academy/skills/${skillId}/like`);

export const unlikeSkill = (skillId: number | string) =>
  apiWithToken.delete<SkillLikeResponse>(`/v1/academy/skills/${skillId}/unlike`);

export const downloadSkill = (skillId: string) =>
  apiWithToken.post<SkillDownloadResponse>(
    `/v1/academy/skills/${skillId}/download`
  );

export const deleteSkill = (skillId: number | string) =>
  apiWithToken.delete<void>(`/v1/academy/skills/${skillId}`);

export const getTrendingTags = (params?: GetTrendingTagsParams) =>
  apiWithToken.get<GetTrendingTagsResponse>("/v1/academy/tags/trending", {
    params,
  });
