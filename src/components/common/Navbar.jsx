import { useContext, useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
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
  HiOutlineUserGroup,
  HiOutlineLogin,
  HiOutlineUserAdd,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineChartBar,
  HiOutlineViewGrid,
  HiOutlineCog,
  HiOutlineAcademicCap,
  HiOutlineChevronDown,
  HiOutlineCollection,
  HiOutlinePuzzle,
  HiOutlineTrendingUp,
  HiOutlineStar,
  HiOutlineClipboardList,
  HiOutlineChatAlt2,
} from "react-icons/hi";

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, logOut } = useContext(AuthContext);
  const { currentLanguage, isBengali, changeLanguage } = useLanguage();
  const axiosSecure = useAxiosSecure();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Toggle language
  const toggleLanguage = async () => {
    const newLang = currentLanguage === "bn" ? "en" : "bn";
    changeLanguage(newLang);
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

  // Mega Menu Structure
  const megaMenuItems = [
    {
      id: "learn",
      label: t("nav.learn", "Learn"),
      items: [
        {
          to: "/courses",
          icon: HiOutlineBookOpen,
          label: t("nav.courses", "Courses"),
          description: isBengali ? "ধাপে ধাপে জার্মান শিখুন" : "Step-by-step German lessons",
        },
        {
          to: "/grammar",
          icon: HiOutlineAcademicCap,
          label: t("nav.grammar", "Grammar"),
          description: isBengali ? "ব্যাকরণের নিয়ম শিখুন" : "Learn grammar rules",
        },
        {
          to: "/vocabulary",
          icon: HiOutlineCollection,
          label: t("nav.vocabulary", "Vocabulary"),
          description: isBengali ? "নতুন শব্দ শিখুন" : "Build your word bank",
        },
      ],
    },
    {
      id: "practice",
      label: t("nav.practice", "Practice"),
      items: [
        {
          to: "/practice",
          icon: HiOutlineLightningBolt,
          label: t("nav.exercises", "Exercises"),
          description: isBengali ? "অনুশীলন করুন" : "Practice what you learned",
        },
        {
          to: "/practice?mode=quiz",
          icon: HiOutlinePuzzle,
          label: t("nav.quizzes", "Quizzes"),
          description: isBengali ? "জ্ঞান পরীক্ষা করুন" : "Test your knowledge",
        },
        {
          to: "/practice?mode=flashcards",
          icon: HiOutlineClipboardList,
          label: t("nav.flashcards", "Flashcards"),
          description: isBengali ? "ফ্ল্যাশকার্ড দিয়ে শিখুন" : "Learn with flashcards",
        },
      ],
    },
  ];

  // Simple nav items (no dropdown)
  const simpleNavItems = [
    { to: "/", label: t("nav.home", "Home") },
    { to: "/leaderboard", label: t("nav.leaderboard", "Leaderboard") },
  ];

  // Check if a dropdown has an active route
  const isDropdownActive = (items) => {
    return items.some(
      (item) => location.pathname === item.to || location.pathname.startsWith(item.to.split("?")[0])
    );
  };

  // User dropdown links
  const userDropdownLinks = isAdmin
    ? [
        { to: "/admin", label: t("nav.admin", "Admin Panel"), icon: HiOutlineViewGrid },
        { to: "/admin/settings", label: t("nav.settings", "Settings"), icon: HiOutlineCog },
      ]
    : [
        { to: "/dashboard", label: t("nav.myStats", "My Stats"), icon: HiOutlineChartBar },
        { to: "/profile", label: t("nav.profile", "Profile"), icon: HiOutlineUser },
      ];

  return (
    <nav className="sticky top-0 z-50 bg-ds-bg/95 backdrop-blur-md border-b border-ds-border/30">
      <div className="german-stripe"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl font-bold text-ds-text">
              Deutsch<span className="text-ds-muted">Shikhi</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {/* Home */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-ds-surface text-ds-text"
                    : "text-ds-muted hover:text-ds-text hover:bg-ds-surface/50"
                }`
              }
            >
              {t("nav.home", "Home")}
            </NavLink>

            {/* Mega Menu Dropdowns */}
            {megaMenuItems.map((menu) => (
              <div key={menu.id} className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === menu.id ? null : menu.id)}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    activeDropdown === menu.id || isDropdownActive(menu.items)
                      ? "bg-ds-surface text-ds-text"
                      : "text-ds-muted hover:text-ds-text hover:bg-ds-surface/50"
                  }`}
                >
                  <span className={isBengali ? "font-bangla" : ""}>{menu.label}</span>
                  <HiOutlineChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      activeDropdown === menu.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Panel */}
                {activeDropdown === menu.id && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-ds-surface rounded-xl border border-ds-border/50 shadow-xl overflow-hidden animate-fade-in">
                    <div className="p-2">
                      {menu.items.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                            location.pathname === item.to.split("?")[0]
                              ? "bg-ds-border/30 text-ds-text"
                              : "hover:bg-ds-bg/50 text-ds-muted hover:text-ds-text"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-lg bg-ds-border/20 flex items-center justify-center flex-shrink-0">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className={`font-medium ${isBengali ? "font-bangla" : ""}`}>{item.label}</p>
                            <p
                              className={`text-xs text-ds-muted/70 mt-0.5 ${isBengali ? "font-bangla" : ""}`}
                            >
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Leaderboard */}
            <NavLink
              to="/leaderboard"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-ds-surface text-ds-text"
                    : "text-ds-muted hover:text-ds-text hover:bg-ds-surface/50"
                }`
              }
            >
              {t("nav.leaderboard", "Leaderboard")}
            </NavLink>
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ds-surface text-ds-text text-sm hover:bg-ds-border/50 transition-colors cursor-pointer"
              title={isBengali ? "Switch to English" : "বাংলায় দেখুন"}
            >
              <HiOutlineTranslate className="w-4 h-4" />
              <span className="font-medium">{isBengali ? "EN" : "বাং"}</span>
            </button>

            {/* Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === "user" ? null : "user")}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-ds-surface transition-colors cursor-pointer"
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
                  <span className="text-ds-text text-sm max-w-[100px] truncate">
                    {user.displayName || "User"}
                  </span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 text-xs rounded bg-purple-500/20 text-purple-400">
                      Admin
                    </span>
                  )}
                  <HiOutlineChevronDown
                    className={`w-4 h-4 text-ds-muted transition-transform ${
                      activeDropdown === "user" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* User Dropdown */}
                {activeDropdown === "user" && (
                  <div className="absolute top-full right-0 mt-2 w-52 bg-ds-surface rounded-xl border border-ds-border/50 shadow-xl overflow-hidden animate-fade-in">
                    <div className="p-2">
                      {userDropdownLinks.map((link) => (
                        <Link
                          key={link.to}
                          to={link.to}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-ds-muted hover:text-ds-text hover:bg-ds-bg/50 transition-colors ${
                            isBengali ? "font-bangla" : ""
                          }`}
                        >
                          <link.icon className="w-5 h-5" />
                          {link.label}
                        </Link>
                      ))}
                      <div className="border-t border-ds-border/30 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer ${
                            isBengali ? "font-bangla" : ""
                          }`}
                        >
                          <HiOutlineLogout className="w-5 h-5" />
                          {t("nav.logout", "Logout")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg text-ds-muted hover:text-ds-text transition-colors ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {t("nav.login", "Login")}
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-lg bg-ds-text text-ds-bg hover:shadow-lg transition-all ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {t("nav.register", "Register")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-ds-muted hover:text-ds-text hover:bg-ds-surface transition-colors cursor-pointer"
          >
            {isMenuOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenuAlt3 className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-ds-border/30 bg-ds-bg/95 backdrop-blur-md max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-2">
            {/* Home */}
            <NavLink
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-ds-surface text-ds-text"
                    : "text-ds-muted hover:text-ds-text hover:bg-ds-surface/50"
                }`
              }
            >
              <HiOutlineHome className="w-5 h-5" />
              <span className={isBengali ? "font-bangla" : ""}>{t("nav.home", "Home")}</span>
            </NavLink>

            {/* Mega Menu Sections */}
            {megaMenuItems.map((menu) => (
              <div key={menu.id} className="space-y-1">
                <p
                  className={`px-4 py-2 text-xs font-semibold text-ds-muted uppercase tracking-wider ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {menu.label}
                </p>
                {menu.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-ds-surface text-ds-text"
                          : "text-ds-muted hover:text-ds-text hover:bg-ds-surface/50"
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <div>
                      <span className={isBengali ? "font-bangla" : ""}>{item.label}</span>
                      <p className={`text-xs text-ds-muted/60 ${isBengali ? "font-bangla" : ""}`}>
                        {item.description}
                      </p>
                    </div>
                  </NavLink>
                ))}
              </div>
            ))}

            {/* Leaderboard */}
            <NavLink
              to="/leaderboard"
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-ds-surface text-ds-text"
                    : "text-ds-muted hover:text-ds-text hover:bg-ds-surface/50"
                }`
              }
            >
              <HiOutlineUserGroup className="w-5 h-5" />
              <span className={isBengali ? "font-bangla" : ""}>{t("nav.leaderboard", "Leaderboard")}</span>
            </NavLink>

            <div className="border-t border-ds-border/30 my-4 pt-4">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-ds-muted hover:text-ds-text hover:bg-ds-surface/50 transition-colors cursor-pointer"
              >
                <HiOutlineTranslate className="w-5 h-5" />
                <span>{isBengali ? "Switch to English" : "বাংলায় দেখুন"}</span>
              </button>

              {user ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-10 h-10 rounded-full border-2 border-ds-border"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-ds-surface flex items-center justify-center border-2 border-ds-border">
                        <HiOutlineUser className="w-6 h-6 text-ds-muted" />
                      </div>
                    )}
                    <div>
                      <p className="text-ds-text font-medium">{user.displayName || "User"}</p>
                      {isAdmin && (
                        <span className="px-1.5 py-0.5 text-xs rounded bg-purple-500/20 text-purple-400">
                          Admin
                        </span>
                      )}
                    </div>
                  </div>

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
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer ${
                      isBengali ? "font-bangla" : ""
                    }`}
                  >
                    <HiOutlineLogout className="w-5 h-5" />
                    {t("nav.logout", "Logout")}
                  </button>
                </>
              ) : (
                <div className="space-y-2 mt-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-ds-border/30 text-ds-muted hover:text-ds-text hover:bg-ds-surface/50 transition-colors ${
                      isBengali ? "font-bangla" : ""
                    }`}
                  >
                    <HiOutlineLogin className="w-5 h-5" />
                    {t("nav.login", "Login")}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-ds-text text-ds-bg ${
                      isBengali ? "font-bangla" : ""
                    }`}
                  >
                    <HiOutlineUserAdd className="w-5 h-5" />
                    {t("nav.register", "Register")}
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
