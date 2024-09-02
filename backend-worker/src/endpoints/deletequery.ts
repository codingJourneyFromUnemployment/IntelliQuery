import { Context } from "hono";
import { QueryDeleteRequest } from "../../types/workertypes";
import { ragProcessManager } from "../../services/statusManager";
import { IntentRecognitionService } from "../../services/intentRecognitionService";
import { quickRAGService } from "../../services/quickRAGService";
import { deepRAGService } from "../../services/deepRAGService";
import { D1services } from "../../services/D1services";
import { jwtService } from "../../services/jwtService";
import { jwt } from "hono/jwt";


const deleteQueryById = async (c: Context) => {
  try {
    const deleteRequest : QueryDeleteRequest = await c.req.json();

    // parse queryID from jwt token
    const token = deleteRequest.jwtToken;
    const queryID = await jwtService.verifyAndExtractQueryId(token, c);

    // delete data in D1
    await D1services.deleteQueryByID(queryID, c);

    // delete data in KV
    await ragProcessManager.deleteRAGProcessByQueryId(queryID, c);

    return c.json({
      statuscode: 200,
      queryId: queryID,
      message: "Query Deleted Successfully"
    });

  } catch (error) {
    console.error(`Error in deleteQueryById: ${error}`);
    return c.json(
      { error: "Error in deleteQueryById" },
      500
    );
  }

}

export default deleteQueryById;