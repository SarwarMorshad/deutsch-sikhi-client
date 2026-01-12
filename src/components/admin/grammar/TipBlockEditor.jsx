import {
  HiOutlineLightBulb,
  HiOutlineExclamation,
  HiOutlineCheckCircle,
  HiOutlineInformationCircle,
} from "react-icons/hi";

const TIP_TYPES = {
  info: {
    icon: HiOutlineInformationCircle,
    label: "Info",
    color: "blue",
  },
  tip: {
    icon: HiOutlineLightBulb,
    label: "Tip",
    color: "yellow",
  },
  warning: {
    icon: HiOutlineExclamation,
    label: "Warning",
    color: "orange",
  },
  success: {
    icon: HiOutlineCheckCircle,
    label: "Success",
    color: "green",
  },
};

const TipBlockEditor = ({ data, onChange }) => {
  const tipData = {
    type: data.type || "tip",
    title_en: data.title_en || "",
    title_bn: data.title_bn || "",
    content_en: data.content_en || "",
    content_bn: data.content_bn || "",
  };

  const updateTip = (updates) => {
    onChange({ ...tipData, ...updates });
  };

  const selectedType = TIP_TYPES[tipData.type] || TIP_TYPES.tip;

  return (
    <div className="space-y-4">
      {/* Tip Type Selector */}
      <div>
        <label className="block text-ds-text text-sm font-medium mb-2">Tip Type</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(TIP_TYPES).map(([type, config]) => {
            const Icon = config.icon;
            const isSelected = tipData.type === type;
            return (
              <button
                key={type}
                onClick={() => updateTip({ type })}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? config.color === "blue"
                      ? "border-blue-500 bg-blue-500/10"
                      : config.color === "yellow"
                      ? "border-yellow-500 bg-yellow-500/10"
                      : config.color === "orange"
                      ? "border-orange-500 bg-orange-500/10"
                      : "border-emerald-500 bg-emerald-500/10"
                    : "border-ds-border/30 hover:border-ds-border"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isSelected
                      ? config.color === "blue"
                        ? "text-blue-400"
                        : config.color === "yellow"
                        ? "text-yellow-400"
                        : config.color === "orange"
                        ? "text-orange-400"
                        : "text-emerald-400"
                      : "text-ds-muted"
                  }`}
                />
                <span className={`text-sm font-medium ${isSelected ? "text-ds-text" : "text-ds-muted"}`}>
                  {config.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-ds-text text-sm font-medium mb-2">
            Title (English) <span className="text-ds-muted font-normal">- optional</span>
          </label>
          <input
            type="text"
            value={tipData.title_en}
            onChange={(e) => updateTip({ title_en: e.target.value })}
            placeholder="e.g., Remember!"
            className="w-full px-4 py-2 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border"
          />
        </div>
        <div>
          <label className="block text-ds-text text-sm font-medium mb-2">
            Title (Bengali) <span className="text-ds-muted font-normal">- optional</span>
          </label>
          <input
            type="text"
            value={tipData.title_bn}
            onChange={(e) => updateTip({ title_bn: e.target.value })}
            placeholder="যেমন: মনে রাখুন!"
            className="w-full px-4 py-2 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border font-bangla"
          />
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="block text-ds-text text-sm font-medium mb-2">
          Content (English) <span className="text-red-400">*</span>
        </label>
        <textarea
          value={tipData.content_en}
          onChange={(e) => updateTip({ content_en: e.target.value })}
          placeholder="Enter the tip content..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border resize-none"
        />
      </div>

      <div>
        <label className="block text-ds-text text-sm font-medium mb-2">
          Content (Bengali) <span className="text-ds-muted font-normal">- optional</span>
        </label>
        <textarea
          value={tipData.content_bn}
          onChange={(e) => updateTip({ content_bn: e.target.value })}
          placeholder="বাংলায় টিপ লিখুন..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border resize-none font-bangla"
        />
      </div>

      {/* Preview */}
      <div>
        <label className="block text-ds-text text-sm font-medium mb-2">Preview</label>
        <div
          className={`p-4 rounded-xl border-l-4 ${
            tipData.type === "info"
              ? "bg-blue-500/10 border-blue-500"
              : tipData.type === "warning"
              ? "bg-orange-500/10 border-orange-500"
              : tipData.type === "success"
              ? "bg-emerald-500/10 border-emerald-500"
              : "bg-yellow-500/10 border-yellow-500"
          }`}
        >
          <div className="flex items-start gap-3">
            <selectedType.icon
              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                tipData.type === "info"
                  ? "text-blue-400"
                  : tipData.type === "warning"
                  ? "text-orange-400"
                  : tipData.type === "success"
                  ? "text-emerald-400"
                  : "text-yellow-400"
              }`}
            />
            <div>
              {tipData.title_en && <p className="font-semibold text-ds-text mb-1">{tipData.title_en}</p>}
              <p className="text-ds-text/80 text-sm">
                {tipData.content_en || "Your tip content will appear here..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipBlockEditor;
