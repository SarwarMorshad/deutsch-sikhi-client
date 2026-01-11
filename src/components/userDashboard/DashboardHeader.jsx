import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { HiOutlineFire, HiOutlineSparkles, HiOutlineSun, HiOutlineMoon } from "react-icons/hi";

const DashboardHeader = ({ user, streak = 0 }) => {
  const { t } = useTranslation();
  const { isBengali } = useLanguage();

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return {
        text: isBengali ? "সুপ্রভাত" : "Good Morning",
        icon: HiOutlineSun,
        emoji: "☀️",
      };
    } else if (hour < 18) {
      return {
        text: isBengali ? "শুভ অপরাহ্ন" : "Good Afternoon",
        icon: HiOutlineSun,
        emoji: "🌤️",
      };
    } else {
      return {
        text: isBengali ? "শুভ সন্ধ্যা" : "Good Evening",
        icon: HiOutlineMoon,
        emoji: "🌙",
      };
    }
  };

  const greeting = getGreeting();
  const displayName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Learner";

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      {/* Welcome Message */}
      <div>
        <div className={`flex items-center gap-2 text-ds-muted mb-1 ${isBengali ? "font-bangla" : ""}`}>
          <span>{greeting.emoji}</span>
          <span>{greeting.text}</span>
        </div>
        <h1 className={`text-3xl md:text-4xl font-black text-ds-text ${isBengali ? "font-bangla" : ""}`}>
          {isBengali ? `স্বাগতম, ${displayName}!` : `Welcome back, ${displayName}!`}
        </h1>
        <p className={`text-ds-muted mt-1 ${isBengali ? "font-bangla" : ""}`}>
          {isBengali
            ? "আজ আপনার জার্মান শেখার যাত্রা চালিয়ে যান"
            : "Continue your German learning journey today"}
        </p>
      </div>

      {/* Streak Badge */}
      <div className="flex items-center gap-4">
        <div
          className={`flex items-center gap-3 px-5 py-3 rounded-2xl ${
            streak > 0
              ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30"
              : "bg-ds-surface/50 border border-ds-border/30"
          }`}
        >
          <div className={`p-2 rounded-xl ${streak > 0 ? "bg-orange-500/20" : "bg-ds-bg/50"}`}>
            <HiOutlineFire className={`w-6 h-6 ${streak > 0 ? "text-orange-400" : "text-ds-muted"}`} />
          </div>
          <div>
            <div className={`text-2xl font-bold ${streak > 0 ? "text-orange-400" : "text-ds-text"}`}>
              {streak}
            </div>
            <div
              className={`text-xs ${streak > 0 ? "text-orange-400/70" : "text-ds-muted"} ${
                isBengali ? "font-bangla" : ""
              }`}
            >
              {isBengali ? "দিনের স্ট্রিক" : "Day Streak"}
            </div>
          </div>
        </div>

        {/* Motivational Badge */}
        {streak >= 7 && (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30">
            <HiOutlineSparkles className="w-5 h-5 text-yellow-400" />
            <span className={`text-sm font-medium text-yellow-400 ${isBengali ? "font-bangla" : ""}`}>
              {isBengali ? "দারুণ!" : "On Fire!"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
