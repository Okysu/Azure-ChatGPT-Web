import { request } from ".";

export const getChatList = () => {
  return request.get("/api/chat/");
};

interface ChatOptionsUpdate {
  _id: string;
  messages?: messages[];
  title?: string;
  options?: options;
}

export const updateChat = (data: ChatOptionsUpdate) => {
  return request.put("/api/chat/update", data);
};

interface ChatOptionsInsert {
  type: "chat" | "image";
  messages: messages[];
  options?: options;
}

export const insertChat = (data: ChatOptionsInsert) => {
  return request.post("/api/chat/insert", data);
};

interface ChatOptionsDelete {
  _id: string;
}

export const deleteChat = (data: ChatOptionsDelete) => {
  return request.delete("/api/chat/delete", data);
};
