import { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  HiOutlineMenuAlt3,
  HiOutlineX,
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineTranslate,
  HiOutlineMicrophone,
  HiOutlineLogin,
  HiOutlineUserAdd,
  HiOutlineLogout,
  HiOutlineUser,
  HiOutlineChartBar,
  HiOutlineCog,
} from "react-icons/hi";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState("bn"); // bn or en

  // Toggle language
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "bn" ? "en" : "bn"));
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Navigation links
  const publicLinks = [
    { to: "/", label: { bn: "হোম", en: "Home" }, icon: HiOutlineHome },
    { to: "/courses", label: { bn: "কোর্স", en: "Courses" }, icon: HiOutlineBookOpen },
    { to: "/vocabulary", label: { bn: "শব্দভান্ডার", en: "Vocabulary" }, icon: HiOutlineTranslate },
    { to: "/practice", label: { bn: "অনুশীলন", en: "Practice" }, icon: HiOutlineMicrophone },
  ];

  const userLinks = [
    { to: "/dashboard", label: { bn: "ড্যাশবোর্ড", en: "Dashboard" }, icon: HiOutlineChartBar },
    { to: "/progress", label: { bn: "অগ্রগতি", en: "Progress" }, icon: HiOutlineChartBar },
    { to: "/profile", label: { bn: "প্রোফাইল", en: "Profile" }, icon: HiOutlineUser },
  ];

  // NavLink styles
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
      isActive ? "bg-ds-surface text-ds-text" : "text-ds-muted hover:text-ds-text hover:bg-ds-surface/50"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-ds-bg/95 backdrop-blur-md border-b border-ds-border/30">
      {/* German Flag Stripe */}
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
                <span className={language === "bn" ? "font-bangla" : "font-inter"}>
                  {link.label[language]}
                </span>
              </NavLink>
            ))}
          </div>

          {/* Right Side - Language Toggle & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ds-surface text-ds-text text-sm hover:bg-ds-border transition-colors"
            >
              <HiOutlineTranslate className="w-4 h-4" />
              <span className="font-medium">{language === "bn" ? "EN" : "বাং"}</span>
            </button>

            {/* Auth Buttons / User Menu */}
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
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content mt-2 p-2 shadow-lg bg-ds-surface rounded-xl w-52 border border-ds-border/50"
                >
                  {userLinks.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-ds-text hover:bg-ds-bg transition-colors"
                      >
                        <link.icon className="w-5 h-5" />
                        <span className={language === "bn" ? "font-bangla" : "font-inter"}>
                          {link.label[language]}
                        </span>
                      </Link>
                    </li>
                  ))}
                  <li className="border-t border-ds-border/50 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-ds-bg w-full transition-colors"
                    >
                      <HiOutlineLogout className="w-5 h-5" />
                      <span className={language === "bn" ? "font-bangla" : "font-inter"}>
                        {language === "bn" ? "লগ আউট" : "Logout"}
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-ds-text hover:bg-ds-surface transition-colors"
                >
                  <HiOutlineLogin className="w-5 h-5" />
                  <span className={language === "bn" ? "font-bangla" : "font-inter"}>
                    {language === "bn" ? "লগইন" : "Login"}
                  </span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-ds-surface text-ds-text hover:bg-ds-border transition-colors"
                >
                  <HiOutlineUserAdd className="w-5 h-5" />
                  <span className={language === "bn" ? "font-bangla" : "font-inter"}>
                    {language === "bn" ? "রেজিস্টার" : "Register"}
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-ds-text hover:bg-ds-surface transition-colors"
          >
            {isMenuOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenuAlt3 className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-ds-bg border-t border-ds-border/30 animate-fade-in">
          <div className="px-4 py-4 space-y-2">
            {/* Language Toggle Mobile */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-ds-surface text-ds-text"
            >
              <HiOutlineTranslate className="w-5 h-5" />
              <span>{language === "bn" ? "Switch to English" : "বাংলায় দেখুন"}</span>
            </button>

            {/* Navigation Links */}
            {publicLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={navLinkClass}
              >
                <link.icon className="w-5 h-5" />
                <span className={language === "bn" ? "font-bangla" : "font-inter"}>
                  {link.label[language]}
                </span>
              </NavLink>
            ))}

            {/* User Links (if logged in) */}
            {user && (
              <>
                <div className="border-t border-ds-border/30 my-2 pt-2">
                  {userLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={navLinkClass}
                    >
                      <link.icon className="w-5 h-5" />
                      <span className={language === "bn" ? "font-bangla" : "font-inter"}>
                        {link.label[language]}
                      </span>
                    </NavLink>
                  ))}
                </div>
              </>
            )}

            {/* Auth Buttons Mobile */}
            <div className="border-t border-ds-border/30 pt-2 mt-2">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-red-400 hover:bg-ds-surface transition-colors"
                >
                  <HiOutlineLogout className="w-5 h-5" />
                  <span className={language === "bn" ? "font-bangla" : "font-inter"}>
                    {language === "bn" ? "লগ আউট" : "Logout"}
                  </span>
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-ds-border text-ds-text hover:bg-ds-surface transition-colors"
                  >
                    <HiOutlineLogin className="w-5 h-5" />
                    <span className={language === "bn" ? "font-bangla" : "font-inter"}>
                      {language === "bn" ? "লগইন" : "Login"}
                    </span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-ds-surface text-ds-text hover:bg-ds-border transition-colors"
                  >
                    <HiOutlineUserAdd className="w-5 h-5" />
                    <span className={language === "bn" ? "font-bangla" : "font-inter"}>
                      {language === "bn" ? "রেজিস্টার" : "Register"}
                    </span>
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
