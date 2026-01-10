import { NavLink, Link } from "react-router-dom";
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
} from "react-icons/hi";

const AdminSidebar = ({ collapsed, setCollapsed, user, onLogout }) => {
  const navItems = [
    { to: "/admin", label: "Dashboard", icon: HiOutlineViewGrid, end: true },
    { to: "/admin/levels", label: "Levels", icon: HiOutlineCollection },
    { to: "/admin/lessons", label: "Lessons", icon: HiOutlineBookOpen },
    { to: "/admin/vocabulary", label: "Vocabulary", icon: HiOutlineTranslate },
    { to: "/admin/exercises", label: "Exercises", icon: HiOutlinePuzzle },
    { to: "/admin/users", label: "Users", icon: HiOutlineUsers },
    { to: "/admin/settings", label: "Settings", icon: HiOutlineCog },
  ];

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive
        ? "bg-ds-text text-ds-bg font-semibold"
        : "text-ds-muted hover:text-ds-text hover:bg-ds-surface/50"
    }`;

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-ds-surface/50 backdrop-blur-sm border-r border-ds-border/30 transition-all duration-300 z-40 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-ds-border/30">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <span className="text-xl font-bold text-ds-text">
              <span className="text-ds-muted">DE</span> Admin Panel
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-ds-bg text-ds-muted hover:text-ds-text transition-colors"
          >
            {collapsed ? (
              <HiOutlineChevronRight className="w-5 h-5" />
            ) : (
              <HiOutlineChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Home Link - Back to Main Site */}
        <Link
          to="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-ds-muted hover:text-ds-text hover:bg-ds-surface/50 transition-all duration-200 ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Back to Home" : undefined}
        >
          <HiOutlineHome className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Back to Home</span>}
        </Link>

        <div className="border-t border-ds-border/30 my-2"></div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={navLinkClass}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-ds-border/30">
        {user && (
          <div className={`flex items-center gap-3 mb-3 ${collapsed ? "justify-center" : ""}`}>
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
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-ds-text font-medium truncate">{user.displayName || "Admin"}</p>
                <p className="text-ds-muted text-xs truncate">{user.email}</p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onLogout}
          className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Logout" : undefined}
        >
          <HiOutlineLogout className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
