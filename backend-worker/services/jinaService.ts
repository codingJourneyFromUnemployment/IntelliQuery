import { Context } from "hono";

export const jinaService = {
  async fetchJinaResults(
    targetUrl: string,
    c: Context,
    maxRetries = 3
  ): Promise<string> {
    const baseUrl = "https://r.jina.ai/";
    const fullUrl = new URL(targetUrl, baseUrl).toString();

    const headers = {
      Authorization: `Bearer ${c.env.JINA_API_KEY}`,
      "X-Timeout": "10",
      "X-With-Images-Summary": "true",
      "X-With-Generated-Alt": "true",
    };

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(fullUrl, {
          method: "GET",
          headers: headers,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.text();
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed:`, error);
        if (attempt === maxRetries - 1) {
          console.error("All retry attempts failed");
          throw error; // Let the caller handle the final error
        }
        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt))
        );
      }
    }

    throw new Error("Unexpected end of retry loop");
  },

  async jinaFetchBatch(links: string[], c: Context): Promise<string[]> {
    if (links.length === 0) {
      return []; // Return an empty array if no links are provided
    }

    const settledPromises = await Promise.allSettled(
      links.map((link) => this.fetchJinaResults(link, c))
    );

    const results = settledPromises
      .filter(
        (result): result is PromiseFulfilledResult<string> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);

    console.log(
      `Successfully fetched ${results.length} out of ${links.length} requests`
    );

    return results;
  },
};
