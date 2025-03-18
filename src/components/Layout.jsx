import React from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quiz App</h1>
          <nav>
            <Link to="/" className="mr-4 hover:underline">
              Home
            </Link>
            <Link to="/quizes" className="mr-4 hover:underline">
              Quizes
            </Link>
            <Link to="/add-quiz" className="hover:underline">
              Add Quiz
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow bg-gray-100 p-4">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
      <footer className="bg-blue-600 text-white p-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* &copy; {new Date().getFullYear()} Quiz App. All rights reserved. */}
        </div>
      </footer>
    </div>
  );
}
