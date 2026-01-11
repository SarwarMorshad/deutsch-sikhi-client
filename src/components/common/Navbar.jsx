import { useContext, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../../context/AuthContext";
import useLanguage from "../../hooks/useLanguage";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import axios from "axios";
import {
  HiOutlineMenuAlt3,
  HiOutlineX,
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineTranslate,
  HiOutlineLightningBolt,
  HiOutlineLogin,
  HiOutlineUserAdd,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineChartBar,
  HiOutlineViewGrid,
  HiOutlineCog,
} from "react-icons/hi";

const Navbar = () => {
  const { t } = useTranslation();
  const { user, logOut } = useContext(AuthContext);
  const { currentLanguage, isBengali, changeLanguage } = useLanguage();
  const axiosSecure = useAxiosSecure();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(response.data.data?.role === "admin");
      } catch (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      }
    };

    checkAdminRole();
  }, [user]);

  // Toggle language - saves to DB if user is logged in
  const toggleLanguage = async () => {
    const newLang = currentLanguage === "bn" ? "en" : "bn";

    // Change language immediately (updates i18n + localStorage)
    changeLanguage(newLang);

    // If user is logged in, also save to database
    if (user) {
      try {
        await axiosSecure.patch("/users/me/language", { language: newLang });
      } catch (error) {
        console.error("Error saving language preference:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logOut();
      setIsMenuOpen(false);
      setIsAdmin(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Navigation links
  const publicLinks = [
    { to: "/", label: t("nav.home"), icon: HiOutlineHome },
    { to: "/courses", label: t("nav.courses"), icon: HiOutlineBookOpen },
    { to: "/vocabulary", label: t("nav.vocabulary"), icon: HiOutlineTranslate },
    { to: "/practice", label: t("nav.practice"), icon: HiOutlineLightningBolt },
  ];

  // Different dropdown links based on role
  const userDropdownLinks = isAdmin
    ? [
        { to: "/admin", label: t("nav.admin"), icon: HiOutlineViewGrid },
        { to: "/admin/settings", label: t("nav.settings"), icon: HiOutlineCog },
      ]
    : [
        { to: "/dashboard", label: t("nav.myStats"), icon: HiOutlineChartBar },
        { to: "/profile", label: t("nav.profile"), icon: HiOutlineUser },
      ];

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
      isActive ? "bg-ds-surface text-ds-text" : "text-ds-muted hover:text-ds-text hover:bg-ds-surface/50"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-ds-bg/95 backdrop-blur-md border-b border-ds-border/30">
      <div className="german-stripe"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-ds-text">
              Deutsch<span className="text-ds-muted">Shikhi</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {publicLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                <link.icon className="w-5 h-5" />
                <span className={isBengali ? "font-bangla" : "font-inter"}>{link.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ds-surface text-ds-text text-sm hover:bg-ds-border transition-colors"
            >
              <HiOutlineTranslate className="w-4 h-4" />
              <span className="font-medium">{isBengali ? "EN" : "বাং"}</span>
            </button>

            {/* Auth */}
            {user ? (
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg hover:bg-ds-surface transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full border-2 border-ds-border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-ds-surface flex items-center justify-center border-2 border-ds-border">
                      <HiOutlineUser className="w-5 h-5 text-ds-muted" />
                    </div>
                  )}
                  <span className="text-ds-text text-sm hidden lg:block">{user.displayName || "User"}</span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 text-xs rounded bg-purple-500/20 text-purple-400">
                      Admin
                    </span>
                  )}
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content mt-2 p-2 shadow-lg bg-ds-surface rounded-xl w-52 border border-ds-border/50"
                >
                  {userDropdownLinks.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-ds-muted hover:text-ds-text hover:bg-ds-bg transition-colors ${
                          isBengali ? "font-bangla" : ""
                        }`}
                      >
                        <link.icon className="w-5 h-5" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li className="border-t border-ds-border/30 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors ${
                        isBengali ? "font-bangla" : ""
                      }`}
                    >
                      <HiOutlineLogout className="w-5 h-5" />
                      {t("nav.logout")}
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-ds-muted hover:text-ds-text transition-colors ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  <HiOutlineLogin className="w-5 h-5" />
                  {t("nav.login")}
                </Link>
                <Link
                  to="/register"
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg bg-ds-text text-ds-bg hover:shadow-lg transition-all ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  <HiOutlineUserAdd className="w-5 h-5" />
                  {t("nav.register")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-ds-muted hover:text-ds-text hover:bg-ds-surface transition-colors"
          >
            {isMenuOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenuAlt3 className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-ds-border/30 bg-ds-bg/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-2">
            {publicLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-ds-surface text-ds-text"
                      : "text-ds-muted hover:text-ds-text hover:bg-ds-surface/50"
                  } ${isBengali ? "font-bangla" : ""}`
                }
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </NavLink>
            ))}

            <div className="border-t border-ds-border/30 my-4 pt-4">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-ds-muted hover:text-ds-text hover:bg-ds-surface/50 transition-colors"
              >
                <HiOutlineTranslate className="w-5 h-5" />
                <span>{isBengali ? "Switch to English" : "বাংলায় দেখুন"}</span>
              </button>

              {user ? (
                <>
                  {userDropdownLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-ds-muted hover:text-ds-text hover:bg-ds-surface/50 transition-colors ${
                        isBengali ? "font-bangla" : ""
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors ${
                      isBengali ? "font-bangla" : ""
                    }`}
                  >
                    <HiOutlineLogout className="w-5 h-5" />
                    {t("nav.logout")}
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-ds-muted hover:text-ds-text hover:bg-ds-surface/50 transition-colors ${
                      isBengali ? "font-bangla" : ""
                    }`}
                  >
                    <HiOutlineLogin className="w-5 h-5" />
                    {t("nav.login")}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg bg-ds-text text-ds-bg ${
                      isBengali ? "font-bangla" : ""
                    }`}
                  >
                    <HiOutlineUserAdd className="w-5 h-5" />
                    {t("nav.register")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
