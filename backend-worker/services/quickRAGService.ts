import { contextManager } from "./contextManager";
import { serperService } from "./serperService";
import { Context } from "hono";
import { Query, SearchResult } from "../types/workertypes";
import { ragProcessManager, RAGProcessStatus } from "./statusManager";
import { D1services } from "./D1services";
import { openrouterService, ReplyData } from "./openrouterServices";

export const quickRAGService = {

  async updateBatchRawDataAndLinks(queryID: string, c: Context): Promise<SearchResult> {
    // update RAG process status to QUICK_RAG
    const currentStatus = RAGProcessStatus.QUICK_RAG;
    const rawData = await serperService.serperFetchBatch(queryID, c);

    const searchLinksArray = serperService.extractLinks(rawData);

    const newRawData = JSON.stringify(rawData);
    const searchLinks = JSON.stringify(searchLinksArray);

    console.log(`start updating RAGProcess and serperBatchRawDataAndLinks`);

    await ragProcessManager.updateRAGProcess(
      c.env.currentRAGProcessId,
      currentStatus,
      c
    );

    console.log(`updated RAGProcess status to ${currentStatus}`);
    console.log(`updating serperBatchRawDataAndLinks`);

    const newSearchResult = await D1services.createSearchResult(queryID, newRawData, searchLinks, c);

    return newSearchResult;

    console.log(`updated serperBatchRawDataAndLinks`);
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
      // update  RAGProcess status and quickRAGContent

      await ragProcessManager.updateQuickRAGContent(
        c.env.currentRAGProcessId,
        quickRAGReply,
        c
      );

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
  }
};