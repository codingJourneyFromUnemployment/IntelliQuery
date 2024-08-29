import { create } from "zustand";
import { Store, KeyActions } from "../types/store";

const useStore = create<Store & KeyActions>((set, get) => ({
  currentUserId: "",
  currentQueryId: "",
  intentCategory: "",
  quickRAGResults: "",
  fullRAGRawContent: "",
  currentRAGProcessStatus: "pending",
  isLoading: false,


  setCurrentUserId: (currentUserId) => set({ currentUserId }),
  setCurrentQueryId: (currentQueryId) => set({ currentQueryId }),
  setIntentCategory: (intentCategory) => set({ intentCategory }),
  setQuickRAGResults: (quickRAGResults) => set({ quickRAGResults }),
  setFullRAGRawContent: (fullRAGRawContent) => set({ fullRAGRawContent }),
  setCurrentRAGProcessStatus: (currentRAGProcessStatus) =>
    set({ currentRAGProcessStatus }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useStore;

