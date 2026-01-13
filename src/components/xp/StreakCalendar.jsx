import { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { HiOutlineFire } from "react-icons/hi";

/**
 * Streak Calendar Component
 * Shows last 7 days with activity indicators
 */
const StreakCalendar = ({ streak, activityDates = [] }) => {
  const { t } = useTranslation();

  // Generate last 7 days
  const last7Days = useMemo(() => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dateStr = date.toISOString().split("T")[0];
      const isActive = activityDates.some((d) => {
        const actDate = new Date(d);
        actDate.setHours(0, 0, 0, 0);
        return actDate.toISOString().split("T")[0] === dateStr;
      });

      days.push({
        date,
        dateStr,
        dayName: date.toLocaleDateString("en", { weekday: "short" }),
        dayNum: date.getDate(),
        isToday: i === 0,
        isActive,
      });
    }

    return days;
  }, [activityDates]);

  return (
    <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HiOutlineFire className={`w-5 h-5 ${streak.isActive ? "text-orange-400" : "text-ds-muted"}`} />
          <h3 className="text-ds-text font-medium">{t("xp.weeklyActivity", "Weekly Activity")}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-orange-400">{streak.current}</span>
          <span className="text-ds-muted text-sm">{t("xp.dayStreak", "day streak")}</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {last7Days.map((day, index) => (
          <motion.div
            key={day.dateStr}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col items-center"
          >
            {/* Day name */}
            <span className="text-xs text-ds-muted mb-1">{day.dayName}</span>

            {/* Day circle */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center relative ${
                day.isActive
                  ? "bg-orange-500"
                  : day.isToday
                  ? "bg-ds-border/50 border-2 border-dashed border-orange-400"
                  : "bg-ds-bg/50"
              }`}
            >
              {day.isActive ? (
                <HiOutlineFire className="w-5 h-5 text-white" />
              ) : (
                <span className={`text-sm ${day.isToday ? "text-orange-400 font-bold" : "text-ds-muted"}`}>
                  {day.dayNum}
                </span>
              )}

              {/* Today indicator */}
              {day.isToday && !day.isActive && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -bottom-1 w-1.5 h-1.5 bg-orange-400 rounded-full"
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Streak warning */}
      {streak.willExpireToday && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/30"
        >
          <p className="text-orange-400 text-sm text-center">
            ⚠️ {t("xp.streakWarning", "Practice today to keep your streak!")}
          </p>
        </motion.div>
      )}

      {/* Longest streak */}
      {streak.longest > streak.current && (
        <p className="text-center text-ds-muted text-xs mt-3">
          {t("xp.longestStreak", "Longest streak")}: {streak.longest} {t("xp.days", "days")}
        </p>
      )}
    </div>
  );
};

export default StreakCalendar;
