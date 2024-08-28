import { RAGProcess, Query } from "../types/workertypes";
import { Context } from "hono";

enum RAGProcessStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  QUICK_RAG = "quick RAG",
  FULL_RAG = "full RAG",
  INTENT_RECOGNITION = "intent recognition",
}

class RAGProcessManager {
  
  async createRAGProcess(query: Query, c: Context): Promise<RAGProcess> {
    const RAGprocess: RAGProcess = {
      id: crypto.randomUUID(),
      queryId: query.id,
      status: RAGProcessStatus.INTENT_RECOGNITION,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await c.env.RAGProcess.put(RAGprocess.id, JSON.stringify(RAGprocess));
    c.env.currentRAGProcessId = RAGprocess.id;

    return RAGprocess;
  }

  async fetchRAGProcess(id: string, c: Context): Promise<RAGProcess> {
    const RAGprocess = await c.env.RAGProcess.get(id);
    if (RAGprocess === null) {
      throw new Error("RAGProcess not found");
    }
    return JSON.parse(RAGprocess);
  }

  async updateRAGProcess(
    id: string,
    status: RAGProcessStatus,
    c: Context
  ): Promise<RAGProcess> {
    const RAGprocess = await this.fetchRAGProcess(id, c);
    RAGprocess.status = status;
    RAGprocess.updatedAt = new Date();

    await c.env.RAGProcess.put(RAGprocess.id, JSON.stringify(RAGprocess));

    return RAGprocess;
  }

  async deleteRAGProcess(id: string, c: Context): Promise<void> {
    await c.env.RAGProcess.delete(id);
  }

  async updateQuickRAGContent(
    id: string,
    quickRAGContent: string,
    c: Context
  ): Promise<RAGProcess> {
    const RAGprocess = await this.fetchRAGProcess(id, c);
    RAGprocess.quickRAGContent = quickRAGContent;
    RAGprocess.updatedAt = new Date();

    await c.env.RAGProcess.put(RAGprocess.id, JSON.stringify(RAGprocess));

    return RAGprocess;
  }

  async updateFullRAGRawContent(
    id: string,
    fullRAGRawContent: string,
    c: Context
  ):Promise<RAGProcess> {
    const RAGprocess = await this.fetchRAGProcess(id, c);
    RAGprocess.fullRAGRawContent = fullRAGRawContent;
    RAGprocess.updatedAt = new Date();

    await c.env.RAGProcess.put(RAGprocess.id, JSON.stringify(RAGprocess));

    return RAGprocess;
  }
}


export const ragProcessManager = new RAGProcessManager();
export {RAGProcessStatus };
