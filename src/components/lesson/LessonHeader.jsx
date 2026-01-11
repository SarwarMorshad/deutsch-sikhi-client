import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { HiOutlineArrowLeft } from "react-icons/hi";

const LessonHeader = ({ lesson, wordsCount, exercisesCount }) => {
  const { t } = useTranslation();
  const { isBengali, getLocalizedContent } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <button
        onClick={() => navigate(-1)}
        className={`flex items-center gap-2 text-ds-muted hover:text-ds-text transition-colors mb-4 ${
          isBengali ? "font-bangla" : ""
        }`}
      >
        <HiOutlineArrowLeft className="w-5 h-5" />
        {t("lesson.backToCourses")}
      </button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-ds-surface/50 to-ds-surface/30 border border-ds-border/30">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
              {lesson.levelCode || "A1"}
            </span>
            <span className="text-ds-border">•</span>
            <span className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
              {t("lesson.module")} {lesson.order || 1}
            </span>
          </div>
          <h1
            className={`text-2xl md:text-3xl font-bold text-ds-text mb-1 ${isBengali ? "font-bangla" : ""}`}
          >
            {getLocalizedContent(lesson.title)}
          </h1>
          <p className={`text-ds-muted ${isBengali ? "" : "font-bangla"}`}>
            {isBengali ? lesson.title?.en : lesson.title?.bn}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-center px-4 py-2 bg-ds-bg/50 rounded-xl">
            <div className="text-xl font-bold text-ds-text">{wordsCount}</div>
            <div className={`text-ds-muted text-xs ${isBengali ? "font-bangla" : ""}`}>
              {t("lesson.words")}
            </div>
          </div>
          <div className="text-center px-4 py-2 bg-ds-bg/50 rounded-xl">
            <div className="text-xl font-bold text-ds-text">{exercisesCount}</div>
            <div className={`text-ds-muted text-xs ${isBengali ? "font-bangla" : ""}`}>
              {t("lesson.questions")}
            </div>
          </div>
          <div className="text-center px-4 py-2 bg-ds-bg/50 rounded-xl">
            <div className="text-xl font-bold text-ds-text">{lesson.estimatedMinutes || 30}</div>
            <div className={`text-ds-muted text-xs ${isBengali ? "font-bangla" : ""}`}>
              {t("lesson.mins")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonHeader;
