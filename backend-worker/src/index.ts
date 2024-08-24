import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import searchMainEndpoint from "./endpoints/search";
import { Hono } from "hono";
import { querySchema } from "./validation/zod-validator";
import { zValidator } from "@hono/zod-validator";

export interface Env {
	DB: D1Database;
}

const app = new Hono()



app.get("/", (c) => c.text("Hello IntelliQuery!"))
app.post("/search",
	zValidator("json", querySchema),
	searchMainEndpoint)

export default app;

