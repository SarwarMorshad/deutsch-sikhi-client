import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { publicAPI } from "../../utils/api";
import {
  HiOutlineRefresh,
  HiOutlineVolumeUp,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineLightningBolt,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlinePlay,
  HiOutlineAdjustments,
  HiOutlineChartBar,
} from "react-icons/hi";

const Practice = () => {
  const { t } = useTranslation();
  const { isBengali, getLocalizedContent } = useLanguage();

  // Data states
  const [words, setWords] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Practice states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Settings
  const [selectedLevel, setSelectedLevel] = useState("");
  const [wordCount, setWordCount] = useState(10);
  const [practiceMode, setPracticeMode] = useState("german-to-meaning"); // or "meaning-to-german"

  // Progress tracking
  const [knownWords, setKnownWords] = useState([]);
  const [unknownWords, setUnknownWords] = useState([]);
  const [sessionComplete, setSessionComplete] = useState(false);

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
      } finally {
        setLoading(false);
      }
    };
    fetchLevels();
  }, []);

  // Start practice session
  const startPractice = async () => {
    setLoading(true);
    try {
      let url = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"}/words/random/${wordCount}`;
      if (selectedLevel) {
        url += `?level=${selectedLevel}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        setWords(data.data);
        setCurrentIndex(0);
        setIsFlipped(false);
        setKnownWords([]);
        setUnknownWords([]);
        setSessionComplete(false);
        setPracticeStarted(true);
      }
    } catch (error) {
      console.error("Error fetching practice words:", error);
    } finally {
      setLoading(false);
    }
  };

  // Shuffle words
  const shuffleWords = () => {
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    setWords(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

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

  // Navigation
  const nextCard = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      setSessionComplete(true);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  // Mark word as known/unknown
  const markAsKnown = () => {
    const currentWord = words[currentIndex];
    if (!knownWords.includes(currentWord._id)) {
      setKnownWords((prev) => [...prev, currentWord._id]);
      setUnknownWords((prev) => prev.filter((id) => id !== currentWord._id));
    }
    nextCard();
  };

  const markAsUnknown = () => {
    const currentWord = words[currentIndex];
    if (!unknownWords.includes(currentWord._id)) {
      setUnknownWords((prev) => [...prev, currentWord._id]);
      setKnownWords((prev) => prev.filter((id) => id !== currentWord._id));
    }
    nextCard();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!practiceStarted || sessionComplete) return;

      switch (e.key) {
        case " ":
          e.preventDefault();
          setIsFlipped((prev) => !prev);
          break;
        case "ArrowRight":
          nextCard();
          break;
        case "ArrowLeft":
          prevCard();
          break;
        case "1":
          markAsKnown();
          break;
        case "2":
          markAsUnknown();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [practiceStarted, sessionComplete, currentIndex]);

  // Restart with unknown words
  const practiceUnknownOnly = () => {
    const unknownWordsList = words.filter((w) => unknownWords.includes(w._id));
    if (unknownWordsList.length > 0) {
      setWords(unknownWordsList);
      setCurrentIndex(0);
      setIsFlipped(false);
      setKnownWords([]);
      setUnknownWords([]);
      setSessionComplete(false);
    }
  };

  // Reset practice
  const resetPractice = () => {
    setPracticeStarted(false);
    setSessionComplete(false);
    setWords([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setKnownWords([]);
    setUnknownWords([]);
  };

  // Get level code
  const getLevelCode = (levelId) => {
    const level = levels.find((l) => l._id === levelId?.toString());
    return level?.code || "A1";
  };

  const currentWord = words[currentIndex];
  const progress = words.length > 0 ? ((currentIndex + 1) / words.length) * 100 : 0;

  // Loading state
  if (loading && !practiceStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-ds-muted border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  // Start Screen
  if (!practiceStarted) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ds-surface/50 text-ds-muted text-sm mb-4 ${
                isBengali ? "font-bangla" : ""
              }`}
            >
              <HiOutlineLightningBolt className="w-4 h-4" />
              <span>{isBengali ? "ফ্ল্যাশকার্ড অনুশীলন" : "Flashcard Practice"}</span>
            </div>
            <h1
              className={`text-4xl md:text-5xl font-black text-ds-text mb-4 ${
                isBengali ? "font-bangla" : ""
              }`}
            >
              {isBengali ? "অনুশীলন " : "Practice "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-ds-muted to-ds-border">
                {isBengali ? "মোড" : "Mode"}
              </span>
            </h1>
            <p className={`text-ds-muted text-lg ${isBengali ? "font-bangla" : ""}`}>
              {isBengali
                ? "ফ্ল্যাশকার্ড দিয়ে আপনার শব্দভান্ডার পরীক্ষা করুন"
                : "Test your vocabulary with flashcards"}
            </p>
          </div>

          {/* Settings Card */}
          <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6 space-y-6">
            {/* Level Selection */}
            <div>
              <label className={`block text-ds-text font-semibold mb-3 ${isBengali ? "font-bangla" : ""}`}>
                {isBengali ? "লেভেল নির্বাচন করুন" : "Select Level"}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => setSelectedLevel("")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedLevel === ""
                      ? "border-ds-text bg-ds-text text-ds-bg"
                      : "border-ds-border/30 text-ds-text hover:border-ds-border"
                  }`}
                >
                  <span className={`font-semibold ${isBengali ? "font-bangla" : ""}`}>
                    {isBengali ? "সব" : "All"}
                  </span>
                </button>
                {levels.map((level) => (
                  <button
                    key={level._id}
                    onClick={() => setSelectedLevel(level._id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedLevel === level._id
                        ? `border-transparent bg-gradient-to-r ${levelColors[level.code]} text-white`
                        : "border-ds-border/30 text-ds-text hover:border-ds-border"
                    }`}
                  >
                    <span className="font-bold text-lg">{level.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Word Count */}
            <div>
              <label className={`block text-ds-text font-semibold mb-3 ${isBengali ? "font-bangla" : ""}`}>
                {isBengali ? "শব্দ সংখ্যা" : "Number of Words"}
              </label>
              <div className="flex gap-3">
                {[5, 10, 20, 30].map((count) => (
                  <button
                    key={count}
                    onClick={() => setWordCount(count)}
                    className={`flex-1 p-3 rounded-xl border-2 font-semibold transition-all ${
                      wordCount === count
                        ? "border-ds-text bg-ds-text text-ds-bg"
                        : "border-ds-border/30 text-ds-text hover:border-ds-border"
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Practice Mode */}
            <div>
              <label className={`block text-ds-text font-semibold mb-3 ${isBengali ? "font-bangla" : ""}`}>
                {isBengali ? "অনুশীলন মোড" : "Practice Mode"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setPracticeMode("german-to-meaning")}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    practiceMode === "german-to-meaning"
                      ? "border-ds-text bg-ds-text/10"
                      : "border-ds-border/30 hover:border-ds-border"
                  }`}
                >
                  <div className="font-semibold text-ds-text mb-1">🇩🇪 → 🇬🇧/🇧🇩</div>
                  <div className={`text-sm text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                    {isBengali ? "জার্মান থেকে অর্থ" : "German to Meaning"}
                  </div>
                </button>
                <button
                  onClick={() => setPracticeMode("meaning-to-german")}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    practiceMode === "meaning-to-german"
                      ? "border-ds-text bg-ds-text/10"
                      : "border-ds-border/30 hover:border-ds-border"
                  }`}
                >
                  <div className="font-semibold text-ds-text mb-1">🇬🇧/🇧🇩 → 🇩🇪</div>
                  <div className={`text-sm text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                    {isBengali ? "অর্থ থেকে জার্মান" : "Meaning to German"}
                  </div>
                </button>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startPractice}
              disabled={loading}
              className={`w-full py-4 rounded-xl bg-gradient-to-r from-ds-muted to-ds-border text-ds-bg font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50 ${
                isBengali ? "font-bangla" : ""
              }`}
            >
              <HiOutlinePlay className="w-6 h-6" />
              {isBengali ? "অনুশীলন শুরু করুন" : "Start Practice"}
            </button>

            {/* Keyboard Shortcuts */}
            <div className={`text-center text-sm text-ds-border ${isBengali ? "font-bangla" : ""}`}>
              <p>{isBengali ? "কীবোর্ড শর্টকাট:" : "Keyboard shortcuts:"}</p>
              <p className="mt-1">
                <kbd className="px-2 py-1 bg-ds-surface rounded text-xs">Space</kbd>{" "}
                {isBengali ? "ফ্লিপ" : "Flip"} •
                <kbd className="px-2 py-1 bg-ds-surface rounded text-xs ml-2">←</kbd>
                <kbd className="px-2 py-1 bg-ds-surface rounded text-xs">→</kbd>{" "}
                {isBengali ? "নেভিগেট" : "Navigate"} •
                <kbd className="px-2 py-1 bg-ds-surface rounded text-xs ml-2">1</kbd>{" "}
                {isBengali ? "জানি" : "Know"} •
                <kbd className="px-2 py-1 bg-ds-surface rounded text-xs ml-2">2</kbd>{" "}
                {isBengali ? "জানি না" : "Don't Know"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Session Complete Screen
  if (sessionComplete) {
    const knownCount = knownWords.length;
    const unknownCount = unknownWords.length;
    const totalAnswered = knownCount + unknownCount;
    const accuracy = totalAnswered > 0 ? Math.round((knownCount / totalAnswered) * 100) : 0;

    return (
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-8">
            {/* Celebration Icon */}
            <div
              className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                accuracy >= 70 ? "bg-green-500/20" : "bg-yellow-500/20"
              }`}
            >
              <HiOutlineChartBar
                className={`w-12 h-12 ${accuracy >= 70 ? "text-green-400" : "text-yellow-400"}`}
              />
            </div>

            {/* Title */}
            <h2 className={`text-3xl font-bold text-ds-text mb-2 ${isBengali ? "font-bangla" : ""}`}>
              {isBengali ? "অনুশীলন সম্পন্ন! 🎉" : "Practice Complete! 🎉"}
            </h2>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 my-8">
              <div className="p-4 rounded-xl bg-ds-bg/50">
                <div className="text-3xl font-black text-ds-text">{words.length}</div>
                <div className={`text-sm text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                  {isBengali ? "মোট শব্দ" : "Total Words"}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-green-500/10">
                <div className="text-3xl font-black text-green-400">{knownCount}</div>
                <div className={`text-sm text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                  {isBengali ? "জানি" : "Known"}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-red-500/10">
                <div className="text-3xl font-black text-red-400">{unknownCount}</div>
                <div className={`text-sm text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                  {isBengali ? "শিখতে হবে" : "To Learn"}
                </div>
              </div>
            </div>

            {/* Accuracy */}
            <div className="mb-8">
              <div className="text-5xl font-black text-ds-text mb-2">{accuracy}%</div>
              <div className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
                {isBengali ? "নির্ভুলতা" : "Accuracy"}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {unknownCount > 0 && (
                <button
                  onClick={practiceUnknownOnly}
                  className={`px-6 py-3 rounded-xl bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30 transition-all ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {isBengali ? `অজানা ${unknownCount}টি অনুশীলন করুন` : `Practice ${unknownCount} Unknown`}
                </button>
              )}
              <button
                onClick={startPractice}
                className={`px-6 py-3 rounded-xl bg-ds-text text-ds-bg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isBengali ? "font-bangla" : ""
                }`}
              >
                <HiOutlineRefresh className="w-5 h-5" />
                {isBengali ? "নতুন সেশন" : "New Session"}
              </button>
              <button
                onClick={resetPractice}
                className={`px-6 py-3 rounded-xl border-2 border-ds-border/30 text-ds-text font-semibold hover:bg-ds-surface transition-all ${
                  isBengali ? "font-bangla" : ""
                }`}
              >
                {isBengali ? "সেটিংস" : "Settings"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Practice Mode - Flashcards
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={resetPractice}
              className={`text-ds-muted hover:text-ds-text transition-colors flex items-center gap-2 ${
                isBengali ? "font-bangla" : ""
              }`}
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
              {isBengali ? "বের হন" : "Exit"}
            </button>
            <div className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
              {currentIndex + 1} / {words.length}
            </div>
            <button onClick={shuffleWords} className="text-ds-muted hover:text-ds-text transition-colors">
              <HiOutlineRefresh className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-ds-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-ds-muted to-ds-border transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Flashcard */}
        {currentWord && (
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="relative h-80 sm:h-96 cursor-pointer perspective-1000 mb-6"
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                isFlipped ? "rotate-y-180" : ""
              }`}
            >
              {/* Front of Card */}
              <div className="absolute inset-0 backface-hidden">
                <div className="h-full p-8 rounded-3xl bg-ds-surface/50 border border-ds-border/30 flex flex-col items-center justify-center">
                  {/* Level Badge */}
                  <span
                    className={`absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-lg bg-gradient-to-r ${
                      levelColors[getLevelCode(currentWord.levelId)]
                    } text-white`}
                  >
                    {getLevelCode(currentWord.levelId)}
                  </span>

                  {/* Audio Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakGerman(currentWord.word_de);
                    }}
                    className="absolute top-4 right-4 p-3 rounded-xl bg-ds-bg/50 text-ds-muted hover:text-ds-text hover:bg-ds-bg transition-colors"
                  >
                    <HiOutlineVolumeUp className="w-6 h-6" />
                  </button>

                  {/* Content */}
                  {practiceMode === "german-to-meaning" ? (
                    <>
                      <h2 className="text-4xl sm:text-5xl font-bold text-ds-text mb-3">
                        {currentWord.article && <span className="text-ds-muted">{currentWord.article} </span>}
                        {currentWord.word_de}
                      </h2>
                      {currentWord.ipa && <p className="text-ds-muted text-lg">[{currentWord.ipa}]</p>}
                    </>
                  ) : (
                    <>
                      <p className="text-2xl sm:text-3xl font-semibold text-ds-text mb-3">
                        {currentWord.meaning_en}
                      </p>
                      <p className="text-xl text-ds-muted font-bangla">{currentWord.meaning_bn}</p>
                    </>
                  )}

                  {/* Hint */}
                  <div
                    className={`absolute bottom-4 flex items-center gap-2 text-ds-border ${
                      isBengali ? "font-bangla" : ""
                    }`}
                  >
                    <HiOutlineEye className="w-4 h-4" />
                    <span className="text-sm">
                      {isBengali ? "উত্তর দেখতে ট্যাপ করুন" : "Tap to reveal answer"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Back of Card */}
              <div className="absolute inset-0 backface-hidden rotate-y-180">
                <div
                  className={`h-full p-8 rounded-3xl bg-gradient-to-br ${
                    levelColors[getLevelCode(currentWord.levelId)]
                  } flex flex-col items-center justify-center text-white`}
                >
                  {/* Audio Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speakGerman(currentWord.word_de);
                    }}
                    className="absolute top-4 right-4 p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <HiOutlineVolumeUp className="w-6 h-6" />
                  </button>

                  {/* Content */}
                  {practiceMode === "german-to-meaning" ? (
                    <>
                      <p className="text-2xl sm:text-3xl font-semibold mb-4">{currentWord.meaning_en}</p>
                      <p className="text-xl text-white/80 font-bangla mb-4">{currentWord.meaning_bn}</p>
                      <p className="text-white/60 text-sm">{currentWord.partOfSpeech}</p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-4xl sm:text-5xl font-bold mb-3">
                        {currentWord.article && <span className="text-white/70">{currentWord.article} </span>}
                        {currentWord.word_de}
                      </h2>
                      {currentWord.ipa && <p className="text-white/70 text-lg">[{currentWord.ipa}]</p>}
                    </>
                  )}

                  {/* Hint */}
                  <div className="absolute bottom-4 flex items-center gap-2 text-white/60">
                    <HiOutlineEyeOff className="w-4 h-4" />
                    <span className={`text-sm ${isBengali ? "font-bangla" : ""}`}>
                      {isBengali ? "প্রশ্নে ফিরে যেতে ট্যাপ করুন" : "Tap to go back"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          {/* Previous */}
          <button
            onClick={prevCard}
            disabled={currentIndex === 0}
            className="p-4 rounded-xl bg-ds-surface/50 border border-ds-border/30 text-ds-text disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ds-surface transition-colors"
          >
            <HiOutlineArrowLeft className="w-6 h-6" />
          </button>

          {/* Don't Know */}
          <button
            onClick={markAsUnknown}
            className={`flex-1 max-w-[140px] py-4 rounded-xl bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30 transition-all flex items-center justify-center gap-2 ${
              isBengali ? "font-bangla" : ""
            }`}
          >
            <HiOutlineX className="w-5 h-5" />
            {isBengali ? "জানি না" : "Don't Know"}
          </button>

          {/* Know */}
          <button
            onClick={markAsKnown}
            className={`flex-1 max-w-[140px] py-4 rounded-xl bg-green-500/20 text-green-400 font-semibold hover:bg-green-500/30 transition-all flex items-center justify-center gap-2 ${
              isBengali ? "font-bangla" : ""
            }`}
          >
            <HiOutlineCheck className="w-5 h-5" />
            {isBengali ? "জানি" : "Know"}
          </button>

          {/* Next */}
          <button
            onClick={nextCard}
            disabled={currentIndex === words.length - 1}
            className="p-4 rounded-xl bg-ds-surface/50 border border-ds-border/30 text-ds-text disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ds-surface transition-colors"
          >
            <HiOutlineArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* Session Stats */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm">
          <div className={`flex items-center gap-2 text-green-400 ${isBengali ? "font-bangla" : ""}`}>
            <HiOutlineCheck className="w-4 h-4" />
            <span>
              {knownWords.length} {isBengali ? "জানি" : "Known"}
            </span>
          </div>
          <div className={`flex items-center gap-2 text-red-400 ${isBengali ? "font-bangla" : ""}`}>
            <HiOutlineX className="w-4 h-4" />
            <span>
              {unknownWords.length} {isBengali ? "শিখতে হবে" : "To Learn"}
            </span>
          </div>
        </div>
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

export default Practice;
