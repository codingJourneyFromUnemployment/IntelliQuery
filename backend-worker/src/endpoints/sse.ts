import { Hono } from "hono";
import { Context } from "hono";
import { stream, streamSSE } from "hono/streaming";
import { Bindings } from "../../types/workertypes";
import { ragProcessManager, RAGProcessStatus } from "../../services/statusManager";

const sseEndpoint = async (c: Context) => {
  return streamSSE(c, async (stream) => {

    while(true) {
      const currentRAGProcess = await ragProcessManager.fetchRAGProcess(c.env.currentRAGProcessId, c);
      const quickRAGContent = currentRAGProcess.quickRAGContent;

      if (quickRAGContent) {
        await stream.writeSSE({
          data: quickRAGContent,
          event: "quickRAGContent Push",
        });
      }
      
      await stream.sleep(1000);
    }

  });    
}

export default sseEndpoint;