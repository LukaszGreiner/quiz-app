import { useNavigate } from "react-router";

export default function Btn({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  to,
  onClick,
  ...props
}) {
  const navigate = useNavigate();

  const variants = {
    base: "hover:underline",
    primary: "bg-primary text-white hover:bg-accent/85",
    secondary: "bg-secondary text-white hover:bg-secondary/85 hover:text-whitr",
    tertiary:
      "bg-text text-text-inverse hover:bg-text-inverse/85 hover:text-text",
    white:
      "dark:bg-white dark:text-primary dark:hover:bg-white/85 text-white bg-primary hover:bg-primary/85",
    accent: "bg-accent text-white hover:bg-accent/85",
    outline:
      "border bg-transparent border-text text-text hover:bg-accent/85 hover:text-white/85",
    outline2: "border bg-transparent text-white hover:bg-primary",
    success: "bg-success text-white hover:bg-success/85",
    warning: "bg-danger text-white hover:bg-danger/85",
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  const handleClick = (e) => {
    if (to) {
      navigate(to);
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button className={classes} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}
