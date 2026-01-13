import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { HiOutlineFire, HiOutlineLightningBolt, HiOutlineTrendingUp, HiOutlineStar } from "react-icons/hi";

/**
 * XP Stats Card Component
 * Displays user's XP, level, streak, and daily goal progress
 */
const XPStatsCard = ({ xpStatus, loading, onGoalClick }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6 animate-pulse">
        <div className="h-6 bg-ds-border/30 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-ds-border/30 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!xpStatus) return null;

  const { xp, streak, dailyGoal } = xpStatus;

  const stats = [
    {
      label: t("xp.level", "Level"),
      value: xp.level,
      icon: HiOutlineStar,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      progress: xp.levelProgress,
      subText: `${xp.currentLevelXp} / ${xp.nextLevelXp} XP`,
    },
    {
      label: t("xp.totalXP", "Total XP"),
      value: xp.total.toLocaleString(),
      icon: HiOutlineLightningBolt,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: t("xp.streak", "Streak"),
      value: `${streak.current} ${t("xp.days", "days")}`,
      icon: HiOutlineFire,
      color: streak.isActive ? "text-orange-400" : "text-ds-muted",
      bgColor: streak.isActive ? "bg-orange-500/10" : "bg-ds-bg/50",
      subText: streak.willExpireToday
        ? t("xp.streakExpiring", "Practice today to keep it!")
        : streak.isActive
        ? t("xp.streakActive", "Keep it going!")
        : t("xp.streakInactive", "Start a new streak!"),
      warning: streak.willExpireToday,
    },
    {
      label: t("xp.dailyGoal", "Daily Goal"),
      value: `${dailyGoal.todayXp} / ${dailyGoal.target}`,
      icon: HiOutlineTrendingUp,
      color: dailyGoal.completed ? "text-green-400" : "text-blue-400",
      bgColor: dailyGoal.completed ? "bg-green-500/10" : "bg-blue-500/10",
      progress: dailyGoal.progress,
      subText: dailyGoal.completed
        ? t("xp.goalComplete", "Goal achieved! 🎉")
        : `${Math.round(dailyGoal.progress)}% ${t("xp.complete", "complete")}`,
      onClick: onGoalClick,
    },
  ];

  return (
    <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6">
      <h2 className="text-lg font-semibold text-ds-text mb-4 flex items-center gap-2">
        <HiOutlineLightningBolt className="w-5 h-5 text-purple-400" />
        {t("xp.yourProgress", "Your Progress")}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={stat.onClick}
            className={`relative rounded-xl p-4 ${stat.bgColor} ${
              stat.onClick ? "cursor-pointer hover:scale-105 transition-transform" : ""
            }`}
          >
            {/* Icon */}
            <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center mb-2`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>

            {/* Label */}
            <p className="text-ds-muted text-sm">{stat.label}</p>

            {/* Value */}
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>

            {/* Sub text */}
            {stat.subText && (
              <p className={`text-xs mt-1 ${stat.warning ? "text-orange-400" : "text-ds-muted"}`}>
                {stat.subText}
              </p>
            )}

            {/* Progress bar */}
            {stat.progress !== undefined && (
              <div className="mt-2 h-1.5 bg-ds-bg/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(stat.progress, 100)}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className={`h-full rounded-full ${
                    stat.progress >= 100 ? "bg-green-400" : stat.color.replace("text-", "bg-")
                  }`}
                />
              </div>
            )}

            {/* Warning indicator for expiring streak */}
            {stat.warning && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-2 right-2 w-2 h-2 bg-orange-400 rounded-full"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Longest streak */}
      {streak.longest > 0 && (
        <p className="text-center text-ds-muted text-sm mt-4">
          {t("xp.longestStreak", "Longest streak")}: {streak.longest} {t("xp.days", "days")} 🏆
        </p>
      )}
    </div>
  );
};

export default XPStatsCard;
