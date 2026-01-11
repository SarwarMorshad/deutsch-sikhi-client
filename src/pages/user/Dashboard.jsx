import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { AuthContext } from "../../context/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { publicAPI } from "../../utils/api";

// Dashboard Components
import {
  DashboardHeader,
  ProgressOverview,
  LevelProgress,
  RecentActivity,
  WeeklyGoal,
  QuickActions,
} from "../../components/userDashboard";

const Dashboard = () => {
  const { t } = useTranslation();
  const { isBengali } = useLanguage();
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // Data states
  const [progress, setProgress] = useState(null);
  const [recentProgress, setRecentProgress] = useState([]);
  const [levels, setLevels] = useState([]);
  const [nextLesson, setNextLesson] = useState(null);
  const [lastLesson, setLastLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Calculated stats
  const [streak, setStreak] = useState(0);
  const [completedThisWeek, setCompletedThisWeek] = useState(0);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        // Fetch progress data
        const [progressRes, lessonsRes, levelsRes] = await Promise.all([
          axiosSecure.get("/progress/me"),
          axiosSecure.get("/progress/me/lessons"),
          publicAPI.getLevels(),
        ]);

        const progressData = progressRes.data.data;
        const completedLessons = lessonsRes.data.data || [];
        const levelsData = levelsRes.data || [];

        setProgress(progressData);
        setRecentProgress(progressData?.recentProgress || []);
        setLevels(levelsData);

        // Calculate streak (simplified - days with activity)
        calculateStreak(completedLessons);

        // Calculate completed this week
        calculateWeeklyProgress(completedLessons);

        // Find next lesson to continue
        await findNextLesson(levelsData, completedLessons);

        // Find last completed lesson for review
        if (completedLessons.length > 0) {
          const sortedLessons = [...completedLessons].sort(
            (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
          );
          setLastLesson(sortedLessons[0]?.lesson);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Calculate streak from completed lessons
  const calculateStreak = (completedLessons) => {
    if (completedLessons.length === 0) {
      setStreak(0);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get unique dates with activity
    const activityDates = [
      ...new Set(
        completedLessons.map((lesson) => {
          const date = new Date(lesson.completedAt);
          date.setHours(0, 0, 0, 0);
          return date.getTime();
        })
      ),
    ].sort((a, b) => b - a);

    // Calculate streak
    let currentStreak = 0;
    let checkDate = today.getTime();

    for (const activityDate of activityDates) {
      if (activityDate === checkDate || activityDate === checkDate - 86400000) {
        currentStreak++;
        checkDate = activityDate;
      } else if (activityDate < checkDate - 86400000) {
        break;
      }
    }

    setStreak(currentStreak);
  };

  // Calculate lessons completed this week
  const calculateWeeklyProgress = (completedLessons) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeekLessons = completedLessons.filter((lesson) => {
      const completedAt = new Date(lesson.completedAt);
      return completedAt >= startOfWeek;
    });

    setCompletedThisWeek(thisWeekLessons.length);
  };

  // Find next lesson for user to continue
  const findNextLesson = async (levels, completedLessons) => {
    try {
      const completedIds = completedLessons.map((l) => l.lessonId?.toString());

      for (const level of levels) {
        if (!level.isActive) continue;

        const lessonsRes = await axiosSecure.get(`/levels/${level._id}/lessons`);
        const lessons = lessonsRes.data.data || [];

        for (const lesson of lessons) {
          if (!completedIds.includes(lesson._id?.toString())) {
            setNextLesson(lesson);
            return;
          }
        }
      }
    } catch (error) {
      console.error("Error finding next lesson:", error);
    }
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ds-muted border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  // Not logged in (shouldn't reach here due to redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Welcome & Streak */}
        <DashboardHeader user={user} streak={streak} />

        {/* Progress Overview Stats */}
        <ProgressOverview progress={progress} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Level Progress & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level Progress */}
            <LevelProgress levelProgress={progress?.levelProgress || []} levels={levels} />

            {/* Quick Actions */}
            <QuickActions nextLesson={nextLesson} lastLesson={lastLesson} />
          </div>

          {/* Right Column - Weekly Goal & Recent Activity */}
          <div className="space-y-6">
            {/* Weekly Goal */}
            <WeeklyGoal completedThisWeek={completedThisWeek} weeklyGoal={5} />

            {/* Recent Activity */}
            <RecentActivity recentProgress={recentProgress} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
