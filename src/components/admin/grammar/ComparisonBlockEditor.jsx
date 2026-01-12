import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi";
import toast from "react-hot-toast";

const ComparisonBlockEditor = ({ data, onChange }) => {
  const comparisonData = {
    title_en: data.title_en || "",
    title_bn: data.title_bn || "",
    left_header: data.left_header || "Correct ✓",
    right_header: data.right_header || "Incorrect ✗",
    items: data.items || [{ left: "", right: "" }],
  };

  const updateComparison = (updates) => {
    onChange({ ...comparisonData, ...updates });
  };

  const addItem = () => {
    updateComparison({ items: [...comparisonData.items, { left: "", right: "" }] });
  };

  const removeItem = (index) => {
    if (comparisonData.items.length <= 1) {
      toast.error("At least one comparison item is required");
      return;
    }
    const newItems = comparisonData.items.filter((_, i) => i !== index);
    updateComparison({ items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = comparisonData.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    updateComparison({ items: newItems });
  };

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-ds-text text-sm font-medium mb-2">
            Title (English) <span className="text-ds-muted font-normal">- optional</span>
          </label>
          <input
            type="text"
            value={comparisonData.title_en}
            onChange={(e) => updateComparison({ title_en: e.target.value })}
            placeholder="e.g., Common Mistakes"
            className="w-full px-4 py-2 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border"
          />
        </div>
        <div>
          <label className="block text-ds-text text-sm font-medium mb-2">
            Title (Bengali) <span className="text-ds-muted font-normal">- optional</span>
          </label>
          <input
            type="text"
            value={comparisonData.title_bn}
            onChange={(e) => updateComparison({ title_bn: e.target.value })}
            placeholder="যেমন: সাধারণ ভুল"
            className="w-full px-4 py-2 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border font-bangla"
          />
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-ds-text text-sm font-medium mb-2">Left Column Header</label>
          <input
            type="text"
            value={comparisonData.left_header}
            onChange={(e) => updateComparison({ left_header: e.target.value })}
            placeholder="Correct ✓"
            className="w-full px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-ds-text text-sm font-medium mb-2">Right Column Header</label>
          <input
            type="text"
            value={comparisonData.right_header}
            onChange={(e) => updateComparison({ right_header: e.target.value })}
            placeholder="Incorrect ✗"
            className="w-full px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Comparison Items */}
      <div className="space-y-3">
        <label className="block text-ds-text text-sm font-medium">Comparison Items</label>
        {comparisonData.items.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="flex-1 grid grid-cols-2 gap-2">
              <input
                type="text"
                value={item.left}
                onChange={(e) => updateItem(index, "left", e.target.value)}
                placeholder="Correct example..."
                className="w-full px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-ds-text placeholder-ds-muted focus:outline-none focus:border-emerald-500/50"
              />
              <input
                type="text"
                value={item.right}
                onChange={(e) => updateItem(index, "right", e.target.value)}
                placeholder="Incorrect example..."
                className="w-full px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/20 text-ds-text placeholder-ds-muted focus:outline-none focus:border-red-500/50"
              />
            </div>
            <button
              onClick={() => removeItem(index)}
              className="p-2 text-ds-muted hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
              title="Remove item"
            >
              <HiOutlineTrash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Item Button */}
      <button
        onClick={addItem}
        className="w-full py-2 border-2 border-dashed border-ds-border/30 rounded-xl text-ds-muted hover:border-ds-border hover:text-ds-text transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        <HiOutlinePlus className="w-4 h-4" />
        Add Comparison Item
      </button>

      {/* Item Count */}
      <p className="text-xs text-ds-muted text-center">
        {comparisonData.items.length} comparison item{comparisonData.items.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

export default ComparisonBlockEditor;
