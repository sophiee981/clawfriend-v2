import { api, serverApi } from "@/services";

export const getPrompt = (isServer = false) => {
  const client = isServer ? serverApi : api;
  return client.get<string>("/prompt.txt", {
    headers: {
      Accept: "text/plain",
    },
    responseType: "text",
  });
}
