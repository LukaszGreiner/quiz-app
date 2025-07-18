import { navigationConfig } from "../../config/navigationConfig";
import ThemeToggle from "../common/ThemeToggle";
import LanguageSwitcher from "../common/LanguageSwitcher";
import Logo from "../common/Logo";
import Btn from "../common/Btn";
import { useLocation } from "react-router-dom";
import ProfileAvatar from "../Header/ProfileAvatar";
import StreakCard from "../UserPage/StreakCard";
import { useAuth } from "../../context/AuthContext";

function Header() {
  const location = useLocation?.() || { pathname: "/" };
  const { currentUser } = useAuth();

  return (
    <header className="bg-surface-elevated sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop: logo + nav + theme toggle */}
        <div className="hidden h-16 items-center justify-between sm:flex">
          <div className="flex items-center">
            <Logo />
          </div>
          <nav className="flex items-center space-x-4">
            {navigationConfig
              .filter((item) => item.showInDesktop)
              .map(({ path, label }) => (
                <Btn
                  key={path}
                  to={path}
                  variant={location.pathname === path ? "primary" : "ghost"}
                  size="sm"
                  aria-label={label}
                >
                  {label}
                </Btn>
              ))}
            {currentUser && (
              <div className="hidden lg:block">
                <StreakCard compact={true} showActions={false} />
              </div>
            )}
            <ProfileAvatar />
            <LanguageSwitcher />
            <ThemeToggle />
          </nav>
        </div>
        {/* Mobile: logo + theme toggle */}
        <div className="flex h-16 items-center justify-between gap-2 sm:hidden">
          <Logo />
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
