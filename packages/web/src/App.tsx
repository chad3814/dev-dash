import { useTheme } from "./hooks/useTheme";
import { TopBar } from "./components/TopBar";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { ClaudeChat } from "./components/ClaudeChat";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <WebSocketProvider>
      <div className="min-h-full bg-gray-50 dark:bg-gray-800 flex flex-col">
        <TopBar theme={theme} onThemeToggle={toggleTheme} />
        <main className="flex-1 p-4">
          <ClaudeChat />
        </main>
      </div>
    </WebSocketProvider>
  );
}

export default App;
