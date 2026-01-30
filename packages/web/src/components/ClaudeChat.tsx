import React, { useState, useCallback } from "react";
import { useWebSocket } from "../contexts/WebSocketContext";
import { useServerMessage } from "../hooks/useServerMessage";
import { ServerMessage } from "../types";

export function ClaudeChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<unknown[]>([]);
  const { send } = useWebSocket();

  const handleMessage = useCallback((message: ServerMessage) => {
    setMessages((prev) => [...prev, message.payload]);
  }, []);

  useServerMessage("RECV_CLAUDE", handleMessage);

  const handleSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      send({ type: "SEND_CLAUDE", payload: input.trim() });
      setInput("");
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <textarea
        readOnly
        value={JSON.stringify(messages, null, 2)}
        className="flex-1 min-h-[400px] p-4 font-mono text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
      />
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleSubmit}
        placeholder="Type a message and press Enter..."
        className="p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100 placeholder-gray-500"
      />
    </div>
  );
}
