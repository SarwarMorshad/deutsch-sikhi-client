import { useContext, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
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
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineChartBar,
  HiOutlineViewGrid,
  HiOutlineCog,
  HiOutlineAcademicCap,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineCollection,
  HiOutlinePuzzle,
  HiOutlineTrendingUp,
  HiOutlineClipboardList,
  HiOutlineLockClosed,
} from "react-icons/hi";

// Desktop dropdown animation
const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15, ease: "easeIn" } },
};

// Mobile menu animations - slide from top with smooth exit
const menuVariants = {
  hidden: { opacity: 0, y: -50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.95,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logOut } = useContext(AuthContext);
  const { currentLanguage, isBengali, changeLanguage } = useLanguage();
  const axiosSecure = useAxiosSecure();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const dropdownTimeoutRef = useRef(null);

  // Check admin role
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
        setIsAdmin(false);
      }
    };
    checkAdminRole();
  }, [user]);

  // Close everything on route change
  useEffect(() => {
    setActiveDropdown(null);
    setIsMenuOpen(false);
    setExpandedSection(null);
  }, [location.pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Desktop hover handlers
  const handleMouseEnter = (menuId) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menuId);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  // Language toggle
  const toggleLanguage = async () => {
    const newLang = currentLanguage === "bn" ? "en" : "bn";
    changeLanguage(newLang);
    if (user) {
      try {
        await axiosSecure.patch("/users/me/language", { language: newLang });
      } catch (error) {
        console.error("Error saving language:", error);
      }
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logOut();
      setIsMenuOpen(false);
      setIsAdmin(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Menu structure for mobile
  const megaMenuItems = [
    {
      id: "learn",
      label: t("nav.learn", "Learn"),
      icon: HiOutlineBookOpen,
      items: [
        { to: "/courses", label: t("nav.courses", "Courses"), requiresAuth: false },
        { to: "/grammar", label: t("nav.grammar", "Grammar"), requiresAuth: true },
        { to: "/vocabulary", label: t("nav.vocabulary", "Vocabulary"), requiresAuth: true },
      ],
    },
    {
      id: "practice",
      label: t("nav.practice", "Practice"),
      icon: HiOutlineLightningBolt,
      items: [
        { to: "/practice", label: t("nav.exercises", "Exercises"), requiresAuth: true },
        { to: "/practice?mode=quiz", label: t("nav.quizzes", "Quizzes"), requiresAuth: true },
        { to: "/practice?mode=flashcards", label: t("nav.flashcards", "Flashcards"), requiresAuth: true },
      ],
    },
  ];

  // Desktop menu items with descriptions
  const desktopMenuItems = [
    {
      id: "learn",
      label: t("nav.learn", "Learn"),
      items: [
        {
          to: "/courses",
          icon: HiOutlineBookOpen,
          label: t("nav.courses", "Courses"),
          description: isBengali ? "ধাপে ধাপে জার্মান শিখুন" : "Step-by-step German lessons",
          requiresAuth: false,
        },
        {
          to: "/grammar",
          icon: HiOutlineAcademicCap,
          label: t("nav.grammar", "Grammar"),
          description: isBengali ? "ব্যাকরণের নিয়ম শিখুন" : "Learn grammar rules",
          requiresAuth: true,
        },
        {
          to: "/vocabulary",
          icon: HiOutlineCollection,
          label: t("nav.vocabulary", "Vocabulary"),
          description: isBengali ? "নতুন শব্দ শিখুন" : "Build your word bank",
          requiresAuth: true,
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
          requiresAuth: true,
        },
        {
          to: "/practice?mode=quiz",
          icon: HiOutlinePuzzle,
          label: t("nav.quizzes", "Quizzes"),
          description: isBengali ? "জ্ঞান পরীক্ষা করুন" : "Test your knowledge",
          requiresAuth: true,
        },
        {
          to: "/practice?mode=flashcards",
          icon: HiOutlineClipboardList,
          label: t("nav.flashcards", "Flashcards"),
          description: isBengali ? "ফ্ল্যাশকার্ড দিয়ে শিখুন" : "Learn with flashcards",
          requiresAuth: true,
        },
      ],
    },
  ];

  const isDropdownActive = (items) =>
    items.some(
      (item) => location.pathname === item.to || location.pathname.startsWith(item.to.split("?")[0])
    );

  const handleNavItemClick = (item, e) => {
    if (item.requiresAuth && !user) {
      e.preventDefault();
      navigate(`/login?redirect=${encodeURIComponent(item.to)}`);
    }
  };

  const userDropdownLinks = isAdmin
    ? [
        { to: "/admin", label: t("nav.admin", "Admin Panel"), icon: HiOutlineViewGrid },
        { to: "/leaderboard", label: t("nav.leaderboard", "Leaderboard"), icon: HiOutlineTrendingUp },
        { to: "/admin/settings", label: t("nav.settings", "Settings"), icon: HiOutlineCog },
      ]
    : [
        { to: "/dashboard", label: t("nav.myStats", "My Stats"), icon: HiOutlineChartBar },
        { to: "/leaderboard", label: t("nav.leaderboard", "Leaderboard"), icon: HiOutlineTrendingUp },
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

          {/* ==================== DESKTOP NAVIGATION ==================== */}
          <div className="hidden lg:flex items-center gap-1">
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

            {desktopMenuItems.map((menu) => (
              <div
                key={menu.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(menu.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    activeDropdown === menu.id || isDropdownActive(menu.items)
                      ? "bg-ds-surface text-ds-text"
                      : "text-ds-muted hover:text-ds-text hover:bg-ds-surface/50"
                  }`}
                >
                  <span className={isBengali ? "font-bangla" : ""}>{menu.label}</span>
                  <motion.div
                    animate={{ rotate: activeDropdown === menu.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiOutlineChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {activeDropdown === menu.id && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-0 mt-1 w-72 bg-ds-surface rounded-xl border border-ds-border/50 shadow-xl overflow-hidden"
                      onMouseEnter={() => handleMouseEnter(menu.id)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="p-2">
                        {menu.items.map((item, index) => {
                          const isLocked = item.requiresAuth && !user;
                          return (
                            <motion.div
                              key={item.to}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                to={isLocked ? "/login" : item.to}
                                onClick={(e) => handleNavItemClick(item, e)}
                                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                                  location.pathname === item.to.split("?")[0]
                                    ? "bg-ds-border/30 text-ds-text"
                                    : "hover:bg-ds-bg/50 text-ds-muted hover:text-ds-text"
                                } ${isLocked ? "opacity-70" : ""}`}
                              >
                                <div
                                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                    isLocked ? "bg-ds-border/10" : "bg-ds-border/20"
                                  }`}
                                >
                                  {isLocked ? (
                                    <HiOutlineLockClosed className="w-5 h-5 text-ds-muted/50" />
                                  ) : (
                                    <item.icon className="w-5 h-5" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className={`font-medium ${isBengali ? "font-bangla" : ""}`}>
                                      {item.label}
                                    </p>
                                    {isLocked && (
                                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-ds-border/30 text-ds-muted">
                                        {isBengali ? "লগইন" : "Login"}
                                      </span>
                                    )}
                                  </div>
                                  <p
                                    className={`text-xs text-ds-muted/70 mt-0.5 ${
                                      isBengali ? "font-bangla" : ""
                                    }`}
                                  >
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center gap-3">
            {!user && (
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
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ds-surface text-ds-text text-sm hover:bg-ds-border/50 transition-colors cursor-pointer"
            >
              <HiOutlineTranslate className="w-4 h-4" />
              <span className="font-medium">{isBengali ? "EN" : "বাং"}</span>
            </motion.button>

            {user ? (
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter("user")}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-ds-surface transition-colors cursor-pointer">
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
                  <motion.div
                    animate={{ rotate: activeDropdown === "user" ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <HiOutlineChevronDown className="w-4 h-4 text-ds-muted" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {activeDropdown === "user" && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full right-0 mt-1 w-52 bg-ds-surface rounded-xl border border-ds-border/50 shadow-xl overflow-hidden"
                      onMouseEnter={() => handleMouseEnter("user")}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="p-2">
                        {userDropdownLinks.map((link, index) => (
                          <motion.div
                            key={link.to}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              to={link.to}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-ds-muted hover:text-ds-text hover:bg-ds-bg/50 transition-colors ${
                                isBengali ? "font-bangla" : ""
                              }`}
                            >
                              <link.icon className="w-5 h-5" />
                              {link.label}
                            </Link>
                          </motion.div>
                        ))}
                        <div className="border-t border-ds-border/30 mt-2 pt-2">
                          <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: userDropdownLinks.length * 0.05 }}
                            onClick={handleLogout}
                            className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer ${
                              isBengali ? "font-bangla" : ""
                            }`}
                          >
                            <HiOutlineLogout className="w-5 h-5" />
                            {t("nav.logout", "Logout")}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className={`px-4 py-2 rounded-lg bg-ds-text text-ds-bg hover:shadow-lg transition-all inline-block ${
                      isBengali ? "font-bangla" : ""
                    }`}
                  >
                    {t("nav.register", "Register")}
                  </Link>
                </motion.div>
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

      {/* ==================== MOBILE MENU (Facebook Style) - Using Portal ==================== */}
      {createPortal(
        <AnimatePresence>
          {isMenuOpen && (
            <div key="mobile-menu-wrapper" className="lg:hidden">
              {/* Backdrop - full screen with blur */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setIsMenuOpen(false)}
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

              {/* Menu Panel - Facebook Style */}
              <motion.div
                key="menu-panel"
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                  exit: { duration: 0.2, ease: "easeOut" },
                }}
                style={{
                  position: "fixed",
                  top: "80px",
                  left: "16px",
                  right: "16px",
                  maxWidth: "448px",
                  margin: "0 auto",
                  zIndex: 9999,
                }}
                className="bg-ds-surface rounded-2xl border border-ds-border/50 shadow-2xl max-h-[calc(100vh-100px)] overflow-y-auto"
              >
                {/* User Profile Card */}
                {user ? (
                  <div className="p-4 border-b border-ds-border/30">
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-ds-bg/50 transition-colors"
                    >
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt=""
                          className="w-14 h-14 rounded-full border-2 border-ds-border"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-ds-bg/50 flex items-center justify-center border-2 border-ds-border">
                          <HiOutlineUser className="w-7 h-7 text-ds-muted" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-ds-text font-semibold text-lg">{user.displayName || "User"}</p>
                        {isAdmin && (
                          <span className="inline-block px-2 py-0.5 text-xs rounded bg-purple-500/20 text-purple-400">
                            Admin
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 border-b border-ds-border/30">
                    <div className="flex gap-2">
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex-1 py-3 text-center rounded-xl bg-ds-bg/50 text-ds-text font-medium hover:bg-ds-bg transition-colors"
                      >
                        {t("nav.login", "Login")}
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex-1 py-3 text-center rounded-xl bg-ds-text text-ds-bg font-medium hover:bg-ds-muted transition-colors"
                      >
                        {t("nav.register", "Register")}
                      </Link>
                    </div>
                  </div>
                )}

                {/* Menu Items */}
                <div className="p-2">
                  {/* === Section 1: Navigation (Home, Learn, Practice) === */}
                  <NavLink
                    to="/"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-3 py-3 rounded-xl transition-colors ${
                        isActive ? "bg-ds-border/30" : "hover:bg-ds-bg/50"
                      }`
                    }
                  >
                    <div className="w-10 h-10 rounded-full bg-ds-bg/50 flex items-center justify-center">
                      <HiOutlineHome className="w-5 h-5 text-ds-text" />
                    </div>
                    <span className={`text-ds-text font-medium ${isBengali ? "font-bangla" : ""}`}>
                      {t("nav.home", "Home")}
                    </span>
                  </NavLink>

                  {/* Learn */}
                  {megaMenuItems
                    .filter((menu) => menu.id === "learn")
                    .map((menu) => (
                      <div key={menu.id}>
                        <button
                          onClick={() => setExpandedSection(expandedSection === menu.id ? null : menu.id)}
                          className="flex items-center justify-between w-full px-3 py-3 rounded-xl hover:bg-ds-bg/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-ds-bg/50 flex items-center justify-center">
                              <menu.icon className="w-5 h-5 text-ds-text" />
                            </div>
                            <span className={`text-ds-text font-medium ${isBengali ? "font-bangla" : ""}`}>
                              {menu.label}
                            </span>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedSection === menu.id ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <HiOutlineChevronRight className="w-5 h-5 text-ds-muted" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {expandedSection === menu.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-14 pr-3 pb-2 space-y-1">
                                {menu.items.map((item) => {
                                  const isLocked = item.requiresAuth && !user;
                                  return (
                                    <NavLink
                                      key={item.to}
                                      to={isLocked ? "/login" : item.to}
                                      onClick={(e) => {
                                        if (isLocked) {
                                          e.preventDefault();
                                          navigate(`/login?redirect=${encodeURIComponent(item.to)}`);
                                        }
                                        setIsMenuOpen(false);
                                      }}
                                      className={({ isActive }) =>
                                        `flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors ${
                                          isActive
                                            ? "bg-ds-border/30 text-ds-text"
                                            : "text-ds-muted hover:text-ds-text hover:bg-ds-bg/30"
                                        } ${isLocked ? "opacity-60" : ""}`
                                      }
                                    >
                                      <span className={isBengali ? "font-bangla" : ""}>{item.label}</span>
                                      {isLocked && <HiOutlineLockClosed className="w-4 h-4" />}
                                    </NavLink>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}

                  {/* Practice */}
                  {megaMenuItems
                    .filter((menu) => menu.id === "practice")
                    .map((menu) => (
                      <div key={menu.id}>
                        <button
                          onClick={() => setExpandedSection(expandedSection === menu.id ? null : menu.id)}
                          className="flex items-center justify-between w-full px-3 py-3 rounded-xl hover:bg-ds-bg/50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-ds-bg/50 flex items-center justify-center">
                              <menu.icon className="w-5 h-5 text-ds-text" />
                            </div>
                            <span className={`text-ds-text font-medium ${isBengali ? "font-bangla" : ""}`}>
                              {menu.label}
                            </span>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedSection === menu.id ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <HiOutlineChevronRight className="w-5 h-5 text-ds-muted" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {expandedSection === menu.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-14 pr-3 pb-2 space-y-1">
                                {menu.items.map((item) => {
                                  const isLocked = item.requiresAuth && !user;
                                  return (
                                    <NavLink
                                      key={item.to}
                                      to={isLocked ? "/login" : item.to}
                                      onClick={(e) => {
                                        if (isLocked) {
                                          e.preventDefault();
                                          navigate(`/login?redirect=${encodeURIComponent(item.to)}`);
                                        }
                                        setIsMenuOpen(false);
                                      }}
                                      className={({ isActive }) =>
                                        `flex items-center justify-between px-4 py-2.5 rounded-lg transition-colors ${
                                          isActive
                                            ? "bg-ds-border/30 text-ds-text"
                                            : "text-ds-muted hover:text-ds-text hover:bg-ds-bg/30"
                                        } ${isLocked ? "opacity-60" : ""}`
                                      }
                                    >
                                      <span className={isBengali ? "font-bangla" : ""}>{item.label}</span>
                                      {isLocked && <HiOutlineLockClosed className="w-4 h-4" />}
                                    </NavLink>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}

                  {/* === Visible Divider === */}
                  <div className="my-3 mx-2 border-t-2 border-ds-border/50" />

                  {/* === Section 2: Stats (Leaderboard, My Stats) === */}
                  <NavLink
                    to="/leaderboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-3 py-3 rounded-xl transition-colors ${
                        isActive ? "bg-ds-border/30" : "hover:bg-ds-bg/50"
                      }`
                    }
                  >
                    <div className="w-10 h-10 rounded-full bg-ds-bg/50 flex items-center justify-center">
                      <HiOutlineTrendingUp className="w-5 h-5 text-ds-text" />
                    </div>
                    <span className={`text-ds-text font-medium ${isBengali ? "font-bangla" : ""}`}>
                      {t("nav.leaderboard", "Leaderboard")}
                    </span>
                  </NavLink>

                  {user && !isAdmin && (
                    <NavLink
                      to="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-4 px-3 py-3 rounded-xl transition-colors ${
                          isActive ? "bg-ds-border/30" : "hover:bg-ds-bg/50"
                        }`
                      }
                    >
                      <div className="w-10 h-10 rounded-full bg-ds-bg/50 flex items-center justify-center">
                        <HiOutlineChartBar className="w-5 h-5 text-ds-text" />
                      </div>
                      <span className={`text-ds-text font-medium ${isBengali ? "font-bangla" : ""}`}>
                        {t("nav.myStats", "My Stats")}
                      </span>
                    </NavLink>
                  )}

                  {/* === Visible Divider (Admin Section) === */}
                  {isAdmin && (
                    <>
                      <div className="my-3 mx-2 border-t-2 border-ds-border/50" />

                      <NavLink
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-4 px-3 py-3 rounded-xl transition-colors ${
                            isActive ? "bg-ds-border/30" : "hover:bg-ds-bg/50"
                          }`
                        }
                      >
                        <div className="w-10 h-10 rounded-full bg-ds-bg/50 flex items-center justify-center">
                          <HiOutlineViewGrid className="w-5 h-5 text-ds-text" />
                        </div>
                        <span className={`text-ds-text font-medium ${isBengali ? "font-bangla" : ""}`}>
                          {t("nav.admin", "Admin Panel")}
                        </span>
                      </NavLink>
                    </>
                  )}

                  {/* === Visible Divider === */}
                  <div className="my-3 mx-2 border-t-2 border-ds-border/50" />

                  {/* === Section 3: Settings (Language, Logout) === */}
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center justify-between w-full px-3 py-3 rounded-xl hover:bg-ds-bg/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-ds-bg/50 flex items-center justify-center">
                        <HiOutlineTranslate className="w-5 h-5 text-ds-text" />
                      </div>
                      <span className={`text-ds-text font-medium`}>
                        {isBengali ? "Switch to English" : "বাংলায় দেখুন"}
                      </span>
                    </div>
                    <HiOutlineChevronRight className="w-5 h-5 text-ds-muted" />
                  </button>

                  {user && (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-4 w-full px-3 py-3 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                        <HiOutlineLogout className="w-5 h-5 text-red-400" />
                      </div>
                      <span className={`text-red-400 font-medium ${isBengali ? "font-bangla" : ""}`}>
                        {t("nav.logout", "Logout")}
                      </span>
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </nav>
  );
};

export default Navbar;
