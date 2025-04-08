// src/hooks/useCategory.js
import { useNavigate, useParams } from "react-router-dom";
import { quizFormConfig } from "../config/quizFormConfig";

export const useCategory = () => {
  const { category = "wszystkie" } = useParams();
  const navigate = useNavigate();

  // Centralized category names
  const categoryNames = ["Wszystkie", ...quizFormConfig.QUIZ_CATEGORIES];

  // Normalize category with safeguard
  const normalizeCategory = (cat) =>
    cat
      ? cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()
      : "Wszystkie";

  const normalizedCategory = normalizeCategory(category);

  // Navigate to category
  const navigateToCategory = (cat) => {
    const path = cat === "Wszystkie" ? "/" : `/${cat.toLowerCase()}`;
    navigate(path);
  };

  // Validate category and redirect if invalid
  const validateCategory = () => {
    if (
      normalizedCategory !== "Wszystkie" &&
      !categoryNames.includes(normalizedCategory)
    ) {
      navigate("/not-found", { replace: true });
      return false;
    }
    return true;
  };

  return {
    categoryNames,
    normalizedCategory,
    navigateToCategory,
    validateCategory,
  };
};
