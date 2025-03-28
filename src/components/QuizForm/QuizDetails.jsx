import { useState } from "react";
import { FaClock, FaTag, FaStar, FaEye } from "react-icons/fa";
import { formatTotalTime } from "../../utils/quizUtils";
import ImageUpload from "./ImageUpload";
import { quizFormConfig } from "../../config/quizFormConfig";
import CollapsibleSection from "./CollapsibleSection";

const QuizDetails = ({ quiz, onChange, questionCount }) => {
  const [isOpen, setIsOpen] = useState(true);
  const isFilled = !!quiz.category;

  const handleToggle = () => isFilled && setIsOpen((prev) => !prev);
  const handleImageChange = (file) =>
    onChange({ target: { name: "image", files: file ? [file] : [null] } });

  const renderSummary = () => {
    const {
      description,
      timeLimitPerQuestion,
      category,
      difficulty,
      visibility,
      image,
    } = quiz;
    const totalTime = timeLimitPerQuestion
      ? timeLimitPerQuestion * questionCount
      : null;
    return (
      <div className="flex flex-col gap-6 p-2 md:flex-row md:items-center">
        <div className="mx-auto flex-shrink-0 md:mx-0">
          {image ? (
            <img
              src={URL.createObjectURL(image)}
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
          <p className="mb-2 line-clamp-3 break-all">
            {description || "Brak opisu"}
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            {category && (
              <span className="flex items-center gap-1">
                <FaTag size={12} /> {category}
              </span>
            )}
            <span className="flex items-center gap-1">
              <FaStar size={12} />{" "}
              {quizFormConfig.DIFFICULTY_LEVELS[difficulty]}
            </span>
            <span className="flex items-center gap-1">
              <FaClock size={12} />{" "}
              {timeLimitPerQuestion
                ? `${timeLimitPerQuestion} s (${formatTotalTime(totalTime)})`
                : "Bez limitu"}
            </span>
            <span className="flex items-center gap-1">
              <FaEye size={12} />{" "}
              {quizFormConfig.VISIBILITY_OPTIONS[visibility]}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <CollapsibleSection
      isOpen={isOpen}
      onToggle={handleToggle}
      summary={renderSummary()}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="category"
              className="mb-1 flex items-center gap-1 text-sm text-gray-600"
            >
              <FaTag size={12} /> Kategoria
            </label>
            <select
              id="category"
              name="category"
              value={quiz.category}
              onChange={onChange}
              required
              className={`w-full rounded-md border ${
                !quiz.category ? "border-warning" : "border-gray-200"
              } p-2 text-sm focus:ring-1 focus:ring-indigo-500`}
            >
              <option value="">Wybierz Kategorię</option>
              {quizFormConfig.QUIZ_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="difficulty"
              className="mb-1 flex items-center gap-1 text-sm text-gray-600"
            >
              <FaStar size={12} /> Poziom Trudności
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={quiz.difficulty}
              onChange={onChange}
              className="w-full rounded-md border border-gray-200 p-2 text-sm focus:ring-1 focus:ring-indigo-500"
            >
              {Object.entries(quizFormConfig.DIFFICULTY_LEVELS).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </select>
          </div>
          <div>
            <label
              htmlFor="timeLimitPerQuestion"
              className="mb-1 flex items-center gap-1 text-sm text-gray-600"
            >
              <FaClock size={12} /> Czas na pytanie (sekundy)
            </label>
            <select
              id="timeLimitPerQuestion"
              name="timeLimitPerQuestion"
              value={
                quiz.timeLimitPerQuestion === 0 ? "" : quiz.timeLimitPerQuestion
              }
              onChange={onChange}
              className="w-full rounded-md border border-gray-200 p-2 text-sm focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Bez limitu</option>
              {quizFormConfig.TIME_OPTIONS.map((time) => (
                <option key={time} value={time}>
                  {time} s
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="visibility"
              className="mb-1 flex items-center gap-1 text-sm text-gray-600"
            >
              <FaEye size={12} /> Widoczność
            </label>
            <select
              id="visibility"
              name="visibility"
              value={quiz.visibility}
              onChange={onChange}
              className="w-full rounded-md border border-gray-200 p-2 text-sm focus:ring-1 focus:ring-indigo-500"
            >
              {Object.entries(quizFormConfig.VISIBILITY_OPTIONS).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>
        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm text-gray-600"
          >
            Opis (opcjonalnie)
          </label>
          <textarea
            id="description"
            name="description"
            value={quiz.description}
            onChange={onChange}
            placeholder="Dodaj opis"
            maxLength={quizFormConfig.MAX_DESCRIPTION_LENGTH}
            className="min-h-[80px] w-full rounded-md border border-gray-200 p-3 text-sm focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <ImageUpload
          image={quiz.image}
          onChange={handleImageChange}
          label="Dodaj zdjęcie quizu (jpg/png)"
        />
      </div>
    </CollapsibleSection>
  );
};

export default QuizDetails;
