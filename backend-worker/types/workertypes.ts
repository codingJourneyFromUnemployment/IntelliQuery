// Models for D1
export type User = {
  id: string;
  email?: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  queries?: string; // query ids, convert the array to string before saving and parse it when reading
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
  searchResults?: string; // search result id
  ragResultId?: string;
  deepRAGProfileId?: string;
};

export type SearchResult = {
  id: string;
  queryId: string;
  type: "text" | "image" | "video";
  serperBatchRawData?: string; // serper batch raw data, jsonStringify before saving and parse it when reading
  searchLinks?: string; // search links, convert the array to string before saving and parse it when reading
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
  reflection?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type QueryDeleteRequest = {
  queryId: string;
  jwtToken: string;
};

// RAGProcess Model (for KV)

export type RAGProcess = {
  id: string;
  queryId: string;
  status:
    | "pending"
    | "completed"
    | "failed"
    | "quick RAG"
    | "quickRAG sent"
    | "full RAG"
    | "intent recognition";
  intentCategory?: string;
  quickRAGContent?: string;
  fullRAGRawContent?: string;
  deepRAGProfile?: string;
  createdAt: Date;
  updatedAt: Date;
};

// Env for backend-worker

export interface Bindings {
  // cloudflare bindings
  DB: D1Database;
  RAGProcess: KVNamespace;
  RATE_LIMITER: any;

  // Environment variables
  OPENROUTER_MODEL_ENG: string;
  OPENROUTER_MODEL_CHN: string;
  OPENROUTER_API_KEY: string;
  SERPER_API_KEY: string;
  JINA_API_KEY: string;
  currentRAGProcessId: string;
  JWT_SECRET: string;
  CORS_ORIGIN_1: string;
  CORS_ORIGIN_2: string;
}

// other types

export interface SerperResult {
  searchParameters: {
    q: string;
    type: string;
    engine: string;
  };
  organic: Array<{
    title: string;
    link: string;
    snippet: string;
    position: number;
    date?: string;
    attributes?: {
      [key: string]: string;
    };
    imageUrl?: string;
    sitelinks?: Array<{
      title: string;
      link: string;
    }>;
  }>;
  images?: Array<{
    title: string;
    imageUrl: string;
    link: string;
  }>;
  peopleAlsoAsk?: Array<{
    question: string;
    snippet: string;
    title: string;
    link: string;
  }>;
  relatedSearches?: Array<{
    query: string;
  }>;
}

export interface IntentRecognitionJson {
  intent_category: string;
  sub_questions: string[];
  confidence_score: number;
} 

export interface ContentWithImage {
  queryId: string;
  img: string;
  content: string;
}