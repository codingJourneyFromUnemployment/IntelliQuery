import { string } from "zod";
import { Query, SearchResult, IntentRecognitionJson } from "../types/workertypes";
import { Context } from "hono";

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
      const searchResult = await prisma.searchResult.findUnique({
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
  }
};




// export type Query = {
//   id: string;
//   userId?: string;
//   content: string;
//   intentCategory?: "DIRECT_LLM_ANSWER" | "RAG_PROCESS" | "Undefined";
//   createdAt: Date;
//   subQuery1?: string;
//   subQuery2?: string;
//   subQuery3?: string;
//   searchResults?: string; // search result ids, convert the array to string before saving and parse it when reading
//   ragResultId?: string;
//   deepRAGProfileId?: string;
// };

// export interface IntentRecognitionJson {
//   intent_category: string;
//   sub_questions: string[];
//   confidence_score: number;
// } 