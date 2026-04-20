import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("userRole");

  // ❌ Not logged in
  if (!userRole) {
    return <Navigate to="/" />;
  }

  // ❌ Wrong role
  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;