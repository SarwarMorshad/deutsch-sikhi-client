import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useLanguage";
import { HiOutlineArrowRight } from "react-icons/hi";

const CTA = () => {
  const { t } = useTranslation();
  const { isBengali } = useLanguage();

  const trustIndicators = isBengali
    ? [
        { icon: "✓", text: "১০০% বিনামূল্যে" },
        { icon: "🔒", text: "কোন ক্রেডিট কার্ড নেই" },
        { icon: "🌍", text: "বাংলা + ইংরেজি" },
        { icon: "📱", text: "সব ডিভাইসে কাজ করে" },
      ]
    : [
        { icon: "✓", text: "100% Free" },
        { icon: "🔒", text: "No Credit Card" },
        { icon: "🌍", text: "Bengali + English" },
        { icon: "📱", text: "Works on All Devices" },
      ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-ds-muted/10 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-ds-border/10 rounded-full blur-3xl animate-pulse-soft delay-300"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-ds-surface/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Glass Card */}
        <div className="relative">
          {/* Border Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-ds-muted via-ds-border to-ds-muted rounded-[3rem] p-px">
            <div className="w-full h-full bg-ds-bg/80 backdrop-blur-xl rounded-[3rem]"></div>
          </div>

          {/* Content */}
          <div className="relative px-8 py-16 md:px-16 md:py-24">
            {/* Floating Elements */}
            <div
              className="absolute top-8 left-8 text-6xl animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              🇩🇪
            </div>
            <div
              className="absolute top-12 right-12 text-4xl animate-bounce"
              style={{ animationDuration: "4s", animationDelay: "0.5s" }}
            >
              📚
            </div>
            <div
              className="absolute bottom-12 left-16 text-4xl animate-bounce"
              style={{ animationDuration: "3.5s", animationDelay: "1s" }}
            >
              🎯
            </div>
            <div
              className="absolute bottom-8 right-8 text-5xl animate-bounce"
              style={{ animationDuration: "4.5s", animationDelay: "1.5s" }}
            >
              🇧🇩
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto text-center">
              {/* Headline */}
              <div className="mb-8">
                <p
                  className={`text-ds-muted mb-4 tracking-widest text-sm uppercase ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {isBengali ? "আজই শুরু করুন" : "Start Today"}
                </p>
                <h2
                  className={`text-4xl md:text-6xl font-black text-ds-text leading-tight mb-4 ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {t("home.cta.title")}
                </h2>
                <p className={`text-2xl text-ds-muted ${isBengali ? "" : "font-bangla"}`}>
                  {isBengali ? "Your German Journey Begins Here" : "আজই শুরু করুন আপনার জার্মান যাত্রা"}
                </p>
              </div>

              {/* Sub text */}
              <p className={`text-ds-muted text-lg mb-10 max-w-xl mx-auto ${isBengali ? "font-bangla" : ""}`}>
                {t("home.cta.subtitle")}
              </p>

              {/* CTA Buttons - Unique Style */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link
                  to="/register"
                  className={`group relative px-10 py-5 overflow-hidden rounded-2xl bg-ds-text text-ds-bg font-bold text-lg transition-all hover:shadow-2xl hover:shadow-ds-muted/20 hover:scale-105 ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {/* Animated gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-ds-muted to-ds-border translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <span className="relative flex items-center gap-2">
                    {t("home.cta.button")}
                    <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>

                <Link
                  to="/courses"
                  className={`px-10 py-5 rounded-2xl border-2 border-ds-border text-ds-text font-bold text-lg hover:bg-ds-surface/30 transition-all ${
                    isBengali ? "font-bangla" : ""
                  }`}
                >
                  {t("home.hero.exploreCourses")}
                </Link>
              </div>

              {/* Trust Indicators - Unique Pills */}
              <div className="flex flex-wrap justify-center gap-3">
                {trustIndicators.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 bg-ds-surface/30 backdrop-blur rounded-full border border-ds-border/20"
                  >
                    <span>{item.icon}</span>
                    <span className={`text-ds-text text-sm ${isBengali ? "font-bangla" : ""}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Stats Strip */}
            <div className="mt-16 pt-8 border-t border-ds-border/20">
              <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                <div className="text-center">
                  <div className="text-4xl font-black text-ds-text">A1-A2</div>
                  <div className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                    {isBengali ? "লেভেল উপলব্ধ" : "Levels Available"}
                  </div>
                </div>
                <div className="hidden md:block w-px bg-ds-border/30"></div>
                <div className="text-center">
                  <div className="text-4xl font-black text-ds-text">500+</div>
                  <div className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                    {isBengali ? "জার্মান শব্দ" : "German Words"}
                  </div>
                </div>
                <div className="hidden md:block w-px bg-ds-border/30"></div>
                <div className="text-center">
                  <div className="text-4xl font-black text-ds-text">45+</div>
                  <div className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                    {isBengali ? "পাঠ" : "Lessons"}
                  </div>
                </div>
                <div className="hidden md:block w-px bg-ds-border/30"></div>
                <div className="text-center">
                  <div className="text-4xl font-black text-ds-text">∞</div>
                  <div className={`text-ds-muted text-sm ${isBengali ? "font-bangla" : ""}`}>
                    {isBengali ? "অনুশীলন" : "Practice"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* German Flag Bottom Stripe */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="german-stripe"></div>
      </div>
    </section>
  );
};

export default CTA;
