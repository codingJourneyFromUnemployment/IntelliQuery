import { Bindings, Query } from "../types/workertypes";
import { createMiddleware } from "hono/factory";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { Context } from "hono";

const D1middleware = createMiddleware(async (c : Context, next) => {
  const adapter = new PrismaD1(c.env.DB)
  const prisma = new PrismaClient({ adapter });
  c.set("prisma", prisma);

  await next();
  await prisma.$disconnect();
});

export default D1middleware;


