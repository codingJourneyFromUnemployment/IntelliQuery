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
  },

  async createLLMDirectAnswer(queryID: string, c: Context) : Promise<SearchResult> {
    // update RAG process status to QUICK_RAG
    const currentStatus = RAGProcessStatus.QUICK_RAG;

    await ragProcessManager.updateRAGProcess(
      c.env.currentRAGProcessId,
      currentStatus,
      c
    );

    console.log(`updated RAGProcess status to ${currentStatus}`);
    console.log(`creating LLMDirectAnswer`);

    const newSearchResult = await D1services.createSearchResult(queryID, "", "", c);
    return newSearchResult;
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
    const currentModel = c.env.OPENROUTER_MODEL_CHN;
    const quickRAGReply = await openrouterService(quickRAGContext, c.env, currentModel);
    return quickRAGReply.reply;
  },

  async fetchQuickDirectLLMAnswer(
    query: Query,
    c: Context
  ){
    const quickRAGDirectLLMAnswerContext = contextManager.getQuickRAGDirectLLMAnswerContext(
      query,
      c
    );

    const currentModel = c.env.OPENROUTER_MODEL_CHN;
    const quickRAGReply = await openrouterService(quickRAGDirectLLMAnswerContext, c.env, currentModel);
    return quickRAGReply.reply;

  },

  async quickRAGProcess(queryID: string, c: Context, query: Query) {
    console.log(`start LLMDirectAnswerProcess`);
    try {
      const newSearchResult = await this.createLLMDirectAnswer(queryID, c);
      const quickRAGReply = await this.fetchQuickDirectLLMAnswer(query, c);

      console.log(`quickRAGReply: ${quickRAGReply}`);

      console.log(`updated RAGProcess status to PENDING`);

      const newRAGResult = await D1services.createRAGresult(
        queryID,
        quickRAGReply,
        c
      );

      console.log(`created new RAGResult`);

      // update  RAGProcess status and quickRAGContent for SSE endpoint

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
      // update  RAGProcess status and quickRAGContent for SSE endpoint

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