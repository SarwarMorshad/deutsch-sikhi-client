const TextBlockEditor = ({ data, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-ds-text text-sm font-medium mb-2">Content (English)</label>
        <textarea
          value={data.content_en || ""}
          onChange={(e) => onChange({ ...data, content_en: e.target.value })}
          placeholder="Enter explanation in English..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border resize-none"
        />
        <p className="text-xs text-ds-muted mt-1">
          Supports: # Headers, - Bullet points, blank lines for paragraphs
        </p>
      </div>
      <div>
        <label className="block text-ds-text text-sm font-medium mb-2">
          Content (Bengali) <span className="text-ds-muted font-normal">- optional</span>
        </label>
        <textarea
          value={data.content_bn || ""}
          onChange={(e) => onChange({ ...data, content_bn: e.target.value })}
          placeholder="বাংলায় ব্যাখ্যা লিখুন..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border resize-none font-bangla"
        />
      </div>
    </div>
  );
};

export default TextBlockEditor;
