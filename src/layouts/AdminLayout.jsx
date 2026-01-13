import { useState, useContext, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { AuthContext } from "../context/AuthContext";

const AdminLayout = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-ds-bg">
      {/* Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}>
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-ds-surface/80 backdrop-blur-sm border-b border-ds-border/30">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-ds-muted hover:text-ds-text hover:bg-ds-bg/50 transition-colors cursor-pointer"
            >
              <HiOutlineMenuAlt2 className="w-6 h-6" />
            </button>
            <span className="text-lg font-bold text-ds-text">
              <span className="text-ds-muted">DE</span> Admin
            </span>
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-8 h-8 rounded-full border-2 border-ds-border"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-ds-bg flex items-center justify-center border-2 border-ds-border">
                <span className="text-ds-muted text-sm font-bold">{user?.displayName?.charAt(0) || "U"}</span>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
