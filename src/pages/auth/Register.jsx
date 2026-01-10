import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import registerSvg from "../../assets/register.svg";
import auth from "../../firebase/firebase.init";

const Register = () => {
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
    { label: "At least 6 characters", test: (p) => p.length >= 6 },
    { label: "One uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
    { label: "One lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
    { label: "One number (0-9)", test: (p) => /[0-9]/.test(p) },
    {
      label: "One special character (!@#$%^&*)",
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
      toast.error("Please upload a valid image (JPG, PNG, GIF, WEBP)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
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
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Image upload failed. Please try again.");
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
        toast.error("Please fill in all fields");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Please enter a valid email");
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
      toast.error("Password doesn't meet all requirements");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
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

      toast.success("Account created! Please check your email to verify.");
      navigate("/verify-email");
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use");
        setStep(1);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Welcome to DeutschShikhi!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Google sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
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
              <span className="text-ds-muted text-sm tracking-widest uppercase">Get Started</span>
            </div>

            <h1 className="text-4xl font-black text-ds-text mb-2">Create Account</h1>
            <p className="text-ds-muted">Start your German learning journey today</p>
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
            <div className="ml-4 text-ds-muted text-sm">Step {step} of 2</div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                {/* Name Field */}
                <div className="relative">
                  <label className="block text-ds-muted text-sm mb-2">Full Name</label>
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
                      placeholder="Enter your name"
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent py-4 pl-12 pr-4 text-ds-text placeholder:text-ds-border focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="relative">
                  <label className="block text-ds-muted text-sm mb-2">Email Address</label>
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
                  <label className="block text-ds-muted text-sm mb-2">
                    Profile Photo <span className="text-ds-border">(optional)</span>
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
                          <div className="flex items-center justify-center gap-2 text-ds-muted">
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
                            <span>Uploading...</span>
                          </div>
                        ) : (
                          <>
                            <HiOutlinePhotograph className="w-8 h-8 mx-auto text-ds-border mb-2" />
                            <p className="text-ds-muted text-sm">Click or drag to upload image</p>
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
                  className="group w-full py-4 rounded-xl bg-ds-text text-ds-bg font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-ds-muted/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* Step 2: Password */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                {/* Password Field */}
                <div className="relative">
                  <label className="block text-ds-muted text-sm mb-2">Password</label>
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
                      placeholder="Create a password"
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
                          <span className="text-xs text-ds-muted">Password Strength</span>
                          <span
                            className={`text-xs font-medium ${
                              passwordStrength <= 2
                                ? "text-red-400"
                                : passwordStrength <= 3
                                ? "text-yellow-400"
                                : passwordStrength <= 4
                                ? "text-blue-400"
                                : "text-green-400"
                            }`}
                          >
                            {passwordStrength <= 2
                              ? "Weak"
                              : passwordStrength <= 3
                              ? "Fair"
                              : passwordStrength <= 4
                              ? "Good"
                              : "Strong"}
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
                                passed ? "text-green-400" : "text-ds-muted"
                              }`}
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
                  <label className="block text-ds-muted text-sm mb-2">Confirm Password</label>
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
                      placeholder="Confirm your password"
                      onFocus={() => setFocusedField("confirmPassword")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent py-4 pl-12 pr-4 text-ds-text placeholder:text-ds-border focus:outline-none"
                    />
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <HiOutlineCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                    )}
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-400 text-xs mt-2">Passwords don't match</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex-1 py-4 rounded-xl border-2 border-ds-border/30 text-ds-text font-semibold flex items-center justify-center gap-2 hover:bg-ds-surface/30 transition-all"
                  >
                    <HiOutlineArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex-[2] py-4 rounded-xl bg-ds-text text-ds-bg font-bold text-lg overflow-hidden relative transition-all hover:shadow-xl hover:shadow-ds-muted/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          Creating...
                        </span>
                      ) : (
                        "Create Account"
                      )}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-ds-border/30"></div>
              <span className="text-ds-muted text-sm">or</span>
              <div className="flex-1 h-px bg-ds-border/30"></div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full py-4 rounded-xl border-2 border-ds-border/30 text-ds-text font-semibold flex items-center justify-center gap-3 hover:bg-ds-surface/30 hover:border-ds-border transition-all disabled:opacity-50"
            >
              <FcGoogle className="w-6 h-6" />
              Continue with Google
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-ds-muted">
            Already have an account?{" "}
            <Link to="/login" className="text-ds-text font-semibold hover:underline">
              Sign in
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
          <h2 className="text-3xl font-bold text-ds-text mb-3">Join DeutschShikhi</h2>
          <p className="text-ds-muted mb-2">Start your German learning journey</p>
          <p className="text-ds-muted font-bangla">আজই জার্মান শেখা শুরু করুন</p>

          {/* Features List */}
          <div className="mt-10 space-y-4 text-left max-w-xs mx-auto">
            {[
              { icon: "🎯", text: "Structured A1-A2 curriculum" },
              { icon: "🔊", text: "Native German pronunciation" },
              { icon: "📱", text: "Learn on any device" },
              { icon: "🆓", text: "100% free, forever" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 rounded-xl bg-ds-bg/30 backdrop-blur border border-ds-border/20"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-ds-text">{item.text}</span>
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
