import { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import useLanguage from "../../hooks/useLanguage";
import axios from "axios";
import AchievementsSection from "../../components/userDashboard/AchievementsSection";
import {
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineCollection,
  HiOutlineLightningBolt,
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineFire,
  HiOutlineStar,
  HiOutlineSparkles,
  HiOutlineTrendingUp,
  HiOutlineCheckCircle,
  HiOutlineCog,
} from "react-icons/hi";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const { isBengali } = useLanguage();
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from /users/me API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const token = await user.getIdToken();
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  // Handle achievement claimed (refresh user data)
  const handleAchievementClaimed = async () => {
    // Refetch user data to get updated XP
    try {
      const token = await user.getIdToken();
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data.data);
    } catch (error) {
      console.error("Error refetching user data:", error);
    }
  };

  // Get last 7 days for streak calendar
  const getLast7Days = () => {
    const days = [];
    const streakCount = userData?.streak?.current || 0;
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date,
        dayName: date.toLocaleDateString("en", { weekday: "short" }),
        dayNum: date.getDate(),
        isToday: i === 0,
        isActive: i < streakCount,
      });
    }
    return days;
  };

  const quickStats = [
    {
      icon: HiOutlineBookOpen,
      label: "Lessons",
      value: "12",
      color: "from-blue-500 to-cyan-400",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      icon: HiOutlineAcademicCap,
      label: "Grammar",
      value: "8",
      color: "from-green-500 to-emerald-400",
      iconBg: "bg-green-500/20",
      iconColor: "text-green-400",
    },
    {
      icon: HiOutlineCollection,
      label: "Words",
      value: "156",
      color: "from-purple-500 to-pink-400",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      icon: HiOutlineLightningBolt,
      label: "Quizzes",
      value: "24",
      color: "from-orange-500 to-yellow-400",
      iconBg: "bg-orange-500/20",
      iconColor: "text-orange-400",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-ds-bg flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Extract XP data from userData
  const xp = userData?.xp || { total: 0, level: 1, currentLevelXp: 0, nextLevelXp: 100, levelProgress: 0 };
  const streak = userData?.streak || { current: 0, longest: 0, isActive: false };
  const dailyGoal = userData?.dailyGoal || { target: 50, todayXp: 0 };
  const dailyProgress = Math.min((dailyGoal.todayXp / dailyGoal.target) * 100, 100);
  const dailyCompleted = dailyGoal.todayXp >= dailyGoal.target;

  return (
    <div className="min-h-screen bg-ds-bg py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className={`text-2xl sm:text-3xl font-bold text-ds-text ${isBengali ? "font-bangla" : ""}`}>
            {t("dashboard.title", "My Stats")}
          </h1>
          <p className={`text-ds-muted mt-1 text-sm sm:text-base ${isBengali ? "font-bangla" : ""}`}>
            {t("dashboard.subtitle", "Track your learning progress and achievements")}
          </p>
        </motion.div>

        {/* Main XP Card - Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600/20 via-ds-surface/50 to-blue-600/20 border border-purple-500/20 p-6 mb-6"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            {/* Level Badge */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <span className="text-2xl font-bold text-white">{xp.level}</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <HiOutlineStar className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-ds-muted text-sm">Current Level</p>
                  <p className="text-ds-text text-xl font-bold">Level {xp.level}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-ds-muted text-sm">Total XP</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {xp.total?.toLocaleString() || 0}
                </p>
              </div>
            </div>

            {/* Level Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-ds-muted">Progress to Level {xp.level + 1}</span>
                <span className="text-purple-400 font-medium">
                  {xp.currentLevelXp || 0} / {xp.nextLevelXp || 100} XP
                </span>
              </div>
              <div className="h-3 bg-ds-bg/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xp.levelProgress || 0}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </motion.div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              {/* Streak */}
              <div className="bg-ds-bg/30 rounded-xl p-4 text-center">
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                    streak.isActive ? "bg-orange-500/20" : "bg-ds-border/20"
                  }`}
                >
                  <HiOutlineFire
                    className={`w-5 h-5 ${streak.isActive ? "text-orange-400" : "text-ds-muted"}`}
                  />
                </div>
                <p className={`text-2xl font-bold ${streak.isActive ? "text-orange-400" : "text-ds-muted"}`}>
                  {streak.current}
                </p>
                <p className="text-xs text-ds-muted">Day Streak</p>
              </div>

              {/* Daily Goal */}
              <button
                onClick={() => setShowGoalModal(true)}
                className="bg-ds-bg/30 rounded-xl p-4 text-center hover:bg-ds-bg/50 transition-colors cursor-pointer group"
              >
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                    dailyCompleted ? "bg-green-500/20" : "bg-blue-500/20"
                  }`}
                >
                  {dailyCompleted ? (
                    <HiOutlineCheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <HiOutlineSparkles className="w-5 h-5 text-blue-400" />
                  )}
                </div>
                <p className={`text-2xl font-bold ${dailyCompleted ? "text-green-400" : "text-blue-400"}`}>
                  {dailyGoal.todayXp}/{dailyGoal.target}
                </p>
                <p className="text-xs text-ds-muted group-hover:text-ds-text transition-colors">
                  Daily Goal <HiOutlineCog className="w-3 h-3 inline ml-1" />
                </p>
              </button>

              {/* Best Streak */}
              <div className="bg-ds-bg/30 rounded-xl p-4 text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500/20 mb-2">
                  <HiOutlineTrendingUp className="w-5 h-5 text-yellow-400" />
                </div>
                <p className="text-2xl font-bold text-yellow-400">{streak.longest}</p>
                <p className="text-xs text-ds-muted">Best Streak</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Streak Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-5 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HiOutlineFire className="w-5 h-5 text-orange-400" />
              <h3 className="text-ds-text font-medium">This Week</h3>
            </div>
            {streak.isActive && (
              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                🔥 Active Today
              </span>
            )}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {getLast7Days().map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={`relative flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all ${
                  day.isToday
                    ? "bg-purple-500/20 border border-purple-500/50"
                    : day.isActive
                    ? "bg-orange-500/10"
                    : "bg-ds-bg/30"
                }`}
              >
                <span className="text-[10px] sm:text-xs text-ds-muted mb-1">{day.dayName}</span>
                <span
                  className={`text-sm sm:text-lg font-bold ${
                    day.isToday ? "text-purple-400" : day.isActive ? "text-orange-400" : "text-ds-muted"
                  }`}
                >
                  {day.dayNum}
                </span>
                {day.isActive && (
                  <HiOutlineFire
                    className={`w-4 h-4 mt-1 ${day.isToday ? "text-purple-400" : "text-orange-400"}`}
                  />
                )}
                {day.isToday && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <AchievementsSection userData={userData} onAchievementClaimed={handleAchievementClaimed} />
        </motion.div>

        {/* Quick Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6"
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-ds-surface/30 rounded-xl border border-ds-border/30 p-4 hover:border-ds-border/50 transition-all group"
            >
              <div
                className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <p
                className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.value}
              </p>
              <p className="text-xs text-ds-muted mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineClock className="w-5 h-5 text-ds-muted" />
            <h3 className="text-ds-text font-medium">Recent Activity</h3>
          </div>

          <div className="space-y-2">
            {[
              {
                action: "Completed Lesson",
                detail: "Basic Greetings",
                xp: "+20",
                time: "2h ago",
                icon: HiOutlineBookOpen,
                color: "text-blue-400",
              },
              {
                action: "Quiz Completed",
                detail: "Article Practice - 85%",
                xp: "+20",
                time: "Yesterday",
                icon: HiOutlineLightningBolt,
                color: "text-orange-400",
              },
              {
                action: "New Words Learned",
                detail: "5 vocabulary words",
                xp: "+25",
                time: "Yesterday",
                icon: HiOutlineCollection,
                color: "text-purple-400",
              },
              {
                action: "Daily Goal",
                detail: "50 XP target reached",
                xp: "+10",
                time: "2 days ago",
                icon: HiOutlineCheckCircle,
                color: "text-green-400",
              },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-ds-bg/30 hover:bg-ds-bg/50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-lg bg-ds-surface/50 flex items-center justify-center flex-shrink-0`}
                >
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-ds-text font-medium text-sm truncate">{activity.action}</p>
                  <p className="text-xs text-ds-muted truncate">{activity.detail}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`font-bold ${activity.color}`}>{activity.xp} XP</p>
                  <p className="text-[10px] text-ds-muted">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Daily Goal Modal */}
        {showGoalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowGoalModal(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-ds-surface rounded-2xl border border-ds-border/50 p-6 w-full max-w-sm"
            >
              <h3 className="text-lg font-bold text-ds-text mb-4">Set Daily Goal</h3>
              <div className="space-y-3">
                {[30, 50, 100, 150].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => setShowGoalModal(false)}
                    className={`w-full p-3 rounded-xl text-left transition-colors ${
                      dailyGoal.target === goal
                        ? "bg-purple-500/20 border border-purple-500/50 text-purple-400"
                        : "bg-ds-bg/30 hover:bg-ds-bg/50 text-ds-text"
                    }`}
                  >
                    <span className="font-bold">{goal} XP</span>
                    <span className="text-ds-muted text-sm ml-2">
                      {goal === 30
                        ? "Casual"
                        : goal === 50
                        ? "Regular"
                        : goal === 100
                        ? "Serious"
                        : "Intense"}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowGoalModal(false)}
                className="w-full mt-4 py-2 text-ds-muted hover:text-ds-text transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* CSS for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
