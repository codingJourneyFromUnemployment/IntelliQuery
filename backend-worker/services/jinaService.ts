import { Context } from "hono";

export const jinaService = {
  // 将链接数组分割成指定大小的批次
  chunkArray(array: string[], size: number): string[][] {
    const chunked: string[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  },

  // 处理单个批次的请求
  async processBatch(batch: string[], c: Context): Promise<string[]> {
    const promises = batch.map((link) => this.fetchJinaResults(link, c));
    const results = await Promise.allSettled(promises);
    return results
      .filter(
        (result): result is PromiseFulfilledResult<string> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);
  },

  async fetchJinaResults(
    targetUrl: string,
    c: Context,
    maxRetries = 3
  ): Promise<string> {
    console.log(`Fetching Jina results from ${targetUrl}`);

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
          throw error;
        }
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt))
        );
      }
    }

    throw new Error("Unexpected end of retry loop");
  },

  async jinaFetchBatch(links: string[], c: Context): Promise<string[]> {
    if (links.length === 0) {
      return [];
    }

    const batchSize = 190; // 每批处理190个请求
    const batches = this.chunkArray(links, batchSize);
    const results: string[] = [];

    for (const batch of batches) {
      const batchResults = await this.processBatch(batch, c);
      results.push(...batchResults);

      // 如果还有更多批次要处理，则等待一秒
      if (batch !== batches[batches.length - 1]) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(
      `Successfully fetched ${results.length} out of ${links.length} requests`
    );

    return results;
  },
};
