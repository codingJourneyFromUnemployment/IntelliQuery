import { string } from "zod";
import { Query, SearchResult, IntentRecognitionJson } from "../types/workertypes";
import { Context } from "hono";
import { create } from "domain";

export const D1services = {
  async createIntentRecognition(query: Query, c: Context) {
    const prisma = c.get("prisma");

    try {
      const newQuery: Query = await prisma.query.create({
        data: {
          id: query.id,
          content: query.content,
          intentCategory: "undefined",
          createdAt: new Date(),
        },
      });

      return newQuery;
    } catch (error) {
      console.error(`Error in D1services.createIntentRecognition: ${error}`);
    }
  },

  async updateIntentCategory(query: Query, intentCategory: string, c: Context) {
    const prisma = c.get("prisma");

    try {
      const updatedQuery: Query = await prisma.query.update({
        where: { id: query.id },
        data: {
          intentCategory: intentCategory,
        },
      });
      return updatedQuery;
    } catch (error) {
      console.error(`Error in D1services.updateIntentCategory: ${error}`);
    }
  },

  async updateSubQueries(
    query: Query,
    intentRecognitionJson: IntentRecognitionJson,
    c: Context
  ) {
    const prisma = c.get("prisma");

    try {
      const updatedQuery: Query = await prisma.query.update({
        where: { id: query.id },
        data: {
          subQuery1: intentRecognitionJson.sub_questions[0],
          subQuery2: intentRecognitionJson.sub_questions[1],
          subQuery3: intentRecognitionJson.sub_questions[2],
        },
      });
      return updatedQuery;
    } catch (error) {
      console.error(`Error in D1services.updateSubQueries: ${error}`);
    }
  },

  async fetchQueryByID(queryID: string, c: Context) {
    const prisma = c.get("prisma");

    try {
      const query = await prisma.query.findUnique({
        where: { id: queryID },
      });
      return query;
    } catch (error) {
      console.error(`Error in D1services.fetchQueryByID: ${error}`);
    }
  },

  async createSearchResult(
    queryID: string,
    serperBatchRawData: string,
    searchLinks: string,
    c: Context
  ) {
    const prisma = c.get("prisma");

    try {
      const newSearchResult: SearchResult = await prisma.searchResult.create({
        data: {
          queryId: queryID,
          type: "text",
          serperBatchRawData: serperBatchRawData,
          searchLinks: searchLinks,
          createdAt: new Date(),
        },
      });

      await prisma.query.update({
        where: { id: queryID },
        data: {
          searchResults: newSearchResult.id,
        },
      });

      return newSearchResult;
    } catch (error) {
      console.error(`Error in D1services.createSearchResult: ${error}`);
      throw error; 
    }
  },

  async createRAGresult(queryID: string, content: string, c: Context) {
    const prisma = c.get("prisma");

    try {
      const newRAGResult = await prisma.RAGResult.create({
        data: {
          queryId: queryID,
          content: content,
          isQuickRAG: true,
          createdAt: new Date(),
        },
      });

      await prisma.query.update({
        where: { id: queryID },
        data: {
          ragResultId: newRAGResult.id,
        },
      });

      return newRAGResult;
    } catch (error) {
      console.error(`Error in D1services.createRAGresult: ${error}`);
      throw error;
    }
  },

  async fetchSearchResultByQueryId(queryID: string, c: Context) {
    const prisma = c.get("prisma");

    try {
      const searchResult = await prisma.searchResult.findFirst({
        where: { queryId: queryID },
      });
      return searchResult;
    } catch (error) {
      console.error(`Error in D1services.fetchSearchResultByQueryId: ${error}`);
    }
  },

  async extractLinksByQueryId(queryID: string, c: Context) {
    try {
      const searchResult = await this.fetchSearchResultByQueryId(queryID, c);
      const searchLinksString = searchResult.searchLinks;
      const searchLinks = JSON.parse(searchLinksString);
      return searchLinks;
      
    } catch (error) {
      console.error(`Error in D1services.extractLinksByQueryId: ${error}`);
    }
  },

  async fetchBatchRawDataByQueryId(queryID: string, c: Context) {
    try {
      const searchResult = await this.fetchSearchResultByQueryId(queryID, c);
      const serperBatchRawData = searchResult.serperBatchRawData;
      return serperBatchRawData;
    } catch (error) {
      console.error(`Error in D1services.fetchBatchRawDataByQueryId: ${error}`);
    }
  },

  async createDeepRAGProfile(queryID: string, content: string, c: Context) {
    const prisma = c.get("prisma");

    try {
      const newDeepRAGProfile = await prisma.deepRAGProfile.create({
        data: {
          queryId: queryID,
          content: content,
          reflection: null,
          createdAt: new Date(),
        },
      });

      await prisma.query.update({
        where: { id: queryID },
        data: {
          deepRAGProfileId: newDeepRAGProfile.id,
        },
      });

      return newDeepRAGProfile;
    } catch (error) {
      console.error(`Error in D1services.createDeepRAGProfile: ${error}`);
      throw error;
    }
  }
};



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
//   intentCategory?: "DIRECT_LLM_ANSWER" | "RAG_PROCESS" | "Undefined";
//   createdAt: Date;
//   subQuery1?: string;
//   subQuery2?: string;
//   subQuery3?: string;
//   searchResults?: string; // search result id
//   ragResultId?: string;
//   deepRAGProfileId?: string;
// };

// export type SearchResult = {
//   id: string;
//   queryId: string;
//   type: "text" | "image" | "video";
//   serperBatchRawData?: string; // serper batch raw data, jsonStringify before saving and parse it when reading
//   searchLinks?: string; // search links, convert the array to string before saving and parse it when reading
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
//   status:
//     | "pending"
//     | "completed"
//     | "failed"
//     | "quick RAG"
//     | "full RAG"
//     | "intent recognition";
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
//   SERPER_API_KEY: string;
//   JINA_API_KEY: string;
//   currentRAGProcessId: string;
// }

// // other types

// export interface SerperResult {
//   searchParameters: {
//     q: string;
//     type: string;
//     engine: string;
//   };
//   organic: Array<{
//     title: string;
//     link: string;
//     snippet: string;
//     position: number;
//     date?: string;
//     attributes?: {
//       [key: string]: string;
//     };
//     imageUrl?: string;
//     sitelinks?: Array<{
//       title: string;
//       link: string;
//     }>;
//   }>;
//   images?: Array<{
//     title: string;
//     imageUrl: string;
//     link: string;
//   }>;
//   peopleAlsoAsk?: Array<{
//     question: string;
//     snippet: string;
//     title: string;
//     link: string;
//   }>;
//   relatedSearches?: Array<{
//     query: string;
//   }>;
// }

// export interface IntentRecognitionJson {
//   intent_category: string;
//   sub_questions: string[];
//   confidence_score: number;
// } 
