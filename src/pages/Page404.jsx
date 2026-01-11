import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguage from "../hooks/useLanguage";
import { HiOutlineHome, HiOutlineBookOpen, HiOutlineArrowLeft } from "react-icons/hi";

const Page404 = () => {
  const { t } = useTranslation();
  const { isBengali } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Elements */}
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
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ds-muted/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-ds-border/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      {/* Floating German Letters */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute top-[10%] left-[10%] text-8xl font-bold text-ds-border/10 animate-float">
          ä
        </span>
        <span className="absolute top-[20%] right-[15%] text-7xl font-bold text-ds-border/10 animate-float delay-500">
          ö
        </span>
        <span className="absolute bottom-[30%] left-[20%] text-9xl font-bold text-ds-border/10 animate-float delay-1000">
          ü
        </span>
        <span className="absolute bottom-[15%] right-[10%] text-6xl font-bold text-ds-border/10 animate-float delay-700">
          ß
        </span>
      </div>

      <div className="relative z-10 text-center max-w-lg">
        {/* 404 Number */}
        <div className="relative mb-8">
          <h1 className="text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-br from-ds-muted via-ds-border to-ds-muted leading-none select-none">
            404
          </h1>
          {/* German Word Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-ds-text/80 bg-ds-bg/80 px-4 py-2 rounded-lg backdrop-blur-sm">
              Nicht gefunden!
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className={`text-3xl font-bold text-ds-text mb-4 ${isBengali ? "font-bangla" : ""}`}>
          {t("error.pageNotFound")}
        </h2>

        {/* Description */}
        <p className={`text-ds-muted mb-2 ${isBengali ? "font-bangla" : ""}`}>
          {t("error.pageNotFoundDesc")}
        </p>
        <p className={`text-ds-muted mb-8 ${isBengali ? "" : "font-bangla"}`}>
          {isBengali
            ? "The page you're looking for doesn't exist or has been moved."
            : "আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই বা সরানো হয়েছে।"}
        </p>

        {/* German Learning Tip */}
        <div className="bg-ds-surface/50 border border-ds-border/30 rounded-xl p-4 mb-8">
          <p className="text-ds-muted text-sm mb-1">
            🇩🇪 <span className={isBengali ? "font-bangla" : ""}>{t("error.germanTip")}</span>
          </p>
          <p className="text-ds-text font-medium">
            "Nicht gefunden" ={" "}
            <span className={`${isBengali ? "font-bangla" : ""}`}>
              {isBengali ? "পাওয়া যায়নি" : "Not found"}
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className={`group flex items-center gap-2 px-6 py-3 bg-ds-text text-ds-bg font-semibold rounded-xl hover:shadow-lg hover:shadow-ds-muted/20 transition-all ${
              isBengali ? "font-bangla" : ""
            }`}
          >
            <HiOutlineHome className="w-5 h-5" />
            {t("error.goHome")}
          </Link>

          <Link
            to="/courses"
            className={`group flex items-center gap-2 px-6 py-3 border-2 border-ds-border/30 text-ds-text font-semibold rounded-xl hover:bg-ds-surface/50 hover:border-ds-border transition-all ${
              isBengali ? "font-bangla" : ""
            }`}
          >
            <HiOutlineBookOpen className="w-5 h-5" />
            {t("error.browseCourses")}
          </Link>
        </div>

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className={`mt-6 inline-flex items-center gap-2 text-ds-muted hover:text-ds-text transition-colors ${
            isBengali ? "font-bangla" : ""
          }`}
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          {t("error.goBack")}
        </button>
      </div>

      {/* CSS for floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
};

export default Page404;
