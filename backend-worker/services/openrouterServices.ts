import {
  Response,
  NonStreamingChoice,
  StreamingChoice,
} from "../types/openrouter";
import { Bindings } from "../types/workertypes";

export interface ReplyData {
  reply: string;
}

export async function openrouterService(
  context: string,
  env: Bindings
): Promise<ReplyData> {
  if (!context) {
    throw new Error("Missing context");
  }

  const current_model = env.OPENROUTER_MODEL;

  console.log(`current_model: ${current_model}`);

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
          model: current_model,
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
    console.error("Error in openrouterService", error);
    throw new Error(
      `API request failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
