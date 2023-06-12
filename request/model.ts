import { request, token } from ".";

interface ModelChatOptions {
  name: string;
  messages: message[];
  options?: options;
}

export const startNewModelChat = (data: ModelChatOptions) => {
  return request.post("/api/model/" + data.name, {
    messages: data.messages,
    options: data.options,
  });
};

export const getModelStream = (clientId: string) => {
  return fetch("/api/model/stream/" + clientId, {
    method: 'POST',
    headers: {
      Authorization: "Bearer " + token(),
    },
  });
};
