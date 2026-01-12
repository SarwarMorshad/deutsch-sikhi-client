import { HiOutlinePlus, HiOutlineTrash, HiOutlineCheckCircle } from "react-icons/hi";
import toast from "react-hot-toast";

const QuizBlockEditor = ({ data, onChange }) => {
  const quizData = {
    question_en: data.question_en || "",
    question_bn: data.question_bn || "",
    options: data.options || [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
    ],
    explanation_en: data.explanation_en || "",
    explanation_bn: data.explanation_bn || "",
  };

  const updateQuiz = (updates) => {
    onChange({ ...quizData, ...updates });
  };

  const addOption = () => {
    if (quizData.options.length >= 6) {
      toast.error("Maximum 6 options allowed");
      return;
    }
    updateQuiz({
      options: [...quizData.options, { text: "", isCorrect: false }],
    });
  };

  const removeOption = (index) => {
    if (quizData.options.length <= 2) {
      toast.error("At least 2 options required");
      return;
    }
    const newOptions = quizData.options.filter((_, i) => i !== index);
    // Ensure at least one correct answer
    if (!newOptions.some((opt) => opt.isCorrect) && newOptions.length > 0) {
      newOptions[0].isCorrect = true;
    }
    updateQuiz({ options: newOptions });
  };

  const updateOption = (index, text) => {
    const newOptions = quizData.options.map((opt, i) => (i === index ? { ...opt, text } : opt));
    updateQuiz({ options: newOptions });
  };

  const setCorrectAnswer = (index) => {
    const newOptions = quizData.options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    updateQuiz({ options: newOptions });
  };

  const correctIndex = quizData.options.findIndex((opt) => opt.isCorrect);

  return (
    <div className="space-y-4">
      {/* Question */}
      <div>
        <label className="block text-ds-text text-sm font-medium mb-2">
          Question (English) <span className="text-red-400">*</span>
        </label>
        <textarea
          value={quizData.question_en}
          onChange={(e) => updateQuiz({ question_en: e.target.value })}
          placeholder="Enter the quiz question..."
          rows={2}
          className="w-full px-4 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border resize-none"
        />
      </div>

      <div>
        <label className="block text-ds-text text-sm font-medium mb-2">
          Question (Bengali) <span className="text-ds-muted font-normal">- optional</span>
        </label>
        <textarea
          value={quizData.question_bn}
          onChange={(e) => updateQuiz({ question_bn: e.target.value })}
          placeholder="বাংলায় প্রশ্ন লিখুন..."
          rows={2}
          className="w-full px-4 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border resize-none font-bangla"
        />
      </div>

      {/* Options */}
      <div>
        <label className="block text-ds-text text-sm font-medium mb-2">
          Answer Options <span className="text-ds-muted font-normal">- click to mark correct</span>
        </label>
        <div className="space-y-2">
          {quizData.options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <button
                onClick={() => setCorrectAnswer(index)}
                className={`p-2 rounded-lg border-2 transition-all cursor-pointer ${
                  option.isCorrect
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                    : "border-ds-border/30 text-ds-muted hover:border-ds-border"
                }`}
                title={option.isCorrect ? "Correct answer" : "Mark as correct"}
              >
                <HiOutlineCheckCircle className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={option.text}
                onChange={(e) => updateOption(index, e.target.value)}
                placeholder={`Option ${index + 1}...`}
                className={`flex-1 px-4 py-2 rounded-xl border transition-all ${
                  option.isCorrect
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-ds-bg/50 border-ds-border/30"
                } text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border`}
              />
              <button
                onClick={() => removeOption(index)}
                className="p-2 text-ds-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                title="Remove option"
              >
                <HiOutlineTrash className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Option Button */}
      {quizData.options.length < 6 && (
        <button
          onClick={addOption}
          className="w-full py-2 border-2 border-dashed border-ds-border/30 rounded-xl text-ds-muted hover:border-ds-border hover:text-ds-text transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <HiOutlinePlus className="w-4 h-4" />
          Add Option
        </button>
      )}

      {/* Explanation */}
      <div>
        <label className="block text-ds-text text-sm font-medium mb-2">
          Explanation (English) <span className="text-ds-muted font-normal">- shown after answer</span>
        </label>
        <textarea
          value={quizData.explanation_en}
          onChange={(e) => updateQuiz({ explanation_en: e.target.value })}
          placeholder="Explain why the correct answer is correct..."
          rows={2}
          className="w-full px-4 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border resize-none"
        />
      </div>

      <div>
        <label className="block text-ds-text text-sm font-medium mb-2">
          Explanation (Bengali) <span className="text-ds-muted font-normal">- optional</span>
        </label>
        <textarea
          value={quizData.explanation_bn}
          onChange={(e) => updateQuiz({ explanation_bn: e.target.value })}
          placeholder="বাংলায় ব্যাখ্যা..."
          rows={2}
          className="w-full px-4 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border resize-none font-bangla"
        />
      </div>

      {/* Summary */}
      <div className="p-3 bg-ds-bg/30 rounded-lg">
        <p className="text-sm text-ds-muted">
          {quizData.options.length} options • Correct answer:{" "}
          <span className="text-emerald-400">
            {correctIndex >= 0 ? `Option ${correctIndex + 1}` : "Not set"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default QuizBlockEditor;
