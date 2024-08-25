import { contextManager } from "./contextManager";
import { serperService } from "./serperService";
import { Context } from "hono";
import { Query } from "../types/workertypes";
import { ragProcessManager, RAGProcessStatus } from "./statusManager";
import { D1services } from "./D1services";

export const quickRAGService = {
  
  async updateBatchRawDataAndLinks(queryID: string, c: Context) {
    // update status and serperBatchRawData in RAGProcess
    const currentStatus = RAGProcessStatus.QUICK_RAG;
    const rawData = await serperService.serperFetchBatch(queryID, c);
    
    const searchLinks = serperService.extractLinks(rawData);
    const newRawData = JSON.stringify(rawData);
    console.log(`newRawData: ${newRawData}`);
    console.log(`searchLinks: ${searchLinks}`);
    
    await ragProcessManager.updateRAGProcess(queryID, currentStatus, c);
    await ragProcessManager.updateSerperBatchRawData(queryID, newRawData, c);
    await ragProcessManager.updateSearchLinks(queryID, searchLinks, c);
  }




}