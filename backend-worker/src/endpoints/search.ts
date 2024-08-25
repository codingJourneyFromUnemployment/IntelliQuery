import { Context } from "hono";
import { Query, SerperResult } from "../../types/workertypes";
import { Bindings } from "../../types/workertypes";
import { IntentRecognitionService } from "../../services/intentRecognitionService";
import { serperService } from "../../services/serperService";

const searchMainEndpoint = async (c: Context) => {
  try {

    const query: Query = await c.req.json();

    // enter the intent recognition status
    
    const intentRecognitionResult = await IntentRecognitionService.intentRecognitionService(
      query,
      c
    );

    // return c.json({ 
    //   data: intentRecognitionResult,
    //   message: "Intent Recognition Processed Successfully",
    // });

    // test serperService
    const serperResponse = await serperService.serperFetch(query, c);
    const serperResult: SerperResult = await serperResponse.json(); 

    console.log(`serperResult: ${JSON.stringify(serperResult, null, 2)}`);

    return c.json({
      data: serperResult,
      message: "Serper Fetch Processed Successfully",
      statuscode: 200,
    });
    
  } catch (error) {
    console.error(`Error in searchMainEndpoint: ${error}`);
    return c.json({ error: "Error in searchMainEndpoint" }, 500);
  }
};

export default searchMainEndpoint;

