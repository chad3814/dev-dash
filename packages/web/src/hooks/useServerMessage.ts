import { useEffect } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";
import { ServerMessage } from "../types";

/**
 * Subscribe to a specific server message type.
 * The handler will be called whenever a message of the given type is received.
 *
 * @param type - The message type to subscribe to, or "*" for all messages
 * @param handler - Callback function to handle the message
 */
export function useServerMessage(
  type: string,
  handler: (message: ServerMessage) => void
) {
  const { subscribe } = useWebSocket();

  useEffect(() => {
    return subscribe(type, handler);
  }, [type, handler, subscribe]);
}
