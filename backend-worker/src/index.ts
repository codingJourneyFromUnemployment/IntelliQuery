import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

export interface Env {
	DB: D1Database;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const adapter = new PrismaD1(env.DB);
		const prisma = new PrismaClient({ adapter });

		const users = await prisma.user.findMany();
		return new Response(JSON.stringify(users), {
			headers: { "content-type": "application/json" },
		});
	}
} satisfies ExportedHandler<Env>;