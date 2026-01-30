import { useTheme } from "./hooks/useTheme";
import { TopBar } from "./components/TopBar";
import { WebSocketProvider } from "./contexts/WebSocketContext";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <WebSocketProvider>
      <div className="min-h-full bg-gray-50 dark:bg-gray-800">
        <TopBar theme={theme} onThemeToggle={toggleTheme} />
        <main className="p-4">{/* Main content will go here */}</main>
      </div>
    </WebSocketProvider>
  );
}

export default App;
