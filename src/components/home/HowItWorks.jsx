import {
  HiOutlineUserAdd,
  HiOutlineAcademicCap,
  HiOutlineLightningBolt,
  HiOutlineTrendingUp,
} from "react-icons/hi";

const HowItWorks = () => {
  const steps = [
    {
      icon: HiOutlineUserAdd,
      number: "01",
      title: "Create Free Account",
      titleBn: "বিনামূল্যে অ্যাকাউন্ট",
      description: "Sign up in 10 seconds. No credit card, no commitment.",
      accent: "from-green-400 to-emerald-500",
    },
    {
      icon: HiOutlineAcademicCap,
      number: "02",
      title: "Pick Your Level",
      titleBn: "আপনার লেভেল বাছুন",
      description: "Start from A1 or test your knowledge to find your level.",
      accent: "from-blue-400 to-indigo-500",
    },
    {
      icon: HiOutlineLightningBolt,
      number: "03",
      title: "Learn Daily",
      titleBn: "প্রতিদিন শিখুন",
      description: "Bite-sized lessons that fit into your busy schedule.",
      accent: "from-orange-400 to-amber-500",
    },
    {
      icon: HiOutlineTrendingUp,
      number: "04",
      title: "See Progress",
      titleBn: "অগ্রগতি দেখুন",
      description: "Watch yourself improve with detailed analytics.",
      accent: "from-purple-400 to-violet-500",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-ds-surface rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-ds-surface rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - Left aligned */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-px bg-ds-muted"></div>
            <span className="text-ds-muted text-sm tracking-widest uppercase">The Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-ds-text">
            How It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ds-muted to-ds-border">
              Works
            </span>
          </h2>
        </div>

        {/* Zigzag Timeline */}
        <div className="relative">
          {/* Vertical Line (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-ds-border via-ds-muted to-ds-border"></div>

          {/* Steps */}
          <div className="space-y-12 lg:space-y-24">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Content Side */}
                <div className={`flex-1 ${index % 2 === 1 ? "lg:text-right" : ""}`}>
                  <div className={`inline-block ${index % 2 === 1 ? "lg:ml-auto" : ""}`}>
                    {/* Number Badge */}
                    <div
                      className={`inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r ${step.accent} bg-opacity-10 mb-4`}
                    >
                      <span className="text-white text-sm font-bold">{step.number}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-ds-text mb-2">{step.title}</h3>
                    <p className="text-ds-muted font-bangla mb-4">{step.titleBn}</p>

                    {/* Description */}
                    <p className="text-ds-muted max-w-sm">{step.description}</p>
                  </div>
                </div>

                {/* Center Icon (on the timeline) */}
                <div className="relative z-10 order-first lg:order-none">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.accent} p-0.5`}>
                    <div className="w-full h-full rounded-2xl bg-ds-bg flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-ds-text" />
                    </div>
                  </div>

                  {/* Connection dot */}
                  <div
                    className={`hidden lg:block absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-r ${
                      step.accent
                    } ${index % 2 === 0 ? "-right-8" : "-left-8"}`}
                  ></div>
                </div>

                {/* Empty Side (for zigzag) */}
                <div className="flex-1 hidden lg:block"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-ds-muted mb-6">Ready to start your German journey?</p>
          <div className="inline-flex items-center gap-4">
            <div className="flex -space-x-2">
              {["🇧🇩", "🇩🇪", "🇬🇧"].map((flag, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-ds-surface flex items-center justify-center border-2 border-ds-bg text-xl"
                >
                  {flag}
                </div>
              ))}
            </div>
            <span className="text-ds-text">
              Join learners from <span className="text-ds-muted font-semibold">Bangladesh</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
