import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { HiOutlineChevronRight, HiOutlineLockClosed, HiOutlineCheckCircle } from "react-icons/hi";

const LevelProgress = ({ levelProgress = [], levels = [] }) => {
  const { t } = useTranslation();
  const { isBengali, getLocalizedContent } = useLanguage();

  // Level styling config
  const levelConfig = {
    A1: {
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-400",
      label: { en: "Beginner", bn: "শুরু" },
    },
    A2: {
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
      label: { en: "Elementary", bn: "প্রাথমিক" },
    },
    B1: {
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-400",
      label: { en: "Intermediate", bn: "মধ্যবর্তী" },
    },
  };

  const getConfig = (code) => levelConfig[code] || levelConfig.A1;

  // Merge level progress with level info
  const mergedLevels = levels.map((level) => {
    const progress = levelProgress.find((lp) => lp.levelId?.toString() === level._id?.toString());
    return {
      ...level,
      completedLessons: progress?.completedLessons || 0,
      totalLessons: progress?.totalLessons || 0,
      percentage: progress?.percentage || 0,
    };
  });

  return (
    <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold text-ds-text ${isBengali ? "font-bangla" : ""}`}>
          {isBengali ? "লেভেল অগ্রগতি" : "Level Progress"}
        </h2>
        <Link
          to="/courses"
          className={`text-sm text-ds-muted hover:text-ds-text flex items-center gap-1 ${
            isBengali ? "font-bangla" : ""
          }`}
        >
          {isBengali ? "সব দেখুন" : "View All"}
          <HiOutlineChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Level Cards */}
      <div className="space-y-4">
        {mergedLevels.map((level) => {
          const config = getConfig(level.code);
          const isLocked = !level.isActive;
          const isComplete = level.percentage === 100;

          return (
            <div
              key={level._id}
              className={`relative p-4 rounded-xl border transition-all ${
                isLocked
                  ? "border-ds-border/20 bg-ds-surface/20 opacity-60"
                  : `${config.borderColor} ${config.bgColor} hover:shadow-lg`
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Level Badge */}
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-xl ${
                    isLocked ? "bg-ds-surface text-ds-border" : `bg-gradient-to-br ${config.color} text-white`
                  }`}
                >
                  {isLocked ? (
                    <HiOutlineLockClosed className="w-6 h-6" />
                  ) : isComplete ? (
                    <HiOutlineCheckCircle className="w-7 h-7" />
                  ) : (
                    level.code
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold text-ds-text ${isBengali ? "font-bangla" : ""}`}>
                      {level.code} -{" "}
                      {getLocalizedContent(level.title) || config.label[isBengali ? "bn" : "en"]}
                    </h3>
                    {isComplete && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.textColor}`}
                      >
                        ✓
                      </span>
                    )}
                  </div>

                  {isLocked ? (
                    <p className={`text-sm text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                      {isBengali ? "শীঘ্রই আসছে" : "Coming Soon"}
                    </p>
                  ) : (
                    <>
                      {/* Stats */}
                      <p className={`text-sm text-ds-muted mb-2 ${isBengali ? "font-bangla" : ""}`}>
                        {level.completedLessons} / {level.totalLessons} {isBengali ? "পাঠ" : "lessons"}
                      </p>

                      {/* Progress Bar */}
                      <div className="h-2 bg-ds-bg/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${config.color} rounded-full transition-all duration-500`}
                          style={{ width: `${level.percentage}%` }}
                        ></div>
                      </div>
                    </>
                  )}
                </div>

                {/* Percentage */}
                {!isLocked && (
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${config.textColor}`}>{level.percentage}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelProgress;
