import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Query } from "../../types/workertypes";



const querySchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  content: z.string(),
  intentCategory: z.enum([
    "DIRECT_LLM_ANSWER", "RAG_PROCESS","Undefined"
  ]).optional(),
  createdAt: z
    .string()
    .datetime()
    .transform((str) => new Date(str)),
  searchResults: z.string().optional(),
  ragResultId: z.string().optional(),
  deepRAGProfileId: z.string().optional(),
});


export { querySchema };