import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "../common/Logo";
import ThemeToggle from "../common/ThemeToggle";
import Btn from "../common/Btn";
import { useAuth } from "../../context/AuthContext";
import ProfileAvatar from "../Header/ProfileAvatar";

export default function Header({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, currentUser, logout } = useAuth();
  const navLinks = [
    { path: "/", label: "Strona główna" },
    { path: "/newquiz", label: "Stwórz Quiz" },
    { path: "/design-system", label: "Design System" },
    { path: "/user/library", label: "[Dashboard]" },
    { path: "/profile/🌵", label: "[OtherUserPage]" },
  ];

  return (
    <header className="bg-surface-elevated sticky top-0 z-50 border-b backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden items-center space-x-4 sm:flex">
            <ThemeToggle />
            {isAuthenticated ? (
              <ProfileAvatar
                isAuthenticated={isAuthenticated}
                avatar={currentUser.photoURL}
                username={currentUser?.username}
              />
            ) : (
              <>
                <div className="border-surface bg-border h-4 w-px border-1"></div>
                <Btn variant="ghost" size="small" to="/login">
                  Zaloguj się
                </Btn>
                <Btn variant="primary" size="small" to="/signup">
                  Zarejestruj się
                </Btn>
              </>
            )}
          </nav>

          {/* Mobile navigation */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-text hover:text-primary focus:text-primary focus:ring-primary/20 rounded-md p-2 transition-colors duration-200 focus:ring-2 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        {/* Mobile navigation */}
        <div
          className={`border-border bg-surface-elevated overflow-hidden border-t transition-all duration-300 ease-in-out sm:hidden ${
            isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-4 px-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-text text-sm font-medium">Motyw</span>
              <ThemeToggle />
            </div>
            <div className="border-border space-y-2 border-t pt-4">
              {isAuthenticated ? (
                <Btn
                  onClick={() => logout()}
                  variant="danger"
                  size="small"
                  className="mx-auto"
                  to="/login"
                >
                  Wyloguj się
                </Btn>
              ) : (
                <>
                  <Btn
                    variant="outline"
                    size="small"
                    to="/login"
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Zaloguj się
                  </Btn>
                  <Btn
                    variant="primary"
                    size="small"
                    to="/signup"
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Zarejestruj się
                  </Btn>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
