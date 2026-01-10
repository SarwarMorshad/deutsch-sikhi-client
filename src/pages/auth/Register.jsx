import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
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
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

const Register = () => {
  const { createUser, updateUserProfile, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
    confirmPassword: "",
  });

  // Password strength
  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // Create user
      await createUser(formData.email, formData.password);

      // Update profile
      await updateUserProfile(formData.name, formData.photoURL);

      toast.success("Account created successfully!");
      navigate("/");
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
      await googleSignIn();
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

                {/* Photo URL Field (Optional) */}
                <div className="relative">
                  <label className="block text-ds-muted text-sm mb-2">
                    Photo URL <span className="text-ds-border">(optional)</span>
                  </label>
                  <div
                    className={`relative rounded-xl border-2 transition-all duration-300 ${
                      focusedField === "photoURL"
                        ? "border-ds-muted shadow-lg shadow-ds-muted/10"
                        : "border-ds-border/30"
                    }`}
                  >
                    <HiOutlinePhotograph
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                        focusedField === "photoURL" ? "text-ds-muted" : "text-ds-border"
                      }`}
                    />
                    <input
                      type="url"
                      name="photoURL"
                      value={formData.photoURL}
                      onChange={handleChange}
                      placeholder="https://example.com/photo.jpg"
                      onFocus={() => setFocusedField("photoURL")}
                      onBlur={() => setFocusedField(null)}
                      className="w-full bg-transparent py-4 pl-12 pr-4 text-ds-text placeholder:text-ds-border focus:outline-none"
                    />
                  </div>
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="group w-full py-4 rounded-xl bg-ds-text text-ds-bg font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-ds-muted/20 transition-all"
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

                  {/* Password Strength */}
                  {formData.password && (
                    <div className="mt-3">
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-all ${
                              passwordStrength >= level
                                ? passwordStrength <= 2
                                  ? "bg-red-400"
                                  : passwordStrength <= 3
                                  ? "bg-yellow-400"
                                  : "bg-green-400"
                                : "bg-ds-border/30"
                            }`}
                          ></div>
                        ))}
                      </div>
                      <p className="text-xs text-ds-muted">
                        {passwordStrength <= 2
                          ? "Weak password"
                          : passwordStrength <= 3
                          ? "Good password"
                          : "Strong password"}
                      </p>
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

      {/* Right Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-ds-surface/50 to-ds-bg relative overflow-hidden items-center justify-center">
        {/* Gradient Orbs */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-ds-muted/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-ds-border/10 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-12">
          {/* Illustration / Stats */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-ds-bg/50 backdrop-blur border border-ds-border/30 mb-6">
              <span className="text-6xl">🚀</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-ds-text mb-4">Join Our Community</h2>
          <p className="text-ds-muted mb-8 max-w-sm mx-auto">
            Learn German with thousands of Bengali speakers worldwide.
          </p>

          {/* Features List */}
          <div className="space-y-4 text-left max-w-xs mx-auto">
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
