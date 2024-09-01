import { create } from "zustand";
import { Store, KeyActions } from "../types/store";

const useStore = create<Store & KeyActions>((set, get) => ({
  currentUserId: "",
  currentQueryId: "",
  intentCategory: "",
  quickRAGResults: "",
  deepRAGResults: "",
  fullRAGRawContent: "",
  currentRAGProcessStatus: "pending",
  isSearching: false,


  setCurrentUserId: (currentUserId) => set({ currentUserId }),
  setCurrentQueryId: (currentQueryId) => set({ currentQueryId }),
  setIntentCategory: (intentCategory) => set({ intentCategory }),

  setQuickRAGResults: (quickRAGResults) => set({ quickRAGResults }),
  setDeepRAGResults: (deepRAGResults) => set({ deepRAGResults }),

  setFullRAGRawContent: (fullRAGRawContent) => set({ fullRAGRawContent }),
  setCurrentRAGProcessStatus: (currentRAGProcessStatus) =>
    set({ currentRAGProcessStatus }),
  setIsSearching: (isSearching) => set({ isSearching }),
}));

export default useStore;


