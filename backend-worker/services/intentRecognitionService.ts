import { contextManager } from "./contextManager";
import { openrouterService } from "./openrouterServices";
import { PrismaClient } from "@prisma/client";
import { Context } from "hono";
import { Query } from "../types/workertypes";
import { Bindings } from "../types/workertypes";
import {
  ragProcessManager,
  RAGProcessStatus,
} from "./statusManager";
import { D1services } from "./D1services";


export const IntentRecognitionService = {


  async intentRecognitionService(query: Query, c: Context): Promise<any> {
    try {
      // Create RAGProcessa in KV and new query in D1
      console.log("Creating RAGProcess and new query in D1");

      const ragProcess = await ragProcessManager.createRAGProcess(query, c);
      const newQuery = await D1services.createIntentRecognition(query, c);

      // use openrouterService to implement intent recognition
      console.log("Calling openrouterService");

      const intentRecognitionContext =
        await contextManager.getIntentRecognitionContext(query, c);
      const reply = await openrouterService(intentRecognitionContext, c.env);
      let intentRecognitionJsonString = reply.reply;

      intentRecognitionJsonString = intentRecognitionJsonString.replace(
        /```json\n|\n```/g,
        ""
      );

      console.log(
        `intentRecognitionJsonString: ${intentRecognitionJsonString}`
      );

      //update RAGProcess status and query intentCategory
      console.log("Updating RAGProcess status and query intentCategory");

      const intentRecognitionJson = JSON.parse(intentRecognitionJsonString);
      const intentCategory = intentRecognitionJson.intent_category;

      console.log(`intentCategory: ${intentCategory}`);

      if(intentCategory === "1") {
        const newIntentCategory = "DIRECT_LLM_ANSWER";
        const updatedQuery = await D1services.updateIntentCategory(query, newIntentCategory, c);
      } else if(intentCategory === "2") {
        const newIntentCategory = "RAG_PROCESS";
        let updatedQuery = await D1services.updateIntentCategory(query, newIntentCategory, c);
        updatedQuery = await D1services.updateSubQueries(query, intentRecognitionJson, c);
      } else {
        throw new Error("Invalid intent category");
      }
      
      await ragProcessManager.updateRAGProcess(
        ragProcess.id,
        RAGProcessStatus.PENDING,
        c
      );


      return intentRecognitionJson;
      
    } catch (error) {
      console.error(`Error in intentRecognitionService: ${error}`);
      return c.json({ error: "Error in intentRecognitionService" }, 500);
    }
  }

}


