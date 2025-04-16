import { Link } from "react-router";

export default function Logo() {
  return (
    <Link to="/">
      <span className="font-ptserif text-2xl font-bold text-nowrap">
        Quizowisko
      </span>
    </Link>
  );
}
