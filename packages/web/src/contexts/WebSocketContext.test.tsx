import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { WebSocketProvider, useWebSocket } from "./WebSocketContext";

// Mock WebSocket
class MockWebSocket {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSING = 2;
  static readonly CLOSED = 3;
  static instances: MockWebSocket[] = [];

  readyState: number = MockWebSocket.CONNECTING;
  onopen: (() => void) | null = null;
  onclose: (() => void) | null = null;
  onmessage: ((event: { data: string }) => void) | null = null;
  onerror: (() => void) | null = null;
  send = vi.fn();
  close = vi.fn();

  constructor(_url: string) {
    MockWebSocket.instances.push(this);
    // Simulate async connection
    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      this.onopen?.();
    }, 0);
  }

  simulateMessage(data: unknown) {
    this.onmessage?.({ data: JSON.stringify(data) });
  }
}

function TestComponent({ onMessage }: { onMessage?: (msg: unknown) => void }) {
  const { isConnected, subscribe, send } = useWebSocket();

  if (onMessage) {
    subscribe("test", onMessage);
  }

  return (
    <div>
      <span data-testid="status">
        {isConnected ? "connected" : "disconnected"}
      </span>
      <button onClick={() => send({ type: "ping" })}>Send</button>
    </div>
  );
}

describe("WebSocketContext", () => {
  beforeEach(() => {
    MockWebSocket.instances = [];
    vi.stubGlobal("WebSocket", MockWebSocket);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("should show disconnected initially", () => {
    render(
      <WebSocketProvider url="ws://localhost:3000/ws">
        <TestComponent />
      </WebSocketProvider>
    );

    expect(screen.getByTestId("status")).toHaveTextContent("disconnected");
  });

  it("should show connected after WebSocket opens", async () => {
    render(
      <WebSocketProvider url="ws://localhost:3000/ws">
        <TestComponent />
      </WebSocketProvider>
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(screen.getByTestId("status")).toHaveTextContent("connected");
  });

  it("should send messages through WebSocket", async () => {
    render(
      <WebSocketProvider url="ws://localhost:3000/ws">
        <TestComponent />
      </WebSocketProvider>
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    await act(async () => {
      screen.getByText("Send").click();
    });

    expect(MockWebSocket.instances[0].send).toHaveBeenCalledWith(
      JSON.stringify({ type: "ping" })
    );
  });

  it("should throw error when useWebSocket is used outside provider", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useWebSocket must be used within a WebSocketProvider");

    consoleError.mockRestore();
  });
});
