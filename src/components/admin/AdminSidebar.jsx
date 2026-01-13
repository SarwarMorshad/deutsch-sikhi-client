import { NavLink, Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineViewGrid,
  HiOutlineCollection,
  HiOutlineBookOpen,
  HiOutlineTranslate,
  HiOutlinePuzzle,
  HiOutlineUsers,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineHome,
  HiOutlineAcademicCap,
  HiOutlineX,
} from "react-icons/hi";

const AdminSidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen, user, onLogout }) => {
  const navItems = [
    { to: "/admin", label: "Dashboard", icon: HiOutlineViewGrid, end: true },
    { to: "/admin/levels", label: "Levels", icon: HiOutlineCollection },
    { to: "/admin/lessons", label: "Lessons", icon: HiOutlineBookOpen },
    { to: "/admin/vocabulary", label: "Vocabulary", icon: HiOutlineTranslate },
    { to: "/admin/grammar", label: "Grammar", icon: HiOutlineAcademicCap },
    { to: "/admin/exercises", label: "Exercises", icon: HiOutlinePuzzle },
    { to: "/admin/users", label: "Manage Users", icon: HiOutlineUsers },
    { to: "/admin/settings", label: "Settings", icon: HiOutlineCog },
  ];

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
      isActive
        ? "bg-ds-text text-ds-bg font-semibold"
        : "text-ds-muted hover:text-ds-text hover:bg-ds-surface/50"
    }`;

  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  const handleMobileClose = () => {
    setMobileOpen(false);
  };

  const handleNavClick = () => {
    // Close mobile menu on navigation
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  // Sidebar Content Component (reused for both desktop and mobile)
  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-ds-border/30">
        <div className="flex items-center justify-between">
          {(!collapsed || isMobile) && (
            <span className="text-xl font-bold text-ds-text">
              <span className="text-ds-muted">DE</span> Admin
            </span>
          )}
          {isMobile ? (
            <button
              onClick={handleMobileClose}
              className="p-2 rounded-lg hover:bg-ds-bg text-ds-muted hover:text-ds-text transition-colors cursor-pointer"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleToggle}
              className={`p-2 rounded-lg hover:bg-ds-bg text-ds-muted hover:text-ds-text transition-colors cursor-pointer ${
                collapsed ? "mx-auto" : ""
              }`}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <HiOutlineChevronRight className="w-5 h-5" />
              ) : (
                <HiOutlineChevronLeft className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Back to Site Link */}
      <div className="px-4 pt-4">
        <Link
          to="/"
          onClick={handleNavClick}
          className={`flex items-center gap-3 px-4 py-2 rounded-xl text-ds-muted hover:text-ds-text hover:bg-ds-surface/50 transition-colors cursor-pointer ${
            collapsed && !isMobile ? "justify-center" : ""
          }`}
          title={collapsed && !isMobile ? "Back to Site" : undefined}
        >
          <HiOutlineHome className="w-5 h-5 flex-shrink-0" />
          {(!collapsed || isMobile) && <span className="text-sm">Back to Home</span>}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={handleNavClick}
            className={navLinkClass}
            title={collapsed && !isMobile ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {(!collapsed || isMobile) && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-ds-border/30">
        {user && (
          <div className={`flex items-center gap-3 mb-3 ${collapsed && !isMobile ? "justify-center" : ""}`}>
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-10 h-10 rounded-full border-2 border-ds-border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-ds-bg flex items-center justify-center border-2 border-ds-border">
                <span className="text-ds-muted font-bold">{user.displayName?.charAt(0) || "U"}</span>
              </div>
            )}
            {(!collapsed || isMobile) && (
              <div className="flex-1 min-w-0">
                <p className="text-ds-text font-medium truncate">{user.displayName || "Admin"}</p>
                <p className="text-ds-muted text-xs truncate">{user.email}</p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onLogout}
          className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer ${
            collapsed && !isMobile ? "justify-center" : ""
          }`}
          title={collapsed && !isMobile ? "Logout" : undefined}
        >
          <HiOutlineLogout className="w-5 h-5" />
          {(!collapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 h-full bg-ds-surface/50 backdrop-blur-sm border-r border-ds-border/30 transition-all duration-300 z-40 flex-col ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent isMobile={false} />
      </aside>

      {/* Mobile Sidebar - Portal */}
      {createPortal(
        <AnimatePresence>
          {mobileOpen && (
            <div className="lg:hidden">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={handleMobileClose}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(4px)",
                  WebkitBackdropFilter: "blur(4px)",
                  zIndex: 9998,
                  cursor: "pointer",
                }}
              />

              {/* Mobile Sidebar Panel */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  height: "100vh",
                  width: "280px",
                  maxWidth: "85vw",
                  backgroundColor: "#124559",
                  zIndex: 9999,
                }}
                className="border-r border-ds-border/30 shadow-2xl"
              >
                <SidebarContent isMobile={true} />
              </motion.aside>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default AdminSidebar;
