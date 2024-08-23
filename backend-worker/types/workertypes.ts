

// Models for D1
type User = {
  id: string;
  email?: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  queries?: string; // query ids, convert the array to string before saving and parse it when reading
};

type Query = {
  id: string;
  userId: string;
  content: string;
  intentCategory: "DIRECT_LLM_ANSWER" | "CACHED_PROFILE" | "QUICK_RAG" | "FULL_RAG";
  createdAt: Date;
  searchResults: string; // search result ids, convert the array to string before saving and parse it when reading
  ragResultId?: string;
  deepRAGProfileId?: string;
};

type SearchResult = {
  id: string;
  queryId: string;
  type: "text" | "image" | "video";
  content: string; // text or img/video url
  metadata?: string // metadata for the search result. convert the json to string before saving and parse it when reading
  createdAt: Date;
};

type RAGResult = {
  id: string;
  queryId: string;
  content: string;
  isQuickRAG: boolean;
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
  status: "pending" | "completed" | "failed" | "quick RAG" | "full RAG";
  createdAt: Date;
  updatedAt: Date;
};
