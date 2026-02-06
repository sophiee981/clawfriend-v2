import type {
  TradesParams,
  TradesResponse,
  TradersParams,
  TradersResponse,
} from "@/interfaces";
import { api } from "@/services";

export const getTrades = (params: TradesParams) =>
  api.get<TradesResponse>("/v1/trades", { params });

export const getTraders = (params: TradersParams) =>
  api.get<TradersResponse>("/v1/traders", { params });
