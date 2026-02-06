import type { PlatformStatsResponse } from "@/interfaces";
import { api } from "@/services";

export const getPlatformStats = () =>
  api.get<PlatformStatsResponse>("/v1/stats/platform", {
    headers: { accept: "application/json" },
  });
