import { Home, User, PlusCircle, LayoutDashboard } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";
import Logo from "../common/Logo";
import Btn from "../common/Btn";
import { Link, useLocation } from "react-router-dom";
import ProfileAvatar from "../Header/ProfileAvatar";

const navLinks = [
  { path: "/", label: "Strona główna", icon: Home },
  { path: "/newquiz", label: "Stwórz Quiz", icon: PlusCircle },
  { path: "design-system", label: "Design System", icon: LayoutDashboard },
];

function Header() {
  const location = useLocation?.() || { pathname: "/" };

  return (
    <header className="bg-surface-elevated sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop: logo + nav + theme toggle */}
        <div className="hidden h-16 items-center justify-between sm:flex">
          <div className="flex items-center">
            <Logo />
          </div>
          <nav className="flex items-center space-x-4">
            {navLinks.map(({ path, label }) => (              <Btn
                key={path}
                to={path}
                variant={location.pathname === path ? "primary" : "ghost"}
                size="sm"
                aria-label={label}
              >
                {label}
              </Btn>
            ))}
            <ProfileAvatar />
            <ThemeToggle />
          </nav>
        </div>
        {/* Mobile: logo + theme toggle */}
        <div className="flex h-16 items-center justify-between gap-2 sm:hidden">
          <Logo />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export default Header;
