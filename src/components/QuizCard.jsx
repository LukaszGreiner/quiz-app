import { FaStar, FaHeart, FaSignal } from "react-icons/fa";
import { useState } from "react"; // Import useState for local toggle

export default function QuizCard({
  imageSrc,
  imageAlt,
  title,
  description,
  buttonText,
  avgScore,
  likes,
  difficulty,
}) {
  // Local state to toggle "liked" status
  const [isLiked, setIsLiked] = useState(false);

  // Function to determine difficulty color
  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "hard":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  // Toggle like state
  const handleLikeToggle = () => {
    setIsLiked((prev) => !prev);
  };

  return (
    <div className="relative flex w-full max-w-[500px] min-w-[300px] flex-col items-center rounded-xl bg-white p-4 shadow-md transition duration-300 hover:shadow-lg md:max-w-[600px] md:min-w-0 md:flex-row lg:w-[calc(50%-1rem)] lg:max-w-none">
      {/* Like Button */}
      <button
        onClick={handleLikeToggle}
        className="absolute top-2 right-2 p-1 focus:outline-none"
        title="Like this quiz"
      >
        <FaHeart
          className={`text-2xl ${isLiked ? "text-red-500" : "text-gray-300"} hover:text-red-400 transition-colors duration-200`}
        />
      </button>

      {/* Image */}
      <img
        src={imageSrc}
        alt={imageAlt}
        className="mb-4 h-32 w-32 rounded-lg md:mr-6 md:mb-0 md:h-40 md:w-40"
      />

      {/* Text Content */}
      <div className="flex-1 text-center md:text-left">
        <h4 className="text-dark mb-2 text-xl font-semibold">{title}</h4>
        <p className="text-secondary mb-4">{description}</p>

        {/* Stats Section */}
        <div className="mb-4 flex justify-center gap-4 md:justify-start">
          <div className="flex items-center gap-1" title="Average Score">
            <FaStar className="text-yellow-400" />
            <span>{avgScore ? `${avgScore}%` : "N/A"}</span>
          </div>
          <div className="flex items-center gap-1" title="Likes">
            <FaHeart className="text-red-500" />
            <span>{likes ?? 0}</span>
          </div>
          <div className="flex items-center gap-1" title="Difficulty">
            <FaSignal className={getDifficultyColor(difficulty)} />
            <span>{difficulty || "Unknown"}</span>
          </div>
        </div>

        <a
          href="#"
          className="bg-success inline-block rounded-full px-5 py-2 font-semibold text-white transition duration-300 hover:bg-blue-400"
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
}
