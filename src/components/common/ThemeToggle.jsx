// filepath: c:\Users\Łukasz Greiner\Documents\VSC projects\cursor\quiz-app\src\components\UI\ThemeToggle.jsx
import { Moon, Sun } from "lucide-react";
import Button from "./Btn";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={() => toggleTheme(theme)}
      className="hover:bg-background hover:[&_svg] flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm [&_svg]:size-4 hover:[&_svg]:fill-current"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="text-text fill-none hover:fill-black" />
      ) : (
        <Sun className="text-text fill-none hover:fill-white" />
      )}
    </button>
  );
}
