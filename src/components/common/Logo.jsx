import { Link } from "react-router";

export default function Logo({ className = "" }) {
  return (
    <Link to="/">
      <span
        translate="no"
        aria-label="logo"
        className={`text-primary !font-ptserif text-2xl font-bold text-nowrap dark:text-white ${className}`}
      >
        Quizowisko
      </span>
    </Link>
  );
}
