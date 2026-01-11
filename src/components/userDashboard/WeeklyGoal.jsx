import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { HiOutlineCalendar, HiOutlineCheck, HiOutlineTrendingUp } from "react-icons/hi";

const WeeklyGoal = ({ completedThisWeek = 0, weeklyGoal = 5 }) => {
  const { t } = useTranslation();
  const { isBengali } = useLanguage();

  const percentage = Math.min((completedThisWeek / weeklyGoal) * 100, 100);
  const isGoalMet = completedThisWeek >= weeklyGoal;

  // Days of week
  const days = isBengali
    ? ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"]
    : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const today = new Date().getDay();

  // Simulated activity for the week (in real app, this would come from backend)
  // For demo, assume user completed lessons on some days
  const weekActivity = Array(7)
    .fill(false)
    .map((_, i) => {
      if (i < today) {
        return Math.random() > 0.4; // Random activity for past days
      }
      return false;
    });

  return (
    <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold text-ds-text ${isBengali ? "font-bangla" : ""}`}>
          {isBengali ? "সাপ্তাহিক লক্ষ্য" : "Weekly Goal"}
        </h2>
        <HiOutlineCalendar className="w-5 h-5 text-ds-muted" />
      </div>

      {/* Progress Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-ds-border/30"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#aec3b0" />
                <stop offset="100%" stopColor="#598392" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isGoalMet ? (
              <HiOutlineCheck className="w-10 h-10 text-emerald-400" />
            ) : (
              <>
                <span className="text-3xl font-black text-ds-text">{completedThisWeek}</span>
                <span className="text-sm text-ds-muted">/ {weeklyGoal}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center mb-6">
        {isGoalMet ? (
          <div className="flex items-center justify-center gap-2 text-emerald-400">
            <HiOutlineTrendingUp className="w-5 h-5" />
            <span className={`font-semibold ${isBengali ? "font-bangla" : ""}`}>
              {isBengali ? "লক্ষ্য অর্জিত! 🎉" : "Goal Achieved! 🎉"}
            </span>
          </div>
        ) : (
          <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
            {isBengali
              ? `আরও ${weeklyGoal - completedThisWeek}টি পাঠ বাকি`
              : `${weeklyGoal - completedThisWeek} more lessons to go`}
          </p>
        )}
      </div>

      {/* Week Days */}
      <div className="flex justify-between">
        {days.map((day, index) => {
          const isToday = index === today;
          const isActive = weekActivity[index];
          const isPast = index < today;

          return (
            <div key={day} className="flex flex-col items-center gap-2">
              <span
                className={`text-xs ${isToday ? "text-ds-text font-semibold" : "text-ds-muted"} ${
                  isBengali ? "font-bangla" : ""
                }`}
              >
                {day}
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  isActive
                    ? "bg-gradient-to-br from-ds-muted to-ds-border text-ds-bg"
                    : isToday
                    ? "bg-ds-text/20 border-2 border-ds-text text-ds-text"
                    : isPast
                    ? "bg-ds-surface text-ds-border"
                    : "bg-ds-surface/50 text-ds-border/50"
                }`}
              >
                {isActive ? (
                  <HiOutlineCheck className="w-4 h-4" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-current opacity-30"></span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyGoal;
