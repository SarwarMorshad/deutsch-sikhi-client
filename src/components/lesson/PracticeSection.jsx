import { useState } from "react";
import { HiOutlineVolumeUp, HiOutlineRefresh, HiOutlineArrowRight } from "react-icons/hi";

const PracticeSection = ({ words, speakGerman, onNext }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [practiceMode, setPracticeMode] = useState("flashcard"); // flashcard, listen, type

  const currentWord = words[currentWordIndex];

  const nextWord = () => {
    setShowAnswer(false);
    setCurrentWordIndex((prev) => (prev + 1) % words.length);
  };

  const shuffleWords = () => {
    setCurrentWordIndex(Math.floor(Math.random() * words.length));
    setShowAnswer(false);
  };

  if (words.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-12 bg-ds-surface/30 rounded-2xl">
          <p className="text-ds-muted">No words to practice in this lesson</p>
        </div>
        <button
          onClick={onNext}
          className="w-full py-4 rounded-xl bg-ds-text text-ds-bg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
        >
          Continue to Conversation
          <HiOutlineArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-ds-text mb-2">🎯 Practice</h2>
        <p className="text-ds-muted">Test your memory</p>
      </div>

      {/* Practice Mode Selector */}
      <div className="flex gap-2 justify-center">
        {["flashcard", "listen"].map((mode) => (
          <button
            key={mode}
            onClick={() => setPracticeMode(mode)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              practiceMode === mode
                ? "bg-ds-text text-ds-bg"
                : "bg-ds-surface text-ds-muted hover:text-ds-text"
            }`}
          >
            {mode === "flashcard" ? "📝 Flashcard" : "🎧 Listen"}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="text-center text-ds-muted text-sm">
        Word {currentWordIndex + 1} of {words.length}
      </div>

      {/* Flashcard Practice */}
      {practiceMode === "flashcard" && currentWord && (
        <div
          onClick={() => setShowAnswer(!showAnswer)}
          className="bg-ds-surface/30 rounded-2xl p-8 border border-ds-border/30 cursor-pointer hover:border-ds-border transition-all min-h-[250px] flex flex-col items-center justify-center"
        >
          {!showAnswer ? (
            <div className="text-center">
              <p className="text-ds-muted text-sm mb-2">What is the German word for:</p>
              <p className="text-3xl font-bold text-ds-text mb-2">
                {currentWord.meaning_en || currentWord.english}
              </p>
              <p className="text-xl text-ds-muted font-bangla">
                {currentWord.meaning_bn || currentWord.bengali}
              </p>
              <p className="text-ds-border text-sm mt-4">Tap to reveal</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-ds-muted text-sm mb-2">Answer:</p>
              <div className="flex items-center justify-center gap-3 mb-2">
                {currentWord.article && <span className="text-ds-muted text-xl">{currentWord.article}</span>}
                <p className="text-4xl font-bold text-emerald-400">
                  {currentWord.word_de || currentWord.german}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakGerman(currentWord.word_de || currentWord.german);
                  }}
                  className="p-2 rounded-lg bg-ds-bg/50 text-ds-muted hover:text-ds-text"
                >
                  <HiOutlineVolumeUp className="w-6 h-6" />
                </button>
              </div>
              <p className="text-ds-border text-sm">Tap for next word</p>
            </div>
          )}
        </div>
      )}

      {/* Listen Practice */}
      {practiceMode === "listen" && currentWord && (
        <div className="bg-ds-surface/30 rounded-2xl p-8 border border-ds-border/30 min-h-[250px] flex flex-col items-center justify-center">
          <p className="text-ds-muted text-sm mb-4">Listen and guess the word:</p>
          <button
            onClick={() => speakGerman(currentWord.word_de || currentWord.german)}
            className="w-20 h-20 rounded-full bg-ds-text text-ds-bg flex items-center justify-center hover:shadow-lg transition-all mb-4"
          >
            <HiOutlineVolumeUp className="w-10 h-10" />
          </button>

          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="px-6 py-2 rounded-xl bg-ds-surface text-ds-text hover:bg-ds-border transition-colors"
            >
              Show Answer
            </button>
          ) : (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                {currentWord.article && <span className="text-ds-muted text-xl">{currentWord.article}</span>}
                <p className="text-3xl font-bold text-emerald-400">
                  {currentWord.word_de || currentWord.german}
                </p>
              </div>
              <p className="text-ds-muted">{currentWord.meaning_en || currentWord.english}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={shuffleWords}
          className="flex-1 py-3 rounded-xl border border-ds-border/30 text-ds-text font-medium flex items-center justify-center gap-2 hover:bg-ds-surface transition-colors"
        >
          <HiOutlineRefresh className="w-5 h-5" />
          Shuffle
        </button>
        <button
          onClick={nextWord}
          className="flex-1 py-3 rounded-xl bg-ds-surface text-ds-text font-medium flex items-center justify-center gap-2 hover:bg-ds-border transition-colors"
        >
          Next Word
          <HiOutlineArrowRight className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 rounded-xl bg-ds-text text-ds-bg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
      >
        Continue to Conversation
        <HiOutlineArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PracticeSection;
