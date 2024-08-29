import { Hono } from "hono";
import { Context } from "hono";
import { stream, streamSSE } from "hono/streaming";
import { Bindings } from "../../types/workertypes";
import { ragProcessManager, RAGProcessStatus } from "../../services/statusManager";

const sseEndpoint = async (c: Context) => {
  const ragProcessIDRequire = c.req.param("ragProcessID");
  if (!ragProcessIDRequire) {
    return c.json({ error: "No RAG process ID provided" }, 400);
  }

  return streamSSE(c, async (stream) => {

    while(true) {
      console.log("Checking for quickRAGContent");
      console.log("Current RAG Process ID:", c.env.currentRAGProcessId);

      const currentRAGProcess = await ragProcessManager.fetchRAGProcess(c.env.currentRAGProcessId, c);

      console.log("fetchRAGProcess success");
      console.log("Current RAG Process Status:", currentRAGProcess.status);
      const quickRAGContent = currentRAGProcess.quickRAGContent;

      console.log("start writeSSE");

      if (quickRAGContent) {
        await stream.writeSSE({
          data: quickRAGContent,
          event: "quickRAGContent Push",
        });
      }

      if (currentRAGProcess.status === RAGProcessStatus.COMPLETED) {
        break;
      }

      console.log("wait for 1 second");
      
      await stream.sleep(1000);
    }

  });    
}

export default sseEndpoint;