import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import searchMainEndpoint from "./endpoints/search";
import { Hono } from "hono";

export interface Env {
	DB: D1Database;
}

const app = new Hono()

app.get("/", (c) => c.text("Hello Worker!"))
app.post("/search", searchMainEndpoint)

export default app;

