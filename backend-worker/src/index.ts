import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { Router } from "itty-router";
import searchMainEndpoint from "./endpoints/search";

export interface Env {
	DB: D1Database;
}

const router = Router();

router
	.get("/", () => new Response("Hello Worker!"))
	.post("/search", searchMainEndpoint)
	.all("*", () => new Response("Not Found", { status: 404 }));


export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
		try {
			return await router.handle(request);
		} catch (error) {
			console.error("Unhandled error:", error);
			return Response.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
		}
  },
};