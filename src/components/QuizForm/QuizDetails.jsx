import { useFormContext } from "react-hook-form";
import { Controller } from "react-hook-form";
import ImageUpload from "./ImageUpload";
import { quizFormConfig } from "../../config/quizFormConfig";
import CollapsibleSection from "./CollapsibleSection";
import { FaTag, FaStar, FaClock, FaEye } from "react-icons/fa";
import { formatTotalTime } from "../../utils/quizUtils";

const QuizDetails = ({ questionCount }) => {
  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const fields = {
    category: watch("category"),
    description: watch("description") || "Brak opisu",
    timeLimitPerQuestion: watch("timeLimitPerQuestion"),
    difficulty: watch("difficulty"),
    visibility: watch("visibility"),
    image: watch("image"),
  };

  const totalTime = fields.timeLimitPerQuestion
    ? fields.timeLimitPerQuestion * questionCount
    : null;

  return (
    <div className="rounded-md border border-gray-200 bg-gray-50 p-4 md:p-6">
      <CollapsibleSection
        summary={<Summary fields={fields} totalTime={totalTime} />}
        defaultOpen={true}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField
              id="category"
              label="Kategoria"
              icon={<FaTag size={12} />}
              register={register("category", {
                required: "Kategoria jest wymagana",
              })}
              options={[
                { value: "", label: "Wybierz Kategorię" },
                ...quizFormConfig.QUIZ_CATEGORIES.map((cat) => ({
                  value: cat,
                  label: cat,
                })),
              ]}
              error={errors.category}
              className={
                !fields.category ? "border-warning" : "border-gray-200"
              }
            />
            <SelectField
              id="difficulty"
              label="Poziom Trudności"
              icon={<FaStar size={12} />}
              register={register("difficulty")}
              defaultValue={quizFormConfig.DEFAULT_DIFFICULTY}
              options={Object.entries(quizFormConfig.DIFFICULTY_LEVELS).map(
                ([value, label]) => ({ value, label }),
              )}
            />
            <SelectField
              id="timeLimitPerQuestion"
              label="Czas na pytanie (sekundy)"
              icon={<FaClock size={12} />}
              register={register("timeLimitPerQuestion")}
              options={[
                { value: 0, label: "Bez limitu" },
                ...quizFormConfig.TIME_OPTIONS.map((time) => ({
                  value: time,
                  label: `${time} s`,
                })),
              ]}
            />
            <SelectField
              id="visibility"
              label="Widoczność"
              icon={<FaEye size={12} />}
              register={register("visibility")}
              options={Object.entries(quizFormConfig.VISIBILITY_OPTIONS).map(
                ([value, label]) => ({ value, label }),
              )}
            />
          </div>
          <TextAreaField
            id="description"
            label="Opis (opcjonalnie)"
            register={register("description", {
              maxLength: {
                value: quizFormConfig.MAX_DESCRIPTION_LENGTH,
                message: `Maksymalna długość to ${quizFormConfig.MAX_DESCRIPTION_LENGTH} znaków`,
              },
            })}
            error={errors.description}
          />
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
    </div>
  );
};

// Sub-component for select fields
const SelectField = ({
  id,
  label,
  icon,
  register,
  options,
  defaultValue,
  error,
  className = "border-gray-200",
}) => (
  <div>
    <label
      htmlFor={id}
      className="mb-1 flex items-center gap-1 text-sm text-gray-600"
    >
      {icon} {label}
    </label>
    <select
      id={id}
      {...register}
      defaultValue={defaultValue || ""}
      className={`w-full rounded-md border ${className} p-2 text-sm focus:ring-1 focus:ring-indigo-500`}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
    {error && <span className="text-sm text-red-600">{error.message}</span>}
  </div>
);

// Sub-component for textarea
const TextAreaField = ({ id, label, register, error }) => (
  <div>
    <label htmlFor={id} className="mb-1 block text-sm text-gray-600">
      {label}
    </label>
    <textarea
      id={id}
      {...register}
      placeholder="Dodaj opis"
      className="min-h-[80px] w-full rounded-md border border-gray-200 p-3 text-sm focus:ring-1 focus:ring-indigo-500"
    />
    {error && <span className="text-sm text-red-600">{error.message}</span>}
  </div>
);

// Sub-component for summary
const Summary = ({ fields, totalTime }) => (
  <div className="flex flex-col gap-6 p-2 md:flex-row md:items-center">
    <div className="mx-auto flex-shrink-0 md:mx-0">
      {fields.image ? (
        <img
          src={URL.createObjectURL(fields.image)}
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
        {fields.category && (
          <span className="flex items-center gap-1">
            <FaTag size={12} /> {fields.category}
          </span>
        )}
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

export default QuizDetails;
