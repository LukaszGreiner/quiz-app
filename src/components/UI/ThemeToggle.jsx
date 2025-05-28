// filepath: c:\Users\Łukasz Greiner\Documents\VSC projects\cursor\quiz-app\src\components\UI\ThemeToggle.jsx
import { Moon, Sun } from "lucide-react";
import Button from "./Btn";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      className="rounded-full"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="text-text h-5 w-5 fill-none hover:fill-current" />
      ) : (
        <Sun className="text-text h-5 w-5 fill-none hover:fill-current" />
      )}
    </Button>
  );
}
