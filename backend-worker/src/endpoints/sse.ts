import { Hono } from "hono";
import { Context } from "hono";
import { stream, streamSSE } from "hono/streaming";
import { Bindings } from "../../types/workertypes";
import {
  ragProcessManager,
  RAGProcessStatus,
} from "../../services/statusManager";
import { D1services } from "../../services/D1services";

const sseEndpoint = async (c: Context) => {
  const ragProcessIDRequire = c.req.param("ragProcessID");
  if (!ragProcessIDRequire) {
    return c.json({ error: "No RAG process ID provided" }, 400);
  }

  console.log("SSE endpoint for RAG Process ID:", ragProcessIDRequire);

  return streamSSE(c, async (stream) => {
    let timeout = 60000; // 1 minutes timeout
    const interval = 1000; // 1 second interval

    while (timeout > 0) {
      console.log("Checking for quickRAGContent");
      console.log("Current RAG Process ID:", c.env.currentRAGProcessId);

      const currentRAGProcess = await ragProcessManager.fetchRAGProcess(
        c.env.currentRAGProcessId,
        c
      );

      console.log("fetchRAGProcess success");
      console.log("Current RAG Process Status:", currentRAGProcess.status);
      const quickRAGContent = currentRAGProcess.quickRAGContent;

      const deepRAGProfile = currentRAGProcess.deepRAGProfile;

      if (
        quickRAGContent &&
        currentRAGProcess.status !== RAGProcessStatus.QUICKRAG_SENT
      ) {
        console.log("start writeSSE for quickRAGContent");

        await stream.writeSSE({
          data: quickRAGContent,
          event: "quickRAGContent Push",
        });

        await ragProcessManager.updateRAGProcess(
          c.env.currentRAGProcessId,
          RAGProcessStatus.QUICKRAG_SENT,
          c
        );
      }

      if(currentRAGProcess.status === RAGProcessStatus.QUICKRAG_SENT && currentRAGProcess.intentCategory === "1") {
        console.log("Direct LLM Answer, close the stream");
        await stream.writeSSE({
          data: "COMPLETED",
          event: "completed",
        });

        await ragProcessManager.updateRAGProcess(
          c.env.currentRAGProcessId,
          RAGProcessStatus.COMPLETED,
          c
        );
        
        return;
      } 

      if (deepRAGProfile) {
        console.log("start writeSSE for deepRAGProfile");

        await stream.writeSSE({
          data: deepRAGProfile,
          event: "deepRAGProfile Push",
        });

        await stream.writeSSE({
          data: "COMPLETED",
          event: "deepRAGProfile Push",
        });

        await ragProcessManager.updateRAGProcess(
          c.env.currentRAGProcessId,
          RAGProcessStatus.COMPLETED,
          c
        );

        break;
      }

      if (currentRAGProcess.status === RAGProcessStatus.FAILED) {
        await stream.writeSSE({
          data: "RAG process failed",
          event: "error",
        });
        return;
      }

      if (currentRAGProcess.status === RAGProcessStatus.COMPLETED) {
        await stream.writeSSE({
          data: "COMPLETED",
          event: "completed",
        });
        return;
      }

      console.log("wait for 1 second before next check");
      await stream.sleep(interval);
      timeout -= interval;
    }

    if (timeout <= 0) {
      await stream.writeSSE({
        data: "Process timeout",
        event: "error",
      });

      await ragProcessManager.updateRAGProcess(
        c.env.currentRAGProcessId,
        RAGProcessStatus.FAILED,
        c
      );
      console.log("Error in RAG process, SSE timeout");
    }
  });
};

export default sseEndpoint;
