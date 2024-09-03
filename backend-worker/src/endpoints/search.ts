import { Context } from "hono";
import { Query, SerperResult } from "../../types/workertypes";
import { Bindings } from "../../types/workertypes";
import { IntentRecognitionService } from "../../services/intentRecognitionService";
import { quickRAGService } from "../../services/quickRAGService";
import { deepRAGService } from "../../services/deepRAGService";
import { D1services } from "../../services/D1services";
import { jwtService } from "../../services/jwtService";
import { jwt } from "hono/jwt";
import { contextManager } from "../../services/contextManager";

const searchMainEndpoint = async (c: Context) => {
  try {
    console.log("Entering searchMainEndpoint");
    const query: Query = await c.req.json();
    console.log("Received query:", JSON.stringify(query));
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

      // post subrequest endpoint to deepRAGService

      const subrequest = {
        queryID: queryID,
        ragProcessId: c.env.currentRAGProcessId,
      };

      const baseURL = c.env.CORS_ORIGIN_2;
      const subrequestURL = `${baseURL}/subrequest`;

      c.executionCtx.waitUntil(fetch(subrequestURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subrequest),
      }).catch((error) => {
        console.error(`Error in searchMainEndpoint.fetch: ${error}`);
      }));

    } else {
      console.log("Error in intent recognition");
      return c.json(
        { error: "Error in searchMainEndpoint.intentrecognition" },
        500
      );
    }
    // issue JWT token for future deletion of the query
    const token = await jwtService.signQueryByQueryId(queryID, c);


    // return RAGProceesID for SSE endpoint

    const ragProcessID = c.env.currentRAGProcessId;

    return c.json({
      statuscode: 200,
      ragProcessID: ragProcessID,
      intentCategory: intentCategory,
      jwtToken: token,
    });
  } catch (error) {
    console.error(`Error in searchMainEndpoint: ${error}`);
    return c.json({ error: "Error in searchMainEndpoint" }, 500);
  }
};

export default searchMainEndpoint;
