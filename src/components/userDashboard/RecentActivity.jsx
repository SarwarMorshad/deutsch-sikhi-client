import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { HiOutlineCheckCircle, HiOutlinePlay, HiOutlineClock, HiOutlineBookOpen } from "react-icons/hi";

const RecentActivity = ({ recentProgress = [] }) => {
  const { t } = useTranslation();
  const { isBengali, getLocalizedContent } = useLanguage();

  // Format relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
      return isBengali ? "এইমাত্র" : "Just now";
    } else if (diffMins < 60) {
      return isBengali ? `${diffMins} মিনিট আগে` : `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return isBengali ? `${diffHours} ঘণ্টা আগে` : `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return isBengali ? "গতকাল" : "Yesterday";
    } else if (diffDays < 7) {
      return isBengali ? `${diffDays} দিন আগে` : `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString(isBengali ? "bn-BD" : "en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 90) return "text-emerald-400 bg-emerald-500/20";
    if (score >= 70) return "text-blue-400 bg-blue-500/20";
    if (score >= 50) return "text-yellow-400 bg-yellow-500/20";
    return "text-red-400 bg-red-500/20";
  };

  return (
    <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold text-ds-text ${isBengali ? "font-bangla" : ""}`}>
          {isBengali ? "সাম্প্রতিক কার্যকলাপ" : "Recent Activity"}
        </h2>
        <HiOutlineClock className="w-5 h-5 text-ds-muted" />
      </div>

      {/* Activity List */}
      {recentProgress.length === 0 ? (
        <div className="text-center py-8">
          <HiOutlineBookOpen className="w-12 h-12 text-ds-border mx-auto mb-3" />
          <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
            {isBengali ? "এখনো কোনো কার্যকলাপ নেই" : "No activity yet"}
          </p>
          <Link
            to="/courses"
            className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-ds-text text-ds-bg font-semibold hover:shadow-lg transition-all ${
              isBengali ? "font-bangla" : ""
            }`}
          >
            <HiOutlinePlay className="w-4 h-4" />
            {isBengali ? "শেখা শুরু করুন" : "Start Learning"}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recentProgress.slice(0, 5).map((activity, index) => (
            <Link
              key={activity._id || index}
              to={`/lessons/${activity.lessonId}`}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-ds-bg/30 transition-colors group"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <HiOutlineCheckCircle className="w-5 h-5 text-emerald-400" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium text-ds-text truncate group-hover:text-ds-muted transition-colors ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {getLocalizedContent(activity.lesson?.title) ||
                    (isBengali ? "পাঠ সম্পন্ন" : "Lesson Completed")}
                </p>
                <p className={`text-sm text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                  {getRelativeTime(activity.completedAt)}
                </p>
              </div>

              {/* Score */}
              <div className={`px-3 py-1 rounded-lg text-sm font-semibold ${getScoreColor(activity.score)}`}>
                {activity.score}%
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
