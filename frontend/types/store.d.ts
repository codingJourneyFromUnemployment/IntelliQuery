export interface communityContent {
  queryId: string;
  content: string;
  img: string;
}

export interface Store {
  currentUserId: string;
  currentQueryId: string;
  intentCategory: string;
  quickRAGResults: string;
  fullRAGRawContent: string;
  deepRAGResults: string;
  communityContent: communityContent[];
  currentRAGProcessStatus:
    | "pending"
    | "completed"
    | "failed"
    | "quick RAG"
    | "full RAG"
    | "intent recognition";
  isSearching: boolean;
  jwtToken: string;
}

export interface KeyActions {
  setCurrentUserId: (currentUserId: Store["currentUserId"]) => void;
  setCurrentQueryId: (currentQueryId: Store["currentQueryId"]) => void;
  setIntentCategory: (intentCategory: Store["intentCategory"]) => void;

  setQuickRAGResults: (quickRAGResults: Store["quickRAGResults"]) => void;
  setDeepRAGResults: (deepRAGResults: Store["deepRAGResults"]) => void;

  setFullRAGRawContent: (fullRAGRawContent: Store["fullRAGRawContent"]) => void;
  setCommunityContent: (communityContent: Store["communityContent"]) => void;
  setCurrentRAGProcessStatus: (
    currentRAGProcessStatus: Store["currentRAGProcessStatus"]
  ) => void;
  setIsSearching: (isSearching: Store["isSearching"]) => void;
  setJwtToken: (jwtToken: Store["jwtToken"]) => void;
}
