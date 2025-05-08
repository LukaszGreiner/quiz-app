import { FaCrown } from "react-icons/fa";

const getStarColor = (rating) => {
  if (rating >= 5) return "#FFD700"; // złota (korona)
  if (rating >= 4) return "#facc15"; // żółta
  if (rating >= 3) return "#22c55e"; // zielona
  if (rating >= 2) return "#38bdf8"; // niebieska
  if (rating >= 1) return "#ef4444"; // czerwona
  return "#e5e7eb"; // szara
};

const StarLevel = ({ rating = 0 }) => {
  if (rating >= 5) {
    // Korona dla 5
    return (
      <FaCrown
        color="#FFD700"
        style={{ fontSize: 22, filter: "drop-shadow(0 0 2px #FFD700)" }}
      />
    );
  }

  // Gwiazdka z poziomem zamalowania
  const fillPercent = Math.max(0, Math.min(1, rating / 5)) * 100;
  const starColor = getStarColor(rating);

  return (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="starGradient">
          <stop offset={`${fillPercent}%`} stopColor={starColor} />
          <stop offset={`${fillPercent}%`} stopColor="#e5e7eb" />
        </linearGradient>
      </defs>
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill="url(#starGradient)"
        stroke="#b4b4b4"
        strokeWidth="0.5"
      />
    </svg>
  );
};

export default StarLevel;
