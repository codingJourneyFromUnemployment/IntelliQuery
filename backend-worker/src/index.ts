import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import searchMainEndpoint from "./endpoints/search";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { querySchema } from "./validation/zod-validator";
import { zValidator } from "@hono/zod-validator";
import { Bindings } from "../types/workertypes";
import D1middleware from "../middlewares/D1middleware";
import sseEndpoint from "./endpoints/sse";


// export { DeepRAGDurableObject } from "../services/deepRAGDO";

const app = new Hono<{ Bindings: Bindings }>();

app.use('/search', D1middleware);

app.use(
  "/*",
  cors({
    origin: "http://localhost:3000",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.get("/", (c) => c.text("Hello IntelliQuery!"))
app.get("/sse/:ragProcessID", sseEndpoint);
app.post("/search",
	zValidator("json", querySchema),
	searchMainEndpoint)

export default app;

