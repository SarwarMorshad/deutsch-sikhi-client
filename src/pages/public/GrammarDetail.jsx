import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import axios from "axios";
import {
  HiOutlineArrowLeft,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineDocumentText,
  HiOutlineLink,
  HiOutlineChevronRight,
  HiOutlineLightBulb,
  HiOutlineExclamation,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
  HiOutlineX,
} from "react-icons/hi";

// ============================================
// BLOCK RENDERERS
// ============================================

// Text Block Renderer
const TextBlockRenderer = ({ data, isBengali }) => {
  const content = isBengali && data.content_bn ? data.content_bn : data.content_en;

  if (!content) return null;

  const paragraphs = content.split("\n\n");

  return (
    <div className={`prose prose-invert max-w-none ${isBengali ? "font-bangla" : ""}`}>
      {paragraphs.map((paragraph, index) => {
        if (paragraph.startsWith("### ")) {
          return (
            <h4 key={index} className="text-lg font-semibold text-ds-text mt-6 mb-3">
              {paragraph.replace("### ", "")}
            </h4>
          );
        }
        if (paragraph.startsWith("## ")) {
          return (
            <h3 key={index} className="text-xl font-bold text-ds-text mt-6 mb-3">
              {paragraph.replace("## ", "")}
            </h3>
          );
        }
        if (paragraph.startsWith("# ")) {
          return (
            <h2 key={index} className="text-2xl font-bold text-ds-text mt-6 mb-4">
              {paragraph.replace("# ", "")}
            </h2>
          );
        }

        if (paragraph.includes("\n- ") || paragraph.startsWith("- ")) {
          const items = paragraph.split("\n").filter((item) => item.startsWith("- "));
          return (
            <ul key={index} className="list-disc list-inside space-y-1 my-4 text-ds-text/90">
              {items.map((item, i) => (
                <li key={i}>{item.replace("- ", "")}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={index} className="text-ds-text/90 leading-relaxed my-4">
            {paragraph.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < paragraph.split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
};

// Table Block Renderer
const TableBlockRenderer = ({ data, isBengali }) => {
  const title = isBengali && data.title_bn ? data.title_bn : data.title_en;
  const headers = data.headers || [];
  const rows = data.rows || [];

  if (headers.length === 0) return null;

  return (
    <div className="space-y-3">
      {title && (
        <h4 className={`text-lg font-semibold text-ds-text ${isBengali ? "font-bangla" : ""}`}>{title}</h4>
      )}
      <div className="overflow-x-auto rounded-xl border border-ds-border/30">
        <table className="w-full">
          <thead>
            <tr className="bg-ds-surface/50">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-ds-text font-semibold text-center border-b border-ds-border/30"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-ds-bg/30" : "bg-ds-surface/20"}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`px-4 py-3 text-center border-b border-ds-border/20 ${
                      cellIndex === 0 ? "font-medium text-ds-text" : "text-ds-text/80"
                    }`}
                  >
                    {cell || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Image Block Renderer
const ImageBlockRenderer = ({ data, isBengali }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const caption = isBengali && data.caption_bn ? data.caption_bn : data.caption_en;

  if (!data.url) return null;

  return (
    <div className="space-y-2">
      <div
        className="relative rounded-xl overflow-hidden border border-ds-border/30 cursor-pointer group"
        onClick={() => setIsZoomed(true)}
      >
        <img
          src={data.url}
          alt={data.alt || caption || "Grammar illustration"}
          className="w-full object-contain max-h-96 transition-transform group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/50 px-3 py-1 rounded-full text-sm">
            Click to enlarge
          </span>
        </div>
      </div>

      {caption && (
        <p className={`text-sm text-ds-muted text-center italic ${isBengali ? "font-bangla" : ""}`}>
          {caption}
        </p>
      )}

      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={data.url}
            alt={data.alt || caption || "Grammar illustration"}
            className="max-w-full max-h-full object-contain"
          />
          <button
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            onClick={() => setIsZoomed(false)}
          >
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

// Examples Block Renderer
const ExamplesBlockRenderer = ({ data, isBengali }) => {
  const examples = data.examples || [];
  const [playingAudio, setPlayingAudio] = useState(null);

  if (examples.length === 0) return null;

  const playAudio = (audioUrl) => {
    if (playingAudio) {
      playingAudio.pause();
    }
    const audio = new Audio(audioUrl);
    audio.onended = () => setPlayingAudio(null);
    audio.play();
    setPlayingAudio(audio);
  };

  return (
    <div className="space-y-4">
      {examples.map((example, index) => (
        <div
          key={example.id || index}
          className="p-4 rounded-xl bg-gradient-to-r from-ds-surface/50 to-ds-surface/30 border border-ds-border/20"
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-lg font-semibold text-ds-text flex-1">"{example.german}"</p>
            {example.audio && (
              <button
                onClick={() => playAudio(example.audio)}
                className="p-2 rounded-lg bg-ds-border/20 text-ds-muted hover:text-ds-text hover:bg-ds-border/40 transition-colors cursor-pointer flex-shrink-0"
                title="Play audio"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="mt-2 space-y-1">
            {example.english && (
              <p className="text-ds-muted">
                <span className="text-ds-muted/60 text-sm mr-2">EN:</span>
                {example.english}
              </p>
            )}
            {example.bengali && (
              <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                <span className="text-ds-muted/60 text-sm mr-2">BN:</span>
                {example.bengali}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Tip Block Renderer
const TipBlockRenderer = ({ data, isBengali }) => {
  const tipType = data.type || "tip";
  const title = isBengali && data.title_bn ? data.title_bn : data.title_en;
  const content = isBengali && data.content_bn ? data.content_bn : data.content_en;

  if (!content) return null;

  const tipConfig = {
    info: {
      icon: HiOutlineInformationCircle,
      bgClass: "bg-blue-500/10",
      borderClass: "border-blue-500",
      iconClass: "text-blue-400",
    },
    tip: {
      icon: HiOutlineLightBulb,
      bgClass: "bg-yellow-500/10",
      borderClass: "border-yellow-500",
      iconClass: "text-yellow-400",
    },
    warning: {
      icon: HiOutlineExclamation,
      bgClass: "bg-orange-500/10",
      borderClass: "border-orange-500",
      iconClass: "text-orange-400",
    },
    success: {
      icon: HiOutlineCheckCircle,
      bgClass: "bg-emerald-500/10",
      borderClass: "border-emerald-500",
      iconClass: "text-emerald-400",
    },
  };

  const config = tipConfig[tipType] || tipConfig.tip;
  const Icon = config.icon;

  return (
    <div className={`p-4 rounded-xl border-l-4 ${config.bgClass} ${config.borderClass}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconClass}`} />
        <div className={isBengali ? "font-bangla" : ""}>
          {title && <p className="font-semibold text-ds-text mb-1">{title}</p>}
          <p className="text-ds-text/80">{content}</p>
        </div>
      </div>
    </div>
  );
};

// Comparison Block Renderer
const ComparisonBlockRenderer = ({ data, isBengali }) => {
  const title = isBengali && data.title_bn ? data.title_bn : data.title_en;
  const items = data.items || [];

  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      {title && (
        <h4 className={`text-lg font-semibold text-ds-text ${isBengali ? "font-bangla" : ""}`}>{title}</h4>
      )}
      <div className="overflow-x-auto rounded-xl border border-ds-border/30">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-emerald-500/10 text-emerald-400 font-semibold text-center border-b border-ds-border/30">
                {data.left_header || "Correct ✓"}
              </th>
              <th className="px-4 py-3 bg-red-500/10 text-red-400 font-semibold text-center border-b border-ds-border/30">
                {data.right_header || "Incorrect ✗"}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? "bg-ds-bg/30" : "bg-ds-surface/20"}>
                <td className="px-4 py-3 text-center border-b border-ds-border/20 text-ds-text">
                  {item.left || "-"}
                </td>
                <td className="px-4 py-3 text-center border-b border-ds-border/20 text-ds-muted">
                  {item.right || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Video Block Renderer
const VideoBlockRenderer = ({ data, isBengali }) => {
  const title = isBengali && data.title_bn ? data.title_bn : data.title_en;

  const getYouTubeId = (url) => {
    if (!url) return null;
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const videoId = getYouTubeId(data.url);

  if (!videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}${
    data.start_time ? `?start=${data.start_time}` : ""
  }`;

  return (
    <div className="space-y-3">
      {title && (
        <h4 className={`text-lg font-semibold text-ds-text ${isBengali ? "font-bangla" : ""}`}>{title}</h4>
      )}
      <div className="relative rounded-xl overflow-hidden border border-ds-border/30 bg-black aspect-video">
        <iframe
          src={embedUrl}
          title={title || "Video"}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

// Quiz Block Renderer
const QuizBlockRenderer = ({ data, isBengali }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const question = isBengali && data.question_bn ? data.question_bn : data.question_en;
  const explanation = isBengali && data.explanation_bn ? data.explanation_bn : data.explanation_en;
  const options = data.options || [];

  if (!question || options.length === 0) return null;

  const correctIndex = options.findIndex((opt) => opt.isCorrect);
  const isCorrect = selectedOption === correctIndex;

  const handleSelect = (index) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
  };

  const handleReset = () => {
    setSelectedOption(null);
    setShowResult(false);
  };

  return (
    <div className="p-5 rounded-xl bg-ds-surface/30 border border-ds-border/30 space-y-4">
      {/* Question */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-ds-border/30 flex items-center justify-center flex-shrink-0">
          <span className="text-ds-text font-bold">?</span>
        </div>
        <p className={`text-lg font-medium text-ds-text ${isBengali ? "font-bangla" : ""}`}>{question}</p>
      </div>

      {/* Options */}
      <div className="space-y-2 pl-11">
        {options.map((option, index) => {
          let optionClass = "border-ds-border/30 hover:border-ds-border hover:bg-ds-bg/50";

          if (showResult) {
            if (index === correctIndex) {
              optionClass = "border-emerald-500 bg-emerald-500/10";
            } else if (index === selectedOption && !isCorrect) {
              optionClass = "border-red-500 bg-red-500/10";
            } else {
              optionClass = "border-ds-border/20 opacity-50";
            }
          } else if (selectedOption === index) {
            optionClass = "border-ds-text bg-ds-bg/50";
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showResult}
              className={`w-full p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${optionClass}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                    showResult && index === correctIndex
                      ? "border-emerald-500 text-emerald-400"
                      : showResult && index === selectedOption && !isCorrect
                      ? "border-red-500 text-red-400"
                      : "border-ds-muted text-ds-muted"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="text-ds-text">{option.text}</span>
                {showResult && index === correctIndex && (
                  <HiOutlineCheckCircle className="w-5 h-5 text-emerald-400 ml-auto" />
                )}
                {showResult && index === selectedOption && !isCorrect && (
                  <HiOutlineX className="w-5 h-5 text-red-400 ml-auto" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Result & Explanation */}
      {showResult && (
        <div className="pl-11 space-y-3">
          <div
            className={`p-3 rounded-lg ${
              isCorrect ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
            }`}
          >
            <p className="font-semibold">{isCorrect ? "✓ Correct!" : "✗ Incorrect"}</p>
          </div>

          {explanation && (
            <div className="p-3 rounded-lg bg-ds-bg/50">
              <p className={`text-sm text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                <span className="font-semibold text-ds-text">Explanation:</span> {explanation}
              </p>
            </div>
          )}

          <button
            onClick={handleReset}
            className="text-sm text-ds-muted hover:text-ds-text transition-colors cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================
// BLOCK RENDERER - Routes to appropriate component
// ============================================
const BlockRenderer = ({ block, isBengali }) => {
  switch (block.type) {
    case "text":
      return <TextBlockRenderer data={block.data} isBengali={isBengali} />;
    case "table":
      return <TableBlockRenderer data={block.data} isBengali={isBengali} />;
    case "image":
      return <ImageBlockRenderer data={block.data} isBengali={isBengali} />;
    case "examples":
      return <ExamplesBlockRenderer data={block.data} isBengali={isBengali} />;
    case "tip":
      return <TipBlockRenderer data={block.data} isBengali={isBengali} />;
    case "comparison":
      return <ComparisonBlockRenderer data={block.data} isBengali={isBengali} />;
    case "video":
      return <VideoBlockRenderer data={block.data} isBengali={isBengali} />;
    case "quiz":
      return <QuizBlockRenderer data={block.data} isBengali={isBengali} />;
    default:
      return (
        <div className="p-4 bg-ds-surface/30 rounded-xl text-ds-muted text-center">
          Block type "{block.type}" is not supported
        </div>
      );
  }
};

// ============================================
// MAIN GRAMMAR DETAIL PAGE
// ============================================
const GrammarDetail = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { isBengali } = useLanguage();

  const [grammar, setGrammar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

  useEffect(() => {
    fetchGrammar();
  }, [slug]);

  const fetchGrammar = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/grammar/${slug}`);
      setGrammar(response.data.data);
    } catch (err) {
      console.error("Error fetching grammar:", err);
      setError(err.response?.data?.message || "Failed to load grammar topic");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (!grammar) return "";
    const localTitle = isBengali ? grammar.title.bn : grammar.title.en;
    return localTitle || grammar.title.en;
  };

  const getDescription = () => {
    if (!grammar) return "";
    const localDesc = isBengali ? grammar.description?.bn : grammar.description?.en;
    return localDesc || grammar.description?.en || "";
  };

  const getLevelColor = (code) => {
    switch (code) {
      case "A1":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "A2":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "B1":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-ds-muted/20 text-ds-muted border-ds-muted/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ds-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-ds-muted/30 border-t-ds-muted rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !grammar) {
    return (
      <div className="min-h-screen bg-ds-bg">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center py-16">
            <HiOutlineDocumentText className="w-16 h-16 text-ds-muted mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-ds-text mb-2">
              {t("grammar.notFound", "Grammar Topic Not Found")}
            </h1>
            <p className="text-ds-muted mb-6">
              {t("grammar.notFoundDesc", "The grammar topic you're looking for doesn't exist.")}
            </p>
            <Link
              to="/grammar"
              className="inline-flex items-center gap-2 px-6 py-3 bg-ds-text text-ds-bg rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
              {t("grammar.backToGrammar", "Back to Grammar")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ds-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-ds-muted mb-6">
          <Link to="/grammar" className="hover:text-ds-text transition-colors">
            {t("grammar.title", "Grammar")}
          </Link>
          <HiOutlineChevronRight className="w-4 h-4" />
          <span className="text-ds-text truncate">{grammar.title.de}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          {grammar.level && (
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border mb-4 ${getLevelColor(
                grammar.level.code
              )}`}
            >
              <HiOutlineAcademicCap className="w-4 h-4" />
              {grammar.level.code}
            </span>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-ds-text mb-2">{grammar.title.de}</h1>
          <p className={`text-xl text-ds-muted ${isBengali ? "font-bangla" : ""}`}>{getTitle()}</p>

          {getDescription() && (
            <p className={`mt-4 text-ds-muted ${isBengali ? "font-bangla" : ""}`}>{getDescription()}</p>
          )}
        </div>

        {/* Content Blocks */}
        <div className="space-y-8">
          {grammar.blocks && grammar.blocks.length > 0 ? (
            grammar.blocks
              .sort((a, b) => a.order - b.order)
              .map((block) => (
                <div key={block.id}>
                  <BlockRenderer block={block} isBengali={isBengali} />
                </div>
              ))
          ) : (
            <div className="text-center py-12 bg-ds-surface/30 rounded-2xl border border-ds-border/30">
              <HiOutlineDocumentText className="w-12 h-12 text-ds-muted mx-auto mb-3" />
              <p className="text-ds-muted">{t("grammar.noContent", "No content available yet")}</p>
            </div>
          )}
        </div>

        {/* Related Lessons */}
        {grammar.lessons && grammar.lessons.length > 0 && (
          <div className="mt-12 pt-8 border-t border-ds-border/30">
            <h2 className="text-xl font-bold text-ds-text mb-4 flex items-center gap-2">
              <HiOutlineLink className="w-5 h-5" />
              {t("grammar.relatedLessons", "Related Lessons")}
            </h2>
            <div className="grid gap-3">
              {grammar.lessons.map((lesson) => {
                const lessonTitle =
                  typeof lesson.title === "object"
                    ? isBengali && lesson.title.bn
                      ? lesson.title.bn
                      : lesson.title.en || lesson.title.de
                    : lesson.title;

                return (
                  <Link
                    key={lesson._id}
                    to={`/lessons/${lesson._id}`}
                    className="flex items-center justify-between p-4 bg-ds-surface/30 rounded-xl border border-ds-border/30 hover:bg-ds-surface/50 hover:border-ds-border transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-ds-border/20 flex items-center justify-center">
                        <HiOutlineBookOpen className="w-5 h-5 text-ds-muted" />
                      </div>
                      <div>
                        <p className={`font-medium text-ds-text ${isBengali ? "font-bangla" : ""}`}>
                          {lessonTitle || "Untitled Lesson"}
                        </p>
                        <p className="text-sm text-ds-muted">
                          {t("grammar.module", "Module")} {lesson.order || 0}
                        </p>
                      </div>
                    </div>
                    <HiOutlineChevronRight className="w-5 h-5 text-ds-muted group-hover:text-ds-text transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-12">
          <Link
            to="/grammar"
            className="inline-flex items-center gap-2 text-ds-muted hover:text-ds-text transition-colors"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
            {t("grammar.backToGrammar", "Back to Grammar")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GrammarDetail;
