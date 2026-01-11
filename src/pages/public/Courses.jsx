import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { AuthContext } from "../../context/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { publicAPI } from "../../utils/api";
import {
  HiOutlineAcademicCap,
  HiOutlineLockClosed,
  HiOutlineCheckCircle,
  HiOutlinePlay,
  HiOutlineBookOpen,
  HiOutlineClock,
  HiOutlineChevronRight,
  HiOutlineSparkles,
  HiOutlineTrendingUp,
} from "react-icons/hi";

const Courses = () => {
  const { t } = useTranslation();
  const { isBengali, getLocalizedContent } = useLanguage();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);

  // Level colors and info
  const levelInfo = {
    A1: {
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-400",
      label: { en: "Beginner", bn: "শুরু", de: "Anfänger" },
      description: {
        en: "Start your German journey with basics",
        bn: "জার্মান শেখা শুরু করুন মূল বিষয় দিয়ে",
      },
    },
    A2: {
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
      label: { en: "Elementary", bn: "প্রাথমিক", de: "Grundlegend" },
      description: {
        en: "Build on basics with everyday topics",
        bn: "দৈনন্দিন বিষয় দিয়ে ভিত্তি তৈরি করুন",
      },
    },
    B1: {
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400",
      label: { en: "Intermediate", bn: "মধ্যবর্তী", de: "Mittelstufe" },
      description: {
        en: "Express yourself on familiar topics",
        bn: "পরিচিত বিষয়ে নিজেকে প্রকাশ করুন",
      },
    },
  };

  // Fetch user progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;

      try {
        const [progressRes, lessonsRes] = await Promise.all([
          axiosSecure.get("/progress/me"),
          axiosSecure.get("/progress/me/lessons"),
        ]);

        setUserProgress(progressRes.data.data);

        // Extract completed lesson IDs
        const completedIds = lessonsRes.data.data?.map((p) => p.lessonId.toString()) || [];
        setCompletedLessonIds(completedIds);
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };

    fetchProgress();
  }, [user]);

  // Fetch levels on mount
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await publicAPI.getLevels();
        setLevels(response.data || []);
        // Auto-select first level
        if (response.data?.length > 0) {
          setSelectedLevel(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching levels:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLevels();
  }, []);

  // Fetch lessons when level changes
  useEffect(() => {
    if (!selectedLevel) return;

    const fetchLessons = async () => {
      setLessonsLoading(true);
      try {
        const endpoint = `/levels/${selectedLevel._id}/lessons`;
        let response;

        if (user) {
          response = await axiosSecure.get(endpoint);
          setLessons(response.data.data || []);
        } else {
          const lessonsRes = await fetch(
            `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}${endpoint}`
          );
          const data = await lessonsRes.json();
          setLessons(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLessonsLoading(false);
      }
    };
    fetchLessons();
  }, [selectedLevel, user]);

  // Get level info with fallback
  const getLevelInfo = (code) => levelInfo[code] || levelInfo.A1;

  // Get level progress percentage
  const getLevelProgress = (levelId) => {
    if (!userProgress?.levelProgress) return 0;
    const levelProg = userProgress.levelProgress.find((lp) => lp.levelId.toString() === levelId.toString());
    return levelProg?.percentage || 0;
  };

  // Check if lesson is completed
  const isLessonCompleted = (lessonId) => {
    return completedLessonIds.includes(lessonId.toString());
  };

  // Check if lesson should be unlocked
  const isLessonUnlocked = (lessonIndex) => {
    if (!user) return true; // All unlocked for guests
    if (lessonIndex === 0) return true; // First lesson always unlocked

    // Check if previous lesson is completed
    const prevLesson = lessons[lessonIndex - 1];
    if (prevLesson) {
      return isLessonCompleted(prevLesson._id);
    }
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ds-muted border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ds-surface/50 text-ds-muted text-sm mb-4 ${
              isBengali ? "font-bangla" : ""
            }`}
          >
            <HiOutlineAcademicCap className="w-4 h-4" />
            <span>{isBengali ? "কাঠামোগত শেখার পথ" : "Structured Learning Path"}</span>
          </div>
          <h1
            className={`text-4xl md:text-5xl font-black text-ds-text mb-4 ${isBengali ? "font-bangla" : ""}`}
          >
            {isBengali ? "জার্মান " : "German "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ds-muted to-ds-border">
              {isBengali ? "কোর্স" : "Courses"}
            </span>
          </h1>
          <p className={`text-ds-muted text-lg max-w-2xl mx-auto ${isBengali ? "font-bangla" : ""}`}>
            {isBengali
              ? "A1 থেকে B1 পর্যন্ত আমাদের কাঠামোগত পাঠ্যক্রম অনুসরণ করুন"
              : "Follow our structured curriculum from A1 to B1. Each level builds on the previous one."}
          </p>
          <p className={`text-ds-border mt-2 ${isBengali ? "" : "font-bangla"}`}>
            {isBengali
              ? "Follow our structured curriculum from A1 to B1"
              : "A1 থেকে B1 পর্যন্ত আমাদের কাঠামোগত পাঠ্যক্রম অনুসরণ করুন"}
          </p>
        </div>

        {/* User Progress Summary (if logged in) */}
        {user && userProgress && (
          <div className="mb-8 p-6 rounded-2xl bg-ds-surface/30 border border-ds-border/30">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-ds-muted to-ds-border flex items-center justify-center">
                  <HiOutlineTrendingUp className="w-6 h-6 text-ds-bg" />
                </div>
                <div>
                  <h3 className={`text-ds-text font-semibold ${isBengali ? "font-bangla" : ""}`}>
                    {isBengali ? "আপনার অগ্রগতি" : "Your Progress"}
                  </h3>
                  <p className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                    {userProgress.completedLessons} / {userProgress.totalLessons}{" "}
                    {isBengali ? "পাঠ সম্পন্ন" : "lessons completed"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-ds-text">{userProgress.overallPercentage}%</div>
                  <div className={`text-xs text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                    {isBengali ? "সম্পূর্ণ" : "Complete"}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-ds-text">{userProgress.averageScore}%</div>
                  <div className={`text-xs text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                    {isBengali ? "গড় স্কোর" : "Avg Score"}
                  </div>
                </div>
              </div>
            </div>

            {/* Overall progress bar */}
            <div className="mt-4">
              <div className="h-2 bg-ds-border/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-ds-muted to-ds-border rounded-full transition-all"
                  style={{ width: `${userProgress.overallPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Split Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Level Cards */}
          <div className="lg:w-1/3 space-y-4">
            <h2
              className={`text-lg font-semibold text-ds-text mb-4 flex items-center gap-2 ${
                isBengali ? "font-bangla" : ""
              }`}
            >
              <HiOutlineSparkles className="w-5 h-5 text-ds-muted" />
              {t("courses.selectLevel")}
            </h2>

            {levels.map((level, index) => {
              const info = getLevelInfo(level.code);
              const isSelected = selectedLevel?._id === level._id;
              const isLocked = !level.isActive;
              const progress = getLevelProgress(level._id);

              return (
                <button
                  key={level._id}
                  onClick={() => !isLocked && setSelectedLevel(level)}
                  disabled={isLocked}
                  className={`relative w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 group ${
                    isSelected
                      ? `${info.borderColor} ${info.bgColor}`
                      : isLocked
                      ? "border-ds-border/20 bg-ds-surface/20 opacity-60 cursor-not-allowed"
                      : "border-ds-border/30 hover:border-ds-border/50 hover:bg-ds-surface/30"
                  }`}
                >
                  {/* Level Badge */}
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`text-3xl font-black bg-gradient-to-r ${info.color} text-transparent bg-clip-text`}
                    >
                      {level.code}
                    </div>
                    {isLocked ? (
                      <HiOutlineLockClosed className="w-5 h-5 text-ds-border" />
                    ) : isSelected ? (
                      <HiOutlineCheckCircle className={`w-5 h-5 ${info.textColor}`} />
                    ) : (
                      <HiOutlineChevronRight className="w-5 h-5 text-ds-border group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>

                  {/* Level Title */}
                  <h3 className={`text-ds-text font-semibold mb-1 ${isBengali ? "font-bangla" : ""}`}>
                    {getLocalizedContent(level.title) || info.label[isBengali ? "bn" : "en"]}
                  </h3>
                  <p className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                    {getLocalizedContent(level.description) || info.description[isBengali ? "bn" : "en"]}
                  </p>

                  {/* Coming Soon Badge */}
                  {isLocked && (
                    <div
                      className={`absolute top-3 right-3 px-2 py-1 rounded-full bg-ds-surface text-ds-muted text-xs ${
                        isBengali ? "font-bangla" : ""
                      }`}
                    >
                      {t("courses.comingSoon")}
                    </div>
                  )}

                  {/* Progress Bar (if user has progress) */}
                  {user && progress > 0 && (
                    <div className="mt-4">
                      <div
                        className={`flex justify-between text-xs text-ds-muted mb-1 ${
                          isBengali ? "font-bangla" : ""
                        }`}
                      >
                        <span>{isBengali ? "অগ্রগতি" : "Progress"}</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-ds-border/30 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${info.color} rounded-full transition-all`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Side - Lessons */}
          <div className="lg:w-2/3">
            {selectedLevel && (
              <>
                {/* Selected Level Header */}
                <div
                  className={`p-6 rounded-2xl ${getLevelInfo(selectedLevel.code).bgColor} border ${
                    getLevelInfo(selectedLevel.code).borderColor
                  } mb-6`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`text-4xl font-black bg-gradient-to-r ${
                            getLevelInfo(selectedLevel.code).color
                          } text-transparent bg-clip-text`}
                        >
                          {selectedLevel.code}
                        </span>
                        <div>
                          <h2 className={`text-xl font-bold text-ds-text ${isBengali ? "font-bangla" : ""}`}>
                            {getLocalizedContent(selectedLevel.title)}
                          </h2>
                          <p className={`text-ds-muted text-sm ${isBengali ? "" : "font-bangla"}`}>
                            {isBengali ? selectedLevel.title?.en : selectedLevel.title?.bn}
                          </p>
                        </div>
                      </div>
                      <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                        {getLocalizedContent(selectedLevel.description)}
                      </p>
                    </div>
                    {!user && (
                      <Link
                        to="/register"
                        className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${
                          getLevelInfo(selectedLevel.code).color
                        } text-white font-semibold hover:shadow-lg transition-all ${
                          isBengali ? "font-bangla" : ""
                        }`}
                      >
                        <HiOutlinePlay className="w-5 h-5" />
                        {t("courses.startLearning")}
                      </Link>
                    )}
                  </div>
                </div>

                {/* Lessons List */}
                <h3
                  className={`text-lg font-semibold text-ds-text mb-4 flex items-center gap-2 ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  <HiOutlineBookOpen className="w-5 h-5 text-ds-muted" />
                  {t("courses.lessons")} ({lessons.length})
                </h3>

                {lessonsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-3 border-ds-muted border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : lessons.length === 0 ? (
                  <div className="text-center py-12 bg-ds-surface/30 rounded-2xl">
                    <HiOutlineBookOpen className="w-12 h-12 text-ds-border mx-auto mb-3" />
                    <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                      {t("courses.noLessons")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lessons.map((lesson, index) => {
                      const isCompleted = isLessonCompleted(lesson._id);
                      const isUnlocked = isLessonUnlocked(index);
                      const levelColor = getLevelInfo(selectedLevel.code);

                      return (
                        <div
                          key={lesson._id}
                          className={`relative p-5 rounded-xl border transition-all duration-300 group ${
                            !isUnlocked
                              ? "border-ds-border/20 bg-ds-surface/10 opacity-70"
                              : isCompleted
                              ? `${levelColor.borderColor} ${levelColor.bgColor}`
                              : "border-ds-border/30 hover:border-ds-border/50 hover:bg-ds-surface/30"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {/* Lesson Number */}
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                                !isUnlocked
                                  ? "bg-ds-surface text-ds-border"
                                  : isCompleted
                                  ? `bg-gradient-to-r ${levelColor.color} text-white`
                                  : "bg-ds-surface text-ds-text"
                              }`}
                            >
                              {!isUnlocked ? (
                                <HiOutlineLockClosed className="w-5 h-5" />
                              ) : isCompleted ? (
                                <HiOutlineCheckCircle className="w-6 h-6" />
                              ) : (
                                index + 1
                              )}
                            </div>

                            {/* Lesson Info */}
                            <div className="flex-1">
                              <h4
                                className={`text-ds-text font-semibold mb-1 flex items-center gap-2 ${
                                  isBengali ? "font-bangla" : ""
                                }`}
                              >
                                {getLocalizedContent(lesson.title) || `${t("courses.lesson")} ${index + 1}`}
                                {isCompleted && (
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${levelColor.bgColor} ${
                                      levelColor.textColor
                                    } ${isBengali ? "font-bangla" : ""}`}
                                  >
                                    {t("courses.completed")}
                                  </span>
                                )}
                              </h4>
                              <p className={`text-ds-muted text-sm ${isBengali ? "" : "font-bangla"}`}>
                                {isBengali ? lesson.title?.en : lesson.title?.bn}
                              </p>
                              <div
                                className={`flex items-center gap-4 mt-2 text-xs text-ds-border ${
                                  isBengali ? "font-bangla" : ""
                                }`}
                              >
                                <span>
                                  {lesson.wordCount || 0} {isBengali ? "শব্দ" : "words"}
                                </span>
                                <span>
                                  {lesson.exerciseCount || 0} {isBengali ? "প্রশ্ন" : "exercises"}
                                </span>
                              </div>
                            </div>

                            {/* Action */}
                            {isUnlocked && (
                              <Link
                                to={`/lessons/${lesson._id}`}
                                className={`p-3 rounded-xl transition-all ${
                                  isCompleted
                                    ? `${levelColor.bgColor} ${levelColor.textColor} hover:bg-opacity-50`
                                    : "bg-ds-surface text-ds-text hover:bg-ds-border"
                                }`}
                              >
                                <HiOutlinePlay className="w-5 h-5" />
                              </Link>
                            )}
                          </div>

                          {/* Unlock Message */}
                          {!isUnlocked && (
                            <p
                              className={`mt-3 text-xs text-ds-border italic ${
                                isBengali ? "font-bangla" : ""
                              }`}
                            >
                              🔒{" "}
                              {isBengali
                                ? "আগের পাঠ সম্পন্ন করুন আনলক করতে"
                                : "Complete previous lesson to unlock"}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Mobile CTA */}
                {!user && (
                  <Link
                    to="/register"
                    className={`mt-6 flex md:hidden items-center justify-center gap-2 w-full py-4 rounded-xl bg-gradient-to-r ${
                      getLevelInfo(selectedLevel.code).color
                    } text-white font-semibold hover:shadow-lg transition-all ${
                      isBengali ? "font-bangla" : ""
                    }`}
                  >
                    <HiOutlinePlay className="w-5 h-5" />
                    {t("courses.startLearning")}
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
