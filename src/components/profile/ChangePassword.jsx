import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { AuthContext } from "../../context/AuthContext";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import toast from "react-hot-toast";
import {
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineShieldCheck,
  HiOutlineCheck,
  HiOutlineX,
} from "react-icons/hi";

const ChangePassword = () => {
  const { t } = useTranslation();
  const { isBengali } = useLanguage();
  const { user } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password validation rules
  const passwordRules = [
    {
      id: "minLength",
      label: isBengali ? "কমপক্ষে ৬ অক্ষর" : "At least 6 characters",
      test: (pw) => pw.length >= 6,
    },
    {
      id: "uppercase",
      label: isBengali ? "একটি বড় হাতের অক্ষর (A-Z)" : "One uppercase letter (A-Z)",
      test: (pw) => /[A-Z]/.test(pw),
    },
    {
      id: "lowercase",
      label: isBengali ? "একটি ছোট হাতের অক্ষর (a-z)" : "One lowercase letter (a-z)",
      test: (pw) => /[a-z]/.test(pw),
    },
    {
      id: "number",
      label: isBengali ? "একটি সংখ্যা (0-9)" : "One number (0-9)",
      test: (pw) => /[0-9]/.test(pw),
    },
    {
      id: "special",
      label: isBengali ? "একটি বিশেষ অক্ষর (!@#$%^&*)" : "One special character (!@#$%^&*)",
      test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
    },
  ];

  const isPasswordValid = passwordRules.every((rule) => rule.test(formData.newPassword));

  const doPasswordsMatch =
    formData.newPassword === formData.confirmPassword && formData.confirmPassword !== "";

  // Check if user signed in with Google (no password to change)
  const isGoogleUser = user?.providerData?.[0]?.providerId === "google.com";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.currentPassword) {
      toast.error(isBengali ? "বর্তমান পাসওয়ার্ড দিন" : "Enter current password");
      return;
    }

    if (!isPasswordValid) {
      toast.error(
        isBengali
          ? "নতুন পাসওয়ার্ড সব প্রয়োজনীয়তা পূরণ করেনি"
          : "New password doesn't meet all requirements"
      );
      return;
    }

    if (!doPasswordsMatch) {
      toast.error(isBengali ? "পাসওয়ার্ড মিলছে না" : "Passwords don't match");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error(
        isBengali
          ? "নতুন পাসওয়ার্ড বর্তমান পাসওয়ার্ড থেকে আলাদা হতে হবে"
          : "New password must be different from current password"
      );
      return;
    }

    setLoading(true);

    try {
      // Re-authenticate user first
      const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, formData.newPassword);

      toast.success(isBengali ? "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!" : "Password changed successfully!");

      closeModal();
    } catch (error) {
      console.error("Password change error:", error);

      switch (error.code) {
        case "auth/wrong-password":
          toast.error(isBengali ? "বর্তমান পাসওয়ার্ড ভুল" : "Current password is incorrect");
          break;
        case "auth/too-many-requests":
          toast.error(
            isBengali ? "অনেক বেশি চেষ্টা। পরে আবার চেষ্টা করুন" : "Too many attempts. Try again later"
          );
          break;
        case "auth/requires-recent-login":
          toast.error(isBengali ? "আবার লগইন করে চেষ্টা করুন" : "Please log out and log in again, then try");
          break;
        default:
          toast.error(
            isBengali
              ? "পাসওয়ার্ড পরিবর্তন ব্যর্থ। আবার চেষ্টা করুন"
              : "Failed to change password. Please try again"
          );
      }
    } finally {
      setLoading(false);
    }
  };

  // Google users can't change password
  if (isGoogleUser) {
    return (
      <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-ds-border/20 flex items-center justify-center flex-shrink-0">
            <HiOutlineLockClosed className="w-6 h-6 text-ds-muted" />
          </div>
          <div>
            <h3 className={`font-semibold text-ds-text mb-1 ${isBengali ? "font-bangla" : ""}`}>
              {isBengali ? "পাসওয়ার্ড পরিবর্তন" : "Change Password"}
            </h3>
            <p className={`text-sm text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
              {isBengali
                ? "আপনি Google দিয়ে সাইন ইন করেছেন। পাসওয়ার্ড পরিবর্তন করতে Google অ্যাকাউন্ট সেটিংস ব্যবহার করুন।"
                : "You signed in with Google. Use Google account settings to change your password."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Card */}
      <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <HiOutlineShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className={`font-semibold text-ds-text ${isBengali ? "font-bangla" : ""}`}>
                {isBengali ? "পাসওয়ার্ড পরিবর্তন" : "Change Password"}
              </h3>
              <p className={`text-sm text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                {isBengali ? "আপনার অ্যাকাউন্ট সুরক্ষিত রাখুন" : "Keep your account secure"}
              </p>
            </div>
          </div>

          <button
            onClick={openModal}
            className={`px-4 py-2 rounded-xl bg-ds-text text-ds-bg font-semibold hover:shadow-lg transition-all cursor-pointer ${
              isBengali ? "font-bangla" : ""
            }`}
          >
            {isBengali ? "পরিবর্তন করুন" : "Change"}
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>

          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-ds-surface rounded-3xl border border-ds-border/30 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-ds-border/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <HiOutlineShieldCheck className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className={`text-xl font-bold text-ds-text ${isBengali ? "font-bangla" : ""}`}>
                  {isBengali ? "পাসওয়ার্ড পরিবর্তন" : "Change Password"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg hover:bg-ds-bg/50 text-ds-muted hover:text-ds-text transition-colors cursor-pointer"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Current Password */}
              <div>
                <label
                  className={`block text-ds-text text-sm font-medium mb-2 ${isBengali ? "font-bangla" : ""}`}
                >
                  {isBengali ? "বর্তমান পাসওয়ার্ড" : "Current Password"}
                </label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ds-muted" />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder={isBengali ? "বর্তমান পাসওয়ার্ড দিন" : "Enter current password"}
                    className={`w-full pl-12 pr-12 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border transition-colors ${
                      isBengali ? "font-bangla" : ""
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ds-muted hover:text-ds-text cursor-pointer"
                  >
                    {showCurrentPassword ? (
                      <HiOutlineEyeOff className="w-5 h-5" />
                    ) : (
                      <HiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label
                  className={`block text-ds-text text-sm font-medium mb-2 ${isBengali ? "font-bangla" : ""}`}
                >
                  {isBengali ? "নতুন পাসওয়ার্ড" : "New Password"}
                </label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ds-muted" />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder={isBengali ? "নতুন পাসওয়ার্ড দিন" : "Enter new password"}
                    className={`w-full pl-12 pr-12 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border transition-colors ${
                      isBengali ? "font-bangla" : ""
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ds-muted hover:text-ds-text cursor-pointer"
                  >
                    {showNewPassword ? (
                      <HiOutlineEyeOff className="w-5 h-5" />
                    ) : (
                      <HiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Rules */}
                {formData.newPassword && (
                  <div className="mt-3 p-3 rounded-lg bg-ds-bg/50 space-y-1">
                    {passwordRules.map((rule) => {
                      const passed = rule.test(formData.newPassword);
                      return (
                        <div
                          key={rule.id}
                          className={`flex items-center gap-2 text-sm ${
                            passed ? "text-emerald-400" : "text-ds-muted"
                          }`}
                        >
                          {passed ? (
                            <HiOutlineCheck className="w-4 h-4" />
                          ) : (
                            <HiOutlineX className="w-4 h-4" />
                          )}
                          <span className={isBengali ? "font-bangla" : ""}>{rule.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  className={`block text-ds-text text-sm font-medium mb-2 ${isBengali ? "font-bangla" : ""}`}
                >
                  {isBengali ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm New Password"}
                </label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ds-muted" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={isBengali ? "নতুন পাসওয়ার্ড আবার দিন" : "Confirm new password"}
                    className={`w-full pl-12 pr-12 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border transition-colors ${
                      isBengali ? "font-bangla" : ""
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-ds-muted hover:text-ds-text cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <HiOutlineEyeOff className="w-5 h-5" />
                    ) : (
                      <HiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Match indicator */}
                {formData.confirmPassword && (
                  <div
                    className={`mt-2 flex items-center gap-2 text-sm ${
                      doPasswordsMatch ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {doPasswordsMatch ? (
                      <>
                        <HiOutlineCheck className="w-4 h-4" />
                        <span className={isBengali ? "font-bangla" : ""}>
                          {isBengali ? "পাসওয়ার্ড মিলেছে" : "Passwords match"}
                        </span>
                      </>
                    ) : (
                      <>
                        <HiOutlineX className="w-4 h-4" />
                        <span className={isBengali ? "font-bangla" : ""}>
                          {isBengali ? "পাসওয়ার্ড মিলছে না" : "Passwords don't match"}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`flex-1 py-3 rounded-xl border-2 border-ds-border/30 text-ds-text font-semibold hover:bg-ds-bg/50 transition-colors cursor-pointer ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {isBengali ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={loading || !isPasswordValid || !doPasswordsMatch}
                  className={`flex-1 py-3 rounded-xl bg-ds-text text-ds-bg font-semibold hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {loading
                    ? isBengali
                      ? "পরিবর্তন হচ্ছে..."
                      : "Changing..."
                    : isBengali
                    ? "পাসওয়ার্ড পরিবর্তন করুন"
                    : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChangePassword;
