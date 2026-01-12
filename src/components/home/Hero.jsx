import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";

const Hero = () => {
  const { t } = useTranslation();
  const { isBengali } = useLanguage();
  const [activeWord, setActiveWord] = useState(0);

  // Floating German words that cycle
  const floatingWords = [
    { de: "Hallo", bn: "হ্যালো", en: "Hello" },
    { de: "Danke", bn: "ধন্যবাদ", en: "Thank you" },
    { de: "Liebe", bn: "ভালোবাসা", en: "Love" },
    { de: "Freund", bn: "বন্ধু", en: "Friend" },
    { de: "Wasser", bn: "পানি", en: "Water" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWord((prev) => (prev + 1) % floatingWords.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Diagonal Background Split */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-ds-bg"></div>
        <div
          className="absolute top-0 right-0 w-[60%] h-full bg-ds-surface/30"
          style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)" }}
        ></div>
      </div>

      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 left-[10%] w-72 h-72 bg-ds-border/20 rounded-full blur-3xl animate-pulse-soft"></div>
      <div className="absolute bottom-20 right-[20%] w-96 h-96 bg-ds-muted/10 rounded-full blur-3xl animate-pulse-soft delay-300"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-12 gap-8 items-center w-full py-20">
          {/* Left Side - Text Content (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Vertical Text Accent */}
            <div className="flex items-start gap-6">
              <div className="hidden md:flex flex-col items-center gap-2">
                <div className="w-px h-20 bg-gradient-to-b from-transparent via-ds-muted to-ds-border"></div>
                <span
                  className="text-ds-muted text-xs tracking-widest rotate-180"
                  style={{ writingMode: "vertical-rl" }}
                >
                  DEUTSCH LERNEN
                </span>
                <div className="w-px h-20 bg-gradient-to-b from-ds-border via-ds-muted to-transparent"></div>
              </div>

              <div>
                {/* Main Heading - Stacked */}
                <div className="space-y-2">
                  {isBengali ? (
                    <>
                      <h1 className="text-5xl md:text-7xl font-black text-ds-text leading-none font-bangla">
                        জার্মান
                      </h1>
                      <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-ds-muted to-ds-border leading-none font-bangla pt-4">
                        শিখুন
                      </h1>
                      <h1 className="text-3xl md:text-4xl font-bold text-ds-text leading-tight">
                        Learn German
                      </h1>
                    </>
                  ) : (
                    <>
                      <h1 className="text-5xl md:text-7xl font-black text-ds-text leading-none">Learn</h1>
                      <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-ds-muted to-ds-border leading-none">
                        German
                      </h1>
                      <h1 className="text-3xl md:text-4xl font-bold text-ds-text font-bangla leading-tight">
                        বাংলায় শিখুন
                      </h1>
                    </>
                  )}
                </div>

                {/* Description */}
                <p
                  className={`mt-6 text-ds-muted text-lg max-w-sm leading-relaxed ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {t("home.hero.description")}
                </p>
              </div>
            </div>

            {/* CTA - Unique pill buttons */}
            <div className="flex flex-wrap gap-3 pl-0 md:pl-12">
              <Link
                to="/courses"
                className={`group relative px-8 py-4 bg-ds-text text-ds-bg font-bold rounded-full overflow-hidden transition-transform hover:scale-105 ${
                  isBengali ? "font-bangla" : ""
                }`}
              >
                <span className="relative z-10">{t("home.hero.startLearning")} →</span>
                <div className="absolute inset-0 bg-ds-muted translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
              <Link
                to="/vocabulary"
                className={`px-8 py-4 border-2 border-ds-border text-ds-text font-bold rounded-full hover:bg-ds-surface/50 transition-all ${
                  isBengali ? "font-bangla" : ""
                }`}
              >
                {t("home.hero.exploreCourses")}
              </Link>
            </div>

            {/* Mini Stats - Inline */}
            <div className="flex items-center gap-6 pl-0 md:pl-12 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-ds-muted text-sm">A1 → A2</span>
              </div>
              <div className="w-px h-4 bg-ds-border"></div>
              <span className="text-ds-muted text-sm">500+ {isBengali ? "শব্দ" : "Words"}</span>
              <div className="w-px h-4 bg-ds-border"></div>
              <span className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                {isBengali ? "সম্পূর্ণ বিনামূল্যে" : "Free Forever"}
              </span>
            </div>
          </div>

          {/* Right Side - Interactive Word Display (7 cols) */}
          <div className="lg:col-span-7 relative h-[500px] hidden lg:block">
            {/* Central Word Display - Glass Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-ds-muted/20 blur-2xl rounded-3xl scale-110"></div>

                {/* Main Card */}
                <div className="relative bg-ds-bg/80 backdrop-blur-xl border border-ds-border/50 rounded-3xl p-10 min-w-[320px]">
                  <div className="text-center space-y-4">
                    <span
                      className={`text-ds-muted text-sm tracking-widest uppercase ${
                        isBengali ? "font-bangla" : ""
                      }`}
                    >
                      {isBengali ? "এই মুহূর্তের শব্দ" : "Word of the moment"}
                    </span>

                    {/* German Word */}
                    <div className="text-5xl font-black text-ds-text transition-all duration-500">
                      {floatingWords[activeWord].de}
                    </div>

                    {/* Translations */}
                    <div className="flex justify-center gap-8 pt-4">
                      <div className="text-center">
                        <div className="text-xs text-ds-muted mb-1">English</div>
                        <div className="text-ds-text font-medium">{floatingWords[activeWord].en}</div>
                      </div>
                      <div className="w-px bg-ds-border"></div>
                      <div className="text-center">
                        <div className="text-xs text-ds-muted mb-1">বাংলা</div>
                        <div className="text-ds-text font-medium font-bangla">
                          {floatingWords[activeWord].bn}
                        </div>
                      </div>
                    </div>

                    {/* Progress dots */}
                    <div className="flex justify-center gap-2 pt-4">
                      {floatingWords.map((_, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            idx === activeWord ? "bg-ds-muted w-6" : "bg-ds-border"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Word Bubbles - Scattered */}
            <div
              className="absolute top-10 left-10 px-4 py-2 bg-ds-surface/50 backdrop-blur rounded-full border border-ds-border/30 text-ds-text text-sm animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              Guten Tag 👋
            </div>
            <div
              className="absolute top-20 right-20 px-4 py-2 bg-ds-surface/50 backdrop-blur rounded-full border border-ds-border/30 text-ds-text text-sm animate-bounce"
              style={{ animationDuration: "4s", animationDelay: "1s" }}
            >
              Wie geht's?
            </div>
            <div
              className="absolute bottom-32 left-20 px-4 py-2 bg-ds-surface/50 backdrop-blur rounded-full border border-ds-border/30 text-ds-text text-sm animate-bounce"
              style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
            >
              Ich lerne 📚
            </div>
            <div
              className="absolute bottom-20 right-32 px-4 py-2 bg-ds-surface/50 backdrop-blur rounded-full border border-ds-border/30 text-ds-text text-sm animate-bounce"
              style={{ animationDuration: "4.5s", animationDelay: "1.5s" }}
            >
              Deutsch ist toll!
            </div>

            {/* Decorative Circles */}
            <div className="absolute top-1/4 right-10 w-20 h-20 border-2 border-ds-border/30 rounded-full"></div>
            <div className="absolute bottom-1/4 left-16 w-12 h-12 border-2 border-ds-muted/30 rounded-full"></div>
            <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-ds-muted/20 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="currentColor"
            className="text-ds-surface/30"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
