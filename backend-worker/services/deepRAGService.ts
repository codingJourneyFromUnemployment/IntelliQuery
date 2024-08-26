import { contextManager } from "./contextManager";
import { serperService } from "./serperService";
import { Context } from "hono";
import { Query, SearchResult } from "../types/workertypes";
import { ragProcessManager, RAGProcessStatus } from "./statusManager";
import { D1services } from "./D1services";
import { openrouterService, ReplyData } from "./openrouterServices";

export const deepRAGService = {

  async fetchLinks(
    queryID: string,
    c: Context
  ): Promise<string[]> {
    // update RAG process status to FULL_RAG
    const currentStatus = RAGProcessStatus.FULL_RAG;

    await ragProcessManager.updateRAGProcess(
      c.env.currentRAGProcessId,
      currentStatus,
      c
    );

    // fetch Links
    const Links = await D1services.extractLinksByQueryId(queryID, c);

    console.log(
      `updated RAGProcess status to ${currentStatus}, and fetched Links`
    );
    return Links;
  },

  

  async fetchQuickRAG(
    query: Query,
    searchResults: SearchResult,
    c: Context
  ): Promise<string> {
    const quickRAGContext = contextManager.getQuickRAGContext(
      query,
      searchResults,
      c
    );
    const quickRAGReply = await openrouterService(quickRAGContext, c.env);
    return quickRAGReply.reply;
  },

  async fullQuickRAGProcess(queryID: string, c: Context, query: Query) {
    console.log(`start fullQuickRAGProcess`);
    try {
      const newSearchResult = await this.updateBatchRawDataAndLinks(queryID, c);

      const quickRAGReply = await this.fetchQuickRAG(query, newSearchResult, c);

      console.log(`quickRAGReply: ${quickRAGReply}`);

      console.log(`updated RAGProcess status to PENDING`);

      const newRAGResult = await D1services.createRAGresult(
        queryID,
        quickRAGReply,
        c
      );

      console.log(`created new RAGResult`);
      // update status in RAGProcess to PENDING
      const currentStatus = RAGProcessStatus.PENDING;

      await ragProcessManager.updateRAGProcess(
        c.env.currentRAGProcessId,
        currentStatus,
        c
      );

      return newRAGResult;
    } catch (error) {
      console.error(`Error in quickRAGService.fullQuickRAGProcess: ${error}`);
      throw error;
    }
  },
};
