import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  // If no user, send to login page
  if (!user) {
    // state.from = where the user was trying to go
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If user exists, show the protected content
  return children;
}

export default ProtectedRoute;
