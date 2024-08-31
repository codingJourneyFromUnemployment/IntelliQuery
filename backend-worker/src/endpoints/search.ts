import { Context } from "hono";
import { Query, SerperResult } from "../../types/workertypes";
import { Bindings } from "../../types/workertypes";
import { IntentRecognitionService } from "../../services/intentRecognitionService";
import { quickRAGService } from "../../services/quickRAGService";
import { deepRAGService } from "../../services/deepRAGService";
import { D1services } from "../../services/D1services";

const searchMainEndpoint = async (c: Context) => {
  try {
    const query: Query = await c.req.json();
    const queryID = query.id;

    // enter the intent recognition status

    const intentCategory =
      await IntentRecognitionService.intentRecognitionService(query, c);

    if (intentCategory === "1") {
      // enter the quickRAGService
      const newRAGResult = await quickRAGService.quickRAGProcess(
        queryID,
        c,
        query
      );
    } else if (intentCategory === "2") {
      // enter the fullquickRAGService
      const newRAGResult = await quickRAGService.fullQuickRAGProcess(
        queryID,
        c,
        query
      );

      // enter the deepRAGService and wait until the process is done

      c.executionCtx.waitUntil(
        deepRAGService.processDeepRAG(queryID, query, c)
      )
      
      
    } else {
      console.log("Error in intent recognition");
      return c.json(
        { error: "Error in searchMainEndpoint.intentrecognition" },
        500
      );
    }

    // return RAGProceesID for SSE endpoint

    const ragProcessID = c.env.currentRAGProcessId;

    return c.json({
      statuscode: 200,
      ragProcessID: ragProcessID,
      intentCategory: intentCategory,
    });
  } catch (error) {
    console.error(`Error in searchMainEndpoint: ${error}`);
    return c.json({ error: "Error in searchMainEndpoint" }, 500);
  }
};

export default searchMainEndpoint;
