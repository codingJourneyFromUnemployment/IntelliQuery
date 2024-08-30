import { Hono, Context } from "hono";
import type { DurableObjectState } from "@cloudflare/workers-types";
import { deepRAGService } from "../services/deepRAGService";
import { Bindings } from "../types/workertypes";

export class DeepRAGDurableObject {
  state: DurableObjectState;
  app: Hono<{ Bindings: Bindings }>;
  env: Bindings;

  constructor(state: DurableObjectState, env: Bindings) {
    this.state = state;
    this.env = env;
    this.app = new Hono<{ Bindings: Bindings }>();

    this.app.post("/deeprag", async (c, env) => {
      try {
        const {queryId, query } = await c.req.json();

        await deepRAGService.processDeepRAG(queryId, query, c);
        return c.json({ message: "DeepRAG process completed" });
      } catch (error) {
        console.error(
          `Error in processDeepRAG(DeepRAGDurableObject): ${error}`
        );
        return c.json({ status: "error", error: error});
      }
    });
  }

  async fetch(request: Request) {
    return this.app.fetch(request);
  }
}
