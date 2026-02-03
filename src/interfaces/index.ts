export interface IPaginationParams {
  page: number;
  limit: number;
}

export interface IResponse<T> {
  data: T;
  pagination?: IPaginationParams;
  error?: string;
  message?: string;
  status?: number;
}

export * from "./agent";
