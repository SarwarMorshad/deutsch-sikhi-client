import { Link } from "react-router-dom";
import { HiOutlineArrowLeft, HiOutlineRefresh, HiOutlineMenuAlt2 } from "react-icons/hi";

const AdminHeader = ({ title, subtitle, onRefresh, refreshing, onMenuClick, user }) => {
  return (
    <header className="bg-ds-surface/30 backdrop-blur-sm border-b border-ds-border/30 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left - Menu & Title */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          {onMenuClick && (
            <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-ds-bg text-ds-muted">
              <HiOutlineMenuAlt2 className="w-6 h-6" />
            </button>
          )}

          {/* Title */}
          <div>
            <h1 className="text-xl font-bold text-ds-text">{title || "Dashboard"}</h1>
            {subtitle && <p className="text-ds-muted text-sm">{subtitle}</p>}
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ds-surface text-ds-text hover:bg-ds-border transition-colors disabled:opacity-50"
            >
              <HiOutlineRefresh className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          )}

          {/* Back to Site */}
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-ds-muted hover:text-ds-text hover:bg-ds-surface transition-colors"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Site</span>
          </Link>

          {/* User Avatar */}
          {user && (
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full border-2 border-ds-border"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-ds-surface flex items-center justify-center border-2 border-ds-border">
                  <span className="text-ds-muted text-sm font-bold">
                    {user.displayName?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <span className="hidden md:block text-ds-text text-sm">{user.displayName || "Admin"}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
