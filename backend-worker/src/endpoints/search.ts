import { Context } from "hono";
import { Query, SerperResult } from "../../types/workertypes";
import { Bindings } from "../../types/workertypes";
import { IntentRecognitionService } from "../../services/intentRecognitionService";
import { quickRAGService } from "../../services/quickRAGService";

const searchMainEndpoint = async (c: Context) => {
  try {
    const query: Query = await c.req.json();
    const queryID = query.id;

    // enter the intent recognition status

    const intentRecognitionResult =
      await IntentRecognitionService.intentRecognitionService(query, c);

    // enter the quickRAGService
    const quickRAGReply = await quickRAGService.fullQuickRAGProcess(
      queryID,
      c,
      query
    );

    return c.json({ quickRAGReply: quickRAGReply });

  } catch (error) {
    console.error(`Error in searchMainEndpoint: ${error}`);
    return c.json({ error: "Error in searchMainEndpoint" }, 500);
  }
};

export default searchMainEndpoint;

