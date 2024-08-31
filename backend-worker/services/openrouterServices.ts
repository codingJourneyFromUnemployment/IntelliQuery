import {
  Response,
  NonStreamingChoice,
  StreamingChoice,
} from "../types/openrouter";
import { Bindings } from "../types/workertypes";

export interface ReplyData {
  reply: string;
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function openrouterService(
  context: string,
  env: Bindings,
  currentModel: string
): Promise<ReplyData> {
  if (!context) {
    throw new Error("Missing context");
  }

  console.log(`current_model: ${currentModel}`);

  const maxRetries = 5;
  const baseDelay = 1000; // 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: currentModel,
            messages: [
              {
                role: "user",
                content: context,
              },
            ],
            temperature: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as Response;

      if (!data.choices || data.choices.length === 0) {
        throw new Error("No response from OpenRouter API");
      }

      const firstChoice = data.choices[0] as NonStreamingChoice;
      const reply = firstChoice.message.content;

      if (!reply) {
        throw new Error("No reply from OpenRouter API");
      }

      return { reply };
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        throw new Error(
          `API request failed after ${maxRetries} attempts: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
      const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 1000; // Add up to 1 second of random jitter
      await delay(exponentialDelay + jitter);
    }
  }

  // This line should never be reached due to the throw in the loop,
  // but TypeScript requires a return statement
  throw new Error("Unexpected end of function");
}
