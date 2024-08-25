import { Bindings, Query } from "../types/workertypes";
import { createMiddleware } from "hono/factory";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { Context } from "hono";

const D1middleware = createMiddleware(async (c : Context, next) => {
  const adapter = new PrismaD1(c.env.DB)
  const prisma = new PrismaClient({ adapter });
  c.set("prisma", prisma);

  await next();
  await prisma.$disconnect();
});

export default D1middleware;














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
