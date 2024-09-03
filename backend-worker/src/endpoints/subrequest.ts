import { Context } from "hono";
import { Query, SerperResult } from "../../types/workertypes";
import { Bindings } from "../../types/workertypes";
import { IntentRecognitionService } from "../../services/intentRecognitionService";
import { quickRAGService } from "../../services/quickRAGService";
import { deepRAGService } from "../../services/deepRAGService";
import { D1services } from "../../services/D1services";

const deepRAGSubRequest = async (c: Context) => {
  try {
    const subrequest = await c.req.json();
    console.log("Received subrequest:", JSON.stringify(subrequest));

    const queryID = subrequest.queryID;
    const ragProcessId = subrequest.ragProcessId;

    c.env.currentRAGProcessId = ragProcessId;

    const query: Query = await D1services.fetchQueryByID(queryID, c);

    // enter the deepRAGService and wait until the process is done
    console.log("Entering deepRAGService.processDeepRAG");

    await deepRAGService.processDeepRAG(queryID, query, c);

    console.log("DeepRAG process completed!");
    
    return c.json({ message: "DeepRAG process completed!" }, 200);
  } catch (error) {
    console.error(`Error in deepRAGSubRequest(subrequest endpoint) : ${error}`);
    return c.json({ error: "Error in deepRAGSubRequest" }, 500);
    
  }

};

export default deepRAGSubRequest;