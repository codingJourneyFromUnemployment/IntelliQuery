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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${baseUrl}/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Query-Id": id,
      },
      body: JSON.stringify(query),
    });

    const data = await response.json();
    const { ragProcessID, intentCategory, jwtToken } = data;
    
    return new Response(JSON.stringify({
      id,
      ragProcessID,
      intentCategory,
      jwtToken
    }), {
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


