export interface TwitterLoginData {
  url: string;
  state: string;
}

export interface TwitterLoginResponse {
  data: TwitterLoginData;
  statusCode: number;
  message: string;
}

export interface TwitterLoginParams {
  isLocal?: boolean;
}

export interface TwitterCallbackParams {
  code: string;
  state: string;
}

export interface TwitterCallbackResponse {
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    username: string;
    email?: string;
  };
}
