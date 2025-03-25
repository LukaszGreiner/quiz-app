import Logo from "./Logo";
import Navbar from "./Navbar";

function Header() {
  return (
    <header className="bg-primary md:px- sticky top-0 z-99 mx-auto flex w-full items-center justify-between p-4 text-white">
      <Logo />
      <Navbar />
    </header>
  );
}

export default Header;
