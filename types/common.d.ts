type user = {
  _id: string;
  username: string;
  password: string | null;
  avatar: string;
  email: string;
  type: string;
  expense_base: number;
  created_at: Date;
  updated_at: Date;
  expried_at: Date;
  disabled_flag: boolean;
};

type options = {
  modelName?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  presencePenalty?: number;
  frequencyPenalty?: number;
  playRole?: string;
  singleMode?: boolean;
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
  created_at?: Date;
  updated_at?: Date;
  options?: options;
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

type wallet = {
  _id?: string;
  title: string;
  type: number; // 0: income, 1: expense
  count: number;
  created_at?: Date;
  updated_at?: Date;
  valid_flag?: boolean;
};
