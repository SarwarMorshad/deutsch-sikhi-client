import { useState } from "react";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { HiOutlineVolumeUp, HiOutlineBookOpen, HiOutlineArrowRight } from "react-icons/hi";

const VocabularySection = ({ words, speakGerman, onNext }) => {
  const { t } = useTranslation();
  const { isBengali } = useLanguage();
  const [flippedCards, setFlippedCards] = useState({});

  const toggleCardFlip = (wordId) => {
    setFlippedCards((prev) => ({ ...prev, [wordId]: !prev[wordId] }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className={`text-2xl font-bold text-ds-text mb-2 ${isBengali ? "font-bangla" : ""}`}>
          {t("lesson.vocabulary.title")}
        </h2>
        <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>{t("lesson.vocabulary.subtitle")}</p>
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {words.map((word) => {
          const isFlipped = flippedCards[word._id];
          return (
            <div
              key={word._id}
              onClick={() => toggleCardFlip(word._id)}
              className="group h-44 cursor-pointer perspective-1000"
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden">
                  <div className="h-full p-5 rounded-xl bg-gradient-to-br from-ds-surface to-ds-surface/50 border border-ds-border/30 flex flex-col justify-between hover:border-ds-border transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-ds-border uppercase">{word.partOfSpeech}</span>
                        {word.article && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-ds-bg/50 text-ds-muted">
                            {word.article}
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-ds-text">{word.word_de || word.german}</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakGerman(word.word_de || word.german);
                        }}
                        className="p-2 rounded-lg bg-ds-bg/50 text-ds-muted hover:text-ds-text transition-colors"
                      >
                        <HiOutlineVolumeUp className="w-5 h-5" />
                      </button>
                      <span className={`text-xs text-ds-border ${isBengali ? "font-bangla" : ""}`}>
                        {t("lesson.vocabulary.tapToFlip")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  <div className="h-full p-5 rounded-xl bg-gradient-to-br from-emerald-500/10 to-ds-surface/50 border border-emerald-500/30 flex flex-col justify-center">
                    <div className="space-y-3 text-center">
                      <div>
                        <span className="text-xs text-ds-border">English</span>
                        <p className="text-lg text-ds-text font-medium">{word.meaning_en || word.english}</p>
                      </div>
                      <div>
                        <span className="text-xs text-ds-border">বাংলা</span>
                        <p className="text-lg text-ds-text font-bangla">{word.meaning_bn || word.bengali}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {words.length === 0 && (
        <div className="text-center py-12 bg-ds-surface/30 rounded-2xl">
          <HiOutlineBookOpen className="w-12 h-12 text-ds-border mx-auto mb-3" />
          <p className={`text-ds-muted ${isBengali ? "font-bangla" : ""}`}>
            {t("lesson.vocabulary.noWords")}
          </p>
        </div>
      )}

      <button
        onClick={onNext}
        className={`w-full py-4 rounded-xl bg-ds-text text-ds-bg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all ${
          isBengali ? "font-bangla" : ""
        }`}
      >
        {t("lesson.continue.toGrammar")}
        <HiOutlineArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default VocabularySection;
