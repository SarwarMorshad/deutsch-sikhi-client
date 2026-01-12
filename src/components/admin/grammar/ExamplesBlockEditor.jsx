import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlineVolumeUp,
} from "react-icons/hi";
import toast from "react-hot-toast";

const ExamplesBlockEditor = ({ data, onChange }) => {
  // Initialize with default data if empty
  const examples = data.examples || [];

  const updateExamples = (newExamples) => {
    onChange({ ...data, examples: newExamples });
  };

  const addExample = () => {
    const newExample = {
      id: `ex-${Date.now()}`,
      german: "",
      english: "",
      bengali: "",
      audio: "",
    };
    updateExamples([...examples, newExample]);
  };

  const updateExample = (index, field, value) => {
    const newExamples = examples.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex));
    updateExamples(newExamples);
  };

  const removeExample = (index) => {
    if (examples.length <= 1) {
      toast.error("At least one example is required");
      return;
    }
    const newExamples = examples.filter((_, i) => i !== index);
    updateExamples(newExamples);
  };

  const moveExample = (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= examples.length) return;

    const newExamples = [...examples];
    [newExamples[index], newExamples[newIndex]] = [newExamples[newIndex], newExamples[index]];
    updateExamples(newExamples);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-ds-muted">Add example sentences with translations</p>
        <span className="text-xs text-ds-muted bg-ds-bg/50 px-2 py-1 rounded">
          {examples.length} example{examples.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Examples List */}
      {examples.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-ds-border/30 rounded-xl">
          <p className="text-ds-muted mb-3">No examples yet</p>
          <button
            onClick={addExample}
            className="inline-flex items-center gap-2 px-4 py-2 bg-ds-text text-ds-bg rounded-lg font-medium hover:shadow-lg transition-all cursor-pointer"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Add First Example
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {examples.map((example, index) => (
            <div
              key={example.id || index}
              className="p-4 bg-ds-bg/30 rounded-xl border border-ds-border/20 space-y-3"
            >
              {/* Example Header */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ds-muted">Example #{index + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveExample(index, "up")}
                    disabled={index === 0}
                    className="p-1 text-ds-muted hover:text-ds-text disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move up"
                  >
                    <HiOutlineChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveExample(index, "down")}
                    disabled={index === examples.length - 1}
                    className="p-1 text-ds-muted hover:text-ds-text disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Move down"
                  >
                    <HiOutlineChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeExample(index)}
                    className="p-1 text-ds-muted hover:text-red-400 cursor-pointer ml-2"
                    title="Remove example"
                  >
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* German */}
              <div>
                <label className="block text-ds-text text-sm font-medium mb-1">
                  German <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={example.german}
                  onChange={(e) => updateExample(index, "german", e.target.value)}
                  placeholder="Ich bin ein Student."
                  className="w-full px-3 py-2 rounded-lg bg-ds-surface/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border"
                />
              </div>

              {/* English */}
              <div>
                <label className="block text-ds-text text-sm font-medium mb-1">English Translation</label>
                <input
                  type="text"
                  value={example.english}
                  onChange={(e) => updateExample(index, "english", e.target.value)}
                  placeholder="I am a student."
                  className="w-full px-3 py-2 rounded-lg bg-ds-surface/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border"
                />
              </div>

              {/* Bengali */}
              <div>
                <label className="block text-ds-text text-sm font-medium mb-1">Bengali Translation</label>
                <input
                  type="text"
                  value={example.bengali}
                  onChange={(e) => updateExample(index, "bengali", e.target.value)}
                  placeholder="আমি একজন ছাত্র।"
                  className="w-full px-3 py-2 rounded-lg bg-ds-surface/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border font-bangla"
                />
              </div>

              {/* Audio URL */}
              <div>
                <label className="block text-ds-text text-sm font-medium mb-1">
                  <span className="flex items-center gap-1">
                    <HiOutlineVolumeUp className="w-4 h-4" />
                    Audio URL <span className="text-ds-muted font-normal">- optional</span>
                  </span>
                </label>
                <input
                  type="url"
                  value={example.audio}
                  onChange={(e) => updateExample(index, "audio", e.target.value)}
                  placeholder="https://example.com/audio.mp3"
                  className="w-full px-3 py-2 rounded-lg bg-ds-surface/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add More Button */}
      {examples.length > 0 && (
        <button
          onClick={addExample}
          className="w-full py-2 border-2 border-dashed border-ds-border/30 rounded-xl text-ds-muted hover:border-ds-border hover:text-ds-text transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          <HiOutlinePlus className="w-4 h-4" />
          Add Another Example
        </button>
      )}
    </div>
  );
};

export default ExamplesBlockEditor;
