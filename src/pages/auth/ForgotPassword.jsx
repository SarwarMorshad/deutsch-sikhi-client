import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { sendPasswordResetEmail } from "firebase/auth";
import auth from "../../firebase/firebase.init";
import toast from "react-hot-toast";
import { HiOutlineMail, HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineGlobe } from "react-icons/hi";

const ForgotPassword = () => {
  const { t, i18n } = useTranslation();
  const { isBengali } = useLanguage();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Toggle language
  const toggleLanguage = () => {
    const newLang = i18n.language === "bn" ? "en" : "bn";
    i18n.changeLanguage(newLang);
    localStorage.setItem("deutschshikhi-language", newLang);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error(isBengali ? "ইমেইল প্রয়োজন" : "Email is required");
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      toast.success(isBengali ? "পাসওয়ার্ড রিসেট ইমেইল পাঠানো হয়েছে!" : "Password reset email sent!");
    } catch (error) {
      console.error("Password reset error:", error);

      // Handle specific Firebase errors
      switch (error.code) {
        case "auth/user-not-found":
          toast.error(isBengali ? "এই ইমেইলে কোনো অ্যাকাউন্ট নেই" : "No account found with this email");
          break;
        case "auth/invalid-email":
          toast.error(isBengali ? "অবৈধ ইমেইল ঠিকানা" : "Invalid email address");
          break;
        case "auth/too-many-requests":
          toast.error(
            isBengali ? "অনেক বেশি চেষ্টা। পরে আবার চেষ্টা করুন" : "Too many attempts. Try again later"
          );
          break;
        default:
          toast.error(
            isBengali ? "কিছু ভুল হয়েছে। আবার চেষ্টা করুন" : "Something went wrong. Please try again"
          );
      }
    } finally {
      setLoading(false);
    }
  };

  // Success state - Email sent
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-ds-muted/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-ds-border/10 rounded-full blur-3xl"></div>
        </div>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="absolute top-6 right-6 z-20 flex items-center gap-2 px-3 py-2 rounded-xl bg-ds-surface/50 border border-ds-border/30 text-ds-text hover:bg-ds-surface transition-colors"
        >
          <HiOutlineGlobe className="w-4 h-4" />
          <span className="text-sm font-medium">{isBengali ? "EN" : "বাং"}</span>
        </button>

        {/* Success Card */}
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-ds-surface/30 backdrop-blur-sm rounded-3xl border border-ds-border/30 p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <HiOutlineCheckCircle className="w-10 h-10 text-emerald-400" />
            </div>

            {/* Title */}
            <h1 className={`text-2xl font-bold text-ds-text mb-3 ${isBengali ? "font-bangla" : ""}`}>
              {isBengali ? "ইমেইল পাঠানো হয়েছে!" : "Email Sent!"}
            </h1>

            {/* Description */}
            <p className={`text-ds-muted mb-6 ${isBengali ? "font-bangla" : ""}`}>
              {isBengali
                ? `আমরা ${email} এ একটি পাসওয়ার্ড রিসেট লিংক পাঠিয়েছি। আপনার ইনবক্স চেক করুন।`
                : `We've sent a password reset link to ${email}. Please check your inbox.`}
            </p>

            {/* Spam Notice */}
            <div
              className={`p-4 rounded-xl bg-ds-bg/50 border border-ds-border/30 mb-6 ${
                isBengali ? "font-bangla" : ""
              }`}
            >
              <p className="text-sm text-ds-muted">
                {isBengali
                  ? "💡 ইমেইল না পেলে স্প্যাম ফোল্ডার চেক করুন"
                  : "💡 If you don't see the email, check your spam folder"}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                }}
                className={`w-full py-3 rounded-xl border-2 border-ds-border/30 text-ds-text font-semibold hover:bg-ds-surface transition-colors ${
                  isBengali ? "font-bangla" : ""
                }`}
              >
                {isBengali ? "অন্য ইমেইল ব্যবহার করুন" : "Try another email"}
              </button>

              <Link
                to="/login"
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-ds-text text-ds-bg font-semibold hover:shadow-lg transition-all ${
                  isBengali ? "font-bangla" : ""
                }`}
              >
                <HiOutlineArrowLeft className="w-5 h-5" />
                {isBengali ? "লগইনে ফিরে যান" : "Back to Login"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Email Input Form
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-ds-muted/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-ds-border/10 rounded-full blur-3xl"></div>
      </div>

      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="absolute top-6 right-6 z-20 flex items-center gap-2 px-3 py-2 rounded-xl bg-ds-surface/50 border border-ds-border/30 text-ds-text hover:bg-ds-surface transition-colors"
      >
        <HiOutlineGlobe className="w-4 h-4" />
        <span className="text-sm font-medium">{isBengali ? "EN" : "বাং"}</span>
      </button>

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-ds-surface/30 backdrop-blur-sm rounded-3xl border border-ds-border/30 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-6">
              <span className="text-3xl font-bold text-ds-text">
                Deutsch<span className="text-ds-muted">Shikhi</span>
              </span>
            </Link>

            <h1 className={`text-2xl font-bold text-ds-text mb-2 ${isBengali ? "font-bangla" : ""}`}>
              {isBengali ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot Password?"}
            </h1>

            <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
              {isBengali
                ? "চিন্তা নেই! আপনার ইমেইল দিন, আমরা রিসেট লিংক পাঠাব"
                : "No worries! Enter your email and we'll send you a reset link"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className={`block text-ds-text font-medium mb-2 ${isBengali ? "font-bangla" : ""}`}>
                {isBengali ? "ইমেইল ঠিকানা" : "Email Address"}
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ds-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isBengali ? "আপনার ইমেইল দিন" : "Enter your email"}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border transition-colors ${
                    isBengali ? "font-bangla" : ""
                  }`}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl bg-ds-text text-ds-bg font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isBengali ? "font-bangla" : ""
              }`}
            >
              {loading
                ? isBengali
                  ? "পাঠানো হচ্ছে..."
                  : "Sending..."
                : isBengali
                ? "রিসেট লিংক পাঠান"
                : "Send Reset Link"}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className={`inline-flex items-center gap-2 text-ds-muted hover:text-ds-text transition-colors ${
                isBengali ? "font-bangla" : ""
              }`}
            >
              <HiOutlineArrowLeft className="w-4 h-4" />
              {isBengali ? "লগইনে ফিরে যান" : "Back to Login"}
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <p className={`text-center text-ds-muted text-sm mt-6 ${isBengali ? "font-bangla" : ""}`}>
          {isBengali ? "অ্যাকাউন্ট নেই?" : "Don't have an account?"}{" "}
          <Link to="/register" className="text-ds-text hover:underline font-medium">
            {isBengali ? "নিবন্ধন করুন" : "Register"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
