import { FastifyInstance } from "fastify";
import { WebSocket } from "ws";
import { ServerMessage, ClientMessage } from "./types.js";
import { sendMessage } from "./claude.js";

const clients = new Set<WebSocket>();

export function broadcastMessage(message: ServerMessage): void {
  const data = JSON.stringify(message);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
}

export async function registerWebSocket(fastify: FastifyInstance) {
  fastify.get("/ws", { websocket: true }, (socket, _request) => {
    clients.add(socket);

    socket.on("message", (rawData: Buffer) => {
      try {
        const message = JSON.parse(rawData.toString()) as ClientMessage;
        handleClientMessage(socket, message);
      } catch {
        // Ignore malformed messages
      }
    });

    socket.on("close", () => {
      clients.delete(socket);
    });

    // Send initial connection confirmation
    const welcome: ServerMessage = {
      type: "connected",
      payload: { timestamp: Date.now() },
    };
    socket.send(JSON.stringify(welcome));
  });
}

async function handleClientMessage(
  _socket: WebSocket,
  message: ClientMessage
): Promise<void> {
  switch (message.type) {
    case "SEND_CLAUDE": {
      const text = message.payload as string;
      if (typeof text === "string" && text.trim()) {
        try {
          for await (const event of sendMessage(text)) {
            broadcastMessage({
              type: "RECV_CLAUDE",
              payload: event,
            });
          }
        } catch (error) {
          broadcastMessage({
            type: "RECV_CLAUDE",
            payload: {
              type: "error",
              error:
                error instanceof Error
                  ? error.message
                  : "Unknown error occurred",
            },
          });
        }
      }
      break;
    }
    case "ping":
      // Example: respond to ping
      break;
    default:
      // Unknown message type
      break;
  }
}
