import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import searchMainEndpoint from "./endpoints/search";
import { Hono } from "hono";
import { querySchema } from "./validation/zod-validator";
import { zValidator } from "@hono/zod-validator";
import { Bindings } from "../types/workertypes";
import D1middleware from "../middlewares/D1middleware";
import sseEndpoint from "./endpoints/sse";


const app = new Hono<{ Bindings: Bindings }>();

app.use('/search', D1middleware);


app.get("/", (c) => c.text("Hello IntelliQuery!"))
app.get("/sse/:ragProcessID", sseEndpoint);
app.post("/search",
	zValidator("json", querySchema),
	searchMainEndpoint)

export default app;

