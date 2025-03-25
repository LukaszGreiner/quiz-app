const QuizBanner = () => {
  return (
    <div className="flex w-[500px] items-center justify-between rounded-lg bg-teal-900 p-6 text-white shadow-md">
      {/* Left side: Illustration and sparkles */}
      <div className="flex items-center">
        <img
          src="https://placehold.co/100x100.png?text=Illustration"
          alt="Quiz illustration"
          className="mr-4 h-24 w-24"
        />
        {/* Sparkles could be an SVG or part of the image; here I'm just noting their presence */}
      </div>

      {/* Right side: Text and Button */}
      <div className="flex flex-col items-end">
        <h2 className="mb-2 text-2xl font-bold">Create a quiz</h2>
        <p className="mb-4 text-lg">Play for free with 300 participants</p>
        <button className="rounded-full bg-green-500 px-6 py-2 font-semibold text-white transition duration-300 hover:bg-green-600">
          Quiz editor
        </button>
      </div>
    </div>
  );
};

export default QuizBanner;
