export type Response = {
  id: string;
  choices: (NonStreamingChoice | StreamingChoice | NonChatChoice)[];
  created: number;
  model: string;
  object: "chat.completion" | "chat.completion.chunk";
  system_fingerprint?: string;
  usage?: ResponseUsage;
};

export type ResponseUsage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

export type NonChatChoice = {
  finish_reason: string | null;
  text: string;
  error?: Error;
};

export type NonStreamingChoice = {
  finish_reason: string | null;
  message: {
    content: string | null;
    role: string;
    tool_calls?: ToolCall[];
    function_call?: FunctionCall;
  };
  error?: Error;
};

export type StreamingChoice = {
  finish_reason: string | null;
  delta: {
    content: string | null;
    role?: string;
    tool_calls?: ToolCall[];
    function_call?: FunctionCall;
  };
  error?: Error;
};

export type Error = {
  code: number;
  message: string;
};

export type FunctionCall = {
  name: string;
  arguments: string;
};

export type ToolCall = {
  id: string;
  type: "function";
  function: FunctionCall;
};
