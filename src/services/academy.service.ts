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
import { api } from "@/services";

export const getSkills = (params: GetSkillsParams) =>
  api.get<GetSkillsResponse>("/v1/academy/skills", { params });

export const getSkill = (skillId: number) =>
  api.get<GetSkillResponse>(`/v1/academy/skills/${skillId}`);

export const createSkill = (data: CreateSkillRequest) =>
  api.post<CreateSkillResponse>("/v1/academy/skills", data);

export const updateSkill = (skillId: number, data: UpdateSkillRequest) =>
  api.put<UpdateSkillResponse>(`/v1/academy/skills/${skillId}`, data);

export const likeSkill = (skillId: number) =>
  api.post<SkillLikeResponse>(`/v1/academy/skills/${skillId}/like`);

export const downloadSkill = (skillId: string) =>
  api.post<SkillDownloadResponse>(`/v1/academy/skills/${skillId}/download`);

export const deleteSkill = (skillId: number) =>
  api.delete<void>(`/v1/academy/skills/${skillId}`);
