import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { AuthContext } from "../../context/AuthContext";
import { sendEmailVerification } from "firebase/auth";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineUser,
  HiOutlinePhotograph,
  HiOutlineCheck,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlineX,
  HiOutlineGlobe,
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import registerSvg from "../../assets/register.svg";
import { authAPI } from "../../utils/api";

const Register = () => {
  const { t, i18n } = useTranslation();
  const { isBengali } = useLanguage();
  const { createUser, updateUserProfile, signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
    confirmPassword: "",
  });

  // ImgBB API Key from environment variable
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  // Password validation rules
  const passwordRules = [
    { label: t("auth.register.passwordRules.minLength"), test: (p) => p.length >= 6 },
    { label: t("auth.register.passwordRules.uppercase"), test: (p) => /[A-Z]/.test(p) },
    { label: t("auth.register.passwordRules.lowercase"), test: (p) => /[a-z]/.test(p) },
    { label: t("auth.register.passwordRules.number"), test: (p) => /[0-9]/.test(p) },
    {
      label: t("auth.register.passwordRules.special"),
      test: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p),
    },
  ];

  // Check which rules pass
  const passedRules = passwordRules.filter((rule) => rule.test(formData.password));
  const passwordStrength = passedRules.length;
  const isPasswordValid = passwordStrength === passwordRules.length;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Image Upload to ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error(t("auth.register.errors.invalidImage"));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("auth.register.errors.imageTooLarge"));
      return;
    }

    setImageUploading(true);

    try {
      const formDataImg = new FormData();
      formDataImg.append("image", file);

      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formDataImg,
      });

      const data = await response.json();

      if (data.success) {
        setFormData({ ...formData, photoURL: data.data.display_url });
        setImagePreview(data.data.display_url);
        toast.success(t("auth.register.imageUploaded"));
      } else {
        toast.error(t("auth.register.errors.uploadFailed"));
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(t("auth.register.errors.uploadFailed"));
    } finally {
      setImageUploading(false);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setFormData({ ...formData, photoURL: "" });
    setImagePreview(null);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email) {
        toast.error(t("auth.register.errors.fillAllFields"));
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error(t("auth.register.errors.invalidEmail"));
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error(t("auth.register.errors.passwordRequirements"));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(t("auth.register.errors.passwordMismatch"));
      return;
    }

    setLoading(true);

    try {
      // Create user
      const result = await createUser(formData.email, formData.password);

      // Update profile
      await updateUserProfile(formData.name, formData.photoURL);

      // Send email verification
      await sendEmailVerification(result.user);

      toast.success(t("auth.register.accountCreated"));
      navigate("/verify-email");
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        toast.error(t("auth.register.errors.emailInUse"));
        setStep(1);
      } else {
        toast.error(t("auth.register.errors.registrationFailed"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();

      // Save user to database
      try {
        await authAPI.register({
          name: result.user.displayName || "",
          photoURL: result.user.photoURL || "",
        });
      } catch (error) {
        // If user already exists, that's fine (returning user)
        const errorMsg = error.response?.data?.message || error.message;
        if (errorMsg !== "User already registered.") {
          console.error("Error saving user:", errorMsg);
        }
      }

      toast.success(t("toast.welcomeToDeutschShikhi"));
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(t("auth.errors.googleFailed"));
    } finally {
      setLoading(false);
    }
  };

  // Password strength labels
  const getStrengthLabel = () => {
    if (passwordStrength <= 2) return isBengali ? "দুর্বল" : "Weak";
    if (passwordStrength <= 3) return isBengali ? "মোটামুটি" : "Fair";
    if (passwordStrength <= 4) return isBengali ? "ভালো" : "Good";
    return isBengali ? "শক্তিশালী" : "Strong";
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
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

        {/* Background Pattern */}
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
          {/* Header */}
          <div className="mb-8">
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
                {t("auth.register.getStarted")}
              </span>
            </div>

            <h1 className={`text-4xl font-black text-ds-text mb-2 ${isBengali ? "font-bangla" : ""}`}>
              {t("auth.register.createAccount")}
            </h1>
            <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
              {t("auth.register.startJourney")}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-10">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    step >= s
                      ? "bg-gradient-to-r from-ds-muted to-ds-border text-ds-bg"
                      : "bg-ds-surface/50 text-ds-muted"
                  }`}
                >
                  {step > s ? <HiOutlineCheck className="w-5 h-5" /> : s}
                </div>
                {s < 2 && (
                  <div
                    className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${
                      step > s ? "bg-gradient-to-r from-ds-muted to-ds-border" : "bg-ds-surface/50"
                    }`}
                  ></div>
                )}
              </div>
            ))}
            <div className={`ml-4 text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
              {t("auth.register.step")} {step} {t("auth.register.of")} 2
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                {/* Name Field */}
                <div className="relative">
                  <label className={`block text-ds-muted text-sm mb-2 ${isBengali ? "font-bangla" : ""}`}>
                    {t("auth.register.fullName")}
                  </label>
                  <div
                    className={`relative rounded-xl border-2 transition-all duration-300 ${
                      focusedField === "name"
                        ? "border-ds-muted shadow-lg shadow-ds-muted/10"
                        : "border-ds-border/30"
                    }`}
                  >
                    <HiOutlineUser
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedField === "name" ? "text-ds-muted" : "text-ds-border"
                      }`}
                    />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder={isBengali ? "আপনার নাম লিখুন" : "Enter your name"}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent py-4 pl-12 pr-4 text-ds-text placeholder:text-ds-border focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="relative">
                  <label className={`block text-ds-muted text-sm mb-2 ${isBengali ? "font-bangla" : ""}`}>
                    {t("auth.register.email")}
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
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent py-4 pl-12 pr-4 text-ds-text placeholder:text-ds-border focus:outline-none"
                    />
                  </div>
                </div>

                {/* Photo Upload Field */}
                <div className="relative">
                  <label className={`block text-ds-muted text-sm mb-2 ${isBengali ? "font-bangla" : ""}`}>
                    {t("auth.register.profilePhoto")}{" "}
                    <span className="text-ds-border">({t("common.optional")})</span>
                  </label>

                  {/* Image Preview */}
                  {imagePreview ? (
                    <div className="relative inline-block mb-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-xl object-cover border-2 border-ds-border/30"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <HiOutlineX className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`relative rounded-xl border-2 border-dashed transition-all duration-300 ${
                        focusedField === "photo" ? "border-ds-muted bg-ds-muted/5" : "border-ds-border/30"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        onFocus={() => setFocusedField("photo")}
                        onBlur={() => setFocusedField(null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={imageUploading}
                      />
                      <div className="py-6 px-4 text-center">
                        {imageUploading ? (
                          <div
                            className={`flex items-center justify-center gap-2 text-ds-muted ${
                              isBengali ? "font-bangla" : ""
                            }`}
                          >
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
                            <span>{t("common.uploading")}</span>
                          </div>
                        ) : (
                          <>
                            <HiOutlinePhotograph className="w-8 h-8 mx-auto text-ds-border mb-2" />
                            <p className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                              {t("auth.register.clickToUpload")}
                            </p>
                            <p className="text-ds-border text-xs mt-1">JPG, PNG, GIF, WEBP (max 5MB)</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={imageUploading}
                  className={`group w-full py-4 rounded-xl bg-ds-text text-ds-bg font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-ds-muted/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {t("common.continue")}
                  <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                {/* Password Field */}
                <div className="relative">
                  <label className={`block text-ds-muted text-sm mb-2 ${isBengali ? "font-bangla" : ""}`}>
                    {t("auth.register.password")}
                  </label>
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
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder={isBengali ? "একটি পাসওয়ার্ড তৈরি করুন" : "Create a password"}
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

                  {/* Password Strength & Rules */}
                  {formData.password && (
                    <div className="mt-4 space-y-3">
                      {/* Strength Bar */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-xs text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                            {t("auth.register.passwordStrength")}
                          </span>
                          <span
                            className={`text-xs font-medium ${isBengali ? "font-bangla" : ""} ${
                              passwordStrength <= 2
                                ? "text-red-400"
                                : passwordStrength <= 3
                                ? "text-yellow-400"
                                : passwordStrength <= 4
                                ? "text-blue-400"
                                : "text-green-400"
                            }`}
                          >
                            {getStrengthLabel()}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1.5 flex-1 rounded-full transition-all ${
                                passwordStrength >= level
                                  ? passwordStrength <= 2
                                    ? "bg-red-400"
                                    : passwordStrength <= 3
                                    ? "bg-yellow-400"
                                    : passwordStrength <= 4
                                    ? "bg-blue-400"
                                    : "bg-green-400"
                                  : "bg-ds-border/30"
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>

                      {/* Validation Checklist */}
                      <div className="bg-ds-surface/30 rounded-xl p-4 space-y-2">
                        {passwordRules.map((rule, index) => {
                          const passed = rule.test(formData.password);
                          return (
                            <div
                              key={index}
                              className={`flex items-center gap-2 text-sm transition-all ${
                                isBengali ? "font-bangla" : ""
                              } ${passed ? "text-green-400" : "text-ds-muted"}`}
                            >
                              {passed ? (
                                <HiOutlineCheck className="w-4 h-4 flex-shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-ds-border/50 flex-shrink-0"></div>
                              )}
                              <span className={passed ? "line-through opacity-70" : ""}>{rule.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="relative">
                  <label className={`block text-ds-muted text-sm mb-2 ${isBengali ? "font-bangla" : ""}`}>
                    {t("auth.register.confirmPassword")}
                  </label>
                  <div
                    className={`relative rounded-xl border-2 transition-all duration-300 ${
                      focusedField === "confirmPassword"
                        ? "border-ds-muted shadow-lg shadow-ds-muted/10"
                        : formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? "border-red-400"
                        : "border-ds-border/30"
                    }`}
                  >
                    <HiOutlineLockClosed
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedField === "confirmPassword" ? "text-ds-muted" : "text-ds-border"
                      }`}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder={isBengali ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm your password"}
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent py-4 pl-12 pr-4 text-ds-text placeholder:text-ds-border focus:outline-none"
                    />
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <HiOutlineCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                    )}
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className={`text-red-400 text-xs mt-2 ${isBengali ? "font-bangla" : ""}`}>
                      {t("auth.register.errors.passwordMismatch")}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className={`flex-1 py-4 rounded-xl border-2 border-ds-border/30 text-ds-text font-semibold flex items-center justify-center gap-2 hover:bg-ds-surface/30 transition-all ${
                      isBengali ? "font-bangla" : ""
                    }`}
                  >
                    <HiOutlineArrowLeft className="w-5 h-5" />
                    {t("common.back")}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`group flex-[2] py-4 rounded-xl bg-ds-text text-ds-bg font-bold text-lg overflow-hidden relative transition-all hover:shadow-xl hover:shadow-ds-muted/20 disabled:opacity-50 disabled:cursor-not-allowed ${
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
                          {t("auth.register.creating")}
                        </span>
                      ) : (
                        t("auth.register.createAccount")
                      )}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-ds-border/30"></div>
              <span className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                {t("common.or")}
              </span>
              <div className="flex-1 h-px bg-ds-border/30"></div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={loading}
              className={`w-full py-4 rounded-xl border-2 border-ds-border/30 text-ds-text font-semibold flex items-center justify-center gap-3 hover:bg-ds-surface/30 hover:border-ds-border transition-all disabled:opacity-50 ${
                isBengali ? "font-bangla" : ""
              }`}
            >
              <FcGoogle className="w-6 h-6" />
              {t("auth.register.continueWithGoogle")}
            </button>
          </form>

          {/* Login Link */}
          <p className={`mt-8 text-center text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
            {t("auth.register.haveAccount")}{" "}
            <Link to="/login" className="text-ds-text font-semibold hover:underline">
              {t("auth.register.signIn")}
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-ds-surface/40 to-ds-bg relative overflow-hidden items-center justify-center">
        {/* Gradient Orbs */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-ds-muted/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-ds-border/10 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-12">
          {/* SVG Illustration */}
          <div className="mb-10">
            <img
              src={registerSvg}
              alt="Register illustration"
              className="w-80 h-80 mx-auto drop-shadow-2xl"
            />
          </div>

          {/* Text */}
          <h2 className={`text-3xl font-bold text-ds-text mb-3 ${isBengali ? "font-bangla" : ""}`}>
            {t("auth.register.joinDeutschShikhi")}
          </h2>
          <p className={`text-ds-muted mb-2 ${isBengali ? "font-bangla" : ""}`}>
            {t("auth.register.startJourney")}
          </p>
          <p className={`text-ds-muted ${isBengali ? "" : "font-bangla"}`}>
            {isBengali ? "Start your German learning journey" : "আজই জার্মান শেখা শুরু করুন"}
          </p>

          {/* Features List */}
          <div className="mt-10 space-y-4 text-left max-w-xs mx-auto">
            {[
              { icon: "🎯", textKey: "feature1" },
              { icon: "🔊", textKey: "feature2" },
              { icon: "📱", textKey: "feature3" },
              { icon: "🆓", textKey: "feature4" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 rounded-xl bg-ds-bg/30 backdrop-blur border border-ds-border/20"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className={`text-ds-text ${isBengali ? "font-bangla" : ""}`}>
                  {t(`auth.register.features.${item.textKey}`)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Line */}
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-ds-border/30 to-transparent"></div>
      </div>
    </div>
  );
};

export default Register;
