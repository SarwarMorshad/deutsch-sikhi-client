import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ds-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ds-muted border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ds-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but email not verified → redirect to verify email page
  if (!user.emailVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  // All good → render children
  return children;
};

export default PrivateRoute;
