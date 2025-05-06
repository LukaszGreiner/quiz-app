import { FaClock, FaEye, FaStar, FaTag } from "react-icons/fa";
import { quizFormConfig } from "../../config/quizFormConfig";
import { formatTotalTime } from "../../utils/quizUtils";
import { getImageSource } from "../../services/imageUploadService";

export default function QuizFormSummary({ fields, totalTime }) {
  return (
    <div className="flex flex-col gap-6 p-2 md:flex-row md:items-center">
      <div className="mx-auto flex-shrink-0 md:mx-0">
        {fields.image ? (
          <img
            src={getImageSource(fields.image)}
            alt="Podgląd zdjęcia quizu"
            className="h-24 w-24 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-md bg-gray-200 text-sm text-gray-500">
            Brak zdjęcia
          </div>
        )}
      </div>
      <div className="flex-1 text-center text-sm text-gray-700 md:text-left">
        <p className="mb-2 line-clamp-3 break-all">{fields.description}</p>
        <div className="flex flex-wrap justify-center gap-3 md:justify-start">
          <span className="flex items-center gap-1">
            <FaTag size={12} /> {fields.category || "Brak"}
          </span>
          <span className="flex items-center gap-1">
            <FaStar size={12} />{" "}
            {quizFormConfig.DIFFICULTY_LEVELS[fields.difficulty]}
          </span>
          <span className="flex items-center gap-1">
            <FaClock size={12} />{" "}
            {fields.timeLimitPerQuestion
              ? `${fields.timeLimitPerQuestion} s (${formatTotalTime(totalTime)})`
              : "Bez limitu"}
          </span>
          <span className="flex items-center gap-1">
            <FaEye size={12} />{" "}
            {quizFormConfig.VISIBILITY_OPTIONS[fields.visibility]}
          </span>
        </div>
      </div>
    </div>
  );
}
