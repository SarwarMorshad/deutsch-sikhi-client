import { HiOutlineX } from "react-icons/hi";

const LinkLessonsModal = ({ lessons, linkedLessons, onToggle, onClose }) => {
  // Helper to get lesson title (handles both string and object format)
  const getLessonTitle = (lesson) => {
    if (typeof lesson.title === "object") {
      return lesson.title.en || lesson.title.de || "Untitled";
    }
    return lesson.title || "Untitled";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-ds-surface rounded-2xl border border-ds-border/30 p-6 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-ds-text">Link Lessons</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-ds-border/30 rounded-lg text-ds-muted hover:text-ds-text cursor-pointer"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <p className="text-ds-muted text-sm mb-4">Select lessons where this grammar topic should appear.</p>

        <div className="overflow-y-auto flex-1 space-y-2">
          {lessons.length === 0 ? (
            <p className="text-ds-muted text-center py-8">No lessons available</p>
          ) : (
            lessons.map((lesson) => {
              const isLinked = linkedLessons.includes(lesson._id);
              const lessonTitle = getLessonTitle(lesson);
              return (
                <button
                  key={lesson._id}
                  onClick={() => onToggle(lesson._id)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-colors cursor-pointer text-left ${
                    isLinked
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "border-ds-border/30 hover:bg-ds-bg/50"
                  }`}
                >
                  <div>
                    <div className="font-medium text-ds-text">{lessonTitle}</div>
                    <div className="text-sm text-ds-muted">
                      {lesson.level?.code || "N/A"} • Module {lesson.order || 0}
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isLinked ? "bg-emerald-500 border-emerald-500" : "border-ds-border"
                    }`}
                  >
                    {isLinked && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="pt-4 border-t border-ds-border/30 mt-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-ds-text text-ds-bg rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
          >
            Done ({linkedLessons.length} selected)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkLessonsModal;
