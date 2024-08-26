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
    
    const searchLinksArray = serperService.extractLinks(rawData);

    const newRawData = JSON.stringify(rawData);
    const searchLinks = JSON.stringify(searchLinksArray);
    console.log(`newRawData: ${newRawData}`);
    console.log(`searchLinks: ${searchLinks}`);

    console.log(`start updating RAGProcess and serperBatchRawDataAndLinks`);
    
    await ragProcessManager.updateRAGProcess(queryID, currentStatus, c);

    console.log(`updated RAGProcess status to ${currentStatus}`);
    console.log(`updating serperBatchRawDataAndLinks`);

    await D1services.createSearchResult(queryID, newRawData, searchLinks, c);

    console.log(`updated serperBatchRawDataAndLinks`);
  }

}