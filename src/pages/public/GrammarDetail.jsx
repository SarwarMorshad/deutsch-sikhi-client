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
} from "react-icons/hi";

// Text Block Renderer
const TextBlockRenderer = ({ data, isBengali }) => {
  const content = isBengali && data.content_bn ? data.content_bn : data.content_en;

  if (!content) return null;

  // Simple markdown-like rendering for paragraphs
  const paragraphs = content.split("\n\n").filter(Boolean);

  return (
    <div className={`prose prose-invert max-w-none ${isBengali ? "font-bangla" : ""}`}>
      {paragraphs.map((paragraph, index) => {
        // Check for headers (lines starting with #)
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

        // Check for bullet points
        if (paragraph.includes("\n- ") || paragraph.startsWith("- ")) {
          const items = paragraph.split("\n").filter((line) => line.startsWith("- "));
          return (
            <ul key={index} className="list-disc list-inside space-y-2 text-ds-text/90 my-4">
              {items.map((item, i) => (
                <li key={i}>{item.replace("- ", "")}</li>
              ))}
            </ul>
          );
        }

        // Regular paragraph
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

// Block Renderer - routes to appropriate component based on type
const BlockRenderer = ({ block, isBengali }) => {
  switch (block.type) {
    case "text":
      return <TextBlockRenderer data={block.data} isBengali={isBengali} />;

    // Future block types will be added here
    // case "table":
    //   return <TableBlockRenderer data={block.data} isBengali={isBengali} />;
    // case "image":
    //   return <ImageBlockRenderer data={block.data} isBengali={isBengali} />;
    // case "examples":
    //   return <ExamplesBlockRenderer data={block.data} isBengali={isBengali} />;
    // case "tip":
    //   return <TipBlockRenderer data={block.data} isBengali={isBengali} />;
    // case "comparison":
    //   return <ComparisonBlockRenderer data={block.data} isBengali={isBengali} />;
    // case "video":
    //   return <VideoBlockRenderer data={block.data} isBengali={isBengali} />;
    // case "quiz":
    //   return <QuizBlockRenderer data={block.data} isBengali={isBengali} />;

    default:
      return (
        <div className="p-4 rounded-xl bg-ds-surface/30 border border-ds-border/30 text-ds-muted text-center">
          Block type "{block.type}" not yet supported
        </div>
      );
  }
};

const GrammarDetail = () => {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { isBengali } = useLanguage();

  const [grammar, setGrammar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGrammar();
  }, [slug]);

  const fetchGrammar = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/grammar/${slug}`);
      setGrammar(response.data.data);
    } catch (err) {
      console.error("Error fetching grammar:", err);
      setError(isBengali ? "ব্যাকরণ লোড করতে সমস্যা হয়েছে" : "Failed to load grammar topic");
    } finally {
      setLoading(false);
    }
  };

  // Level colors
  const getLevelColor = (code) => {
    switch (code) {
      case "A1":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "A2":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "B1":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-ds-muted/20 text-ds-muted border-ds-border/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-ds-muted/30 border-t-ds-muted rounded-full animate-spin"></div>
          <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
            {isBengali ? "লোড হচ্ছে..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !grammar) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <HiOutlineDocumentText className="w-16 h-16 text-ds-muted mx-auto mb-4" />
          <h2 className={`text-2xl font-bold text-ds-text mb-2 ${isBengali ? "font-bangla" : ""}`}>
            {isBengali ? "ব্যাকরণ পাওয়া যায়নি" : "Grammar Not Found"}
          </h2>
          <p className={`text-ds-muted mb-6 ${isBengali ? "font-bangla" : ""}`}>
            {error || (isBengali ? "এই ব্যাকরণ বিষয়টি বিদ্যমান নেই" : "This grammar topic doesn't exist")}
          </p>
          <Link
            to="/grammar"
            className={`inline-flex items-center gap-2 px-6 py-3 bg-ds-text text-ds-bg rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer ${
              isBengali ? "font-bangla" : ""
            }`}
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
            {isBengali ? "ব্যাকরণে ফিরে যান" : "Back to Grammar"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-ds-muted mb-6">
          <Link to="/grammar" className="hover:text-ds-text transition-colors cursor-pointer">
            {isBengali ? "ব্যাকরণ" : "Grammar"}
          </Link>
          <span>/</span>
          <span className="text-ds-text">{grammar.title?.de}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-lg text-sm font-medium border ${getLevelColor(
                grammar.level?.code
              )}`}
            >
              {grammar.level?.code}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-ds-text mb-2">{grammar.title?.de}</h1>

          <p className={`text-xl text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
            {isBengali && grammar.title?.bn ? grammar.title.bn : grammar.title?.en}
          </p>

          {grammar.description && (grammar.description.en || grammar.description.bn) && (
            <p className={`text-ds-muted/80 mt-4 ${isBengali ? "font-bangla" : ""}`}>
              {isBengali && grammar.description?.bn ? grammar.description.bn : grammar.description?.en}
            </p>
          )}
        </div>

        {/* Content Blocks */}
        {grammar.blocks && grammar.blocks.length > 0 ? (
          <div className="space-y-6">
            {grammar.blocks
              .sort((a, b) => a.order - b.order)
              .map((block) => (
                <div key={block.id} className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6">
                  <BlockRenderer block={block} isBengali={isBengali} />
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-ds-surface/30 rounded-2xl border border-ds-border/30">
            <HiOutlineDocumentText className="w-12 h-12 text-ds-muted mx-auto mb-3" />
            <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
              {isBengali ? "এই বিষয়ে কোনো কন্টেন্ট নেই" : "No content available for this topic"}
            </p>
          </div>
        )}

        {/* Linked Lessons */}
        {grammar.lessons && grammar.lessons.length > 0 && (
          <div className="mt-10">
            <h2
              className={`text-xl font-bold text-ds-text mb-4 flex items-center gap-2 ${
                isBengali ? "font-bangla" : ""
              }`}
            >
              <HiOutlineLink className="w-5 h-5 text-ds-muted" />
              {isBengali ? "সম্পর্কিত পাঠ" : "Related Lessons"}
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {grammar.lessons.map((lesson) => (
                <Link
                  key={lesson._id}
                  to={`/lessons/${lesson._id}`}
                  className="group flex items-center justify-between p-4 rounded-xl bg-ds-surface/30 border border-ds-border/30 hover:bg-ds-surface/50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-ds-border/20 flex items-center justify-center">
                      <HiOutlineBookOpen className="w-5 h-5 text-ds-muted" />
                    </div>
                    <div>
                      <p className="font-medium text-ds-text">{lesson.title}</p>
                      <p className="text-sm text-ds-muted">
                        {isBengali ? "মডিউল" : "Module"} {lesson.order}
                      </p>
                    </div>
                  </div>
                  <HiOutlineChevronRight className="w-5 h-5 text-ds-muted group-hover:text-ds-text group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-10 pt-6 border-t border-ds-border/30">
          <Link
            to="/grammar"
            className={`inline-flex items-center gap-2 text-ds-muted hover:text-ds-text transition-colors cursor-pointer ${
              isBengali ? "font-bangla" : ""
            }`}
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
            {isBengali ? "সব ব্যাকরণ দেখুন" : "View all grammar topics"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GrammarDetail;
