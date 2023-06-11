type user = {
  _id: string;
  username: string;
  password: string | null;
  email: string;
  type: string;
  expense_base: number;
  created_at: Date;
  updated_at: Date;
  expried_at: Date;
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
  _id?: string;
  role: string;
  content: string;
  created_at?: Date;
  updated_at?: Date;
  choose_flag?: boolean;
};

type chat = {
  _id?: string;
  title: string;
  type: string; // chat or image
  messages: messages[];
  created_by?: string;
  created_at?: Date;
  updated_at?: Date;
};

type sseConnection = {
  clientId: string;
  messages: message[];
  options: options;
  token: string;
  name: string;
};

type message = {
  role: string;
  content: string;
};
