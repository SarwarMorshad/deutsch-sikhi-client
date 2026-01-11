import { useState } from "react";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import {
  HiOutlineVolumeUp,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineArrowRight,
} from "react-icons/hi";

const GrammarSection = ({ lesson, speakGerman, onNext }) => {
  const { t } = useTranslation();
  const { isBengali, getLocalizedContent } = useLanguage();
  const [expanded, setExpanded] = useState(true);

  if (!lesson.grammar) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-12 bg-ds-surface/30 rounded-2xl">
          <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>{t("lesson.grammar.noGrammar")}</p>
        </div>
        <button
          onClick={onNext}
          className={`w-full py-4 rounded-xl bg-ds-text text-ds-bg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all ${
            isBengali ? "font-bangla" : ""
          }`}
        >
          {t("lesson.continue.toPractice")}
          <HiOutlineArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className={`text-2xl font-bold text-ds-text mb-2 ${isBengali ? "font-bangla" : ""}`}>
          {t("lesson.grammar.title")}
        </h2>
        <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>{t("lesson.grammar.subtitle")}</p>
      </div>

      <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-6 flex items-center justify-between hover:bg-ds-surface/20 transition-colors"
        >
          <div className="text-left">
            <h3 className={`text-xl font-bold text-ds-text ${isBengali ? "font-bangla" : ""}`}>
              {getLocalizedContent(lesson.grammar.title)}
            </h3>
            <p className={`text-ds-muted ${isBengali ? "" : "font-bangla"}`}>
              {isBengali ? lesson.grammar.title?.en : lesson.grammar.title?.bn}
            </p>
          </div>
          {expanded ? (
            <HiOutlineChevronUp className="w-6 h-6 text-ds-muted" />
          ) : (
            <HiOutlineChevronDown className="w-6 h-6 text-ds-muted" />
          )}
        </button>

        {expanded && (
          <div className="px-6 pb-6 space-y-6">
            {/* Explanation */}
            <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className={`text-ds-text mb-2 ${isBengali ? "font-bangla" : ""}`}>
                {getLocalizedContent(lesson.grammar.explanation)}
              </p>
              <p className={`text-ds-muted text-sm ${isBengali ? "" : "font-bangla"}`}>
                {isBengali ? lesson.grammar.explanation?.en : lesson.grammar.explanation?.bn}
              </p>
            </div>

            {/* Rules */}
            <div className="space-y-3">
              {lesson.grammar.rules?.map((rule, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-ds-bg/50 border border-ds-border/20 flex flex-col md:flex-row md:items-center gap-3"
                >
                  <div className="flex-1">
                    <p className={`text-ds-text font-medium ${isBengali ? "font-bangla" : ""}`}>
                      {typeof rule.rule === "object" ? getLocalizedContent(rule.rule) : rule.rule}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ds-surface">
                    <span className="text-emerald-400 font-mono">{rule.example}</span>
                    <button
                      onClick={() => speakGerman(rule.example)}
                      className="p-1 rounded hover:bg-ds-bg/50"
                    >
                      <HiOutlineVolumeUp className="w-4 h-4 text-ds-muted" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onNext}
        className={`w-full py-4 rounded-xl bg-ds-text text-ds-bg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all ${
          isBengali ? "font-bangla" : ""
        }`}
      >
        {t("lesson.continue.toPractice")}
        <HiOutlineArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default GrammarSection;
