import { FastifyInstance } from "fastify";
import { WebSocket } from "ws";
import { ServerMessage, ClientMessage } from "./types.js";

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

function handleClientMessage(_socket: WebSocket, message: ClientMessage): void {
  // Handle different message types here
  switch (message.type) {
    case "ping":
      // Example: respond to ping
      break;
    default:
      // Unknown message type
      break;
  }
}
