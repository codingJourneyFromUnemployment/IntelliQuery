import { Context } from "hono";
import { Query } from "../../types/workertypes";
import { Bindings } from "../../types/workertypes";
import { IntentRecognitionService } from "../../services/intentRecognitionService";

const searchMainEndpoint = async (c: Context) => {
  try {

    const query: Query = await c.req.json();

    // enter the intent recognition status
    
    const intentRecognitionResult = await IntentRecognitionService.intentRecognitionService(
      query,
      c
    );

    return c.json({ 
      data: intentRecognitionResult,
      message: "Intent Recognition Processed Successfully",
    });
    
  } catch (error) {
    console.error(`Error in searchMainEndpoint: ${error}`);
    return c.json({ error: "Error in searchMainEndpoint" }, 500);
  }
};

export default searchMainEndpoint;

// // Models for D1
// export type User = {
//   id: string;
//   email?: string;
//   name?: string;
//   createdAt: Date;
//   updatedAt: Date;
//   queries?: string; // query ids, convert the array to string before saving and parse it when reading
// };

// export type Query = {
//   id: string;
//   userId?: string;
//   content: string;
//   intentCategory:
//     | "DIRECT_LLM_ANSWER"
//     | "CACHED_PROFILE"
//     | "QUICK_RAG"
//     | "FULL_RAG";
//   createdAt: Date;
//   searchResults?: string; // search result ids, convert the array to string before saving and parse it when reading
//   ragResultId?: string;
//   deepRAGProfileId?: string;
// };

// export type SearchResult = {
//   id: string;
//   queryId: string;
//   type: "text" | "image" | "video";
//   content: string; // text or img/video url
//   metadata?: string; // metadata for the search result. convert the json to string before saving and parse it when reading
//   createdAt: Date;
// };

// export type RAGResult = {
//   id: string;
//   queryId: string;
//   content: string;
//   isQuickRAG: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// };

// export type DeepRAGProfile = {
//   id: string;
//   queryId: string;
//   content: string;
//   reflection: string | null;
//   createdAt: Date;
//   updatedAt: Date;
// };

// // RAGProcess Model (for KV)

// export type RAGProcess = {
//   id: string;
//   queryId: string;
//   status: "pending" | "completed" | "failed" | "quick RAG" | "full RAG" | "intent recognition";
//   createdAt: Date;
//   updatedAt: Date;
// };

// // Env for backend-worker

// export interface Bindings {
//   // cloudflare bindings
//   DB: D1Database;
//   KV: KVNamespace;

//   // Environment variables
//   OPENROUTER_MODEL: string;
//   OPENROUTER_API_KEY: string;
// }

// enum RAGProcessStatus {
//   PENDING = "pending",
//   COMPLETED = "completed",
//   FAILED = "failed",
//   QUICK_RAG = "quick RAG",
//   FULL_RAG = "full RAG",
//   INTENT_RECOGNITION = "intent recognition",
// }
