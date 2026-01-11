import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import {
  HiOutlinePlay,
  HiOutlineLightningBolt,
  HiOutlineBookOpen,
  HiOutlineChevronRight,
  HiOutlineRefresh,
} from "react-icons/hi";

const QuickActions = ({ nextLesson, lastLesson }) => {
  const { t } = useTranslation();
  const { isBengali, getLocalizedContent } = useLanguage();

  const actions = [
    {
      id: "continue",
      title: isBengali ? "শেখা চালিয়ে যান" : "Continue Learning",
      description: nextLesson
        ? getLocalizedContent(nextLesson.title)
        : isBengali
        ? "পরবর্তী পাঠ শুরু করুন"
        : "Start your next lesson",
      icon: HiOutlinePlay,
      link: nextLesson ? `/lessons/${nextLesson._id}` : "/courses",
      color: "from-emerald-500 to-teal-600",
      primary: true,
    },
    {
      id: "practice",
      title: isBengali ? "অনুশীলন করুন" : "Practice Flashcards",
      description: isBengali ? "শব্দভান্ডার অনুশীলন করুন" : "Review vocabulary with flashcards",
      icon: HiOutlineLightningBolt,
      link: "/practice",
      color: "from-purple-500 to-pink-600",
    },
    {
      id: "vocabulary",
      title: isBengali ? "শব্দভান্ডার" : "Browse Vocabulary",
      description: isBengali ? "সমস্ত শব্দ দেখুন" : "Explore all words",
      icon: HiOutlineBookOpen,
      link: "/vocabulary",
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: "review",
      title: isBengali ? "পুনরায় পড়ুন" : "Review Last Lesson",
      description: lastLesson
        ? getLocalizedContent(lastLesson.title)
        : isBengali
        ? "শেষ পাঠ পর্যালোচনা করুন"
        : "Go back to your last lesson",
      icon: HiOutlineRefresh,
      link: lastLesson ? `/lessons/${lastLesson._id}` : "/courses",
      color: "from-orange-500 to-red-600",
      disabled: !lastLesson,
    },
  ];

  return (
    <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6">
      {/* Header */}
      <h2 className={`text-xl font-bold text-ds-text mb-6 ${isBengali ? "font-bangla" : ""}`}>
        {isBengali ? "দ্রুত অ্যাকশন" : "Quick Actions"}
      </h2>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          if (action.disabled) {
            return (
              <div
                key={action.id}
                className="p-4 rounded-xl bg-ds-surface/30 border border-ds-border/20 opacity-50 cursor-not-allowed"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-ds-bg/50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-ds-muted" />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                      {action.title}
                    </h3>
                    <p className={`text-sm text-ds-border mt-0.5 ${isBengali ? "font-bangla" : ""}`}>
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={action.id}
              to={action.link}
              className={`relative p-4 rounded-xl border transition-all group overflow-hidden ${
                action.primary
                  ? `bg-gradient-to-br ${action.color} border-transparent text-white hover:shadow-xl hover:scale-[1.02]`
                  : "bg-ds-surface/50 border-ds-border/30 hover:border-ds-border hover:bg-ds-surface"
              }`}
            >
              {/* Hover Effect */}
              {!action.primary && (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                ></div>
              )}

              <div className="flex items-start gap-3 relative">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    action.primary ? "bg-white/20" : `bg-gradient-to-br ${action.color} bg-opacity-20`
                  }`}
                >
                  <Icon className={`w-5 h-5 ${action.primary ? "text-white" : "text-ds-text"}`} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3
                      className={`font-semibold ${action.primary ? "text-white" : "text-ds-text"} ${
                        isBengali ? "font-bangla" : ""
                      }`}
                    >
                      {action.title}
                    </h3>
                    <HiOutlineChevronRight
                      className={`w-4 h-4 ${
                        action.primary ? "text-white/70" : "text-ds-muted"
                      } group-hover:translate-x-1 transition-transform`}
                    />
                  </div>
                  <p
                    className={`text-sm mt-0.5 line-clamp-1 ${
                      action.primary ? "text-white/80" : "text-ds-muted"
                    } ${isBengali ? "font-bangla" : ""}`}
                  >
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
