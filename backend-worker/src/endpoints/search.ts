import { Context } from "hono";
import { Query } from "../../types/workertypes";
import { openrouterService } from "../../services/openrouterServices";
import { Bindings } from "../../types/workertypes";


const searchMainEndpoint = async (c: Context) => {
  try {
    const query: Query = await c.req.json();
    const searchContent = query.content;
    console.log(`Search content: ${searchContent}`);

    const env = c.env as Bindings;
    console.log(`Env: ${env.OPENROUTER_MODEL}`);
    console.log(`Env: ${env.OPENROUTER_API_KEY}`);

    // Call OpenRouter service
    const reply = await openrouterService(searchContent, c.env);
    console.log(`Reply from OpenRouter: ${reply.reply}`);

    return c.json({
      data: `Reply from OpenRouter: ${reply.reply}`,
    });
  } catch (error) {
    console.error(`Error in searchMainEndpoint: ${error}`);
    return c.json({ error: "Error in searchMainEndpoint" }, 500);
  }
};

export default searchMainEndpoint;
