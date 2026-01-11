import { HiOutlineVolumeUp, HiOutlineChatAlt2, HiOutlineArrowRight } from "react-icons/hi";

const ConversationSection = ({ lesson, speakGerman, onNext }) => {
  const isOtherSpeaker = (speaker) => {
    return ["B", "You"].includes(speaker);
  };

  if (!lesson.conversation?.dialogue || lesson.conversation.dialogue.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-12 bg-ds-surface/30 rounded-2xl">
          <HiOutlineChatAlt2 className="w-12 h-12 text-ds-border mx-auto mb-3" />
          <p className="text-ds-muted">No conversation practice for this lesson</p>
        </div>
        <button
          onClick={onNext}
          className="w-full py-4 rounded-xl bg-ds-text text-ds-bg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
        >
          Continue to Quiz
          <HiOutlineArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-ds-text mb-2">💬 Conversation</h2>
        <p className="text-ds-muted">Practice real-world dialogue</p>
      </div>

      {/* Situation */}
      {lesson.conversation.situation?.en && (
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
          <p className="text-ds-border text-sm mb-1">Situation</p>
          <p className="text-ds-text font-medium">{lesson.conversation.situation.en}</p>
          <p className="text-ds-muted text-sm font-bangla">{lesson.conversation.situation.bn}</p>
        </div>
      )}

      {/* Dialogue */}
      <div className="bg-ds-surface/30 rounded-2xl p-6 border border-ds-border/30">
        <div className="space-y-4">
          {lesson.conversation.dialogue.map((line, index) => (
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

      {/* Tips */}
      <div className="p-4 rounded-xl bg-ds-surface/20 border border-ds-border/20">
        <h4 className="text-ds-text font-medium mb-2">💡 Practice Tips</h4>
        <ul className="text-ds-muted text-sm space-y-1">
          <li>• Read each line aloud</li>
          <li>• Practice both roles</li>
          <li>• Focus on pronunciation</li>
        </ul>
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 rounded-xl bg-ds-text text-ds-bg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
      >
        Continue to Quiz
        <HiOutlineArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ConversationSection;
