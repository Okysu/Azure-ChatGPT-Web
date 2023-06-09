type user = {
  id: number;
  username: string;
  password: string | null;
  email: string;
  type: string;
  created_at: string;
  updated_at: string;
  expried_at: string;
  disabled_flag: boolean;
};

type options = {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
};

type messages = {
  id?: string;
  role: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  choose_flag?: boolean;
};

type chat = {
  id: number;
  uid: number;
  title: string;
  type: string; // chat or image
  messages: messages[];
  created_at: string;
  updated_at: string;
};
