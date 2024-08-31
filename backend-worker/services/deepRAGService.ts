import { contextManager } from "./contextManager";
import { Context } from "hono";
import {
  Query,
  SearchResult,
  DeepRAGProfile,
  RAGProcess,
} from "../types/workertypes";
import { ragProcessManager, RAGProcessStatus } from "./statusManager";
import { D1services } from "./D1services";
import { openrouterService, ReplyData } from "./openrouterServices";
import { jinaService } from "./jinaService";

export const deepRAGService = {
  async fetchLinks(queryID: string, c: Context): Promise<string[]> {
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
      `\nupdated RAGProcess status to ${currentStatus}, and fetched Links`
    );
    return Links;
  },

  async fetchDeepRAGFromJina(queryID: string, c: Context): Promise<RAGProcess> {
    console.log(`\nfetchDeepRAGFromJina`);
    const linksJsonParse = await this.fetchLinks(queryID, c);
    const deepRAGResults = await jinaService.jinaFetchBatch(linksJsonParse, c);
    const deepRAGProfileString = JSON.stringify(deepRAGResults);
    const currentRAGProcess = await ragProcessManager.updateFullRAGRawContent(
      c.env.currentRAGProcessId,
      deepRAGProfileString,
      c
    );

    console.log(
      `\ncreated DeepRAGProfile and updated RAGProcess with raw content`
    );

    return currentRAGProcess;
  },

  async fetchDeepRAGFromOpenRouter(
    query: Query,
    rAGProcess: RAGProcess,
    searchResult: SearchResult,
    c: Context
  ): Promise<DeepRAGProfile> {
    console.log(`\nfetchDeepRAGFromOpenRouter`);
    const deepRAGContext = contextManager.getDeepRAGContext(
      query,
      rAGProcess,
      searchResult,
      c
    );

    const currentModel = c.env.OPENROUTER_MODEL_CHN;
    const deepRAGResults = await openrouterService(deepRAGContext, c.env, currentModel);
    const deepRAGReply = deepRAGResults.reply;
    const deepRAGProfileString = JSON.stringify(deepRAGReply);

    // update DeepRAGProfile in DB
    const currentDeepRAGProfile = await D1services.createDeepRAGProfile(
      query.id,
      deepRAGProfileString,
      c
    );

    return currentDeepRAGProfile;
  },

  async processDeepRAG(queryID: string, query: Query, c: Context) {
    try {
      const currentRAGProcess = await deepRAGService.fetchDeepRAGFromJina(
        queryID,
        c
      );
      const currentSearchResult = await D1services.fetchSearchResultByQueryId(
        queryID,
        c
      );
      const deepRAGProfile = await deepRAGService.fetchDeepRAGFromOpenRouter(
        query,
        currentRAGProcess,
        currentSearchResult,
        c
      );
      // update DeepRAGProfile in statusManager
      const profileResult = await D1services.fetchDeepRAGProfileByQueryId(queryID, c);
      const content = profileResult.content;

      await ragProcessManager.updateDeepRAGProfile(
        c.env.currentRAGProcessId,
        content,
        c
      );

      // update RAG process status to COMPLETED
      await ragProcessManager.updateRAGProcess(
        c.env.currentRAGProcessId,
        RAGProcessStatus.COMPLETED,
        c
      );

    } catch (error) {
      console.error(`Error in processDeepRAG: ${error}`);
      // update RAG process status to FAILED
      await ragProcessManager.updateRAGProcess(
        c.env.currentRAGProcessId,
        RAGProcessStatus.FAILED,
        c
      );
    }
  },
};


