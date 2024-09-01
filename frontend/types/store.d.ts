export interface Store {
  currentUserId: string;
  currentQueryId: string;
  intentCategory: string;
  quickRAGResults: string;
  fullRAGRawContent: string;
  deepRAGResults: string;
  currentRAGProcessStatus:
    | "pending"
    | "completed"
    | "failed"
    | "quick RAG"
    | "full RAG"
    | "intent recognition";
  isSearching: boolean;
}

export interface KeyActions {
  setCurrentUserId: (currentUserId: Store["currentUserId"]) => void;
  setCurrentQueryId: (currentQueryId: Store["currentQueryId"]) => void;
  setIntentCategory: (intentCategory: Store["intentCategory"]) => void;

  setQuickRAGResults: (quickRAGResults: Store["quickRAGResults"]) => void;
  setDeepRAGResults: (deepRAGResults: Store["deepRAGResults"]) => void;

  setFullRAGRawContent: (fullRAGRawContent: Store["fullRAGRawContent"]) => void;
  setCurrentRAGProcessStatus: (
    currentRAGProcessStatus: Store["currentRAGProcessStatus"]
  ) => void;
  setIsSearching: (isSearching: Store["isSearching"]) => void;
}
