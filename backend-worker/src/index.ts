import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import searchMainEndpoint from "./endpoints/search";
import getContents from "./endpoints/getcontents";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { querySchema, deleteQueryByIdSchema } from "./validation/zod-validator";
import { zValidator } from "@hono/zod-validator";
import { Bindings } from "../types/workertypes";
import D1middleware from "../middlewares/D1middleware";
import sseEndpoint from "./endpoints/sse";
import deleteQueryById from "./endpoints/deletequery";
import deepRAGSubRequest from "./endpoints/subrequest";


const app = new Hono<{ Bindings: Bindings }>();

app.use('*', D1middleware);


app.use("*", async (c, next ) => {
  const corsMiddlewareHandler = cors({
    origin: [c.env.CORS_ORIGIN_1, c.env.CORS_ORIGIN_2],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Query-Id"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  });

  return corsMiddlewareHandler(c, next);
})

// app.use("/search", async (c, next) => {
//   const XQueryId = c.req.header("X-Query-Id");
//   const { success } = await c.env.RATE_LIMITER.limit({ key: XQueryId });
//   if (!success) {
//     return c.json({ error: "Rate limit exceeded" }, 429);
//   }

//   await next();
// });


app.get("/", getContents);
app.get("/sse/:ragProcessID", sseEndpoint);
app.post("/search",
	zValidator("json", querySchema),
	searchMainEndpoint)
app.post("/deletequery",
  zValidator("json", deleteQueryByIdSchema),
  deleteQueryById);
app.post("/subrequest", deepRAGSubRequest);

export default app;

