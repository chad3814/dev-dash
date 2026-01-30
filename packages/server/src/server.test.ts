import { describe, it, expect, afterEach } from "vitest";
import { createServer } from "./server.js";

describe("Server", () => {
  let server: Awaited<ReturnType<typeof createServer>> | null = null;

  afterEach(async () => {
    if (server) {
      await server.close();
      server = null;
    }
  });

  it("should create a server instance", async () => {
    server = await createServer({ logger: false });
    expect(server).toBeDefined();
  });

  it("should respond to health check", async () => {
    server = await createServer({ logger: false });

    const response = await server.inject({
      method: "GET",
      url: "/api/health",
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok" });
  });
});
