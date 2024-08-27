import { Bindings } from "../types/workertypes";
import { Query, SerperResult } from "../types/workertypes";
import { Context } from "hono";
import { D1services } from "./D1services";

interface SerperBatchResult {
  mainResult: SerperResult;
  subResult1: SerperResult;
  subResult2: SerperResult;
  subResult3: SerperResult;
}

export const serperService = {
  
  extractLinks(serperBatchResult: SerperBatchResult): string[] {
    const links: string[] = [];

    function recursiveExtract(item: any): void {
      if (typeof item === "object" && item !== null) {
        if (Array.isArray(item)) {
          item.forEach(recursiveExtract);
        } else {
          Object.entries(item).forEach(([key, value]) => {
            if (key === "link" && typeof value === "string") {
              links.push(value);
            } else {
              recursiveExtract(value);
            }
          });
        }
      }
    }

    recursiveExtract(serperBatchResult.mainResult);
    return Array.from(new Set(links)); // Remove duplicates
  },

  async fetchSerperResults(
    content: string,
    serper_api_key: string,
    maxRetries = 3
  ): Promise<any> {
    const myHeaders = new Headers();
    myHeaders.append("X-API-KEY", serper_api_key);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      q: content,
      num: 10,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(
          "https://google.serper.dev/search",
          requestOptions
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        if (attempt === maxRetries - 1) throw error;
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt))
        ); // Exponential backoff
      }
    }
  },

  async serperFetchBatch(
    queryID: string,
    c: Context
  ): Promise<SerperBatchResult> {
    const serper_api_key = c.env.SERPER_API_KEY;
    const query = await D1services.fetchQueryByID(queryID, c);

    if (!query || !serper_api_key) {
      throw new Error("Missing query or serper api key");
    }

    try {
      const [mainResult, subResult1, subResult2, subResult3] =
        await Promise.all([
          query.content
            ? this.fetchSerperResults(query.content, serper_api_key)
            : Promise.resolve(null),
          query.subQuery1
            ? this.fetchSerperResults(query.subQuery1, serper_api_key)
            : Promise.resolve(null),
          query.subQuery2
            ? this.fetchSerperResults(query.subQuery2, serper_api_key)
            : Promise.resolve(null),
          query.subQuery3
            ? this.fetchSerperResults(query.subQuery3, serper_api_key)
            : Promise.resolve(null),
        ]);

      const serperResults = {
        mainResult,
        subResult1,
        subResult2,
        subResult3,
      };

      return serperResults;
    } catch (error) {
      throw new Error(`Error in serperFetchBatch: ${error}`);
    }
  },
};
