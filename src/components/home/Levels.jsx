import { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineArrowRight, HiOutlineLockClosed } from "react-icons/hi";

const Levels = () => {
  const [hoveredLevel, setHoveredLevel] = useState(null);

  const levels = [
    {
      code: "A1",
      title: "Beginner",
      titleDe: "Anfänger",
      titleBn: "প্রাথমিক",
      description: "Zero to basic. Greetings, numbers, simple phrases.",
      topics: ["Greetings", "Numbers 1-100", "Colors", "Family", "Food & Drink"],
      gradient: "from-green-400 via-emerald-500 to-teal-500",
      shadowColor: "shadow-green-500/20",
      available: true,
      lessons: 20,
      words: 300,
    },
    {
      code: "A2",
      title: "Elementary",
      titleDe: "Grundstufe",
      titleBn: "মৌলিক",
      description: "Build confidence. Daily routines, travel, hobbies.",
      topics: ["Daily Routine", "Travel", "Shopping", "Health", "Work"],
      gradient: "from-blue-400 via-indigo-500 to-purple-500",
      shadowColor: "shadow-blue-500/20",
      available: true,
      lessons: 25,
      words: 400,
    },
    {
      code: "B1",
      title: "Intermediate",
      titleDe: "Mittelstufe",
      titleBn: "মধ্যবর্তী",
      description: "Express opinions. News, culture, complex topics.",
      topics: ["Coming Soon"],
      gradient: "from-orange-400 via-amber-500 to-yellow-500",
      shadowColor: "shadow-orange-500/20",
      available: false,
      lessons: 0,
      words: 0,
    },
  ];

  return (
    <section className="py-24 bg-ds-surface/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - Centered with flair */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="text-4xl">🎯</span>
            <div className="h-px w-12 bg-ds-border"></div>
            <span className="text-ds-muted tracking-widest text-sm uppercase">Your Path</span>
            <div className="h-px w-12 bg-ds-border"></div>
            <span className="text-4xl">🏆</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-ds-text mb-4">Choose Your Level</h2>
          <p className="text-ds-muted font-bangla text-lg">আপনার যাত্রা শুরু করুন</p>
        </div>

        {/* Levels - Horizontal Scroll on Mobile, Grid on Desktop */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          {levels.map((level, index) => (
            <div
              key={level.code}
              className={`flex-1 relative group ${!level.available ? "opacity-70" : ""}`}
              onMouseEnter={() => setHoveredLevel(level.code)}
              onMouseLeave={() => setHoveredLevel(null)}
            >
              {/* Card */}
              <div
                className={`relative h-full bg-ds-bg rounded-[2rem] border border-ds-border/20 overflow-hidden transition-all duration-500 ${
                  level.available ? "hover:border-ds-border/50 hover:-translate-y-2" : ""
                } ${level.shadowColor} ${hoveredLevel === level.code ? "shadow-2xl" : "shadow-lg"}`}
              >
                {/* Gradient Top Bar */}
                <div className={`h-2 bg-gradient-to-r ${level.gradient}`}></div>

                {/* Level Code - Large Background */}
                <div className="absolute -right-4 -top-4 text-[150px] font-black text-ds-surface/30 leading-none select-none">
                  {level.code}
                </div>

                {/* Content */}
                <div className="relative z-10 p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div
                        className={`inline-flex px-3 py-1 rounded-full bg-gradient-to-r ${level.gradient} text-white text-sm font-bold mb-3`}
                      >
                        {level.code}
                      </div>
                      <h3 className="text-2xl font-bold text-ds-text">{level.title}</h3>
                      <p className="text-ds-muted text-sm">{level.titleDe}</p>
                      <p className="text-ds-muted text-sm font-bangla">{level.titleBn}</p>
                    </div>
                    {!level.available && (
                      <div className="p-3 bg-ds-surface rounded-xl">
                        <HiOutlineLockClosed className="w-6 h-6 text-ds-muted" />
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-ds-muted mb-6">{level.description}</p>

                  {/* Topics */}
                  <div className="mb-8">
                    <p className="text-ds-muted text-xs uppercase tracking-wider mb-3">Topics Covered</p>
                    <div className="flex flex-wrap gap-2">
                      {level.topics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-ds-surface/50 rounded-full text-ds-text text-xs"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  {level.available && (
                    <div className="flex gap-6 mb-8 pb-6 border-b border-ds-border/20">
                      <div>
                        <div className="text-3xl font-bold text-ds-text">{level.lessons}</div>
                        <div className="text-ds-muted text-xs">Lessons</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-ds-text">{level.words}+</div>
                        <div className="text-ds-muted text-xs">Words</div>
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  {level.available ? (
                    <Link
                      to={`/courses?level=${level.code}`}
                      className={`group/btn flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold bg-gradient-to-r ${level.gradient} text-white transition-all hover:shadow-lg hover:scale-[1.02]`}
                    >
                      Start {level.code}
                      <HiOutlineArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <div className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-ds-surface/50 text-ds-muted cursor-not-allowed">
                      <HiOutlineLockClosed className="w-5 h-5" />
                      Coming Soon
                    </div>
                  )}
                </div>

                {/* Hover Glow Effect */}
                {level.available && (
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${level.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`}
                  ></div>
                )}
              </div>

              {/* Index Number */}
              <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-ds-bg border border-ds-border/30 flex items-center justify-center text-ds-muted font-bold">
                {String(index + 1).padStart(2, "0")}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-16 text-center">
          <p className="text-ds-muted text-sm">Complete A1 to unlock A2 • Complete A2 to unlock B1</p>
        </div>
      </div>
    </section>
  );
};

export default Levels;
