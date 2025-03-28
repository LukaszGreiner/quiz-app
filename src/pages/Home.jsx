import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react"; // Add useEffect
import Categories from "../components/Home/Categories";
import QuizList from "../components/Home/QuizList";
import { categoriesConfig } from "../config/categoriesConfig";

function Home() {
  const { category = "wszystkie" } = useParams();
  const navigate = useNavigate();
  const categoryNames = categoriesConfig.QUIZ_CATEGORIES;

  // Normalize category
  const normalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  // Validate and redirect in useEffect
  useEffect(() => {
    if (
      normalizedCategory !== "Wszystkie" &&
      !categoryNames.includes(normalizedCategory)
    ) {
      navigate("/not-found", { replace: true });
    }
  }, [normalizedCategory, navigate, categoryNames]);

  return (
    <div className="bg-background container mx-auto flex min-h-screen flex-col gap-8">
      <header className="flex items-center justify-between">
        <h2 className="text-dark -skew-y-3 transform text-4xl font-bold">
          Zagraj w quizy!
        </h2>
        <Link to="/user/login" className="text-blue-600 hover:underline">
          Zaloguj się, by tworzyć!
        </Link>
      </header>
      <main className="flex flex-col gap-6 md:flex-row-reverse">
        <Categories selectedCategory={normalizedCategory} />
        <QuizList selectedCategory={normalizedCategory} />
      </main>
    </div>
  );
}

export default Home;
