import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { showError } from "../utils/toastUtils";

const ProtectedRoute = ({ message = null }) => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated && message) {
      showError(message, { theme: "light" });
    }
  }, [isAuthenticated, loading, message]);

  if (loading) {
    return <p className="mt-8 text-center">Loading...</p>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
