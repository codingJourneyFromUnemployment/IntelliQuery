import { Query } from "../../../types/othertypes"

export const runtime = "edge";

export async function POST(request: Request) {
  const { content } = await request.json();

  const id = crypto.randomUUID();

  const intentCategory = "Undefined";

  const query: Query = {
    id,
    content,
    intentCategory,
    createdAt: new Date()
  };

  console.log("Query:", query);

  try {

    // Enter QuickRAG Process
    const response = await fetch("http://localhost:8787/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    });

    const data = await response.json();
    const { ragProcessID } = data;
    
    return new Response(JSON.stringify({ ragProcessID }), {
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error(`Error in frontend Search Route: ${error}`);
    return new Response(
      JSON.stringify({
        quickReply: "An error occurred while processing your request.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}


