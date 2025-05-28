import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { showError, showInfo } from "../utils/toastUtils";

const ProtectedRoute = ({ message = null, info = null }) => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if ((!loading && !isAuthenticated && message) || info) {
      message && showError(message, { theme: "light" });
      info && showInfo(info, { theme: "light" });
    }
  }, [isAuthenticated, loading, message, info]);

  if (loading) {
    return <p className="mt-8 text-center">Loading...</p>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
