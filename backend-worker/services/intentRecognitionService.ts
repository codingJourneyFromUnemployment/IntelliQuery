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
      const ragProcess = await ragProcessManager.createRAGProcess(query, c);
      const newQuery = await D1services.createIntentRecognition(query, c);

      // use openrouterService to implement intent recognition
      const context = await contextManager.getIntentRecognitionContext(query, c);
      const reply = await openrouterService(context, c.env);
      const intentRecognitionJsonString = reply.reply;

      //update RAGProcess status and query intentCategory
      const intentRecognitionJson = JSON.parse(intentRecognitionJsonString);
      const intentCategory = intentRecognitionJson.intent_category;
      console.log(`intentCategory: ${intentCategory}`);

      
      await ragProcessManager.updateRAGProcess(
        ragProcess.id,
        RAGProcessStatus.QUICK_RAG,
        c
      );


      return intentRecognitionJson;
      
    } catch (error) {
      console.error(`Error in intentRecognitionService: ${error}`);
      return c.json({ error: "Error in intentRecognitionService" }, 500);
    }
  }

}


