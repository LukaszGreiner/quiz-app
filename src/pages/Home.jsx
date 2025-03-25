import { Link } from "react-router";
import Categories from "../components/Categories";
import QuizCard from "../components/QuizCard";
import QuizesSection from "../components/QuizesSection";
import QuizBanner from "../components/QuizBanner";

function Home() {
  return (
    <div className="bg-background container mx-auto flex flex-col gap-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-dark -skew-y-3 transform text-4xl font-bold">
          Zagraj w quizy!
        </h2>
        <Link to="/user/login">Zaloguj się, by tworzyć!</Link>
      </div>

      <div className="flex min-h-screen flex-col justify-center gap-6 md:flex-row-reverse">
        <Categories />
        <QuizesSection />
      </div>
    </div>
  );
}

export default Home;
