import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import axios from "axios";
import {
  HiOutlineArrowRight,
  HiOutlineChevronRight,
  HiOutlineAcademicCap,
  HiOutlineDocumentText,
  HiOutlineViewGrid,
  HiOutlinePhotograph,
  HiOutlineChatAlt,
  HiOutlineLightBulb,
  HiOutlineSwitchHorizontal,
  HiOutlinePlay,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// Block type icons for summary display
const BLOCK_ICONS = {
  text: HiOutlineDocumentText,
  table: HiOutlineViewGrid,
  image: HiOutlinePhotograph,
  examples: HiOutlineChatAlt,
  tip: HiOutlineLightBulb,
  comparison: HiOutlineSwitchHorizontal,
  video: HiOutlinePlay,
  quiz: HiOutlineQuestionMarkCircle,
};

const GrammarSection = ({ lesson, speakGerman, onNext }) => {
  const { t } = useTranslation();
  const { isBengali, getLocalizedContent } = useLanguage();

  const [grammarTopics, setGrammarTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch grammar topics linked to this lesson
  useEffect(() => {
    const fetchGrammarTopics = async () => {
      if (!lesson?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/grammar/by-lesson/${lesson._id}`);
        setGrammarTopics(response.data.data || []);
      } catch (err) {
        console.error("Error fetching grammar topics:", err);
        setGrammarTopics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGrammarTopics();
  }, [lesson?._id]);

  // Get localized title
  const getTitle = (topic) => {
    if (isBengali && topic.title?.bn) return topic.title.bn;
    return topic.title?.en || topic.title?.de || "Untitled";
  };

  // Get localized description
  const getDescription = (topic) => {
    if (isBengali && topic.description?.bn) return topic.description.bn;
    return topic.description?.en || "";
  };

  // Count block types for summary
  const getBlockSummary = (blocks) => {
    if (!blocks || blocks.length === 0) return [];
    const types = {};
    blocks.forEach((block) => {
      types[block.type] = (types[block.type] || 0) + 1;
    });
    return Object.entries(types).slice(0, 5);
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-ds-muted/30 border-t-ds-muted rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // No grammar topics state
  if (grammarTopics.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-ds-text mb-2">
            <span className="text-2xl">📘</span>
            <h2 className={`text-xl font-bold ${isBengali ? "font-bangla" : ""}`}>
              {t("lesson.grammar.title", "Grammar")}
            </h2>
          </div>
          <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
            {t("lesson.grammar.subtitle", "One simple rule at a time")}
          </p>
        </div>

        <div className="text-center py-12 bg-ds-surface/30 rounded-2xl border border-ds-border/30">
          <HiOutlineAcademicCap className="w-12 h-12 text-ds-muted mx-auto mb-3" />
          <p className={`text-ds-muted mb-2 ${isBengali ? "font-bangla" : ""}`}>
            {t("lesson.grammar.noGrammar", "No grammar topics for this lesson yet")}
          </p>
          <p className="text-ds-muted/60 text-sm">{isBengali ? "শীঘ্রই যোগ করা হবে" : "Coming soon"}</p>
        </div>

        <button
          onClick={onNext}
          className={`w-full py-4 rounded-xl bg-ds-text text-ds-bg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all cursor-pointer ${
            isBengali ? "font-bangla" : ""
          }`}
        >
          {t("lesson.continue.toPractice", "Continue to Practice")}
          <HiOutlineArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 text-ds-text mb-2">
          <span className="text-2xl">📘</span>
          <h2 className={`text-xl font-bold ${isBengali ? "font-bangla" : ""}`}>
            {t("lesson.grammar.title", "Grammar")}
          </h2>
        </div>
        <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
          {t("lesson.grammar.subtitle", "One simple rule at a time")}
        </p>
      </div>

      {/* Grammar Topics List */}
      <div className="space-y-4">
        {grammarTopics.map((topic) => {
          const blockSummary = getBlockSummary(topic.blocks);

          return (
            <Link
              key={topic._id}
              to={`/grammar/${topic.slug}`}
              className="block p-5 bg-ds-surface/30 rounded-2xl border border-ds-border/30 hover:bg-ds-surface/50 hover:border-ds-border transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* German Title */}
                  <h3 className="text-lg font-bold text-ds-text group-hover:text-ds-text transition-colors">
                    {topic.title?.de || "Untitled"}
                  </h3>

                  {/* Localized Title */}
                  <p className={`text-sm text-ds-muted mt-1 ${isBengali ? "font-bangla" : ""}`}>
                    {getTitle(topic)}
                  </p>

                  {/* Description */}
                  {getDescription(topic) && (
                    <p
                      className={`text-sm text-ds-muted/70 mt-3 line-clamp-2 ${
                        isBengali ? "font-bangla" : ""
                      }`}
                    >
                      {getDescription(topic)}
                    </p>
                  )}

                  {/* Block Types Summary */}
                  {blockSummary.length > 0 && (
                    <div className="flex items-center gap-4 mt-4">
                      {blockSummary.map(([type, count]) => {
                        const Icon = BLOCK_ICONS[type] || HiOutlineDocumentText;
                        const labels = {
                          text: "Text",
                          table: "Table",
                          image: "Image",
                          examples: "Examples",
                          tip: "Tips",
                          comparison: "Comparison",
                          video: "Video",
                          quiz: "Quiz",
                        };
                        return (
                          <div
                            key={type}
                            className="flex items-center gap-1.5 text-xs text-ds-muted/70"
                            title={`${count} ${labels[type] || type}`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{count}</span>
                          </div>
                        );
                      })}
                      <span className="text-xs text-ds-muted/50">
                        • {topic.blocks?.length || 0} {isBengali ? "ব্লক" : "blocks"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Arrow */}
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-ds-border/20 group-hover:bg-ds-border/40 transition-colors flex-shrink-0">
                  <HiOutlineChevronRight className="w-5 h-5 text-ds-muted group-hover:text-ds-text transition-colors" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* View All Grammar Link */}
      <div className="text-center">
        <Link
          to="/grammar"
          className="inline-flex items-center gap-2 text-sm text-ds-muted hover:text-ds-text transition-colors"
        >
          <HiOutlineAcademicCap className="w-4 h-4" />
          {isBengali ? "সব ব্যাকরণ বিষয় দেখুন" : "View all grammar topics"}
          <HiOutlineChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Continue Button */}
      <button
        onClick={onNext}
        className={`w-full py-4 rounded-xl bg-ds-text text-ds-bg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all cursor-pointer ${
          isBengali ? "font-bangla" : ""
        }`}
      >
        {t("lesson.continue.toPractice", "Continue to Practice")}
        <HiOutlineArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default GrammarSection;
