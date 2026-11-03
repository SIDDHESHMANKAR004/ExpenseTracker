import { Navigate } from "react-router-dom";
import { isDemoMode } from "../utils/demoMode";

const ProtectedRoute = ({ children }) => {
  const uid = sessionStorage.getItem("uid");

  if (!uid && !isDemoMode()) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default ProtectedRoute;
