import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;
let currentStream: ReturnType<Anthropic["messages"]["stream"]> | null = null;

function getClient(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error(
        "ANTHROPIC_API_KEY environment variable is not set. Copy .env.example to .env and add your API key."
      );
    }
    client = new Anthropic();
  }
  return client;
}

export async function* sendMessage(
  text: string
): AsyncGenerator<Anthropic.RawMessageStreamEvent> {
  const anthropic = getClient();

  // Cancel any existing stream
  if (currentStream) {
    currentStream.abort();
    currentStream = null;
  }

  currentStream = anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8096,
    messages: [{ role: "user", content: text }],
  });

  for await (const event of currentStream) {
    yield event;
  }

  currentStream = null;
}
