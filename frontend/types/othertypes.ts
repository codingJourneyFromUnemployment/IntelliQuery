export type User = {
  id: string;
  email?: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  queries?: string; 
};

export type Query = {
  id: string;
  userId?: string;
  content: string;
  intentCategory?: "DIRECT_LLM_ANSWER" | "RAG_PROCESS" | "Undefined";
  createdAt: Date;
  subQuery1?: string;
  subQuery2?: string;
  subQuery3?: string;
  searchResults?: string; 
  ragResultId?: string;
  deepRAGProfileId?: string;
};

export type SearchResult = {
  id: string;
  queryId: string;
  type: "text" | "image" | "video";
  serperBatchRawData?: string; 
  searchLinks?: string;
  createdAt: Date;
};

export type RAGResult = {
  id: string;
  queryId: string;
  content: string;
  isQuickRAG: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type DeepRAGProfile = {
  id: string;
  queryId: string;
  content: string;
  reflection: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type RAGProcess = {
  id: string;
  queryId: string;
  status:
    | "pending"
    | "completed"
    | "failed"
    | "quick RAG"
    | "full RAG"
    | "intent recognition";
  fullRAGRawContent?: string;
  createdAt: Date;
  updatedAt: Date;
};
