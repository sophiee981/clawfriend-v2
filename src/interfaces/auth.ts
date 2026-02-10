export interface TwitterLoginResponse {
  url: string;
  state: string;
}

export interface TwitterLoginParams {
  isLocal?: boolean;
}

export interface TwitterCallbackParams {
  code: string;
  state: string;
}

export interface TwitterCallbackResponse {
  success: boolean;
  xId: string;
  xUsername: string;
  displayName: string;
  token: string;
  message: string;
}
