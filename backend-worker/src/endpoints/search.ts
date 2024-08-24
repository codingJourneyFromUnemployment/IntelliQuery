import { Context } from "hono";
import { Query } from "../../types/workertypes";
import { openrouterService } from "../../services/openrouterServices";


const searchMainEndpoint = async (c: Context) => {
  try {
    const query: Query = await c.req.json();
    const searchContent = query.content;
    console.log(`Search content: ${searchContent}`);

    // Call OpenRouter service
    

    return c.json({
      data: `Searching for ${searchContent}`,
    });
  } catch (error) {
    console.error(`Error in searchMainEndpoint: ${error}`);
    return c.json({ error: "Error in searchMainEndpoint" }, 500);
  }
};

export default searchMainEndpoint;
