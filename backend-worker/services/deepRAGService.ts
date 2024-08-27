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
};
