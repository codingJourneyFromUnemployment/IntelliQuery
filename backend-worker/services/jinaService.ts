import { Context } from "hono";

// batch process for all main result links

// export const jinaService = {

//   chunkArray(array: string[], size: number): string[][] {
//     const chunked: string[][] = [];
//     for (let i = 0; i < array.length; i += size) {
//       chunked.push(array.slice(i, i + size));
//     }
//     return chunked;
//   },

//   async jinaFetchBatch(links: string[], c: Context): Promise<string[]> {
//     if (links.length === 0) {
//       return [];
//     }

//     const batchSize = 10;
//     const batches = this.chunkArray(links, batchSize);
//     const results: string[] = [];
//     const failedUrls: string[] = [];

//     for (let i = 0; i < batches.length; i++) {
//       const batch = batches[i];
//       console.log(`Processing batch ${i + 1} of ${batches.length}`);

//       const batchResults = await this.processBatch(batch, c);

//       results.push(...batchResults.successes);
//       failedUrls.push(...batchResults.failures.map((f) => f.url));

//       console.log(
//         `Batch ${i + 1} results: ${batchResults.successes.length} successes, ${
//           batchResults.failures.length
//         } failures`
//       );

//       // If all URLs in a full batch fail, stop processing
//       if (
//         batchResults.failures.length === batchSize &&
//         batch.length === batchSize
//       ) {
//         throw new Error(
//           "All URLs in a full batch failed. It must be a Jina API issue."
//         );
//       }

//       // For the last batch or partial batches, log a warning if all fail
//       if (
//         batchResults.failures.length === batch.length &&
//         i === batches.length - 1
//       ) {
//         console.warn(
//           "All URLs in the final batch failed. This might indicate an issue, but processing has completed."
//         );
//       }

//       // Wait for 0.1 seconds between batches
//       if (i < batches.length - 1) {
//         await new Promise((resolve) => setTimeout(resolve, 5000));
//       }
//     }

//     console.log(
//       `Overall results: ${results.length} successes, ${failedUrls.length} failures`
//     );
//     console.log("Failed URLs:", failedUrls);

//     return results;
//   },

//   async processBatch(
//     batch: string[],
//     c: Context
//   ): Promise<{
//     successes: string[];
//     failures: { url: string; error: Error }[];
//   }> {
//     const promises = batch.map((link) =>
//       this.fetchJinaResultsWithRetry(link, c)
//     );
//     const results = await Promise.allSettled(promises);

//     const successes: string[] = [];
//     const failures: { url: string; error: Error }[] = [];

//     results.forEach((result, index) => {
//       if (result.status === "fulfilled") {
//         successes.push(result.value);
//       } else {
//         failures.push({ url: batch[index], error: result.reason });
//       }
//     });

//     return { successes, failures };
//   },

//   async fetchJinaResultsWithRetry(
//     targetUrl: string,
//     c: Context,
//     maxRetries = 3
//   ): Promise<string> {
//     for (let attempt = 0; attempt < maxRetries; attempt++) {
//       try {
//         const result = await this.fetchJinaResults(targetUrl, c);
//         return result;
//       } catch (error) {
//         if (
//           error instanceof Error &&
//           error.message.includes("Network connection lost")
//         ) {
//           console.error(
//             `Network error on attempt ${attempt + 1} for ${targetUrl}:`,
//             error
//           );
//           if (attempt === maxRetries - 1) {
//             throw error;
//           }
//           // Only retry for network connection issues
//           await new Promise((resolve) => setTimeout(resolve, 1000));
//         } else {
//           // For all other errors, including HTTP errors, throw immediately
//           console.error(`Non-network error for ${targetUrl}:`, error);
//           throw error;
//         }
//       }
//     }
//     throw new Error("Unexpected end of retry loop");
//   },

//   async fetchJinaResults(targetUrl: string, c: Context): Promise<string> {
//     console.log(`Fetching Jina results from ${targetUrl}`);

//     const baseUrl = "https://r.jina.ai/";
//     const fullUrl = new URL(targetUrl, baseUrl).toString();

//     const headers = {
//       Authorization: `Bearer ${c.env.JINA_API_KEY}`,
//       "X-Timeout": "5",
//       "X-With-Images-Summary": "true",
//       "X-With-Generated-Alt": "true",
//     };

//     const response = await fetch(fullUrl, {
//       method: "GET",
//       headers: headers,
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.text();
//   },
// };



// batch process for top 3 main result links

export const jinaService = {
  async jinaFetchBatch(links: string[], c: Context): Promise<string[]> {
    if (links.length === 0) {
      return [];
    }

    const top3Links = links.slice(0, 3);
    const results: string[] = [];
    const failedUrls: string[] = [];

    const promises = top3Links.map((link) =>
      this.fetchJinaResultsWithRetry(link, c)
    );
    const settledResults = await Promise.allSettled(promises);

    settledResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        failedUrls.push(top3Links[index]);
        console.error(`Failed to fetch ${top3Links[index]}:`, result.reason);
      }
    });

    console.log(
      `Overall results: ${results.length} successes, ${failedUrls.length} failures`
    );
    if (failedUrls.length > 0) {
      console.log("Failed URLs:", failedUrls);
    }

    return results;
  },

  async fetchJinaResultsWithRetry(
    targetUrl: string,
    c: Context,
    maxRetries = 3
  ): Promise<string> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await this.fetchJinaResults(targetUrl, c);
        return result;
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes("Network connection lost")
        ) {
          console.error(
            `Network error on attempt ${attempt + 1} for ${targetUrl}:`,
            error
          );
          if (attempt === maxRetries - 1) {
            throw error;
          }
          // Only retry for network connection issues
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } else {
          // For all other errors, including HTTP errors, throw immediately
          console.error(`Non-network error for ${targetUrl}:`, error);
          throw error;
        }
      }
    }
    throw new Error("Unexpected end of retry loop");
  },

  async fetchJinaResults(targetUrl: string, c: Context): Promise<string> {
    console.log(`Fetching Jina results from ${targetUrl}`);

    const baseUrl = "https://r.jina.ai/";
    const fullUrl = new URL(targetUrl, baseUrl).toString();

    const headers = {
      Authorization: `Bearer ${c.env.JINA_API_KEY}`,
      "X-Timeout": "5",
      "X-With-Images-Summary": "true",
      "X-With-Generated-Alt": "true",
    };

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
  },
};