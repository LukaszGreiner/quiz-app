import { useState } from "react";
import { FaClock, FaTag, FaStar, FaEye, FaAngleDown } from "react-icons/fa";
import ImageUpload from "./ImageUpload";

const QuizDetails = ({ quiz, onChange, questionCount }) => {
  const [isOpen, setIsOpen] = useState(true);
  const categories = [
    "Matematyka",
    "Nauka",
    "Historia",
    "Geografia",
    "Literatura",
    "Wiedza ogólna",
  ];

  const timeOptions = [5, 10, 15, 20, 30, 45, 60];

  const difficultyLabels = {
    easy: "Łatwy",
    normal: "Normalny",
    hard: "Trudny",
  };

  const visibilityLabels = {
    public: "Publiczny",
    private: "Prywatny",
  };

  const isFilled = !!quiz.category;

  const handleToggle = () => {
    if (isFilled) {
      setIsOpen(!isOpen);
    }
  };

  const formatTotalTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes > 0 && seconds === 0) {
      return `${minutes} min`;
    } else if (minutes > 0) {
      return `${minutes} min ${seconds} s`;
    } else {
      return `${seconds} s`;
    }
  };

  const handleImageChange = (file) => {
    onChange({ target: { name: "image", files: file ? [file] : [null] } });
  };

  const renderSummary = () => {
    const {
      description,
      expectedTime,
      category,
      difficulty,
      visibility,
      image,
    } = quiz;
    const totalTime = expectedTime ? expectedTime * questionCount : null;

    return (
      <div className="flex flex-col gap-6 p-2 md:flex-row md:items-center">
        {" "}
        {/* Changed flex-row to flex-col md:flex-row */}
        {/* First Column: Image */}
        <div className="mx-auto flex-shrink-0 md:mx-0">
          {" "}
          {/* Center on mobile, align left on desktop */}
          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="Quiz preview"
              className="h-24 w-24 rounded-md object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-md bg-gray-200 text-sm text-gray-500">
              Brak zdjęcia
            </div>
          )}
        </div>
        {/* Second Column: Text and Details */}
        <div className="flex-1 text-center text-sm text-gray-700 md:text-left">
          {" "}
          {/* Center text on mobile, left-align on desktop */}
          <p className="mb-2 line-clamp-3 break-all">
            {description || "Brak opisu"}
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            {" "}
            {/* Center items on mobile, left-align on desktop */}
            {category && (
              <span className="flex items-center gap-1">
                <FaTag size={12} /> {category}
              </span>
            )}
            <span className="flex items-center gap-1">
              <FaStar size={12} /> {difficultyLabels[difficulty]}
            </span>
            <span className="flex items-center gap-1">
              <FaClock size={12} />
              {expectedTime
                ? `${expectedTime} s (${formatTotalTime(totalTime)})`
                : "Bez limitu"}
            </span>
            <span className="flex items-center gap-1">
              <FaEye size={12} /> {visibilityLabels[visibility]}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
      {isOpen ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm text-gray-600">
                <FaTag size={12} /> Kategoria
              </label>
              <select
                name="category"
                value={quiz.category}
                onChange={onChange}
                required
                className="w-full appearance-none rounded-md border border-gray-200 p-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Wybierz Kategorię</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm text-gray-600">
                <FaStar size={12} /> Poziom Trudności
              </label>
              <select
                name="difficulty"
                value={quiz.difficulty}
                onChange={onChange}
                className="w-full appearance-none rounded-md border border-gray-200 p-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="easy">Łatwy</option>
                <option value="normal">Normalny</option>
                <option value="hard">Trudny</option>
              </select>
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm text-gray-600">
                <FaClock size={12} /> Czas na pytanie (sekundy)
              </label>
              <select
                name="expectedTime"
                value={quiz.expectedTime || ""}
                onChange={onChange}
                className="w-full appearance-none rounded-md border border-gray-200 p-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">Bez limitu</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time} s
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm text-gray-600">
                <FaEye size={12} /> Widoczność
              </label>
              <select
                name="visibility"
                value={quiz.visibility}
                onChange={onChange}
                className="w-full appearance-none rounded-md border border-gray-200 p-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="public">Publiczny</option>
                <option value="private">Prywatny</option>
              </select>
            </div>
          </div>
          <div>
            <textarea
              name="description"
              value={quiz.description}
              onChange={onChange}
              placeholder="Dodaj opis (opcjonalnie)"
              className="min-h-[80px] w-full resize-y rounded-md border border-gray-200 p-3 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <ImageUpload
            image={quiz.image}
            onChange={handleImageChange}
            label="Dodaj zdjęcie quizu (jpg/png)"
          />
        </div>
      ) : (
        <div>{renderSummary()}</div>
      )}
      {isFilled && (
        <div className="mt-2 flex justify-center">
          <FaAngleDown
            size={16}
            className={`cursor-pointer text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            onClick={handleToggle}
            title={isOpen ? "Pokaż mniej" : "Pokaż więcej"}
          />
        </div>
      )}
    </div>
  );
};

export default QuizDetails;
