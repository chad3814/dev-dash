import { ThemeToggle } from "./ThemeToggle";

interface TopBarProps {
  theme: "light" | "dark";
  onThemeToggle: () => void;
}

export function TopBar({ theme, onThemeToggle }: TopBarProps) {
  return (
    <header className="h-14 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center px-4">
      <div className="flex-1" />
      <h1 className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
        /dev/dash
      </h1>
      <div className="flex-1 flex justify-end">
        <ThemeToggle theme={theme} onToggle={onThemeToggle} />
      </div>
    </header>
  );
}
