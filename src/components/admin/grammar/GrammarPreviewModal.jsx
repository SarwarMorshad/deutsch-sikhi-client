import { useState } from "react";
import {
  HiOutlineX,
  HiOutlineEye,
  HiOutlineGlobeAlt,
  HiOutlineDeviceMobile,
  HiOutlineDesktopComputer,
  HiOutlineAcademicCap,
  HiOutlineLightBulb,
  HiOutlineExclamation,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
} from "react-icons/hi";

// ============================================
// BLOCK RENDERERS (Same as GrammarDetail.jsx)
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
  const caption = isBengali && data.caption_bn ? data.caption_bn : data.caption_en;
  if (!data.url) return null;

  return (
    <div className="space-y-2">
      <div className="relative rounded-xl overflow-hidden border border-ds-border/30">
        <img
          src={data.url}
          alt={data.alt || caption || "Grammar illustration"}
          className="w-full object-contain max-h-96"
        />
      </div>
      {caption && (
        <p className={`text-sm text-ds-muted text-center italic ${isBengali ? "font-bangla" : ""}`}>
          {caption}
        </p>
      )}
    </div>
  );
};

// Examples Block Renderer
const ExamplesBlockRenderer = ({ data, isBengali }) => {
  const examples = data.examples || [];
  if (examples.length === 0) return null;

  return (
    <div className="space-y-4">
      {examples.map((example, index) => (
        <div
          key={example.id || index}
          className="p-4 rounded-xl bg-gradient-to-r from-ds-surface/50 to-ds-surface/30 border border-ds-border/20"
        >
          <p className="text-lg font-semibold text-ds-text">"{example.german}"</p>
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

// Quiz Block Renderer (Preview - non-interactive)
const QuizBlockRenderer = ({ data, isBengali }) => {
  const question = isBengali && data.question_bn ? data.question_bn : data.question_en;
  const options = data.options || [];
  if (!question || options.length === 0) return null;

  const correctIndex = options.findIndex((opt) => opt.isCorrect);

  return (
    <div className="p-5 rounded-xl bg-ds-surface/30 border border-ds-border/30 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-ds-border/30 flex items-center justify-center flex-shrink-0">
          <span className="text-ds-text font-bold">?</span>
        </div>
        <p className={`text-lg font-medium text-ds-text ${isBengali ? "font-bangla" : ""}`}>{question}</p>
      </div>
      <div className="space-y-2 pl-11">
        {options.map((option, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl border-2 ${
              index === correctIndex ? "border-emerald-500 bg-emerald-500/10" : "border-ds-border/30"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                  index === correctIndex
                    ? "border-emerald-500 text-emerald-400"
                    : "border-ds-muted text-ds-muted"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-ds-text">{option.text}</span>
              {index === correctIndex && (
                <HiOutlineCheckCircle className="w-5 h-5 text-emerald-400 ml-auto" />
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-ds-muted pl-11">* Correct answer highlighted in preview</p>
    </div>
  );
};

// Block Renderer
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
          Block type "{block.type}" not supported
        </div>
      );
  }
};

// ============================================
// MAIN PREVIEW MODAL COMPONENT
// ============================================

const GrammarPreviewModal = ({ formData, level, onClose }) => {
  const [isBengali, setIsBengali] = useState(false);
  const [viewMode, setViewMode] = useState("desktop"); // desktop, mobile

  const getTitle = () => (isBengali && formData.title.bn ? formData.title.bn : formData.title.en);
  const getDescription = () =>
    isBengali && formData.description?.bn ? formData.description.bn : formData.description?.en || "";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-ds-bg rounded-2xl border border-ds-border/30 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ds-border/30 bg-ds-surface/30">
          <div className="flex items-center gap-3">
            <HiOutlineEye className="w-5 h-5 text-ds-muted" />
            <h2 className="text-lg font-semibold text-ds-text">Preview Mode</h2>
            {formData.status === "draft" && (
              <span className="px-2 py-0.5 text-xs rounded bg-yellow-500/20 text-yellow-400">Draft</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex items-center gap-1 bg-ds-surface rounded-lg p-1">
              <button
                onClick={() => setIsBengali(false)}
                className={`px-3 py-1 text-sm rounded-md transition-colors cursor-pointer ${
                  !isBengali ? "bg-ds-border text-ds-text" : "text-ds-muted hover:text-ds-text"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setIsBengali(true)}
                className={`px-3 py-1 text-sm rounded-md transition-colors cursor-pointer font-bangla ${
                  isBengali ? "bg-ds-border text-ds-text" : "text-ds-muted hover:text-ds-text"
                }`}
              >
                বাং
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-ds-surface rounded-lg p-1">
              <button
                onClick={() => setViewMode("desktop")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "desktop" ? "bg-ds-border text-ds-text" : "text-ds-muted hover:text-ds-text"
                }`}
                title="Desktop view"
              >
                <HiOutlineDesktopComputer className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("mobile")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "mobile" ? "bg-ds-border text-ds-text" : "text-ds-muted hover:text-ds-text"
                }`}
                title="Mobile view"
              >
                <HiOutlineDeviceMobile className="w-4 h-4" />
              </button>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-ds-border/30 rounded-lg text-ds-muted hover:text-ds-text cursor-pointer"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto bg-ds-bg">
          <div
            className={`mx-auto transition-all duration-300 ${
              viewMode === "mobile" ? "max-w-sm" : "max-w-4xl"
            }`}
          >
            <div className="p-6 md:p-8">
              {/* Level Badge */}
              {level && (
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border mb-4 ${getLevelColor(
                    level.code
                  )}`}
                >
                  <HiOutlineAcademicCap className="w-4 h-4" />
                  {level.code}
                </span>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-ds-text mb-2">
                {formData.title.de || "Untitled"}
              </h1>
              <p className={`text-xl text-ds-muted ${isBengali ? "font-bangla" : ""}`}>{getTitle()}</p>

              {/* Description */}
              {getDescription() && (
                <p className={`mt-4 text-ds-muted ${isBengali ? "font-bangla" : ""}`}>{getDescription()}</p>
              )}

              {/* Content Blocks */}
              <div className="mt-8 space-y-8">
                {formData.blocks && formData.blocks.length > 0 ? (
                  formData.blocks
                    .sort((a, b) => a.order - b.order)
                    .map((block) => (
                      <div key={block.id}>
                        <BlockRenderer block={block} isBengali={isBengali} />
                      </div>
                    ))
                ) : (
                  <div className="text-center py-12 bg-ds-surface/30 rounded-2xl border border-ds-border/30">
                    <p className="text-ds-muted">No content blocks yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-ds-border/30 bg-ds-surface/30 flex items-center justify-between">
          <p className="text-sm text-ds-muted">
            {formData.blocks?.length || 0} blocks • {formData.status === "published" ? "Published" : "Draft"}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-ds-text text-ds-bg rounded-xl font-medium hover:shadow-lg transition-all cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrammarPreviewModal;
