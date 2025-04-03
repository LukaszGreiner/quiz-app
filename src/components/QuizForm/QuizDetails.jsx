import { useFormContext } from "react-hook-form";
import { Controller } from "react-hook-form";
import ImageUpload from "./ImageUpload";
import { quizFormConfig } from "../../config/quizFormConfig";
import CollapsibleSection from "./CollapsibleSection";
import { FaTag, FaStar, FaClock, FaEye } from "react-icons/fa";
import { formatTotalTime } from "../../utils/quizUtils";
import { useState } from "react";

const QuizDetails = ({ questionCount }) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();
  const [isOpen, setIsOpen] = useState(true);
  const category = watch("category");
  const isFilled = !!category;

  const handleToggle = () => isFilled && setIsOpen((prev) => !prev);

  const description = watch("description") || "Brak opisu";
  const timeLimitPerQuestion = watch("timeLimitPerQuestion");
  const difficulty = watch("difficulty");
  const visibility = watch("visibility");
  const image = watch("image");
  const totalTime = timeLimitPerQuestion
    ? timeLimitPerQuestion * questionCount
    : null;

  const renderSummary = () => (
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
        <p className="mb-2 line-clamp-3 break-all">{description}</p>
        <div className="flex flex-wrap justify-center gap-3 md:justify-start">
          {category && (
            <span className="flex items-center gap-1">
              <FaTag size={12} /> {category}
            </span>
          )}
          <span className="flex items-center gap-1">
            <FaStar size={12} /> {quizFormConfig.DIFFICULTY_LEVELS[difficulty]}
          </span>
          <span className="flex items-center gap-1">
            <FaClock size={12} />{" "}
            {timeLimitPerQuestion
              ? `${timeLimitPerQuestion} s (${formatTotalTime(totalTime)})`
              : "Bez limitu"}
          </span>
          <span className="flex items-center gap-1">
            <FaEye size={12} /> {quizFormConfig.VISIBILITY_OPTIONS[visibility]}
          </span>
        </div>
      </div>
    </div>
  );

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
              {...register("category", { required: "Kategoria jest wymagana" })}
              className={`w-full rounded-md border ${!category ? "border-warning" : "border-gray-200"} p-2 text-sm focus:ring-1 focus:ring-indigo-500`}
            >
              <option value="">Wybierz Kategorię</option>
              {quizFormConfig.QUIZ_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-sm text-red-600">
                {errors.category.message}
              </span>
            )}
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
              {...register("difficulty")}
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
              {...register("timeLimitPerQuestion")}
              className="w-full rounded-md border border-gray-200 p-2 text-sm focus:ring-1 focus:ring-indigo-500"
            >
              <option value={0}>Bez limitu</option>
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
              {...register("visibility")}
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
            {...register("description", {
              maxLength: {
                value: quizFormConfig.MAX_DESCRIPTION_LENGTH,
                message: `Maksymalna długość to ${quizFormConfig.MAX_DESCRIPTION_LENGTH} znaków`,
              },
            })}
            placeholder="Dodaj opis"
            className="min-h-[80px] w-full rounded-md border border-gray-200 p-3 text-sm focus:ring-1 focus:ring-indigo-500"
          />
          {errors.description && (
            <span className="text-sm text-red-600">
              {errors.description.message}
            </span>
          )}
        </div>
        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <ImageUpload
              image={field.value}
              onChange={(file) => field.onChange(file)}
              label="Dodaj zdjęcie quizu (jpg/png)"
            />
          )}
        />
      </div>
    </CollapsibleSection>
  );
};

export default QuizDetails;
