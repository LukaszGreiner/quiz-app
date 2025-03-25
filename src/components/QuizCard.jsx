export default function QuizCard({
  imageSrc,
  imageAlt,
  title,
  description,
  buttonText,
}) {
  return (
    <div className="flex w-full max-w-[500px] min-w-[300px] flex-col items-center rounded-xl bg-white p-4 shadow-md transition duration-300 hover:shadow-lg md:max-w-[600px] md:min-w-0 md:flex-row lg:w-[calc(50%-1rem)] lg:max-w-none">
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
