import { Context } from "hono";
import { Query, SerperResult } from "../../types/workertypes";
import { Bindings } from "../../types/workertypes";
import { IntentRecognitionService } from "../../services/intentRecognitionService";
import { quickRAGService } from "../../services/quickRAGService";
import { deepRAGService } from "../../services/deepRAGService";

const searchMainEndpoint = async (c: Context) => {
  try {
    const query: Query = await c.req.json();
    const queryID = query.id;

    // enter the intent recognition status

    const intentRecognitionResult =
      await IntentRecognitionService.intentRecognitionService(query, c);

    // enter the quickRAGService
    const newRAGResult = await quickRAGService.fullQuickRAGProcess(queryID, c, query);

    const quickRAGReply = newRAGResult.content;

    // enter the deepRAGService

    const newDeepRAGProfile = await deepRAGService.fetchDeepRAGFromJina(queryID, c);

    // return RAGProceesID for SSE endpoint

    const ragProcessID = c.env.currentRAGProcessId;
    
    return c.json({ 
      statuscode : 200,
      ragProcessID : ragProcessID,
    });

  } catch (error) {
    console.error(`Error in searchMainEndpoint: ${error}`);
    return c.json({ error: "Error in searchMainEndpoint" }, 500);
  }
};

export default searchMainEndpoint;

