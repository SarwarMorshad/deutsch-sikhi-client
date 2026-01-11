import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { HiOutlineBookOpen, HiOutlineAcademicCap, HiOutlineChartBar, HiOutlineClock } from "react-icons/hi";

const ProgressOverview = ({ progress }) => {
  const { t } = useTranslation();
  const { isBengali } = useLanguage();

  const stats = [
    {
      id: "completed",
      label: isBengali ? "সম্পন্ন পাঠ" : "Lessons Completed",
      value: progress?.completedLessons || 0,
      total: progress?.totalLessons || 0,
      icon: HiOutlineBookOpen,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-400",
    },
    {
      id: "overall",
      label: isBengali ? "সামগ্রিক অগ্রগতি" : "Overall Progress",
      value: `${progress?.overallPercentage || 0}%`,
      icon: HiOutlineChartBar,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-400",
    },
    {
      id: "score",
      label: isBengali ? "গড় স্কোর" : "Average Score",
      value: `${progress?.averageScore || 0}%`,
      icon: HiOutlineAcademicCap,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-400",
    },
    {
      id: "words",
      label: isBengali ? "শেখা শব্দ" : "Words Learned",
      value: progress?.wordsLearned || (progress?.completedLessons || 0) * 8,
      icon: HiOutlineClock,
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-500/10",
      textColor: "text-orange-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.id}
            className={`relative p-5 rounded-2xl ${stat.bgColor} border border-ds-border/20 overflow-hidden group hover:scale-[1.02] transition-transform`}
          >
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}
            ></div>

            {/* Icon */}
            <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${stat.textColor}`} />
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl md:text-3xl font-bold ${stat.textColor}`}>{stat.value}</span>
              {stat.total && <span className="text-ds-muted text-sm">/ {stat.total}</span>}
            </div>

            {/* Label */}
            <p className={`text-ds-muted text-sm mt-1 ${isBengali ? "font-bangla" : ""}`}>{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressOverview;
