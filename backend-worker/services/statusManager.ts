import { RAGProcess, Query } from "../types/workertypes";
import { Context } from "hono";

enum RAGProcessStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  QUICK_RAG = "quick RAG",
  QUICKRAG_SENT = "quickRAG sent",
  FULL_RAG = "full RAG",
  INTENT_RECOGNITION = "intent recognition",
}

interface KVListKey {
  name: string;
  expiration?: number;
  metadata?: unknown;
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

    console.log(`Created RAGProcess: ${JSON.stringify(RAGprocess)}`);
    console.log(`currentRAGProcessId: ${c.env.currentRAGProcessId}`);

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

  async updateDeepRAGProfile(
    id: string,
    deepRAGProfile: string,
    c: Context
  ): Promise<RAGProcess> {
    const RAGprocess = await this.fetchRAGProcess(id, c);
    RAGprocess.deepRAGProfile = deepRAGProfile;
    RAGprocess.updatedAt = new Date();

    await c.env.RAGProcess.put(RAGprocess.id, JSON.stringify(RAGprocess));

    return RAGprocess;
  }

  async updateIntentCategory(
    id: string,
    intentCategory: string,
    c: Context
  ): Promise<RAGProcess> {
    const RAGprocess = await this.fetchRAGProcess(id, c);
    RAGprocess.intentCategory = intentCategory;
    RAGprocess.updatedAt = new Date();

    await c.env.RAGProcess.put(RAGprocess.id, JSON.stringify(RAGprocess));

    return RAGprocess;
  }

  async deleteRAGProcessByQueryId(queryId: string, c: Context): Promise<void> {
    let cursor: string | undefined;
    const deletedKeys: string[] = [];

    try {
      do {
        const list = await c.env.RAGProcess.list({
          cursor,
          limit: 1000,
        });

        const deletePromises = list.keys.map(async (key : KVListKey) => {
          const value = await c.env.RAGProcess.get(key.name);
          if (value){
            const ragProcess: RAGProcess = JSON.parse(value);
            if (ragProcess.queryId === queryId) {
              await c.env.RAGProcess.delete(key.name);
              deletedKeys.push(key.name);
            }
          }
        });

        await Promise.all(deletePromises);

        cursor = list.cursor;


      } while (cursor);

      console.log(
        `Deleted ${deletedKeys.length} RAGProcesses for queryId ${queryId}`
      );
      console.log(`Deleted keys: ${deletedKeys.join(", ")}`);
    } catch (error) {
      console.error(
        `Error in RAGProcessManager.deleteRAGProcessByQueryID: ${error}`
      );
      throw error;
    }
  }
}


export const ragProcessManager = new RAGProcessManager();
export {RAGProcessStatus };
