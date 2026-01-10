import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const [dbUser, setDbUser] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        console.log("AdminRoute: No user found");
        setCheckingRole(false);
        return;
      }

      try {
        console.log("AdminRoute: Checking role for", user.email);
        const token = await user.getIdToken();
        console.log("AdminRoute: Got token, fetching user...");

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("AdminRoute: DB User response:", response.data);
        console.log("AdminRoute: User role:", response.data.data?.role);

        setDbUser(response.data.data);
      } catch (error) {
        console.error("AdminRoute: Error checking admin role:", error);
        console.error("AdminRoute: Error response:", error.response?.data);
        setDbUser(null);
      } finally {
        setCheckingRole(false);
      }
    };

    if (!loading) {
      checkAdminRole();
    }
  }, [user, loading]);

  // Debug log current state
  console.log("AdminRoute State:", {
    loading,
    checkingRole,
    user: user?.email,
    dbUserRole: dbUser?.role,
  });

  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ds-bg">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ds-muted border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ds-muted">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Not admin
  if (dbUser?.role !== "admin") {
    console.log("AdminRoute: Access denied. Role is:", dbUser?.role);
    return (
      <div className="min-h-screen flex items-center justify-center bg-ds-bg">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🚫</span>
          </div>
          <h1 className="text-2xl font-bold text-ds-text mb-2">Access Denied</h1>
          <p className="text-ds-muted mb-2">You don't have permission to access the admin panel.</p>
          <p className="text-ds-border text-sm mb-6">
            Logged in as: {user?.email}
            <br />
            Current role: {dbUser?.role || "unknown"}
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 rounded-xl bg-ds-text text-ds-bg font-semibold hover:shadow-lg transition-all"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  console.log("AdminRoute: Access granted for admin:", user.email);
  return children;
};

export default AdminRoute;
