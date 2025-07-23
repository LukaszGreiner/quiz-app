import { useNavigate } from "react-router";

export default function Btn({
  children,
  variant = "primary",
  size = "md",
  className = "",
  to,
  onClick,
  ...props
}) {
  const navigate = useNavigate();

  const variants = {
    primary: "bg-primary text-white hover:bg-primary/85 focus:ring-primary/20",
    secondary:
      "bg-secondary text-text-inverse hover:bg-secondary/85 focus:ring-secondary/20",
    tertiary:
      "bg-accent text-text-inverse hover:bg-secondary/85 focus:ring-secondary/20",
    surface:
      "bg-surface text-text hover:bg-surface/85 focus:ring-surface/20",
    elevated:
      "bg-surface-elevated text-text hover:bg-surface-elevated/85 focus:ring-surface-elevated/20",
    danger: "bg-danger text-white hover:bg-danger/85 focus:ring-danger/20",
    correct:
      "bg-correct text-text-inverse hover:bg-correct/85 focus:ring-correct/20",
    incorrect:
      "bg-incorrect text-text-inverse hover:bg-incorrect/85 focus:ring-incorrect/20",
    ghost:
      "bg-transparent text-text hover:bg-primary/10 hover:text-primary focus:ring-primary/20",
    outline:
      "border border-border bg-transparent text-text hover:bg-primary hover:text-white hover:border-primary focus:ring-primary/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95";

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
