import { Context } from "hono";
import { Query, SerperResult } from "../../types/workertypes";
import { Bindings } from "../../types/workertypes";
import { IntentRecognitionService } from "../../services/intentRecognitionService";
import { serperService } from "../../services/serperService";

const searchMainEndpoint = async (c: Context) => {
  try {

    const query: Query = await c.req.json();
    const queryID = query.id;

    // enter the intent recognition status
    
    const intentRecognitionResult = await IntentRecognitionService.intentRecognitionService(
      query,
      c
    );

    // test serperService
    const serperFetchBatchResponse = await serperService.serperFetchBatch(
      queryID,
      c
    );
    const serperFetchBatchResult = await serperFetchBatchResponse.json();

    console.log(JSON.stringify(serperFetchBatchResult, null, 2));

    return c.json({
      data: serperFetchBatchResult,
      message: "Serper Fetch Processed Successfully",
      statuscode: 200,
    });
    
  } catch (error) {
    console.error(`Error in searchMainEndpoint: ${error}`);
    return c.json({ error: "Error in searchMainEndpoint" }, 500);
  }
};

export default searchMainEndpoint;

