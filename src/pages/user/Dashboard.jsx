import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import useXP from "../../hooks/useXP";
import useLanguage from "../../hooks/useLanguage";
import XPStatsCard from "../../components/xp/XPStatsCard";
import StreakCalendar from "../../components/xp/StreakCalendar";
import LevelProgress from "../../components/xp/LevelProgress";
import DailyGoalModal from "../../components/xp/DailyGoalModal";
import {
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineCollection,
  HiOutlineLightningBolt,
  HiOutlineChartBar,
  HiOutlineClock,
} from "react-icons/hi";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { isBengali } = useLanguage();
  const { xpStatus, loading, updateDailyGoal } = useXP();
  const [showGoalModal, setShowGoalModal] = useState(false);

  const activityDates = xpStatus?.streak?.lastActivityDate ? [xpStatus.streak.lastActivityDate] : [];

  const quickStats = [
    {
      icon: HiOutlineBookOpen,
      label: t("dashboard.lessonsCompleted", "Lessons Completed"),
      value: "12",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: HiOutlineAcademicCap,
      label: t("dashboard.grammarTopics", "Grammar Topics"),
      value: "8",
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      icon: HiOutlineCollection,
      label: t("dashboard.wordsLearned", "Words Learned"),
      value: "156",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: HiOutlineLightningBolt,
      label: t("dashboard.quizzesTaken", "Quizzes Taken"),
      value: "24",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-ds-bg py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className={`text-3xl font-bold text-ds-text ${isBengali ? "font-bangla" : ""}`}>
            {t("dashboard.title", "My Stats")}
          </h1>
          <p className={`text-ds-muted mt-2 ${isBengali ? "font-bangla" : ""}`}>
            {t("dashboard.subtitle", "Track your learning progress and achievements")}
          </p>
        </motion.div>

        {xpStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6 mb-6"
          >
            <LevelProgress
              level={xpStatus.xp?.level || 1}
              currentXP={xpStatus.xp?.currentLevelXp || 0}
              nextLevelXP={xpStatus.xp?.nextLevelXp || 100}
              progress={xpStatus.xp?.levelProgress || 0}
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <XPStatsCard xpStatus={xpStatus} loading={loading} onGoalClick={() => setShowGoalModal(true)} />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {xpStatus && (
              <StreakCalendar
                streak={xpStatus.streak || { current: 0, longest: 0, isActive: false }}
                activityDates={activityDates}
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <HiOutlineChartBar className="w-5 h-5 text-blue-400" />
              <h3 className={`text-ds-text font-medium ${isBengali ? "font-bangla" : ""}`}>
                {t("dashboard.quickStats", "Quick Stats")}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {quickStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`rounded-xl p-4 ${stat.bgColor}`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className={`text-xs text-ds-muted mt-1 ${isBengali ? "font-bangla" : ""}`}>
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineClock className="w-5 h-5 text-ds-muted" />
            <h3 className={`text-ds-text font-medium ${isBengali ? "font-bangla" : ""}`}>
              {t("dashboard.recentActivity", "Recent Activity")}
            </h3>
          </div>

          <div className="space-y-3">
            {[
              { action: "Completed Lesson", detail: "Basic Greetings", xp: "+20 XP", time: "2 hours ago" },
              { action: "Quiz Completed", detail: "Article Practice - 85%", xp: "+20 XP", time: "Yesterday" },
              { action: "New Words Learned", detail: "5 vocabulary words", xp: "+25 XP", time: "Yesterday" },
              {
                action: "Daily Goal Achieved",
                detail: "50 XP target reached",
                xp: "+10 XP bonus",
                time: "2 days ago",
              },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-ds-bg/30 hover:bg-ds-bg/50 transition-colors"
              >
                <div>
                  <p className="text-ds-text font-medium">{activity.action}</p>
                  <p className="text-sm text-ds-muted">{activity.detail}</p>
                </div>
                <div className="text-right">
                  <p className="text-purple-400 font-medium">{activity.xp}</p>
                  <p className="text-xs text-ds-muted">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 rounded-xl bg-ds-bg/50 text-ds-muted hover:text-ds-text hover:bg-ds-bg transition-colors text-sm">
            {t("dashboard.viewAll", "View All Activity")}
          </button>
        </motion.div>

        <DailyGoalModal
          isOpen={showGoalModal}
          onClose={() => setShowGoalModal(false)}
          currentGoal={xpStatus?.dailyGoal?.target || 50}
          onSave={updateDailyGoal}
        />
      </div>
    </div>
  );
};

export default Dashboard;
