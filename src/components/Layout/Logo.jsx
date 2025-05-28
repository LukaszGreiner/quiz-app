import { Link } from "react-router";

export default function Logo({ className = "" }) {
  return (
    <Link to="/">
      <span
        className={`font-ptserif text-2xl font-bold text-nowrap ${className}`}
      >
        Quizowisko
      </span>
    </Link>
  );
}
