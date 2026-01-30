import Fastify, { FastifyInstance } from "fastify";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface ServerOptions {
  logger?: boolean;
}

export async function createServer(
  options: ServerOptions = {}
): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: options.logger ?? true,
  });

  // Health check endpoint
  fastify.get("/api/health", async () => {
    return { status: "ok" };
  });

  // In production, serve the built web assets
  if (process.env.NODE_ENV === "production") {
    await fastify.register(fastifyStatic, {
      root: path.join(__dirname, "../../web/dist"),
      prefix: "/",
    });

    // SPA fallback - serve index.html for all non-file routes
    fastify.setNotFoundHandler(async (_request, reply) => {
      return reply.sendFile("index.html");
    });
  }

  return fastify;
}
