import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { publicAPI } from "../../utils/api";
import {
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineVolumeUp,
  HiOutlineRefresh,
  HiOutlineBookOpen,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineX,
  HiOutlineAcademicCap,
} from "react-icons/hi";

const Vocabulary = () => {
  const { t } = useTranslation();
  const { isBengali, getLocalizedContent } = useLanguage();

  // Data states
  const [words, setWords] = useState([]);
  const [levels, setLevels] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWords, setTotalWords] = useState(0);
  const WORDS_PER_PAGE = 12;

  // Flip card state
  const [flippedCards, setFlippedCards] = useState({});

  // Level colors
  const levelColors = {
    A1: "from-emerald-500 to-teal-600",
    A2: "from-blue-500 to-indigo-600",
    B1: "from-purple-500 to-pink-600",
  };

  // Fetch levels on mount
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await publicAPI.getLevels();
        setLevels(response.data || []);
      } catch (error) {
        console.error("Error fetching levels:", error);
      }
    };
    fetchLevels();
  }, []);

  // Fetch lessons when level changes
  useEffect(() => {
    const fetchLessons = async () => {
      if (!selectedLevel) {
        setLessons([]);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/levels/${selectedLevel}/lessons`
        );
        const data = await response.json();
        setLessons(data.data || []);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };
    fetchLessons();
    setSelectedLesson(""); // Reset lesson when level changes
  }, [selectedLevel]);

  // Fetch words
  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage,
          limit: WORDS_PER_PAGE,
        });

        if (selectedLevel) params.append("level", selectedLevel);
        if (selectedLesson) params.append("lesson", selectedLesson);
        if (searchQuery) params.append("search", searchQuery);

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/words?${params}`
        );
        const data = await response.json();

        setWords(data.data || []);
        setTotalPages(data.totalPages || 1);
        setTotalWords(data.total || 0);
      } catch (error) {
        console.error("Error fetching words:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchWords, 300);
    return () => clearTimeout(debounceTimer);
  }, [currentPage, selectedLevel, selectedLesson, searchQuery]);

  // Text-to-speech
  const speakGerman = (text) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // Toggle card flip
  const toggleFlip = (wordId) => {
    setFlippedCards((prev) => ({
      ...prev,
      [wordId]: !prev[wordId],
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedLevel("");
    setSelectedLesson("");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Get level code from level ID
  const getLevelCode = (levelId) => {
    const level = levels.find((l) => l._id === levelId);
    return level?.code || "A1";
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ds-surface/50 text-ds-muted text-sm mb-4 ${
              isBengali ? "font-bangla" : ""
            }`}
          >
            <HiOutlineBookOpen className="w-4 h-4" />
            <span>{isBengali ? "শব্দভান্ডার অন্বেষণ করুন" : "Explore Vocabulary"}</span>
          </div>
          <h1
            className={`text-4xl md:text-5xl font-black text-ds-text mb-4 ${isBengali ? "font-bangla" : ""}`}
          >
            {isBengali ? "জার্মান " : "German "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ds-muted to-ds-border">
              {isBengali ? "শব্দভান্ডার" : "Vocabulary"}
            </span>
          </h1>
          <p className={`text-ds-muted text-lg max-w-2xl mx-auto ${isBengali ? "font-bangla" : ""}`}>
            {isBengali
              ? "সমস্ত শব্দ ব্রাউজ করুন, অনুসন্ধান করুন এবং শিখুন"
              : "Browse, search, and learn all vocabulary words"}
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ds-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={
                  isBengali
                    ? "জার্মান, ইংরেজি বা বাংলায় খুঁজুন..."
                    : "Search in German, English or Bengali..."
                }
                className={`w-full pl-12 pr-4 py-4 rounded-xl bg-ds-surface/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border transition-colors ${
                  isBengali ? "font-bangla" : ""
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ds-muted hover:text-ds-text"
                >
                  <HiOutlineX className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`md:hidden flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-ds-surface/50 border border-ds-border/30 text-ds-text ${
                isBengali ? "font-bangla" : ""
              }`}
            >
              <HiOutlineFilter className="w-5 h-5" />
              {isBengali ? "ফিল্টার" : "Filters"}
            </button>

            {/* Desktop Filters */}
            <div className="hidden md:flex gap-3">
              {/* Level Filter */}
              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setCurrentPage(1);
                }}
                className={`px-4 py-4 rounded-xl bg-ds-surface/50 border border-ds-border/30 text-ds-text focus:outline-none focus:border-ds-border cursor-pointer ${
                  isBengali ? "font-bangla" : ""
                }`}
              >
                <option value="">{isBengali ? "সব লেভেল" : "All Levels"}</option>
                {levels.map((level) => (
                  <option key={level._id} value={level._id}>
                    {level.code} - {getLocalizedContent(level.title)}
                  </option>
                ))}
              </select>

              {/* Lesson Filter */}
              <select
                value={selectedLesson}
                onChange={(e) => {
                  setSelectedLesson(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={!selectedLevel}
                className={`px-4 py-4 rounded-xl bg-ds-surface/50 border border-ds-border/30 text-ds-text focus:outline-none focus:border-ds-border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  isBengali ? "font-bangla" : ""
                }`}
              >
                <option value="">{isBengali ? "সব পাঠ" : "All Lessons"}</option>
                {lessons.map((lesson) => (
                  <option key={lesson._id} value={lesson._id}>
                    {getLocalizedContent(lesson.title)}
                  </option>
                ))}
              </select>

              {/* Reset Button */}
              {(selectedLevel || selectedLesson || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-4 rounded-xl bg-ds-surface/50 border border-ds-border/30 text-ds-muted hover:text-ds-text hover:bg-ds-surface transition-colors"
                >
                  <HiOutlineRefresh className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <div className="md:hidden mt-4 p-4 rounded-xl bg-ds-surface/50 border border-ds-border/30 space-y-3">
              <select
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full px-4 py-3 rounded-lg bg-ds-bg border border-ds-border/30 text-ds-text ${
                  isBengali ? "font-bangla" : ""
                }`}
              >
                <option value="">{isBengali ? "সব লেভেল" : "All Levels"}</option>
                {levels.map((level) => (
                  <option key={level._id} value={level._id}>
                    {level.code} - {getLocalizedContent(level.title)}
                  </option>
                ))}
              </select>

              <select
                value={selectedLesson}
                onChange={(e) => {
                  setSelectedLesson(e.target.value);
                  setCurrentPage(1);
                }}
                disabled={!selectedLevel}
                className={`w-full px-4 py-3 rounded-lg bg-ds-bg border border-ds-border/30 text-ds-text disabled:opacity-50 ${
                  isBengali ? "font-bangla" : ""
                }`}
              >
                <option value="">{isBengali ? "সব পাঠ" : "All Lessons"}</option>
                {lessons.map((lesson) => (
                  <option key={lesson._id} value={lesson._id}>
                    {getLocalizedContent(lesson.title)}
                  </option>
                ))}
              </select>

              {(selectedLevel || selectedLesson || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className={`w-full py-3 rounded-lg bg-ds-bg border border-ds-border/30 text-ds-muted hover:text-ds-text flex items-center justify-center gap-2 ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  <HiOutlineRefresh className="w-4 h-4" />
                  {isBengali ? "রিসেট" : "Reset Filters"}
                </button>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className={`mt-4 text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
            {loading ? (
              <span>{isBengali ? "খুঁজছে..." : "Searching..."}</span>
            ) : (
              <span>{isBengali ? `${totalWords} টি শব্দ পাওয়া গেছে` : `Found ${totalWords} words`}</span>
            )}
          </div>
        </div>

        {/* Words Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-ds-muted border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>{t("common.loading")}</p>
            </div>
          </div>
        ) : words.length === 0 ? (
          <div className="text-center py-20 bg-ds-surface/30 rounded-2xl border border-ds-border/30">
            <HiOutlineBookOpen className="w-16 h-16 text-ds-border mx-auto mb-4" />
            <h3 className={`text-xl font-bold text-ds-text mb-2 ${isBengali ? "font-bangla" : ""}`}>
              {isBengali ? "কোনো শব্দ পাওয়া যায়নি" : "No words found"}
            </h3>
            <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
              {isBengali
                ? "আপনার অনুসন্ধান বা ফিল্টার পরিবর্তন করে দেখুন"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {words.map((word) => {
              const isFlipped = flippedCards[word._id];
              const levelCode = getLevelCode(word.levelId?.toString());
              const gradientColor = levelColors[levelCode] || levelColors.A1;

              return (
                <div
                  key={word._id}
                  onClick={() => toggleFlip(word._id)}
                  className="relative h-48 cursor-pointer perspective-1000"
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                      isFlipped ? "rotate-y-180" : ""
                    }`}
                  >
                    {/* Front of Card */}
                    <div className="absolute inset-0 backface-hidden">
                      <div className="h-full p-5 rounded-2xl bg-ds-surface/50 border border-ds-border/30 hover:border-ds-border transition-colors flex flex-col">
                        {/* Level Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`text-xs font-bold px-2 py-1 rounded-lg bg-gradient-to-r ${gradientColor} text-white`}
                          >
                            {levelCode}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakGerman(word.word_de);
                            }}
                            className="p-2 rounded-lg bg-ds-bg/50 text-ds-muted hover:text-ds-text hover:bg-ds-bg transition-colors"
                          >
                            <HiOutlineVolumeUp className="w-4 h-4" />
                          </button>
                        </div>

                        {/* German Word */}
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className="text-2xl font-bold text-ds-text mb-1">
                            {word.article && <span className="text-ds-muted">{word.article} </span>}
                            {word.word_de}
                          </h3>
                          {word.ipa && <p className="text-ds-muted text-sm">[{word.ipa}]</p>}
                        </div>

                        {/* Tap hint */}
                        <p className={`text-xs text-ds-border text-center ${isBengali ? "font-bangla" : ""}`}>
                          {isBengali ? "অর্থ দেখতে ট্যাপ করুন" : "Tap to see meaning"}
                        </p>
                      </div>
                    </div>

                    {/* Back of Card */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180">
                      <div
                        className={`h-full p-5 rounded-2xl bg-gradient-to-br ${gradientColor} flex flex-col`}
                      >
                        {/* Part of Speech */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium px-2 py-1 rounded-lg bg-white/20 text-white">
                            {word.partOfSpeech || "noun"}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              speakGerman(word.word_de);
                            }}
                            className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
                          >
                            <HiOutlineVolumeUp className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Meanings */}
                        <div className="flex-1 flex flex-col justify-center text-white">
                          <p className="text-lg font-semibold mb-2">{word.meaning_en}</p>
                          <p className="text-white/80 font-bangla">{word.meaning_bn}</p>
                        </div>

                        {/* German word reminder */}
                        <p className="text-xs text-white/60 text-center">
                          {word.article && `${word.article} `}
                          {word.word_de}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-xl bg-ds-surface/50 border border-ds-border/30 text-ds-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ds-surface transition-colors"
            >
              <HiOutlineChevronLeft className="w-5 h-5" />
            </button>

            <div
              className={`px-4 py-3 rounded-xl bg-ds-surface/50 border border-ds-border/30 text-ds-text ${
                isBengali ? "font-bangla" : ""
              }`}
            >
              {isBengali ? `পৃষ্ঠা ${currentPage} / ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl bg-ds-surface/50 border border-ds-border/30 text-ds-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-ds-surface transition-colors"
            >
              <HiOutlineChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* CSS for 3D flip effect */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default Vocabulary;
