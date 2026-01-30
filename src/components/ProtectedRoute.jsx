import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const uid = sessionStorage.getItem("uid");

  if (!uid) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

export default ProtectedRoute;
