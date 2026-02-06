import type { TradesParams, TradesResponse } from "@/interfaces";
import { api } from "@/services";

export const getTrades = (params: TradesParams) =>
  api.get<TradesResponse>("/v1/trades", { params });
