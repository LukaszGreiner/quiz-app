import { Home, User, PlusCircle, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { path: "/", icon: Home },
  { path: "/newquiz", icon: PlusCircle },
  { path: "/design-system", icon: LayoutDashboard },
  { path: "/user/details", icon: User },
];

function Footer() {
  const location = useLocation?.() || { pathname: "/" };
  return (
    <footer className="bg-surface-elevated relative mt-auto p-4 text-white">
      {/* Desktop: klasyczny footer */}
      <div className="container mx-auto hidden text-center sm:block">
        <p>&copy; 2025 Quizowisko</p>
      </div>
      {/* Mobile: bottom navigation */}
      <nav
        className="border-border bg-surface-elevated fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around border-t shadow-lg sm:hidden"
        role="navigation"
        aria-label="Mobilna nawigacja"
      >
        {navLinks.map(({ path, label, icon }) => {
          const Icon = icon;
          return (
            <Link
              key={path}
              to={path}
              aria-label={label}
              className={`focus-visible:ring-primary/20 flex flex-col items-center justify-center gap-1 px-2 py-1 transition-colors duration-200 focus:outline-none focus-visible:ring-2 ${
                location.pathname === path
                  ? "text-primary"
                  : "text-text/85 hover:text-primary"
              }`}
              tabIndex={0}
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}

export default Footer;
