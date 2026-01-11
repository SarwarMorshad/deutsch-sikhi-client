import { HiOutlineVolumeUp, HiOutlineStar, HiOutlineCheckCircle, HiOutlineArrowRight } from "react-icons/hi";

const WarmupSection = ({ lesson, speakGerman, onNext }) => {
  // Helper to check if speaker is "other" side
  const isOtherSpeaker = (speaker) => {
    return ["B", "You", "Customer", "Patient", "Tourist", "Student"].includes(speaker);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-ds-text mb-2">🎯 Warm-up</h2>
        <p className="text-ds-muted">Listen and read the dialogue</p>
      </div>

      {/* Dialogue Card */}
      {lesson.warmup?.dialogue && (
        <div className="bg-ds-surface/30 rounded-2xl p-6 border border-ds-border/30">
          <div className="space-y-4">
            {lesson.warmup.dialogue.map((line, index) => (
              <div
                key={index}
                className={`flex gap-4 ${isOtherSpeaker(line.speaker) ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    isOtherSpeaker(line.speaker)
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}
                >
                  {line.speaker.charAt(0)}
                </div>
                <div className={`flex-1 max-w-md ${isOtherSpeaker(line.speaker) ? "text-right" : ""}`}>
                  <div
                    className={`inline-block p-4 rounded-2xl ${
                      isOtherSpeaker(line.speaker)
                        ? "bg-emerald-500/20 rounded-tr-none"
                        : "bg-ds-surface rounded-tl-none"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <p className="text-ds-text font-medium">{line.text}</p>
                      <button
                        onClick={() => speakGerman(line.text)}
                        className="p-1 rounded-full hover:bg-ds-bg/50 transition-colors"
                      >
                        <HiOutlineVolumeUp className="w-4 h-4 text-ds-muted" />
                      </button>
                    </div>
                    <p className="text-ds-muted text-sm">{line.translation?.en}</p>
                    <p className="text-ds-border text-xs font-bangla mt-1">{line.translation?.bn}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Objectives */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <div className="bg-ds-surface/20 rounded-2xl p-6 border border-ds-border/20">
          <h3 className="text-lg font-semibold text-ds-text mb-4 flex items-center gap-2">
            <HiOutlineStar className="w-5 h-5 text-yellow-400" />
            What you'll learn
          </h3>
          <ul className="space-y-2">
            {lesson.objectives.map((obj, i) => (
              <li key={i} className="flex items-center gap-3 text-ds-muted">
                <HiOutlineCheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                {obj}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onNext}
        className="w-full py-4 rounded-xl bg-ds-text text-ds-bg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
      >
        Continue to Vocabulary
        <HiOutlineArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default WarmupSection;
