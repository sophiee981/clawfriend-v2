import type {
  CreateSkillRequest,
  CreateSkillResponse,
  GetSkillResponse,
  GetSkillsParams,
  GetSkillsResponse,
  SkillDownloadResponse,
  SkillLikeResponse,
  UpdateSkillRequest,
  UpdateSkillResponse,
} from "@/interfaces";
import { apiWithToken, api } from "@/services";

export const getSkills = (params: GetSkillsParams) =>
  apiWithToken.get<GetSkillsResponse>("/v1/academy/skills", { params });

export const getSkill = (skillId: number) =>
  apiWithToken.get<GetSkillResponse>(`/v1/academy/skills/${skillId}`);

export const createSkill = (data: CreateSkillRequest) =>
  apiWithToken.post<CreateSkillResponse>("/v1/academy/skills", data);

export const updateSkill = (skillId: number, data: UpdateSkillRequest) =>
  apiWithToken.put<UpdateSkillResponse>(`/v1/academy/skills/${skillId}`, data);

export const likeSkill = (skillId: number) =>
  apiWithToken.post<SkillLikeResponse>(`/v1/academy/skills/${skillId}/like`);

export const downloadSkill = (skillId: string) =>
  apiWithToken.post<SkillDownloadResponse>(
    `/v1/academy/skills/${skillId}/download`
  );

export const deleteSkill = (skillId: number) =>
  apiWithToken.delete<void>(`/v1/academy/skills/${skillId}`);
