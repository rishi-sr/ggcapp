import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const ProtectedRoute = ({ children, role }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        localStorage.setItem("userEmail", currentUser.email);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <h2>Checking session...</h2>;

  if (!user) return <Navigate to="/" />;

  const userRole = localStorage.getItem("userRole");

  if (role && userRole !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;