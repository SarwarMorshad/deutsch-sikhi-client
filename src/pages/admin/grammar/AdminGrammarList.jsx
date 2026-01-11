import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import {
  HiOutlineArrowLeft,
  HiOutlineSave,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineChevronUp,
  HiOutlineChevronDown,
  HiOutlineDocumentText,
  HiOutlineLink,
  HiOutlineX,
  HiOutlineMenuAlt2,
} from "react-icons/hi";

// Block type icons and labels
const BLOCK_TYPES = {
  text: {
    icon: HiOutlineDocumentText,
    label: "Text/Paragraph",
    description: "Rich text explanations",
  },
  // Future block types will be added here
  // table: { icon: HiOutlineTable, label: "Table", description: "Conjugation tables" },
  // image: { icon: HiOutlinePhotograph, label: "Image", description: "Visual explanations" },
  // examples: { icon: HiOutlineChat, label: "Examples", description: "Example sentences" },
  // tip: { icon: HiOutlineLightBulb, label: "Tip/Note", description: "Highlighted tips" },
  // comparison: { icon: HiOutlineSwitchHorizontal, label: "Comparison", description: "Side-by-side" },
  // video: { icon: HiOutlinePlay, label: "Video", description: "YouTube embed" },
  // quiz: { icon: HiOutlineQuestionMarkCircle, label: "Quiz", description: "Mini quiz" },
};

// Text Block Editor Component
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

// Block Wrapper Component
const BlockWrapper = ({ block, index, totalBlocks, onUpdate, onDelete, onMoveUp, onMoveDown }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const BlockType = BLOCK_TYPES[block.type];
  const BlockIcon = BlockType?.icon || HiOutlineDocumentText;

  const renderBlockEditor = () => {
    switch (block.type) {
      case "text":
        return (
          <TextBlockEditor data={block.data} onChange={(newData) => onUpdate({ ...block, data: newData })} />
        );
      // Future block editors will be added here
      default:
        return (
          <div className="text-ds-muted text-center py-8">
            Block type "{block.type}" editor coming soon...
          </div>
        );
    }
  };

  return (
    <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 overflow-hidden">
      {/* Block Header */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-ds-surface/50 border-b border-ds-border/30 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-ds-muted">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              disabled={index === 0}
              className="p-1 hover:bg-ds-border/30 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <HiOutlineChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              disabled={index === totalBlocks - 1}
              className="p-1 hover:bg-ds-border/30 rounded disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <HiOutlineChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="w-8 h-8 rounded-lg bg-ds-border/20 flex items-center justify-center">
            <BlockIcon className="w-4 h-4 text-ds-muted" />
          </div>

          <div>
            <span className="font-medium text-ds-text">{BlockType?.label || block.type}</span>
            <span className="text-ds-muted text-sm ml-2">#{index + 1}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 hover:bg-red-500/20 rounded-lg text-ds-muted hover:text-red-400 transition-colors cursor-pointer"
          >
            <HiOutlineTrash className="w-4 h-4" />
          </button>
          <HiOutlineMenuAlt2
            className={`w-5 h-5 text-ds-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Block Content */}
      {isExpanded && <div className="p-4">{renderBlockEditor()}</div>}
    </div>
  );
};

// Main Component
const AdminGrammarEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [levels, setLevels] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [showLinkLessons, setShowLinkLessons] = useState(false);

  const [formData, setFormData] = useState({
    title: { de: "", en: "", bn: "" },
    description: { en: "", bn: "" },
    levelId: "",
    blocks: [],
    linkedLessons: [],
    status: "draft",
    order: 0,
  });

  useEffect(() => {
    fetchLevels();
    fetchLessons();
    if (!isNew) {
      fetchGrammar();
    }
  }, [id]);

  const fetchLevels = async () => {
    try {
      const response = await axiosSecure.get("/levels");
      setLevels(response.data.data || []);
    } catch (error) {
      console.error("Error fetching levels:", error);
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await axiosSecure.get("/lessons?limit=100");
      setLessons(response.data.data || []);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  const fetchGrammar = async () => {
    try {
      const response = await axiosSecure.get(`/grammar/${id}`);
      const data = response.data.data;
      setFormData({
        title: data.title || { de: "", en: "", bn: "" },
        description: data.description || { en: "", bn: "" },
        levelId: data.levelId || "",
        blocks: data.blocks || [],
        linkedLessons: data.linkedLessons?.map((l) => l.toString()) || [],
        status: data.status || "draft",
        order: data.order || 0,
      });
    } catch (error) {
      console.error("Error fetching grammar:", error);
      toast.error("Failed to load grammar topic");
      navigate("/admin/grammar");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.title.de || !formData.title.en) {
      toast.error("German and English titles are required");
      return;
    }
    if (!formData.levelId) {
      toast.error("Please select a level");
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        const response = await axiosSecure.post("/grammar", formData);
        toast.success("Grammar topic created");
        navigate(`/admin/grammar/${response.data.data._id}`);
      } else {
        await axiosSecure.put(`/grammar/${id}`, formData);
        toast.success("Grammar topic saved");
      }
    } catch (error) {
      console.error("Error saving grammar:", error);
      toast.error("Failed to save grammar topic");
    } finally {
      setSaving(false);
    }
  };

  // Block management functions
  const addBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      order: formData.blocks.length + 1,
      data: {},
    };
    setFormData({
      ...formData,
      blocks: [...formData.blocks, newBlock],
    });
    setShowAddBlock(false);
  };

  const updateBlock = (index, updatedBlock) => {
    const newBlocks = [...formData.blocks];
    newBlocks[index] = updatedBlock;
    setFormData({ ...formData, blocks: newBlocks });
  };

  const deleteBlock = (index) => {
    const newBlocks = formData.blocks.filter((_, i) => i !== index);
    setFormData({ ...formData, blocks: newBlocks });
  };

  const moveBlock = (index, direction) => {
    const newBlocks = [...formData.blocks];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newBlocks.length) return;

    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    setFormData({ ...formData, blocks: newBlocks });
  };

  const toggleLesson = (lessonId) => {
    const current = formData.linkedLessons;
    if (current.includes(lessonId)) {
      setFormData({
        ...formData,
        linkedLessons: current.filter((id) => id !== lessonId),
      });
    } else {
      setFormData({
        ...formData,
        linkedLessons: [...current, lessonId],
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-ds-muted/30 border-t-ds-muted rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/grammar"
            className="p-2 rounded-lg hover:bg-ds-surface text-ds-muted hover:text-ds-text transition-colors cursor-pointer"
          >
            <HiOutlineArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-ds-text">
              {isNew ? "New Grammar Topic" : "Edit Grammar Topic"}
            </h1>
            <p className="text-ds-muted">{isNew ? "Create a new grammar explanation" : formData.title.de}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Toggle */}
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="px-4 py-2 rounded-xl bg-ds-surface/50 border border-ds-border/30 text-ds-text focus:outline-none focus:border-ds-border cursor-pointer"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2 bg-ds-text text-ds-bg rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <HiOutlineSave className="w-5 h-5" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-ds-text">Basic Information</h2>

            {/* German Title */}
            <div>
              <label className="block text-ds-text text-sm font-medium mb-2">
                Title (German) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title.de}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: { ...formData.title, de: e.target.value },
                  })
                }
                placeholder="e.g., Präsens"
                className="w-full px-4 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border"
              />
            </div>

            {/* English Title */}
            <div>
              <label className="block text-ds-text text-sm font-medium mb-2">
                Title (English) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.title.en}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: { ...formData.title, en: e.target.value },
                  })
                }
                placeholder="e.g., Present Tense"
                className="w-full px-4 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border"
              />
            </div>

            {/* Bengali Title */}
            <div>
              <label className="block text-ds-text text-sm font-medium mb-2">
                Title (Bengali) <span className="text-ds-muted font-normal">- optional</span>
              </label>
              <input
                type="text"
                value={formData.title.bn}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: { ...formData.title, bn: e.target.value },
                  })
                }
                placeholder="যেমন: বর্তমান কাল"
                className="w-full px-4 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border font-bangla"
              />
            </div>

            {/* Description EN */}
            <div>
              <label className="block text-ds-text text-sm font-medium mb-2">
                Short Description (English)
              </label>
              <textarea
                value={formData.description.en}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: { ...formData.description, en: e.target.value },
                  })
                }
                placeholder="Brief description of this grammar topic..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border resize-none"
              />
            </div>

            {/* Description BN */}
            <div>
              <label className="block text-ds-text text-sm font-medium mb-2">
                Short Description (Bengali)
              </label>
              <textarea
                value={formData.description.bn}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: { ...formData.description, bn: e.target.value },
                  })
                }
                placeholder="এই ব্যাকরণ বিষয়ের সংক্ষিপ্ত বিবরণ..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text placeholder-ds-muted focus:outline-none focus:border-ds-border resize-none font-bangla"
              />
            </div>
          </div>

          {/* Content Blocks */}
          <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-ds-text">Content Blocks</h2>
              <button
                onClick={() => setShowAddBlock(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-ds-border/30 text-ds-text rounded-xl hover:bg-ds-border/50 transition-colors cursor-pointer"
              >
                <HiOutlinePlus className="w-5 h-5" />
                Add Block
              </button>
            </div>

            {formData.blocks.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-ds-border/30 rounded-xl">
                <HiOutlineDocumentText className="w-12 h-12 text-ds-muted mx-auto mb-3" />
                <p className="text-ds-muted mb-4">No content blocks yet</p>
                <button
                  onClick={() => setShowAddBlock(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-ds-text text-ds-bg rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
                >
                  <HiOutlinePlus className="w-5 h-5" />
                  Add First Block
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.blocks.map((block, index) => (
                  <BlockWrapper
                    key={block.id}
                    block={block}
                    index={index}
                    totalBlocks={formData.blocks.length}
                    onUpdate={(updated) => updateBlock(index, updated)}
                    onDelete={() => deleteBlock(index)}
                    onMoveUp={() => moveBlock(index, "up")}
                    onMoveDown={() => moveBlock(index, "down")}
                  />
                ))}

                {/* Add more block button */}
                <button
                  onClick={() => setShowAddBlock(true)}
                  className="w-full py-3 border-2 border-dashed border-ds-border/30 rounded-xl text-ds-muted hover:border-ds-border hover:text-ds-text transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <HiOutlinePlus className="w-5 h-5" />
                  Add Another Block
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Right column */}
        <div className="space-y-6">
          {/* Level & Order */}
          <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-ds-text">Settings</h2>

            {/* Level */}
            <div>
              <label className="block text-ds-text text-sm font-medium mb-2">
                Level <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.levelId}
                onChange={(e) => setFormData({ ...formData, levelId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text focus:outline-none focus:border-ds-border cursor-pointer"
              >
                <option value="">Select Level</option>
                {levels.map((level) => (
                  <option key={level._id} value={level._id}>
                    {level.code} -{" "}
                    {typeof level.title === "object" ? level.title.en || level.title.de : level.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Order */}
            <div>
              <label className="block text-ds-text text-sm font-medium mb-2">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-ds-bg/50 border border-ds-border/30 text-ds-text focus:outline-none focus:border-ds-border"
              />
            </div>
          </div>

          {/* Linked Lessons */}
          <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-ds-text">Linked Lessons</h2>
              <button
                onClick={() => setShowLinkLessons(true)}
                className="p-2 hover:bg-ds-border/30 rounded-lg text-ds-muted hover:text-ds-text transition-colors cursor-pointer"
              >
                <HiOutlineLink className="w-5 h-5" />
              </button>
            </div>

            {formData.linkedLessons.length === 0 ? (
              <p className="text-ds-muted text-sm">No lessons linked yet</p>
            ) : (
              <div className="space-y-2">
                {formData.linkedLessons.map((lessonId) => {
                  const lesson = lessons.find((l) => l._id === lessonId);
                  return lesson ? (
                    <div
                      key={lessonId}
                      className="flex items-center justify-between px-3 py-2 bg-ds-bg/50 rounded-lg"
                    >
                      <span className="text-ds-text text-sm truncate">
                        {typeof lesson.title === "object" ? lesson.title.en || lesson.title.de : lesson.title}
                      </span>
                      <button
                        onClick={() => toggleLesson(lessonId)}
                        className="p-1 hover:bg-red-500/20 rounded text-ds-muted hover:text-red-400 cursor-pointer"
                      >
                        <HiOutlineX className="w-4 h-4" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Block Modal */}
      {showAddBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddBlock(false)}
          ></div>
          <div className="relative w-full max-w-md bg-ds-surface rounded-2xl border border-ds-border/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-ds-text">Add Block</h3>
              <button
                onClick={() => setShowAddBlock(false)}
                className="p-2 hover:bg-ds-border/30 rounded-lg text-ds-muted hover:text-ds-text cursor-pointer"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {Object.entries(BLOCK_TYPES).map(([type, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={type}
                    onClick={() => addBlock(type)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-ds-bg/50 border border-ds-border/30 hover:border-ds-border transition-colors cursor-pointer text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-ds-border/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-ds-muted" />
                    </div>
                    <div>
                      <div className="font-medium text-ds-text">{config.label}</div>
                      <div className="text-sm text-ds-muted">{config.description}</div>
                    </div>
                  </button>
                );
              })}

              {/* Coming Soon */}
              <div className="pt-4 border-t border-ds-border/30">
                <p className="text-xs text-ds-muted text-center">
                  More block types coming soon: Tables, Images, Examples, Tips, Comparisons, Videos, Quizzes
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Link Lessons Modal */}
      {showLinkLessons && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLinkLessons(false)}
          ></div>
          <div className="relative w-full max-w-lg bg-ds-surface rounded-2xl border border-ds-border/30 p-6 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-ds-text">Link Lessons</h3>
              <button
                onClick={() => setShowLinkLessons(false)}
                className="p-2 hover:bg-ds-border/30 rounded-lg text-ds-muted hover:text-ds-text cursor-pointer"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2">
              {lessons.length === 0 ? (
                <p className="text-ds-muted text-center py-8">No lessons available</p>
              ) : (
                lessons.map((lesson) => {
                  const isLinked = formData.linkedLessons.includes(lesson._id);
                  const lessonTitle =
                    typeof lesson.title === "object" ? lesson.title.en || lesson.title.de : lesson.title;
                  return (
                    <button
                      key={lesson._id}
                      onClick={() => toggleLesson(lesson._id)}
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
                onClick={() => setShowLinkLessons(false)}
                className="w-full py-3 bg-ds-text text-ds-bg rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGrammarEdit;
