import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { AuthContext } from "../../context/AuthContext";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineGlobe,
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import loginSvg from "../../assets/login.svg";
import { authAPI } from "../../utils/api";
import axios from "axios";

const Login = () => {
  const { t, i18n } = useTranslation();
  const { isBengali } = useLanguage();
  const { signInUser, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Check user role and redirect accordingly
  const handleRedirectAfterLogin = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const dbUser = response.data.data;

      // If admin, redirect to admin dashboard
      if (dbUser?.role === "admin") {
        toast.success(t("toast.welcomeAdmin"));
        navigate("/admin", { replace: true });
      } else {
        toast.success(t("toast.welcomeBack"));
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error("Error checking user role:", error);
      toast.success(t("toast.welcomeBack"));
      navigate(from, { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const result = await signInUser(email, password);
      await handleRedirectAfterLogin(result.user);
    } catch (error) {
      console.error(error);
      if (error.code === "auth/user-not-found") {
        toast.error(t("auth.errors.noAccount"));
      } else if (error.code === "auth/wrong-password") {
        toast.error(t("auth.errors.wrongPassword"));
      } else if (error.code === "auth/invalid-credential") {
        toast.error(t("auth.errors.invalidCredentials"));
      } else {
        toast.error(t("auth.errors.loginFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();

      // Save/sync user to database (creates if not exists)
      try {
        await authAPI.register({
          name: result.user.displayName || "",
          photoURL: result.user.photoURL || "",
        });
      } catch (error) {
        // If user already exists, that's fine
        const errorMsg = error.response?.data?.message || error.message;
        if (errorMsg !== "User already registered.") {
          console.error("Error syncing user:", errorMsg);
        }
      }

      await handleRedirectAfterLogin(result.user);
    } catch (error) {
      console.error(error);
      toast.error(t("auth.errors.googleFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-ds-surface/40 to-ds-bg relative overflow-hidden items-center justify-center">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ds-muted/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ds-border/10 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-12">
          <div className="mb-10">
            <img src={loginSvg} alt="Login illustration" className="w-80 h-80 mx-auto drop-shadow-2xl" />
          </div>
          <h2 className={`text-3xl font-bold text-ds-text mb-3 ${isBengali ? "font-bangla" : ""}`}>
            {t("auth.login.welcomeBack")}
          </h2>
          <p className={`text-ds-muted mb-2 ${isBengali ? "font-bangla" : ""}`}>
            {t("auth.login.continueJourney")}
          </p>
          <p className={`text-ds-muted ${isBengali ? "" : "font-bangla"}`}>
            {isBengali ? "Continue your German learning journey" : "আপনার জার্মান শেখা চালিয়ে যান"}
          </p>

          <div className="flex justify-center gap-8 mt-10">
            <div className="text-center">
              <div className="text-2xl font-bold text-ds-text">500+</div>
              <div className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                {isBengali ? "শব্দ" : "Words"}
              </div>
            </div>
            <div className="w-px bg-ds-border/30"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-ds-text">45+</div>
              <div className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                {isBengali ? "পাঠ" : "Lessons"}
              </div>
            </div>
            <div className="w-px bg-ds-border/30"></div>
            <div className="text-center">
              <div className={`text-2xl font-bold text-ds-text ${isBengali ? "font-bangla" : ""}`}>
                {isBengali ? "বিনামূল্যে" : "Free"}
              </div>
              <div className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                {isBengali ? "চিরকাল" : "Forever"}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-ds-border/30 to-transparent"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Language Toggle - Top Right */}
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => {
              const newLang = isBengali ? "en" : "bn";
              i18n.changeLanguage(newLang);
              localStorage.setItem("deutschshikhi-language", newLang);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-ds-surface/50 border border-ds-border/30 text-ds-muted hover:text-ds-text hover:bg-ds-surface transition-all"
          >
            <HiOutlineGlobe className="w-4 h-4" />
            <span className={`text-sm font-medium ${isBengali ? "" : "font-bangla"}`}>
              {isBengali ? "EN" : "বাং"}
            </span>
          </button>
        </div>

        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: "30px 30px",
            }}
          ></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-10">
            <Link to="/" className="inline-block mb-8">
              <span className="text-2xl font-bold text-ds-text">
                Deutsch<span className="text-ds-muted">Shikhi</span>
              </span>
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-1 bg-gradient-to-r from-ds-muted to-ds-border rounded-full"></div>
              <span
                className={`text-ds-muted text-sm tracking-widest uppercase ${
                  isBengali ? "font-bangla" : ""
                }`}
              >
                {t("auth.login.welcomeBack")}
              </span>
            </div>
            <h1 className={`text-4xl font-black text-ds-text mb-2 ${isBengali ? "font-bangla" : ""}`}>
              {t("auth.login.signIn")}
            </h1>
            <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
              {t("auth.login.enterCredentials")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <label className={`block text-ds-muted text-sm mb-2 ${isBengali ? "font-bangla" : ""}`}>
                {t("auth.login.email")}
              </label>
              <div
                className={`relative rounded-xl border-2 transition-all duration-300 ${
                  focusedField === "email"
                    ? "border-ds-muted shadow-lg shadow-ds-muted/10"
                    : "border-ds-border/30"
                }`}
              >
                <HiOutlineMail
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    focusedField === "email" ? "text-ds-muted" : "text-ds-border"
                  }`}
                />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent py-4 pl-12 pr-4 text-ds-text placeholder:text-ds-border focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                  {t("auth.login.password")}
                </label>
                <Link
                  to="/forgot-password"
                  className={`text-ds-muted text-sm hover:text-ds-text transition-colors ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {t("auth.login.forgot")}
                </Link>
              </div>
              <div
                className={`relative rounded-xl border-2 transition-all duration-300 ${
                  focusedField === "password"
                    ? "border-ds-muted shadow-lg shadow-ds-muted/10"
                    : "border-ds-border/30"
                }`}
              >
                <HiOutlineLockClosed
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                    focusedField === "password" ? "text-ds-muted" : "text-ds-border"
                  }`}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder={isBengali ? "আপনার পাসওয়ার্ড দিন" : "Enter your password"}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent py-4 pl-12 pr-12 text-ds-text placeholder:text-ds-border focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ds-border hover:text-ds-muted transition-colors"
                >
                  {showPassword ? (
                    <HiOutlineEyeOff className="w-5 h-5" />
                  ) : (
                    <HiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full py-4 rounded-xl bg-ds-text text-ds-bg font-bold text-lg overflow-hidden transition-all hover:shadow-xl hover:shadow-ds-muted/20 disabled:opacity-50 disabled:cursor-not-allowed ${
                isBengali ? "font-bangla" : ""
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-ds-muted to-ds-border translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t("auth.login.signingIn")}
                  </span>
                ) : (
                  t("auth.login.signIn")
                )}
              </span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-ds-border/30"></div>
              <span className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                {t("auth.login.orContinueWith")}
              </span>
              <div className="flex-1 h-px bg-ds-border/30"></div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-4 rounded-xl border-2 border-ds-border/30 text-ds-text font-semibold flex items-center justify-center gap-3 hover:bg-ds-surface/30 hover:border-ds-border transition-all disabled:opacity-50"
            >
              <FcGoogle className="w-6 h-6" />
              Google
            </button>
          </form>

          <p className={`mt-8 text-center text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
            {t("auth.login.noAccount")}{" "}
            <Link to="/register" className="text-ds-text font-semibold hover:underline">
              {t("auth.login.createOne")}
            </Link>
          </p>
          <p className={`mt-6 text-center text-ds-border text-sm ${isBengali ? "" : "font-bangla"}`}>
            {isBengali ? "New here? Create an account" : "নতুন? একটি অ্যাকাউন্ট তৈরি করুন"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
