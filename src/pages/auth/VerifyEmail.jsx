import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { sendEmailVerification } from "firebase/auth";
import { HiOutlineMail, HiOutlineRefresh, HiOutlineCheckCircle, HiOutlineLogout } from "react-icons/hi";
import toast from "react-hot-toast";

const VerifyEmail = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Check if already verified
  useEffect(() => {
    if (user?.emailVerified) {
      navigate("/");
    }
  }, [user, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Resend verification email
  const handleResend = async () => {
    if (!user || countdown > 0) return;

    setResending(true);
    try {
      await sendEmailVerification(user);
      toast.success("Verification email sent!");
      setCountdown(60); // 60 second cooldown
    } catch (error) {
      console.error(error);
      if (error.code === "auth/too-many-requests") {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error("Failed to send email. Please try again.");
      }
    } finally {
      setResending(false);
    }
  };

  // Refresh to check verification status
  const handleRefresh = async () => {
    if (user) {
      await user.reload();
      if (user.emailVerified) {
        toast.success("Email verified successfully!");
        navigate("/");
      } else {
        toast.error("Email not verified yet. Please check your inbox.");
      }
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative">
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

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ds-muted/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ds-border/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="inline-block mb-8">
          <span className="text-2xl font-bold text-ds-text">
            Deutsch<span className="text-ds-muted">Shikhi</span>
          </span>
        </Link>

        {/* Card */}
        <div className="bg-ds-surface/30 backdrop-blur-sm border border-ds-border/30 rounded-2xl p-8">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-ds-muted/20 flex items-center justify-center">
            <HiOutlineMail className="w-10 h-10 text-ds-muted" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-ds-text text-center mb-2">Verify Your Email</h1>
          <p className="text-ds-muted text-center mb-6">We've sent a verification link to</p>

          {/* Email Display */}
          <div className="bg-ds-bg/50 rounded-xl px-4 py-3 mb-6 text-center">
            <span className="text-ds-text font-medium">{user?.email}</span>
          </div>

          {/* Instructions */}
          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3 text-sm text-ds-muted">
              <span className="w-6 h-6 rounded-full bg-ds-surface flex items-center justify-center text-ds-text font-bold text-xs flex-shrink-0">
                1
              </span>
              <span>Check your email inbox (and spam folder)</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-ds-muted">
              <span className="w-6 h-6 rounded-full bg-ds-surface flex items-center justify-center text-ds-text font-bold text-xs flex-shrink-0">
                2
              </span>
              <span>Click the verification link in the email</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-ds-muted">
              <span className="w-6 h-6 rounded-full bg-ds-surface flex items-center justify-center text-ds-text font-bold text-xs flex-shrink-0">
                3
              </span>
              <span>Come back here and click "I've Verified"</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            {/* Verify Button */}
            <button
              onClick={handleRefresh}
              className="group w-full py-4 rounded-xl bg-ds-text text-ds-bg font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-ds-muted/20 transition-all"
            >
              <HiOutlineCheckCircle className="w-5 h-5" />
              I've Verified My Email
            </button>

            {/* Resend Button */}
            <button
              onClick={handleResend}
              disabled={resending || countdown > 0}
              className="w-full py-3 rounded-xl border-2 border-ds-border/30 text-ds-text font-semibold flex items-center justify-center gap-2 hover:bg-ds-surface/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiOutlineRefresh className={`w-5 h-5 ${resending ? "animate-spin" : ""}`} />
              {countdown > 0
                ? `Resend in ${countdown}s`
                : resending
                ? "Sending..."
                : "Resend Verification Email"}
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-ds-border/30"></div>
            <span className="text-ds-muted text-sm">or</span>
            <div className="flex-1 h-px bg-ds-border/30"></div>
          </div>

          {/* Logout / Use different email */}
          <button
            onClick={handleLogout}
            className="w-full py-3 text-ds-muted text-sm flex items-center justify-center gap-2 hover:text-ds-text transition-colors"
          >
            <HiOutlineLogout className="w-4 h-4" />
            Sign out and use a different email
          </button>
        </div>

        {/* Help Text */}
        <p className="mt-6 text-center text-ds-muted text-sm">
          Didn't receive the email? Check your spam folder or{" "}
          <button
            onClick={handleResend}
            disabled={countdown > 0}
            className="text-ds-text hover:underline disabled:opacity-50"
          >
            click here to resend
          </button>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
