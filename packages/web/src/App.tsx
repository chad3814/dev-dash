import { useTheme } from "./hooks/useTheme";
import { TopBar } from "./components/TopBar";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-800">
      <TopBar theme={theme} onThemeToggle={toggleTheme} />
      <main className="p-4">{/* Main content will go here */}</main>
    </div>
  );
}

export default App;
