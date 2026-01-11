import { HiOutlineVolumeUp } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";

const Features = () => {
  const { t } = useTranslation();
  const { isBengali } = useLanguage();

  return (
    <section className="py-24 bg-ds-surface/20 relative overflow-hidden">
      {/* Section Label */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ds-border to-transparent"></div>
          <span
            className={`text-ds-muted text-sm tracking-[0.3em] uppercase ${isBengali ? "font-bangla" : ""}`}
          >
            {t("home.features.title")} DeutschShikhi
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ds-border to-transparent"></div>
        </div>
      </div>

      {/* Bento Grid - Asymmetric */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Large Feature - Trilingual (spans 8 cols) */}
          <div className="col-span-12 md:col-span-8 row-span-2 group">
            <div className="h-full bg-gradient-to-br from-ds-surface to-ds-bg p-8 md:p-12 rounded-[2rem] border border-ds-border/20 relative overflow-hidden hover:border-ds-border/50 transition-all duration-500">
              {/* Background Text */}
              <div className="absolute -right-10 -bottom-10 text-[200px] font-black text-ds-border/5 leading-none select-none">
                DE
              </div>

              <div className="relative z-10">
                <div
                  className={`inline-flex px-4 py-1 bg-ds-muted/10 rounded-full text-ds-muted text-sm mb-6 ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {isBengali ? "মূল বৈশিষ্ট্য" : "Core Feature"}
                </div>
                <h3
                  className={`text-3xl md:text-4xl font-bold text-ds-text mb-4 ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {t("home.features.bengaliSupport.title")}
                </h3>
                <p className={`text-ds-muted text-lg max-w-md mb-8 ${isBengali ? "font-bangla" : ""}`}>
                  {t("home.features.bengaliSupport.description")}
                </p>

                {/* Demo Card */}
                <div className="bg-ds-bg/50 backdrop-blur rounded-2xl p-6 max-w-sm border border-ds-border/30">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-ds-text">Schmetterling</span>
                      <button className="audio-btn">
                        <HiOutlineVolumeUp className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="h-px bg-ds-border/30"></div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-ds-muted">English</span>
                        <p className="text-ds-text font-medium">Butterfly</p>
                      </div>
                      <div>
                        <span className="text-ds-muted">বাংলা</span>
                        <p className="text-ds-text font-medium font-bangla">প্রজাপতি</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Feature (spans 4 cols) */}
          <div className="col-span-12 md:col-span-4 group">
            <div className="h-full bg-gradient-to-br from-green-500/10 to-emerald-600/10 p-8 rounded-[2rem] border border-green-500/20 hover:border-green-500/40 transition-all duration-500 relative overflow-hidden">
              {/* Animated Sound Waves */}
              <div className="absolute right-6 top-6 flex items-end gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-1 bg-green-400/60 rounded-full animate-pulse"
                    style={{
                      height: `${10 + i * 8}px`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  ></div>
                ))}
              </div>

              <div className="mt-16">
                <h3 className={`text-xl font-bold text-ds-text mb-2 ${isBengali ? "font-bangla" : ""}`}>
                  {t("home.features.audio.title")}
                </h3>
                <p className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                  {t("home.features.audio.description")}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Feature (spans 4 cols) */}
          <div className="col-span-12 md:col-span-4 group">
            <div className="h-full bg-gradient-to-br from-purple-500/10 to-violet-600/10 p-8 rounded-[2rem] border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500">
              {/* Mini Progress Chart */}
              <div className="flex items-end gap-2 h-16 mb-6">
                {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-purple-400/30 rounded-t-sm transition-all duration-500 group-hover:bg-purple-400/50"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>

              <h3 className={`text-xl font-bold text-ds-text mb-2 ${isBengali ? "font-bangla" : ""}`}>
                {isBengali ? "অগ্রগতি দেখুন" : "Track Progress"}
              </h3>
              <p className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                {isBengali
                  ? "আপনার শেখার যাত্রার ভিজ্যুয়াল ইনসাইট।"
                  : "Visual insights into your learning journey."}
              </p>
            </div>
          </div>

          {/* Structured Path (spans 6 cols) */}
          <div className="col-span-12 md:col-span-6 group">
            <div className="h-full bg-gradient-to-br from-orange-500/10 to-amber-600/10 p-8 rounded-[2rem] border border-orange-500/20 hover:border-orange-500/40 transition-all duration-500">
              {/* Level Path Visualization */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 font-bold">
                  A1
                </div>
                <div className="flex-1 h-1 bg-ds-border/30 relative">
                  <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                  A2
                </div>
                <div className="flex-1 h-1 bg-ds-border/30"></div>
                <div className="w-12 h-12 rounded-xl bg-ds-border/20 flex items-center justify-center text-ds-muted font-bold">
                  B1
                </div>
              </div>

              <h3 className={`text-xl font-bold text-ds-text mb-2 ${isBengali ? "font-bangla" : ""}`}>
                {t("home.features.structured.title")}
              </h3>
              <p className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                {t("home.features.structured.description")}
              </p>
            </div>
          </div>

          {/* Interactive Feature (spans 6 cols) */}
          <div className="col-span-12 md:col-span-6 group">
            <div className="h-full bg-gradient-to-br from-pink-500/10 to-rose-600/10 p-8 rounded-[2rem] border border-pink-500/20 hover:border-pink-500/40 transition-all duration-500">
              {/* User Avatars */}
              <div className="flex items-center mb-6">
                <div className="flex -space-x-3">
                  {["🧑‍🎓", "👩‍💻", "🧑‍🏫", "👨‍🎓"].map((emoji, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-ds-surface border-2 border-ds-bg flex items-center justify-center text-lg"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                    {isBengali ? "এখন সক্রিয়" : "Live Now"}
                  </span>
                </div>
              </div>

              <h3 className={`text-xl font-bold text-ds-text mb-2 ${isBengali ? "font-bangla" : ""}`}>
                {t("home.features.interactive.title")}
              </h3>
              <p className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                {t("home.features.interactive.description")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-ds-border/10 rounded-full"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 border border-ds-border/10 rounded-full"></div>
    </section>
  );
};

export default Features;
