import { Outlet } from "react-router-dom";
// import Header from "./Header";
import Footer from "./Footer";
import Header from "./Header";

function Layout() {
  return (
    <div className="bg-background mx-auto flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-grow px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
