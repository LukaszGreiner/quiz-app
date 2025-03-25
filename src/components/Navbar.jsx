import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Hamburger from "./Hamburger";

// Navigation link data
const navLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
];

const linkStyle = "text-white hover:text-gray-300";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, currentUser, username } = useAuth();
  const profileImage = currentUser?.photoURL || "/profile_icon.jpg";

  return (
    <div className="flex w-full items-center justify-end">
      {/* Hamburger toggle for mobile */}
      <Hamburger className="md:hidden" isOpen={isOpen} setIsOpen={setIsOpen} />

      <DesktopNav />

      <ProfileSection
        isAuthenticated={isAuthenticated}
        profileImage={profileImage}
        username={username}
      />

      <MobileNav
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}

function DesktopNav() {
  return (
    <div className="hidden flex-1 justify-center md:flex">
      <nav className="flex space-x-6">
        {navLinks.map((link) => (
          <Link key={link.path} to={link.path} className={linkStyle}>
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

// Profile picture (desktop only)
function ProfileSection({ isAuthenticated, profileImage, username }) {
  return (
    <div className="hidden items-center md:flex">
      {isAuthenticated ? (
        <Link to="/user/details" className="flex items-center gap-2">
          <img
            src={profileImage}
            alt="Profile"
            className="h-10 w-10 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
          <span className="text-white">{username}</span>
        </Link>
      ) : (
        <Link to="/user/login">
          <button className="bg-secondary hover:bg-secondary/90 rounded-md px-4 py-2 text-white transition-colors">
            Sign In
          </button>
        </Link>
      )}
    </div>
  );
}

function MobileNav({ isOpen, setIsOpen, isAuthenticated }) {
  return (
    <nav
      className={`bg-primary absolute top-full left-0 z-10 w-full flex-col space-y-4 p-4 md:hidden ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={linkStyle}
          onClick={() => setIsOpen(false)}
        >
          {link.label}
        </Link>
      ))}
      <Link
        to={isAuthenticated ? "/user/details" : "/user/login"}
        className={linkStyle}
        onClick={() => setIsOpen(false)}
      >
        Profile
      </Link>
    </nav>
  );
}

export default Navbar;
