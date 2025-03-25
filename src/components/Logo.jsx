import { Link } from "react-router";

export default function Logo() {
  return (
    <Link to="/">
      <span className="font-poppins text-2xl font-bold text-nowrap">
        My App
      </span>
    </Link>
  );
}
