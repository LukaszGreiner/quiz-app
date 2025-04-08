import { Navigate } from "react-router-dom";
import { useCategory } from "../hooks/useCategory";

const CategoryRoute = ({ children }) => {
  const { validateCategory } = useCategory();

  if (!validateCategory()) {
    return <Navigate to="/not-found" replace />;
  }

  return children;
};

export default CategoryRoute;
