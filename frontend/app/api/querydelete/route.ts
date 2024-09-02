import { QueryDeleteRequest } from "../../../types/othertypes";

export const runtime = "edge";

export async function POST(request: Request) { 
  const { queryId, jwtToken } = await request.json();

  const queryDeleteRequest: QueryDeleteRequest = {
    queryId,
    jwtToken
  };

  try {
    const response = await fetch("http://localhost:8787/deletequery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queryDeleteRequest),
    });

    const data = await response.json();
    const { queryId, message } = data;

    return new Response(JSON.stringify({
      queryId,
      message
    }), {
      headers: {
        "Content-Type": "application/json",
      },
    });

  } catch (error) {
    console.error(`Error in frontend QueryDelete Route: ${error}`);
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