/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

interface TailEvent {
	scriptName: string;
	eventTimestamp: number;
	outcome: string;
	event?: {
		request?: {
			url: string;
			method: string;
			headers: Record<string, string>;
		};
	};
	logs: Array<{
		timestamp: number;
		level: string;
		message: any[];
	}>;
	exceptions: Array<{
		name: string;
		message: string;
		timestamp: number;
		stack?: string;
	}>;
}

export interface Env {
	// Define your environment bindings here
}

export default {
	async tail(events: TailEvent[], env: Env, ctx: ExecutionContext) {
		for (const event of events) {
			console.log(`\n--- Event for ${event.scriptName} at ${new Date(event.eventTimestamp).toISOString()} ---`);
			console.log(`Outcome: ${event.outcome}`);

			// Log request details if available
			if (event.event?.request) {
				const req = event.event.request;
				console.log(`Request: ${req.method} ${req.url}`);
			}

			// Log console messages
			for (const log of event.logs) {
				console.log(`[${log.level.toUpperCase()}] ${log.message.join(' ')}`);
			}

			// Log all exceptions (including uncaught errors)
			for (const exception of event.exceptions) {
				console.error(`[EXCEPTION] ${exception.name}: ${exception.message}`);
				if (exception.stack) {
					console.error(exception.stack);
				}
			}

			// Log outcome if it's not 'ok'
			if (event.outcome !== 'ok') {
				console.warn(`[WARNING] Worker execution outcome: ${event.outcome}`);
			}
		}
	},
};