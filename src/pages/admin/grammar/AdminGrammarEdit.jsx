import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import {
  HiOutlineArrowLeft,
  HiOutlineSave,
  HiOutlinePlus,
  HiOutlineDocumentText,
  HiOutlineLink,
  HiOutlineX,
  HiOutlineEye,
} from "react-icons/hi";

// Import block components from components folder
import { generateBlockId } from "../../../components/admin/grammar/BlockTypes";
import BlockWrapper from "../../../components/admin/grammar/BlockWrapper";
import AddBlockModal from "../../../components/admin/grammar/AddBlockModal";
import LinkLessonsModal from "../../../components/admin/grammar/LinkLessonsModal";
import GrammarPreviewModal from "../../../components/admin/grammar/GrammarPreviewModal";

const AdminGrammarEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const isNew = id === "new";

  // State
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [levels, setLevels] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [showLinkLessons, setShowLinkLessons] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [formData, setFormData] = useState({
    title: { de: "", en: "", bn: "" },
    description: { en: "", bn: "" },
    levelId: "",
    blocks: [],
    linkedLessons: [],
    status: "draft",
    order: 0,
  });

  // Fetch data on mount
  useEffect(() => {
    fetchLevels();
    fetchLessons();
    if (!isNew && id && id !== "undefined") {
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
    if (!id || id === "undefined" || id === "new") {
      setLoading(false);
      return;
    }
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

  // Save handler
  const handleSave = async () => {
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

  // Block management
  const addBlock = (newBlock) => {
    newBlock.order = formData.blocks.length + 1;
    setFormData({
      ...formData,
      blocks: [...formData.blocks, newBlock],
    });
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

  // Lesson linking
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

  // Helper to get level title
  const getLevelTitle = (level) => {
    if (typeof level.title === "object") {
      return level.title.en || level.title.de || "";
    }
    return level.title || "";
  };

  // Helper to get lesson title
  const getLessonTitle = (lesson) => {
    if (typeof lesson.title === "object") {
      return lesson.title.en || lesson.title.de || "Untitled";
    }
    return lesson.title || "Untitled";
  };

  // Get current level for preview
  const getCurrentLevel = () => {
    return levels.find((l) => l._id === formData.levelId) || null;
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
          {/* Preview Button */}
          <button
            onClick={() => setShowPreview(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-ds-surface border border-ds-border/30 text-ds-text rounded-xl hover:bg-ds-border/30 transition-all cursor-pointer"
          >
            <HiOutlineEye className="w-5 h-5" />
            Preview
          </button>

          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="px-4 py-2 rounded-xl bg-ds-surface/50 border border-ds-border/30 text-ds-text focus:outline-none focus:border-ds-border cursor-pointer"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>

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
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-ds-text">Basic Information</h2>

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

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Level & Order */}
          <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-ds-text">Settings</h2>

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
                    {level.code} - {getLevelTitle(level)}
                  </option>
                ))}
              </select>
            </div>

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
                      <span className="text-ds-text text-sm truncate">{getLessonTitle(lesson)}</span>
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

          {/* Quick Preview Card */}
          <div className="bg-ds-surface/30 rounded-2xl border border-ds-border/30 p-6">
            <h2 className="text-lg font-semibold text-ds-text mb-4">Quick Preview</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ds-muted">Status</span>
                <span className={formData.status === "published" ? "text-emerald-400" : "text-yellow-400"}>
                  {formData.status === "published" ? "Published" : "Draft"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ds-muted">Blocks</span>
                <span className="text-ds-text">{formData.blocks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ds-muted">Linked Lessons</span>
                <span className="text-ds-text">{formData.linkedLessons.length}</span>
              </div>
            </div>
            <button
              onClick={() => setShowPreview(true)}
              className="w-full mt-4 py-2 border border-ds-border/30 rounded-xl text-ds-muted hover:text-ds-text hover:bg-ds-border/20 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <HiOutlineEye className="w-4 h-4" />
              Open Full Preview
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddBlock && <AddBlockModal onClose={() => setShowAddBlock(false)} onAddBlock={addBlock} />}

      {showLinkLessons && (
        <LinkLessonsModal
          lessons={lessons}
          linkedLessons={formData.linkedLessons}
          onToggle={toggleLesson}
          onClose={() => setShowLinkLessons(false)}
        />
      )}

      {showPreview && (
        <GrammarPreviewModal
          formData={formData}
          level={getCurrentLevel()}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default AdminGrammarEdit;
