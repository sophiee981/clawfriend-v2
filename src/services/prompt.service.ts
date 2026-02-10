import { api } from "@/services";

export const getPrompt = () =>
  api.get<string>("/prompt.txt", {
    headers: {
      Accept: "text/plain",
    },
    responseType: "text",
  });
