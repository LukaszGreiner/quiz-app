import { Link } from "react-router";

export default function Logo({
  className = "",
  variant = "full",
  linkTo = "/",
}) {
  const logoText = variant === "compact" ? "Q" : "Quizowisko";

  return (
    <Link to={linkTo}>
      <span
        translate="no"
        aria-label="logo"
        className={`text-primary !font-ptserif text-2xl font-bold text-nowrap dark:text-white ${className}`}
      >
        {logoText}
      </span>
    </Link>
  );
}
