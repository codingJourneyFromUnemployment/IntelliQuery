
enum IntentCategory {
  DIRECT_LLM_ANSWER = 1,
  CACHED_PROFILE = 2,
  QUICK_RAG = 3,
  FULL_RAG = 4,
}

enum SearchType {
  text = 1,
  image = 2,
  video = 3,
}

// Models for D1
type User = {
  id: string;
  email?: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  queries: Query[];
};

type Query = {
  id: string;
  userId: string;
  content: string;
  intentCategory: IntentCategory;
  createdAt: Date;
  searchResults: SearchResult[];
};

type SearchResult = {
  id: string;
  queryId: string;
  type: SearchType;
  content: string; // text content or img/video url
  metadata?: Record<string, any>; // additional metadata
  createdAt: Date;
};

type RAGResult = {
  id: string;
  queryId: string;
  content: string;
  isQuickRAG: boolean;
  sourceIds: string[]; // SearchResult ids
  createdAt: Date;
  updatedAt: Date;
};

type DeepRAGProfile = {
  id: string;
  queryId: string;
  content: string;
  reflection: string | null;
  createdAt: Date;
  updatedAt: Date;
};


// RAGProcess Model (for Durable Object)
type RAGProcess = {
  id: string;
  queryId: string;
  status: "pending" | "completed" | "failed" | "processing";
  progress: number;
  createdAt: Date;
  updatedAt: Date;
};
