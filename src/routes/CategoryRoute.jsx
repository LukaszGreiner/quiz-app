import { useParams, Navigate } from "react-router-dom";
import { categoriesConfig } from "../config/categoriesConfig";

const CategoryRoute = ({ children }) => {
  const { category = "wszystkie" } = useParams();
  const categoryNames = categoriesConfig.QUIZ_CATEGORIES;
  const normalizedCategory =
    category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

  if (
    normalizedCategory !== "Wszystkie" &&
    !categoryNames.includes(normalizedCategory)
  ) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
};
export default CategoryRoute;
