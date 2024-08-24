import { contextManager } from "./contextManager";
import { openrouterService } from "./openrouterServices";
import { PrismaClient } from "@prisma/client";
import { Context } from "hono";
import { Query } from "../types/workertypes";
import { Bindings } from "../types/workertypes";
import {
  RAGProcessManager,
  RAGProcessStatus,
} from "./statusManager";



export const IntentRecognitionService = {


  async intentRecognitionService(query: Query, c: Context): Promise<any> {
    try {
      const context = await contextManager.getIntentRecognitionContext(query, c);
      const reply = await openrouterService(context, c.env);
      const intentRecognitionJson = reply.reply;
      return intentRecognitionJson;
      
    } catch (error) {
      console.error(`Error in intentRecognitionService: ${error}`);
      return c.json({ error: "Error in intentRecognitionService" }, 500);
    }
  }

}


