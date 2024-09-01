import { Query, SearchResult, IntentRecognitionJson } from "../types/workertypes";
import { Context } from "hono";


const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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
  },

  async fetchDeepRAGProfileByQueryId(queryID: string, c: Context) {
    const prisma = c.get("prisma");

    try {
      console.log(`fecth DeepRAGprofile via queryID: ${queryID}`);

      const deepRAGProfile = await prisma.deepRAGProfile.findFirst({
        where: { queryId: queryID },
      });

      return deepRAGProfile;
    } catch (error) {
      console.error(`Error in D1services.fetchDeepRAGProfileByQueryId: ${error}`);
    }
  },

  async fetch20DeepRAGProfiles(c: Context) {
    const prisma = c.get("prisma");

    try {
      const deepRAGProfiles = await prisma.deepRAGProfile.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
      });

      return deepRAGProfiles;
    } catch (error) {
      console.error(`Error in D1services.fetch20DeepRAGProfiles: ${error}`);
    }
  }
};

