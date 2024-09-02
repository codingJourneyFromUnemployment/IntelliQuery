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


// export { DeepRAGDurableObject } from "../services/deepRAGDO";

const app = new Hono<{ Bindings: Bindings }>();

app.use('*', D1middleware);


app.use("*", async (c, next ) => {
  const corsMiddlewareHandler = cors({
    origin: c.env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  });

  return corsMiddlewareHandler(c, next);
})



app.get("/", getContents);
app.get("/sse/:ragProcessID", sseEndpoint);
app.post("/search",
	zValidator("json", querySchema),
	searchMainEndpoint)
app.post("/deletequery",
  zValidator("json", deleteQueryByIdSchema),
  deleteQueryById);

export default app;

